// 街を「レベル」ではなく「分野ごとの定着状況」に紐づけるためのモデル。
//
// 1 分野 = 1 街区。その分野の文をどれだけ思い出せる状態にしてあるかで
// 建物が育ち、灯りがつく。期日を過ぎた文が溜まると灯りが暗くなる (劣化)。
// 劣化は罰ではなく「戻ってきてほしい合図」なので、建物自体は壊れない。

import { JA_DOMAINS, JA_SENTENCES, type JaDomain } from "../data/jaCorpus";
import { todayString } from "./date";
import { isDue, type SrsMap } from "./srs";

/** 0 = 更地 / 1 = 建てはじめ / 2 = 建物 / 3 = 灯りがつく / 4 = 育ちきり */
export type DistrictStage = 0 | 1 | 2 | 3 | 4;

export interface District {
  domain: JaDomain;
  /** その分野の文の総数 (英語が入っているもの)。 */
  total: number;
  /** 一度でも出題した文の数。 */
  seen: number;
  /** 間隔が 21 日以上に育った文の数。 */
  mature: number;
  /** 期日が来ている文の数。多いほど灯りが暗くなる。 */
  due: number;
  stage: DistrictStage;
  /** 灯りの明るさ 0〜1。期日切れが溜まると下がる。 */
  brightness: number;
}

const MATURE_INTERVAL = 21;

function stageOf(seen: number, mature: number, total: number): DistrictStage {
  if (total === 0 || seen === 0) return 0;
  const seenRatio = seen / total;
  const matureRatio = mature / total;
  if (matureRatio >= 0.6) return 4;
  if (matureRatio >= 0.25) return 3;
  if (seenRatio >= 0.25) return 2;
  return 1;
}

export function buildDistricts(srs: SrsMap, today: string = todayString()): District[] {
  const totals = new Map<number, number>();
  for (const s of JA_SENTENCES) {
    if (s.en.length === 0) continue;
    totals.set(s.domain, (totals.get(s.domain) ?? 0) + 1);
  }

  const seen = new Map<number, number>();
  const mature = new Map<number, number>();
  const due = new Map<number, number>();
  for (const card of Object.values(srs)) {
    const domain = Number(card.id.slice(1, 3));
    if (!Number.isFinite(domain)) continue;
    seen.set(domain, (seen.get(domain) ?? 0) + 1);
    if (card.interval >= MATURE_INTERVAL) mature.set(domain, (mature.get(domain) ?? 0) + 1);
    if (isDue(card, today)) due.set(domain, (due.get(domain) ?? 0) + 1);
  }

  return JA_DOMAINS.map((domain) => {
    const total = totals.get(domain.id) ?? 0;
    const s = seen.get(domain.id) ?? 0;
    const m = mature.get(domain.id) ?? 0;
    const d = due.get(domain.id) ?? 0;
    // 触れた文のうち、どれだけ期日を過ぎたまま放置しているか。
    const overdueRatio = s > 0 ? d / s : 0;
    return {
      domain,
      total,
      seen: s,
      mature: m,
      due: d,
      stage: stageOf(s, m, total),
      brightness: Math.max(0.25, 1 - overdueRatio * 0.75),
    };
  });
}

export interface CitySummary {
  /** 建物が建っている街区の数 (stage >= 1)。 */
  built: number;
  /** 灯りがついている街区の数 (stage >= 3)。 */
  lit: number;
  /** 育ちきった街区の数 (stage 4)。 */
  complete: number;
  /** 街全体の育ち具合 0〜100 (%)。stage の合計 / 最大値。 */
  percent: number;
  /** 灯りが暗くなっている街区 (復習が溜まっている)。 */
  dim: District[];
}

export function summarizeCity(districts: District[]): CitySummary {
  const built = districts.filter((d) => d.stage >= 1).length;
  const lit = districts.filter((d) => d.stage >= 3).length;
  const complete = districts.filter((d) => d.stage === 4).length;
  const score = districts.reduce((sum, d) => sum + d.stage, 0);
  const max = districts.length * 4;
  return {
    built,
    lit,
    complete,
    percent: max === 0 ? 0 : Math.round((score / max) * 100),
    dim: districts.filter((d) => d.stage >= 1 && d.brightness < 0.9),
  };
}

export const STAGE_LABELS: Record<DistrictStage, string> = {
  0: "更地",
  1: "建てはじめ",
  2: "建物が立った",
  3: "灯りがついた",
  4: "育ちきった",
};
