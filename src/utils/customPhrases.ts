import type {
  Phrase,
  PhraseCategory,
  PhraseLevel,
  PhraseMood,
  PhraseSource,
} from "../types";
import { deleteAllPhraseAudioForPhrase } from "./phraseAudioStorage";

const STORAGE_KEY = "eigochan.customPhrases.v1";

export const VALID_LEVELS: readonly PhraseLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const VALID_CATEGORIES: readonly PhraseCategory[] = [
  "custom",
  "daily",
  "conversation",
  "feeling",
  "work",
  "learning",
  "travel",
] as const;

export const VALID_MOODS: readonly PhraseMood[] = [
  "natural",
  "casual",
  "polite",
  "warm",
  "neutral",
] as const;

export const VALID_SOURCES: readonly PhraseSource[] = [
  "initial",
  "original",
  "duo3",
] as const;

// localStorage に保存される非同梱フレーズ全般を指す。
// 旧 ID ("custom_...") に加えて DUO 取り込み ID ("duo3_...") も含む。
export function isCustomPhrase(id: string): boolean {
  return id.startsWith("custom_") || id.startsWith("duo3_");
}

export function generateCustomPhraseId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 9);
  return `custom_${ts}_${rand}`;
}

// DUO 3.0 取り込み用の決定的 ID。
// 例: section=5, index=87 → "duo3_s05_087"
export function generateDuo3PhraseId(section: number, index: number): string {
  const sec = String(Math.trunc(section)).padStart(2, "0");
  const idx = String(Math.trunc(index)).padStart(3, "0");
  return `duo3_s${sec}_${idx}`;
}

// 未設定 (undefined) は "original" として扱う。既存データを壊さないため。
export function effectiveSource(p: Pick<Phrase, "source">): PhraseSource {
  return p.source ?? "original";
}

function isValidLevel(v: unknown): v is PhraseLevel {
  return typeof v === "string" && (VALID_LEVELS as readonly string[]).includes(v);
}

function isValidCategory(v: unknown): v is PhraseCategory {
  return typeof v === "string" && (VALID_CATEGORIES as readonly string[]).includes(v);
}

function isValidMood(v: unknown): v is PhraseMood {
  return typeof v === "string" && (VALID_MOODS as readonly string[]).includes(v);
}

function isValidSource(v: unknown): v is PhraseSource {
  return typeof v === "string" && (VALID_SOURCES as readonly string[]).includes(v);
}

function isPositiveInt(v: unknown): v is number {
  return (
    typeof v === "number" && Number.isFinite(v) && Number.isInteger(v) && v > 0
  );
}

/**
 * 英文から . ! ? , を区切りに簡易チャンク分割する。
 * 空白を保ったまま末尾の記号は残す(自然な見た目を優先)。
 * 結果が空なら原文をそのまま1チャンクとして返す。
 */
export function autoChunkText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // 「.」「!」「?」「,」のあとに空白がある箇所で区切る
  // 末尾に句読点がない最終断片も残す
  const parts = trimmed
    .split(/(?<=[.!?,])\s+/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.length > 0 ? parts : [trimmed];
}

/** 改行区切りのテキストをチャンク配列に。空行は除外。 */
export function parseChunkText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** チャンク配列を改行区切りのテキストに。 */
export function chunksToText(chunks: string[]): string {
  return chunks.join("\n");
}

function safeGet(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeSet(value: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    // localStorage が使えない環境(プライベートモード、容量超過 等)
    return false;
  }
}

/** 永続化された値の検証(存在しないキー・型ズレを除去)。 */
function sanitizeStored(arr: unknown): Phrase[] {
  if (!Array.isArray(arr)) return [];
  const out: Phrase[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "string" || !o.id) continue;
    if (typeof o.english !== "string" || !o.english.trim()) continue;
    // japanese は空文字 ("") を許可する。DUO Import 等で訳を後追いするケースに対応。
    // 型不一致 (string でない) のみドロップする。
    if (typeof o.japanese !== "string") continue;
    const chunks = Array.isArray(o.chunks)
      ? o.chunks.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      : [];
    if (chunks.length === 0) continue;
    const phrase: Phrase = {
      id: o.id,
      english: o.english,
      japanese: o.japanese,
      chunks,
      level: isValidLevel(o.level) ? o.level : "beginner",
      category: isValidCategory(o.category) ? o.category : "custom",
      mood: isValidMood(o.mood) ? o.mood : "natural",
    };
    // optional な出典メタ。読み込み時に欠けていてもエントリは破棄しない (旧データ互換)。
    if (isValidSource(o.source)) phrase.source = o.source;
    if (isPositiveInt(o.sourceSection)) phrase.sourceSection = o.sourceSection;
    if (isPositiveInt(o.sourceIndex)) phrase.sourceIndex = o.sourceIndex;
    out.push(phrase);
  }
  return out;
}

export function loadCustomPhrases(): Phrase[] {
  const raw = safeGet();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return sanitizeStored(parsed);
  } catch {
    return [];
  }
}

export function saveCustomPhrases(phrases: Phrase[]): boolean {
  return safeSet(JSON.stringify(phrases));
}

export interface CustomPhraseInput {
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

export interface ValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof CustomPhraseInput, string>>;
}

export function validateInput(input: Partial<CustomPhraseInput>): ValidationResult {
  const errors: ValidationResult["errors"] = {};
  if (!input.english || !input.english.trim()) {
    errors.english = "英文を入れてね";
  }
  if (!input.japanese || !input.japanese.trim()) {
    errors.japanese = "日本語訳を入れてね";
  }
  const chunks = (input.chunks ?? []).filter((c) => c.trim().length > 0);
  if (chunks.length === 0) {
    errors.chunks = "チャンクを1つ以上入れてね";
  }
  // DUO 出典は section/index がそろっていないと整理できないので両方必須。
  if (input.source === "duo3") {
    if (!isPositiveInt(input.sourceSection)) {
      errors.sourceSection = "DUO の Section 番号 (1〜45) を入れてね";
    }
    if (!isPositiveInt(input.sourceIndex)) {
      errors.sourceIndex = "DUO の通し番号を入れてね";
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

function normalize(input: CustomPhraseInput): Omit<Phrase, "id"> {
  const out: Omit<Phrase, "id"> = {
    english: input.english.trim(),
    japanese: input.japanese.trim(),
    chunks: input.chunks.map((c) => c.trim()).filter((c) => c.length > 0),
    level: input.level,
    category: input.category,
    mood: input.mood,
  };
  if (input.source) out.source = input.source;
  if (isPositiveInt(input.sourceSection)) out.sourceSection = input.sourceSection;
  if (isPositiveInt(input.sourceIndex)) out.sourceIndex = input.sourceIndex;
  return out;
}

/**
 * 新規フレーズを追加。
 * 戻り値: 保存に成功した Phrase。
 *         localStorage 書き込みに失敗した場合は null(クォータ超過、プライベートモード 等)。
 *
 * source==='duo3' で section/index が両方そろっているときは決定的 ID
 * "duo3_s<sec>_<idx>" を使う。同 ID が既にあれば置換する (Import 冪等性)。
 */
export function addCustomPhrase(input: CustomPhraseInput): Phrase | null {
  const phrases = loadCustomPhrases();
  const useDeterministic =
    input.source === "duo3" &&
    isPositiveInt(input.sourceSection) &&
    isPositiveInt(input.sourceIndex);
  const id = useDeterministic
    ? generateDuo3PhraseId(
        input.sourceSection as number,
        input.sourceIndex as number,
      )
    : generateCustomPhraseId();
  const phrase: Phrase = { id, ...normalize(input) };
  const idx = phrases.findIndex((p) => p.id === id);
  if (idx >= 0) phrases[idx] = phrase;
  else phrases.push(phrase);
  if (!saveCustomPhrases(phrases)) return null;
  return phrase;
}

/**
 * 既存フレーズを上書き。
 * 戻り値: 上書き後の Phrase。対象が無い・保存に失敗した場合は null。
 */
export function updateCustomPhrase(id: string, input: CustomPhraseInput): Phrase | null {
  if (!isCustomPhrase(id)) return null;
  const phrases = loadCustomPhrases();
  const idx = phrases.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Phrase = { id, ...normalize(input) };
  phrases[idx] = updated;
  if (!saveCustomPhrases(phrases)) return null;
  return updated;
}

/**
 * 自作フレーズを削除。
 * 戻り値: true=削除成立、false=対象が無いか localStorage への書き戻しに失敗。
 */
export function deleteCustomPhrase(id: string): boolean {
  if (!isCustomPhrase(id)) return false;
  const phrases = loadCustomPhrases();
  const next = phrases.filter((p) => p.id !== id);
  if (next.length === phrases.length) return false;
  if (!saveCustomPhrases(next)) return false;
  // 紐づく音声メモも削除(IndexedDB は非同期 / fire-and-forget。
  // 失敗してもフレーズ削除自体は成立しているため握りつぶす)。
  void deleteAllPhraseAudioForPhrase(id).catch(() => {
    // 無視
  });
  return true;
}

export function findCustomPhraseById(id: string): Phrase | undefined {
  if (!isCustomPhrase(id)) return undefined;
  return loadCustomPhrases().find((p) => p.id === id);
}

// ---- DUO 3.0 テキスト貼り付け Import ---------------------------------

// 行頭の番号表記 (例: "1. ", "001) ", "  12: ") を取り除く。
// 番号として扱うのは ASCII 数字のみ。日本語の連番は剥がさない。
const LINE_NUMBER_PREFIX = /^\s*\d+\s*[.)、:：]\s+/;

/**
 * 貼り付け本文を 1 行 1 フレーズに分解する。
 *  - 空行 (空白のみを含む) は除去
 *  - 行頭の連番 ("1.", "001.", "12)" 等) は除去
 *  - 行内の前後空白も除去
 */
export function parseDuo3PastedText(text: string): string[] {
  if (typeof text !== "string") return [];
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const stripped = raw.replace(LINE_NUMBER_PREFIX, "").trim();
    if (stripped.length === 0) continue;
    out.push(stripped);
  }
  return out;
}

export interface Duo3ImportInput {
  section: number;
  startIndex: number;
  englishLines: string[];
}

export interface Duo3ImportResult {
  /** 取り込んだ件数 (新規 + 更新の合計) */
  imported: number;
  /** 新規追加 */
  inserted: number;
  /** 既存 ID を上書き */
  replaced: number;
  /** 入力が空文字などで弾かれた件数 */
  skipped: number;
  /** localStorage 書き込みに失敗したかどうか (true なら何も保存されていない) */
  storageFailed: boolean;
  /** 生成した先頭の ID 数件 (UI プレビューや結果表示用) */
  sampleIds: string[];
}

/**
 * DUO 3.0 用の一括取り込み。
 *  - section / startIndex / englishLines を受け取り、決定的 ID で localStorage に書き込む。
 *  - 同 ID が既に存在すれば置換 (冪等)。
 *  - 個別に addCustomPhrase を呼ばず 1 度の保存で済ませる (大量行でも遅くならない)。
 */
export function importDuo3Phrases(input: Duo3ImportInput): Duo3ImportResult {
  const result: Duo3ImportResult = {
    imported: 0,
    inserted: 0,
    replaced: 0,
    skipped: 0,
    storageFailed: false,
    sampleIds: [],
  };
  if (!isPositiveInt(input.section) || !isPositiveInt(input.startIndex)) {
    result.skipped = input.englishLines.length;
    return result;
  }

  const phrases = loadCustomPhrases();
  const idIndex = new Map<string, number>();
  phrases.forEach((p, i) => idIndex.set(p.id, i));

  let cursor = input.startIndex;
  for (const rawEng of input.englishLines) {
    const english = rawEng.trim();
    if (english.length === 0) {
      result.skipped += 1;
      continue;
    }
    const id = generateDuo3PhraseId(input.section, cursor);
    const phrase: Phrase = {
      id,
      english,
      japanese: "", // 貼り付け時点では訳は空。後から編集画面で追記できる。
      chunks: [english], // チャンク分割は後で編集画面で調整できるよう、暫定で 1 チャンク。
      level: "beginner",
      category: "learning",
      mood: "neutral",
      source: "duo3",
      sourceSection: input.section,
      sourceIndex: cursor,
    };
    const existing = idIndex.get(id);
    if (typeof existing === "number") {
      phrases[existing] = phrase;
      result.replaced += 1;
    } else {
      idIndex.set(id, phrases.length);
      phrases.push(phrase);
      result.inserted += 1;
    }
    if (result.sampleIds.length < 3) result.sampleIds.push(id);
    cursor += 1;
  }

  result.imported = result.inserted + result.replaced;

  if (result.imported === 0) {
    return result;
  }
  if (!saveCustomPhrases(phrases)) {
    // 保存失敗時は何も書き込めていない扱い (counts は呼び出し側で参考表示にする)。
    result.storageFailed = true;
  }
  return result;
}
