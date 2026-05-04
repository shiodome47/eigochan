// バックアップ用のJSON形式と、Export/Importの実装。
// 今回の対象は customPhrases。将来 progress も含められるよう、
// EigochanExportV1 にスロットを残してある。

import type { Phrase, PhraseSource } from "../types";
import {
  generateCustomPhraseId,
  isCustomPhrase,
  loadCustomPhrases,
  saveCustomPhrases,
  VALID_CATEGORIES,
  VALID_LEVELS,
  VALID_MOODS,
  VALID_SOURCES,
} from "./customPhrases";
import { nowJstIso, todayString } from "./date";

export interface EigochanExportV1 {
  app: "eigochan";
  version: 1;
  exportedAt: string;
  customPhrases: Phrase[];
  // 将来: progress?: UserProgressExport
}

export function buildExport(): EigochanExportV1 {
  return {
    app: "eigochan",
    version: 1,
    exportedAt: nowJstIso(),
    customPhrases: loadCustomPhrases(),
  };
}

export function exportToFile(): { count: number } {
  const data = buildExport();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `eigochan-backup-${todayString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { count: data.customPhrases.length };
}

export interface ParseResult {
  ok: boolean;
  error?: string;
  customPhrases: Phrase[];
}

function isValidLevelValue(v: unknown): boolean {
  return typeof v === "string" && (VALID_LEVELS as readonly string[]).includes(v);
}
function isValidCategoryValue(v: unknown): boolean {
  return typeof v === "string" && (VALID_CATEGORIES as readonly string[]).includes(v);
}
function isValidMoodValue(v: unknown): boolean {
  return typeof v === "string" && (VALID_MOODS as readonly string[]).includes(v);
}
function isValidSourceValue(v: unknown): v is PhraseSource {
  return typeof v === "string" && (VALID_SOURCES as readonly string[]).includes(v);
}
function isPositiveIntValue(v: unknown): v is number {
  return (
    typeof v === "number" && Number.isFinite(v) && Number.isInteger(v) && v > 0
  );
}

function validateImportedPhrase(item: unknown): Phrase | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  if (typeof o.english !== "string") return null;
  if (typeof o.japanese !== "string") return null;
  const isMonologue = o.source === "monologue";
  // ひとりごと英語は英語が後追いなので空 english を許可。それ以外は必須。
  if (!isMonologue && !o.english.trim()) return null;
  // 日本語は monologue では主役なので必須、それ以外でも従来どおり必須。
  if (!o.japanese.trim()) return null;
  const rawChunks = Array.isArray(o.chunks) ? o.chunks : [];
  const chunks = rawChunks
    .filter((c): c is string => typeof c === "string")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  if (!isMonologue && chunks.length === 0) return null;

  const id = typeof o.id === "string" ? o.id : "";
  const out: Phrase = {
    id,
    english: o.english.trim(),
    japanese: o.japanese.trim(),
    chunks,
    level: isValidLevelValue(o.level) ? (o.level as Phrase["level"]) : "beginner",
    category: isValidCategoryValue(o.category) ? (o.category as Phrase["category"]) : "custom",
    mood: isValidMoodValue(o.mood) ? (o.mood as Phrase["mood"]) : "natural",
  };
  // 出典メタ・ひとりごと作成日時は round-trip で失わないよう保持する。
  if (isValidSourceValue(o.source)) out.source = o.source;
  if (isPositiveIntValue(o.sourceSection)) out.sourceSection = o.sourceSection;
  if (isPositiveIntValue(o.sourceIndex)) out.sourceIndex = o.sourceIndex;
  if (typeof o.thoughtCreatedAt === "string" && o.thoughtCreatedAt) {
    out.thoughtCreatedAt = o.thoughtCreatedAt;
  }
  return out;
}

export function parseImport(json: unknown): ParseResult {
  if (!json || typeof json !== "object") {
    return { ok: false, error: "ファイルの形式が読み取れませんでした", customPhrases: [] };
  }
  const obj = json as Record<string, unknown>;
  if (obj.app !== "eigochan") {
    return {
      ok: false,
      error: "eigochanのバックアップファイルではないようです",
      customPhrases: [],
    };
  }
  if (obj.version !== 1) {
    return {
      ok: false,
      error: "このバージョンのバックアップにはまだ対応していません",
      customPhrases: [],
    };
  }
  const list = Array.isArray(obj.customPhrases) ? obj.customPhrases : [];
  const validated: Phrase[] = [];
  for (const item of list) {
    const v = validateImportedPhrase(item);
    if (v) validated.push(v);
  }
  return { ok: true, customPhrases: validated };
}

export interface MergeResult {
  added: number;
  reassigned: number;
}

/**
 * 既存の自作フレーズに「マージ」する。
 * - 既存IDと衝突した場合は新しいIDを振って追加
 * - id が "custom_" 形式でなければ新IDを振って追加
 * - 既存データは1件も削除しない
 */
export function mergeImport(imported: Phrase[]): MergeResult {
  const existing = loadCustomPhrases();
  const idSet = new Set(existing.map((p) => p.id));
  let reassigned = 0;
  let added = 0;

  for (const p of imported) {
    let nextId = p.id;
    if (!isCustomPhrase(nextId) || idSet.has(nextId)) {
      nextId = generateCustomPhraseId();
      reassigned += 1;
      // 同じミリ秒で生成された場合の衝突対策(極稀)
      while (idSet.has(nextId)) nextId = generateCustomPhraseId();
    }
    existing.push({ ...p, id: nextId });
    idSet.add(nextId);
    added += 1;
  }
  saveCustomPhrases(existing);
  return { added, reassigned };
}

/** ファイルから読み込み + 検証(JSON Parse の失敗もハンドル)。 */
export async function readImportFile(file: File): Promise<ParseResult> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: "ファイルを読み込めませんでした", customPhrases: [] };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "JSONとして解釈できませんでした", customPhrases: [] };
  }
  return parseImport(parsed);
}
