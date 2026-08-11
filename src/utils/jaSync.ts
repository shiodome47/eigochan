// 日→英モードのクラウド同期ペイロード。
// snapshot API の optional `ja` ブロックとして送受信する。

import type { Phrase, UserProgress } from "../types";
import { loadCustomPhrases } from "./customPhrases";
import { loadJaDomainNotes, saveJaDomainNotes, type JaDomainNoteMap } from "./jaDomainNote";
import { loadJaReview, saveJaReview, type JaReviewMap } from "./jaCorpusReview";
import { loadSrs, saveSrs, type SrsMap } from "./srs";
import { loadProgress } from "./storage";

export interface JaSyncPayload {
  srs: SrsMap;
  review: JaReviewMap;
  domainNotes: JaDomainNoteMap;
}

export function loadJaSyncPayload(): JaSyncPayload {
  return {
    srs: loadSrs(),
    review: loadJaReview(),
    domainNotes: loadJaDomainNotes(),
  };
}

export function applyJaSyncPayload(ja: JaSyncPayload): void {
  saveSrs(ja.srs, { skipSync: true });
  saveJaReview(ja.review, { skipSync: true });
  saveJaDomainNotes(ja.domainNotes, { skipSync: true });
}

export function formatJaSyncSummary(ja: JaSyncPayload | null | undefined): string {
  if (!ja) return "  ・日→英の記録 まだ無し";
  const srsCount = Object.keys(ja.srs).length;
  const reviewCount = Object.keys(ja.review).length;
  const noteCount = Object.keys(ja.domainNotes).length;
  return `  ・日→英 SRS ${srsCount}件 / 評価・メモ ${reviewCount}件 / 分野メモ ${noteCount}件`;
}

export function buildSnapshotPushPayload(): {
  phrases: Phrase[];
  progress: UserProgress;
  ja: JaSyncPayload;
} {
  return {
    phrases: loadCustomPhrases(),
    progress: loadProgress(),
    ja: loadJaSyncPayload(),
  };
}
