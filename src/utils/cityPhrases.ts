// 施設タップ時のフレーズ抽選。
// 既存の固定 PHRASES と localStorage の自作フレーズを合成し、
// 施設に紐づいた「優先カテゴリ/ムード」のどちらかにマッチするものを優先的に拾う。
// 該当0件のときは全フレーズからランダムにフォールバックする。

import { PHRASES } from "../data/phrases";
import { loadCustomPhrases } from "./customPhrases";
import { FACILITY_PHRASE_PREFERENCES, type FacilityId } from "../data/cityLayout";
import type { Phrase } from "../types";

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 施設に合うフレーズを1件返す。
 * - FACILITY_PHRASE_PREFERENCES に登録されたカテゴリ or ムードのどちらかに合致すれば候補
 * - 候補ゼロなら全フレーズからフォールバック
 * - 一切無いときだけ null(現実には PHRASES が固定で22件あるので発生しない想定)
 */
export function pickPhraseForFacility(id: FacilityId): Phrase | null {
  const all: Phrase[] = [...PHRASES, ...loadCustomPhrases()];
  if (all.length === 0) return null;

  const prefs = FACILITY_PHRASE_PREFERENCES[id];
  if (prefs) {
    const categorySet = new Set<string>(prefs.categories ?? []);
    const moodSet = new Set<string>(prefs.moods ?? []);
    if (categorySet.size > 0 || moodSet.size > 0) {
      const matches = all.filter(
        (p) => categorySet.has(p.category) || moodSet.has(p.mood),
      );
      const picked = pickRandom(matches);
      if (picked) return picked;
    }
  }
  return pickRandom(all);
}
