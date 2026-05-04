// /api/sync/snapshot
//   GET … 自作フレーズと進捗の現在値をまるごと返す。Bearer 認可必須。
//   PUT … クライアントの全件スナップショットを受け取って D1 に反映する。LWW + tombstone。
//
// 音声(phrase_audio)はこのエンドポイントでは扱わない(Phase 3)。

import type { Env } from "../../_lib/env";
import { authenticate } from "../../_lib/auth";
import { json, jsonError } from "../../_lib/json";

// ---- 型 ---------------------------------------------------------------

const VALID_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const VALID_CATEGORIES = [
  "daily",
  "work",
  "feeling",
  "conversation",
  "travel",
  "learning",
  "custom",
] as const;
const VALID_MOODS = ["casual", "polite", "warm", "neutral", "natural"] as const;
// "monologue" = ひとりごと英語 (日本語先入力 → 後で英語化)。
// english / chunks が空のまま保存される可能性がある (validatePhrase で限定的に許可)。
const VALID_SOURCES = ["initial", "original", "duo3", "monologue"] as const;

type PhraseLevel = (typeof VALID_LEVELS)[number];
type PhraseCategory = (typeof VALID_CATEGORIES)[number];
type PhraseMood = (typeof VALID_MOODS)[number];
type PhraseSource = (typeof VALID_SOURCES)[number];

interface PhrasePayload {
  id: string;
  english: string;
  japanese: string;
  chunks: string[];
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
  source?: PhraseSource;
  sourceSection?: number;
  sourceIndex?: number;
}

interface PracticeLogPayload {
  id: string;
  phraseId: string;
  date: string;
  readCount: number;
  reciteCount: number;
  xpEarned: number;
}

interface ProgressPayload {
  totalXp: number;
  level: number;
  streakDays: number;
  totalPracticeCount: number;
  totalReadCount: number;
  totalReciteCount: number;
  completedPhraseIds: string[];
  recentPractices: PracticeLogPayload[];
  lastPracticeDate: string | null;
}

interface PutBody {
  clientUpdatedAt: string;
  phrases: PhrasePayload[];
  progress: ProgressPayload;
}

// ---- 検証 -------------------------------------------------------------

function isIsoString(v: unknown): v is string {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

function isPhraseLevel(v: unknown): v is PhraseLevel {
  return typeof v === "string" && (VALID_LEVELS as readonly string[]).includes(v);
}
function isPhraseCategory(v: unknown): v is PhraseCategory {
  return typeof v === "string" && (VALID_CATEGORIES as readonly string[]).includes(v);
}
function isPhraseMood(v: unknown): v is PhraseMood {
  return typeof v === "string" && (VALID_MOODS as readonly string[]).includes(v);
}
function isPhraseSource(v: unknown): v is PhraseSource {
  return typeof v === "string" && (VALID_SOURCES as readonly string[]).includes(v);
}
function isPositiveInt(v: unknown): v is number {
  return (
    typeof v === "number" && Number.isFinite(v) && Number.isInteger(v) && v > 0
  );
}

function validatePhrase(o: unknown): PhrasePayload | null {
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  if (typeof r.english !== "string") return null;
  // japanese は空文字 ("") を許可する。DUO Import 等で訳を後追いするケースに対応。
  if (typeof r.japanese !== "string") return null;
  const isMonologue = r.source === "monologue";
  // ひとりごと英語は英語が後追いなので空 english を許可する。
  // それ以外の出典では従来どおり english 必須 (空は弾く)。
  if (!isMonologue && !r.english.trim()) return null;
  if (!Array.isArray(r.chunks)) return null;
  const chunks = r.chunks
    .filter((c): c is string => typeof c === "string")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  // monologue は英語未入力の段階で chunks も空のまま保存される。
  // それ以外は最低 1 件のチャンクを要求する。
  if (!isMonologue && chunks.length === 0) return null;
  if (!isPhraseLevel(r.level)) return null;
  if (!isPhraseCategory(r.category)) return null;
  if (!isPhraseMood(r.mood)) return null;
  const out: PhrasePayload = {
    id: r.id,
    english: r.english.trim(),
    japanese: r.japanese.trim(),
    chunks,
    level: r.level,
    category: r.category,
    mood: r.mood,
  };
  // optional 出典メタ。未指定や不正値は単に省略する (旧クライアント互換)。
  if (isPhraseSource(r.source)) out.source = r.source;
  if (isPositiveInt(r.sourceSection)) out.sourceSection = r.sourceSection;
  if (isPositiveInt(r.sourceIndex)) out.sourceIndex = r.sourceIndex;
  // thoughtCreatedAt は MVP では D1 に列を持たないため、サーバ側では握りつぶす
  // (ローカル側でのみ保持される)。
  return out;
}

function validatePracticeLog(o: unknown): PracticeLogPayload | null {
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  if (typeof r.phraseId !== "string" || !r.phraseId) return null;
  if (typeof r.date !== "string" || !r.date) return null;
  if (typeof r.readCount !== "number" || !Number.isFinite(r.readCount)) return null;
  if (typeof r.reciteCount !== "number" || !Number.isFinite(r.reciteCount)) return null;
  if (typeof r.xpEarned !== "number" || !Number.isFinite(r.xpEarned)) return null;
  return {
    id: r.id,
    phraseId: r.phraseId,
    date: r.date,
    readCount: r.readCount,
    reciteCount: r.reciteCount,
    xpEarned: r.xpEarned,
  };
}

function validateProgress(o: unknown): ProgressPayload | null {
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  const num = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  const totalXp = num(r.totalXp);
  const level = num(r.level);
  const streakDays = num(r.streakDays);
  const totalPracticeCount = num(r.totalPracticeCount);
  const totalReadCount = num(r.totalReadCount);
  const totalReciteCount = num(r.totalReciteCount);
  if (
    totalXp === null ||
    level === null ||
    streakDays === null ||
    totalPracticeCount === null ||
    totalReadCount === null ||
    totalReciteCount === null
  ) {
    return null;
  }
  if (!Array.isArray(r.completedPhraseIds)) return null;
  const completedPhraseIds = r.completedPhraseIds.filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  if (!Array.isArray(r.recentPractices)) return null;
  const recentPractices: PracticeLogPayload[] = [];
  for (const item of r.recentPractices) {
    const v = validatePracticeLog(item);
    if (v) recentPractices.push(v);
  }
  const lastPracticeDate =
    r.lastPracticeDate === null
      ? null
      : typeof r.lastPracticeDate === "string"
        ? r.lastPracticeDate
        : null;
  return {
    totalXp,
    level,
    streakDays,
    totalPracticeCount,
    totalReadCount,
    totalReciteCount,
    completedPhraseIds,
    recentPractices,
    lastPracticeDate,
  };
}

function validatePutBody(raw: unknown): PutBody | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!isIsoString(r.clientUpdatedAt)) return null;
  if (!Array.isArray(r.phrases)) return null;
  const phrases: PhrasePayload[] = [];
  for (const item of r.phrases) {
    const v = validatePhrase(item);
    if (!v) return null; // 1件でも壊れていれば全体を弾く(部分書き込み回避)
    phrases.push(v);
  }
  const progress = validateProgress(r.progress);
  if (!progress) return null;
  return { clientUpdatedAt: r.clientUpdatedAt, phrases, progress };
}

// ---- DB 行型 ----------------------------------------------------------

interface PhraseRow {
  phrase_id: string;
  english: string;
  japanese: string;
  chunks: string;
  level: string;
  category: string;
  mood: string;
  source: string | null;
  source_section: number | null;
  source_index: number | null;
  updated_at: string;
}

interface ProgressRow {
  total_xp: number;
  level: number;
  streak_days: number;
  total_practice_count: number;
  total_read_count: number;
  total_recite_count: number;
  completed_phrase_ids: string;
  recent_practices: string;
  last_practice_date: string | null;
  updated_at: string;
}

// ---- ハンドラ ---------------------------------------------------------

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  const phrasesResult = await env.DB.prepare(
    `SELECT phrase_id, english, japanese, chunks, level, category, mood,
            source, source_section, source_index, updated_at
     FROM phrases
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY phrase_id`,
  )
    .bind(user.user_id)
    .all<PhraseRow>();

  const phrases: PhrasePayload[] = [];
  let maxUpdated = "";
  for (const row of phrasesResult.results ?? []) {
    let chunks: string[];
    try {
      const parsed = JSON.parse(row.chunks);
      chunks = Array.isArray(parsed)
        ? parsed.filter((c): c is string => typeof c === "string")
        : [];
    } catch {
      chunks = [];
    }
    const isMonologueRow = row.source === "monologue";
    // monologue は英語未入力の段階で chunks も空。それ以外は最低 1 件必須。
    if (chunks.length === 0 && !isMonologueRow) continue;
    if (!isPhraseLevel(row.level)) continue;
    if (!isPhraseCategory(row.category)) continue;
    if (!isPhraseMood(row.mood)) continue;
    const item: PhrasePayload = {
      id: row.phrase_id,
      english: row.english,
      japanese: row.japanese,
      chunks,
      level: row.level,
      category: row.category,
      mood: row.mood,
    };
    if (isPhraseSource(row.source)) item.source = row.source;
    if (isPositiveInt(row.source_section)) item.sourceSection = row.source_section;
    if (isPositiveInt(row.source_index)) item.sourceIndex = row.source_index;
    phrases.push(item);
    if (row.updated_at > maxUpdated) maxUpdated = row.updated_at;
  }

  const progressRow = await env.DB.prepare(
    `SELECT total_xp, level, streak_days, total_practice_count, total_read_count,
            total_recite_count, completed_phrase_ids, recent_practices,
            last_practice_date, updated_at
     FROM progress
     WHERE user_id = ?`,
  )
    .bind(user.user_id)
    .first<ProgressRow>();

  let progress: ProgressPayload | null = null;
  if (progressRow) {
    let completedPhraseIds: string[] = [];
    try {
      const parsed = JSON.parse(progressRow.completed_phrase_ids);
      if (Array.isArray(parsed)) {
        completedPhraseIds = parsed.filter(
          (s): s is string => typeof s === "string",
        );
      }
    } catch {
      // 壊れていたら空扱い
    }
    const recentPractices: PracticeLogPayload[] = [];
    try {
      const parsed = JSON.parse(progressRow.recent_practices);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const v = validatePracticeLog(item);
          if (v) recentPractices.push(v);
        }
      }
    } catch {
      // 壊れていたら空扱い
    }
    progress = {
      totalXp: progressRow.total_xp,
      level: progressRow.level,
      streakDays: progressRow.streak_days,
      totalPracticeCount: progressRow.total_practice_count,
      totalReadCount: progressRow.total_read_count,
      totalReciteCount: progressRow.total_recite_count,
      completedPhraseIds,
      recentPractices,
      lastPracticeDate: progressRow.last_practice_date,
    };
    if (progressRow.updated_at > maxUpdated) maxUpdated = progressRow.updated_at;
  }

  const snapshotUpdatedAt = maxUpdated || new Date(0).toISOString();
  return json({ snapshotUpdatedAt, phrases, progress });
};

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const body = validatePutBody(raw);
  if (!body) return jsonError(400, "invalid_payload");

  // クライアント時計を信用しすぎない: 未来日時はサーバ now にクランプ。
  const serverNow = new Date().toISOString();
  const updatedAt =
    body.clientUpdatedAt > serverNow ? serverNow : body.clientUpdatedAt;

  const { phrases, progress } = body;

  // 1. UPSERT phrases。LWW: incoming.updated_at >= existing.updated_at なら勝つ。
  //    INSERT 時は deleted_at を NULL に戻す(復活)。
  //
  //    DUO 3.0 取り込み等で数百件届くケースに備え、env.DB.batch() でまとめる。
  //    逐次 run() だと Cloudflare Workers のサブリクエスト上限 (Free 50 / Paid 1000)
  //    を超えて 500 になる。1 バッチ = 1 subrequest かつ 1 トランザクション。
  //    1 バッチあたりは安全側で 100 件に分割。
  if (phrases.length > 0) {
    const upsertSql = `INSERT INTO phrases (
         user_id, phrase_id, english, japanese, chunks,
         level, category, mood,
         source, source_section, source_index,
         updated_at, deleted_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
       ON CONFLICT(user_id, phrase_id) DO UPDATE SET
         english        = excluded.english,
         japanese       = excluded.japanese,
         chunks         = excluded.chunks,
         level          = excluded.level,
         category       = excluded.category,
         mood           = excluded.mood,
         source         = excluded.source,
         source_section = excluded.source_section,
         source_index   = excluded.source_index,
         updated_at     = excluded.updated_at,
         deleted_at     = NULL
       WHERE excluded.updated_at >= phrases.updated_at`;
    const BATCH_SIZE = 100;
    for (let i = 0; i < phrases.length; i += BATCH_SIZE) {
      const slice = phrases.slice(i, i + BATCH_SIZE);
      const stmts = slice.map((p) =>
        env.DB.prepare(upsertSql).bind(
          user.user_id,
          p.id,
          p.english,
          p.japanese,
          JSON.stringify(p.chunks),
          p.level,
          p.category,
          p.mood,
          p.source ?? null,
          p.sourceSection ?? null,
          p.sourceIndex ?? null,
          updatedAt,
        ),
      );
      await env.DB.batch(stmts);
    }
  }

  // 2. payload に含まれていない alive な phrase を tombstone(LWW)。
  //    巨大な NOT IN (?, ?, ...) は D1 の bind 上限に当たり得るため、
  //    alive 一覧を取得 → JS 側で差分計算 → 個別 UPDATE を batch 化する。
  const aliveRes = await env.DB.prepare(
    `SELECT phrase_id FROM phrases
     WHERE user_id = ? AND deleted_at IS NULL`,
  )
    .bind(user.user_id)
    .all<{ phrase_id: string }>();
  const incomingIdSet = new Set(phrases.map((p) => p.id));
  const toTombstone = (aliveRes.results ?? [])
    .map((r) => r.phrase_id)
    .filter((id) => !incomingIdSet.has(id));

  if (toTombstone.length > 0) {
    const tombSql = `UPDATE phrases
       SET deleted_at = ?, updated_at = ?
       WHERE user_id = ?
         AND phrase_id = ?
         AND deleted_at IS NULL
         AND updated_at <= ?`;
    const BATCH_SIZE = 100;
    for (let i = 0; i < toTombstone.length; i += BATCH_SIZE) {
      const slice = toTombstone.slice(i, i + BATCH_SIZE);
      const stmts = slice.map((id) =>
        env.DB.prepare(tombSql).bind(
          updatedAt,
          updatedAt,
          user.user_id,
          id,
          updatedAt,
        ),
      );
      await env.DB.batch(stmts);
    }
  }

  // 3. UPSERT progress(1ユーザー1行)。LWW。
  await env.DB.prepare(
    `INSERT INTO progress (
       user_id, total_xp, level, streak_days,
       total_practice_count, total_read_count, total_recite_count,
       completed_phrase_ids, recent_practices, last_practice_date, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       total_xp             = excluded.total_xp,
       level                = excluded.level,
       streak_days          = excluded.streak_days,
       total_practice_count = excluded.total_practice_count,
       total_read_count     = excluded.total_read_count,
       total_recite_count   = excluded.total_recite_count,
       completed_phrase_ids = excluded.completed_phrase_ids,
       recent_practices     = excluded.recent_practices,
       last_practice_date   = excluded.last_practice_date,
       updated_at           = excluded.updated_at
     WHERE excluded.updated_at >= progress.updated_at`,
  )
    .bind(
      user.user_id,
      progress.totalXp,
      progress.level,
      progress.streakDays,
      progress.totalPracticeCount,
      progress.totalReadCount,
      progress.totalReciteCount,
      JSON.stringify(progress.completedPhraseIds),
      JSON.stringify(progress.recentPractices),
      progress.lastPracticeDate,
      updatedAt,
    )
    .run();

  return json({ ok: true, savedAt: updatedAt });
};
