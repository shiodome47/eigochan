import type {
  Phrase,
  PhraseCategory,
  PhraseLevel,
  PhraseMood,
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

export function isCustomPhrase(id: string): boolean {
  return id.startsWith("custom_");
}

export function generateCustomPhraseId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 9);
  return `custom_${ts}_${rand}`;
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

function safeSet(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage が使えない環境では握りつぶす
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
    if (typeof o.japanese !== "string" || !o.japanese.trim()) continue;
    const chunks = Array.isArray(o.chunks)
      ? o.chunks.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      : [];
    if (chunks.length === 0) continue;
    out.push({
      id: o.id,
      english: o.english,
      japanese: o.japanese,
      chunks,
      level: isValidLevel(o.level) ? o.level : "beginner",
      category: isValidCategory(o.category) ? o.category : "custom",
      mood: isValidMood(o.mood) ? o.mood : "natural",
    });
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

export function saveCustomPhrases(phrases: Phrase[]): void {
  safeSet(JSON.stringify(phrases));
}

export interface CustomPhraseInput {
  english: string;
  japanese: string;
  chunks: string[];
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
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
  return { ok: Object.keys(errors).length === 0, errors };
}

function normalize(input: CustomPhraseInput): Omit<Phrase, "id"> {
  return {
    english: input.english.trim(),
    japanese: input.japanese.trim(),
    chunks: input.chunks.map((c) => c.trim()).filter((c) => c.length > 0),
    level: input.level,
    category: input.category,
    mood: input.mood,
  };
}

export function addCustomPhrase(input: CustomPhraseInput): Phrase {
  const phrases = loadCustomPhrases();
  const phrase: Phrase = { id: generateCustomPhraseId(), ...normalize(input) };
  phrases.push(phrase);
  saveCustomPhrases(phrases);
  return phrase;
}

export function updateCustomPhrase(id: string, input: CustomPhraseInput): Phrase | null {
  if (!isCustomPhrase(id)) return null;
  const phrases = loadCustomPhrases();
  const idx = phrases.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Phrase = { id, ...normalize(input) };
  phrases[idx] = updated;
  saveCustomPhrases(phrases);
  return updated;
}

export function deleteCustomPhrase(id: string): boolean {
  if (!isCustomPhrase(id)) return false;
  const phrases = loadCustomPhrases();
  const next = phrases.filter((p) => p.id !== id);
  if (next.length === phrases.length) return false;
  saveCustomPhrases(next);
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
