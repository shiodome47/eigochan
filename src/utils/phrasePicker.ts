// 「今日のフレーズ」をシャッフルするための抽選。
//
// 既定のフレーズと自作フレーズをまとめた中から、英語が入っているものだけを候補にする。
// 直前と同じ文を引かないよう、今出ている文は除外する (候補が 1 件しかないときだけ許す)。

import { getAllPhrases, PHRASES } from "../data/phrases";

export function shufflablePhrases() {
  const all = getAllPhrases().filter((p) => p.english.trim().length > 0);
  return all.length > 0 ? all : PHRASES;
}

/** ランダムなフレーズ ID を返す。excludeId と同じものは避ける。 */
export function pickRandomPhraseId(excludeId?: string): string | null {
  const pool = shufflablePhrases();
  if (pool.length === 0) return null;
  const candidates = pool.filter((p) => p.id !== excludeId);
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)].id;
}
