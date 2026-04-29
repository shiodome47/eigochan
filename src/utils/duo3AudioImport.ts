// DUO 3.0 用の音声一括 Import。
//
// 仕様:
//   - 入力はユーザーが <input type="file" multiple> で選んだ File[]。
//   - ファイル名 (拡張子除く) が duo3_sNN_NNN 形式かつ localStorage に同 ID の
//     フレーズが存在するときだけ、reference スロットに保存する。
//   - syncCode が設定されていれば R2 への自動アップロード予約 (enqueueAudioUpload)
//     も行う。未設定なら IndexedDB に置くだけ。
//   - DUO 音声ファイルはリポジトリには含めない。各ユーザーが自分の手元から取り込む。

import { loadCustomPhrases } from "./customPhrases";
import {
  listAllPhraseAudio,
  savePhraseAudio,
} from "./phraseAudioStorage";
import { enqueueAudioUpload } from "./autoSync";
import { loadSyncCode } from "./syncClient";

const FILENAME_RE = /^duo3_s\d{2}_\d{3}$/;

// R2 側 (functions/api/audio/[phraseId]/[slot].ts) と同じ閾値。
export const DUO3_AUDIO_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export type Duo3AudioStatus =
  | "ok"               // 新規保存予定
  | "ok-overwrite"     // 既存の reference 音声を上書き予定
  | "skip-name"        // ファイル名が duo3_sNN_NNN 形式じゃない
  | "skip-mime"        // 音声として認識できない
  | "skip-no-phrase"   // 対応するフレーズが localStorage にない
  | "skip-too-large";  // 5 MB 超

export interface Duo3AudioPreviewItem {
  fileName: string;
  size: number;
  status: Duo3AudioStatus;
  phraseId?: string;
  message: string;
}

export interface Duo3AudioPreview {
  items: Duo3AudioPreviewItem[];
  totalSelected: number;
  validCount: number;
  overwriteCount: number;
  unmatchedCount: number;
  invalidCount: number;
}

function parsePhraseIdFromFilename(name: string): string | null {
  const dotIdx = name.lastIndexOf(".");
  const stem = dotIdx > 0 ? name.slice(0, dotIdx) : name;
  return FILENAME_RE.test(stem) ? stem : null;
}

function isAudioFile(file: File): boolean {
  if (file.type && file.type.startsWith("audio/")) return true;
  // 一部の OS / ブラウザは MIME を空で返す。拡張子にフォールバック。
  return /\.(mp3|m4a|wav|ogg|aac)$/i.test(file.name);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 選択されたファイル群を分析し、ファイルごとの保存可否と上書き有無を返す。
 * 副作用なし (IndexedDB は読み取りのみ)。
 */
export async function analyzeDuo3AudioFiles(
  files: readonly File[],
): Promise<Duo3AudioPreview> {
  const preview: Duo3AudioPreview = {
    items: [],
    totalSelected: files.length,
    validCount: 0,
    overwriteCount: 0,
    unmatchedCount: 0,
    invalidCount: 0,
  };

  const knownIds = new Set<string>();
  for (const p of loadCustomPhrases()) knownIds.add(p.id);

  const existingRefs = new Set<string>();
  try {
    for (const a of await listAllPhraseAudio()) {
      if (a.slot === "reference") existingRefs.add(a.phraseId);
    }
  } catch {
    // IDB 不可環境では上書き判定を空扱い (保存自体は別途エラーになる)
  }

  for (const file of files) {
    const phraseId = parsePhraseIdFromFilename(file.name);
    if (!phraseId) {
      preview.items.push({
        fileName: file.name,
        size: file.size,
        status: "skip-name",
        message: "スキップ：ファイル名形式が違います (duo3_sNN_NNN)",
      });
      preview.invalidCount += 1;
      continue;
    }
    if (!isAudioFile(file)) {
      preview.items.push({
        fileName: file.name,
        size: file.size,
        status: "skip-mime",
        phraseId,
        message: "スキップ：音声ファイルとして認識できません",
      });
      preview.invalidCount += 1;
      continue;
    }
    if (file.size > DUO3_AUDIO_MAX_SIZE) {
      preview.items.push({
        fileName: file.name,
        size: file.size,
        status: "skip-too-large",
        phraseId,
        message: `スキップ：5MB を超えています (${formatSize(file.size)})`,
      });
      preview.invalidCount += 1;
      continue;
    }
    if (!knownIds.has(phraseId)) {
      preview.items.push({
        fileName: file.name,
        size: file.size,
        status: "skip-no-phrase",
        phraseId,
        message: "スキップ：対応するフレーズが見つかりません (先にテキスト Import が必要)",
      });
      preview.unmatchedCount += 1;
      continue;
    }
    const overwrite = existingRefs.has(phraseId);
    preview.items.push({
      fileName: file.name,
      size: file.size,
      status: overwrite ? "ok-overwrite" : "ok",
      phraseId,
      message: overwrite
        ? `${phraseId} のお手本音声を上書き予定`
        : `${phraseId} に保存予定`,
    });
    preview.validCount += 1;
    if (overwrite) preview.overwriteCount += 1;
  }

  return preview;
}

export interface Duo3AudioImportResult {
  saved: number;
  skipped: number;
  failed: number;
  enqueuedForSync: number;
  hasSyncCode: boolean;
  failures: Array<{ fileName: string; reason: string }>;
}

/**
 * 実 Import。analyze と同じ判定を再評価し、ok / ok-overwrite だけ
 * IndexedDB に保存する。syncCode があれば R2 アップロード予約も行う。
 */
export async function importDuo3AudioFiles(
  files: readonly File[],
): Promise<Duo3AudioImportResult> {
  const preview = await analyzeDuo3AudioFiles(files);
  const result: Duo3AudioImportResult = {
    saved: 0,
    skipped: 0,
    failed: 0,
    enqueuedForSync: 0,
    hasSyncCode: !!loadSyncCode(),
    failures: [],
  };

  // 同名ファイル重複は想定しない (File API の name 重複は使い手依存)。
  const fileByName = new Map<string, File>();
  for (const f of files) fileByName.set(f.name, f);

  for (const item of preview.items) {
    if (item.status !== "ok" && item.status !== "ok-overwrite") {
      result.skipped += 1;
      continue;
    }
    const file = fileByName.get(item.fileName);
    if (!file || !item.phraseId) {
      result.skipped += 1;
      continue;
    }
    try {
      await savePhraseAudio(
        item.phraseId,
        "reference",
        file,
        file.type || "audio/mpeg",
      );
      result.saved += 1;
      if (result.hasSyncCode) {
        enqueueAudioUpload(item.phraseId, "reference");
        result.enqueuedForSync += 1;
      }
    } catch (e) {
      result.failed += 1;
      result.failures.push({
        fileName: file.name,
        reason: e instanceof Error ? e.message : "保存に失敗しました",
      });
    }
  }

  return result;
}
