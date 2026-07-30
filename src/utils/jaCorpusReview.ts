// 日→英モードのレビュー状態 (◎○△× とメモ) と、
// 日本語コーパス → 既存フレーズ (録音・音読で使う Phrase) への橋渡し。
//
// 保存先はこの端末の localStorage。コーパス本体 (src/data/jaCorpus) は
// リポジトリ内の静的データなので、ここには「評価とメモ」だけを持つ。

import {
  JA_SENTENCES,
  findJaDomain,
  type JaSentence,
} from "../data/jaCorpus";
import { loadCustomPhrases, saveCustomPhrases } from "./customPhrases";
import { enqueueSnapshotPush } from "./autoSync";
import type { Phrase, PhraseCategory } from "../types";

const STORAGE_KEY = "eigochan.jaCorpusReview.v1";

/** ◎ よく使う / ○ 言いそう / △ あまり言わない / × 自分らしくない */
export type JaRating = "A" | "B" | "C" | "D";

export const JA_RATING_MARKS: Record<JaRating, string> = {
  A: "◎",
  B: "○",
  C: "△",
  D: "×",
};

export const JA_RATING_LABELS: Record<JaRating, string> = {
  A: "よく使う",
  B: "言いそう",
  C: "あまり言わない",
  D: "自分らしくない",
};

export interface JaReviewEntry {
  rating: JaRating | "";
  note: string;
  /** 評価した時点の日本語。データ側を書き換えたときのズレ検知用。 */
  ja: string;
}

export type JaReviewMap = Record<string, JaReviewEntry>;

function isRating(v: unknown): v is JaRating {
  return v === "A" || v === "B" || v === "C" || v === "D";
}

export function loadJaReview(): JaReviewMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: JaReviewMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const v = value as Record<string, unknown>;
      const rating = isRating(v.rating) ? v.rating : "";
      const note = typeof v.note === "string" ? v.note : "";
      if (!rating && !note) continue;
      out[id] = { rating, note, ja: typeof v.ja === "string" ? v.ja : "" };
    }
    return out;
  } catch {
    return {};
  }
}

export function saveJaReview(map: JaReviewMap): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

function withEntry(
  map: JaReviewMap,
  sentence: JaSentence,
  patch: Partial<JaReviewEntry>,
): JaReviewMap {
  const prev = map[sentence.id] ?? { rating: "" as const, note: "", ja: sentence.ja };
  const next: JaReviewEntry = { ...prev, ...patch, ja: sentence.ja };
  const out = { ...map };
  if (!next.rating && !next.note) delete out[sentence.id];
  else out[sentence.id] = next;
  return out;
}

/** 同じ評価をもう一度押したら解除。 */
export function toggleJaRating(
  map: JaReviewMap,
  sentence: JaSentence,
  rating: JaRating,
): JaReviewMap {
  const current = map[sentence.id]?.rating ?? "";
  return withEntry(map, sentence, { rating: current === rating ? "" : rating });
}

export function setJaNote(
  map: JaReviewMap,
  sentence: JaSentence,
  note: string,
): JaReviewMap {
  return withEntry(map, sentence, { note: note.trim() });
}

export interface JaReviewSummary {
  total: number;
  rated: number;
  keep: number; // ◎ ○
  drop: number; // △ ×
  notes: number;
}

export function summarizeJaReview(
  map: JaReviewMap,
  sentences: JaSentence[] = JA_SENTENCES,
): JaReviewSummary {
  let rated = 0;
  let keep = 0;
  let drop = 0;
  let notes = 0;
  for (const s of sentences) {
    const e = map[s.id];
    if (!e) continue;
    if (e.rating) rated += 1;
    if (e.rating === "A" || e.rating === "B") keep += 1;
    if (e.rating === "C" || e.rating === "D") drop += 1;
    if (e.note) notes += 1;
  }
  return { total: sentences.length, rated, keep, drop, notes };
}

/* ── コーパス → Phrase (録音・音読で使う既存の仕組み) ───────────── */

// グループ → 既存 Phrase の category。
const GROUP_CATEGORY: Record<string, PhraseCategory> = {
  日常生活: "daily",
  外出: "travel",
  人との会話: "conversation",
  "学習・仕事": "work",
  固有分野: "custom",
  思考と言葉の癖: "conversation",
};

/**
 * コーパスの文に対応する Phrase の ID。
 * "custom_" 始まりなので既存の isCustomPhrase() / 同期・音声メモにそのまま乗る。
 * 決定的なので、同じ文を何度取り込んでも増殖しない。
 */
export function jaPhraseId(sentenceId: string): string {
  return `custom_jc_${sentenceId}`;
}

export function isJaCorpusPhraseId(phraseId: string): boolean {
  return phraseId.startsWith("custom_jc_");
}

function toPhrase(sentence: JaSentence): Phrase {
  const domain = findJaDomain(sentence.domain);
  const category = (domain && GROUP_CATEGORY[domain.group]) ?? "custom";
  return {
    id: jaPhraseId(sentence.id),
    english: sentence.en,
    japanese: sentence.ja,
    chunks: sentence.chunks.length > 0 ? sentence.chunks : sentence.en ? [sentence.en] : [],
    level: "beginner",
    category,
    // 英語がまだ入っていない文は monologue 扱い (english 空を許可する既存ルール)。
    mood: "natural",
    source: sentence.en ? "original" : "monologue",
  };
}

export interface JaMaterializeResult {
  added: number;
  replaced: number;
  phraseIds: string[];
  ok: boolean;
}

/**
 * コーパスの文を自作フレーズとして localStorage に実体化する。
 * 既に同じ ID があれば上書き (日本語・英語の修正を反映)。
 * 音声メモは phraseId 単位なので、上書きしても剥がれない。
 */
export function materializeJaSentences(sentences: JaSentence[]): JaMaterializeResult {
  const phrases = loadCustomPhrases();
  const indexById = new Map(phrases.map((p, i) => [p.id, i]));
  let added = 0;
  let replaced = 0;
  const phraseIds: string[] = [];

  for (const s of sentences) {
    const phrase = toPhrase(s);
    phraseIds.push(phrase.id);
    const at = indexById.get(phrase.id);
    if (at === undefined) {
      indexById.set(phrase.id, phrases.length);
      phrases.push(phrase);
      added += 1;
    } else {
      phrases[at] = phrase;
      replaced += 1;
    }
  }

  const ok = saveCustomPhrases(phrases);
  if (ok && (added > 0 || replaced > 0)) enqueueSnapshotPush();
  return { added, replaced, phraseIds, ok };
}

/** 1 文だけ実体化して phraseId を返す (録音を始めるときなどに使う)。 */
export function materializeJaSentence(sentence: JaSentence): string | null {
  const result = materializeJaSentences([sentence]);
  return result.ok ? jaPhraseId(sentence.id) : null;
}

/** 既に自作フレーズとして実体化ずみのコーパス文 ID の集合。 */
export function materializedJaSentenceIds(): Set<string> {
  const out = new Set<string>();
  for (const p of loadCustomPhrases()) {
    if (isJaCorpusPhraseId(p.id)) out.add(p.id.slice("custom_jc_".length));
  }
  return out;
}

/* ── 書き出し / 読み込み ────────────────────────────────────── */

export interface JaCorpusExportV1 {
  app: "eigochan-ja-corpus";
  version: 1;
  exportedAt: string;
  sentences: {
    id: string;
    domain: number;
    domainTitle: string;
    group: string;
    ja: string;
    en: string;
    chunks: string[];
    scene: string;
    to: string;
    imp: string;
    rating: JaRating | "";
    ratingMark: string;
    note: string;
  }[];
}

export function buildJaCorpusExport(map: JaReviewMap): JaCorpusExportV1 {
  return {
    app: "eigochan-ja-corpus",
    version: 1,
    exportedAt: new Date().toISOString(),
    sentences: JA_SENTENCES.map((s) => {
      const e = map[s.id];
      const domain = findJaDomain(s.domain);
      return {
        id: s.id,
        domain: s.domain,
        domainTitle: domain?.title ?? "",
        group: domain?.group ?? "",
        ja: s.ja,
        en: s.en,
        chunks: s.chunks,
        scene: s.scene,
        to: s.to,
        imp: s.imp,
        rating: e?.rating ?? "",
        ratingMark: e?.rating ? JA_RATING_MARKS[e.rating] : "",
        note: e?.note ?? "",
      };
    }),
  };
}

const TSV_HEADER = [
  "id",
  "グループ",
  "分野番号",
  "分野",
  "日本語",
  "英語",
  "チャンク",
  "場面",
  "相手",
  "重要度",
  "評価",
  "メモ",
];

function tsvCell(v: string | number): string {
  return String(v ?? "").replace(/[\t\r\n]+/g, " ");
}

export function buildJaCorpusTsv(map: JaReviewMap): string {
  const lines = [TSV_HEADER.join("\t")];
  for (const s of JA_SENTENCES) {
    const e = map[s.id];
    const domain = findJaDomain(s.domain);
    lines.push(
      [
        s.id,
        domain?.group ?? "",
        s.domain,
        domain?.title ?? "",
        s.ja,
        s.en,
        s.chunks.join(" | "),
        s.scene,
        s.to,
        s.imp,
        e?.rating ? JA_RATING_MARKS[e.rating] : "",
        e?.note ?? "",
      ]
        .map(tsvCell)
        .join("\t"),
    );
  }
  return lines.join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/plain"): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface JaReviewImportResult {
  ok: boolean;
  error?: string;
  map: JaReviewMap;
  applied: number;
  unknown: number;
}

/** 書き出した JSON から評価とメモだけを復元する (別端末への引き継ぎ用)。 */
export function parseJaReviewImport(json: unknown): JaReviewImportResult {
  const empty: JaReviewMap = {};
  if (!json || typeof json !== "object") {
    return { ok: false, error: "ファイルの形式が読み取れませんでした", map: empty, applied: 0, unknown: 0 };
  }
  const obj = json as Record<string, unknown>;
  if (obj.app !== "eigochan-ja-corpus") {
    return {
      ok: false,
      error: "日→英モードの書き出しファイルではないようです",
      map: empty,
      applied: 0,
      unknown: 0,
    };
  }
  if (obj.version !== 1) {
    return { ok: false, error: "このバージョンにはまだ対応していません", map: empty, applied: 0, unknown: 0 };
  }
  const rows = Array.isArray(obj.sentences) ? obj.sentences : [];
  const known = new Set(JA_SENTENCES.map((s) => s.id));
  const map: JaReviewMap = {};
  let applied = 0;
  let unknown = 0;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    if (typeof r.id !== "string") continue;
    const rating = isRating(r.rating) ? r.rating : "";
    const note = typeof r.note === "string" ? r.note : "";
    if (!rating && !note) continue;
    if (!known.has(r.id)) {
      unknown += 1;
      continue;
    }
    map[r.id] = { rating, note, ja: typeof r.ja === "string" ? r.ja : "" };
    applied += 1;
  }
  return { ok: true, map, applied, unknown };
}
