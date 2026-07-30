// 街区の「声」= その分野で実際に練習した文。
//
// 街区をタップしたときに吹き出しで出す文を選ぶ。
// 選ぶのは **一度でも出題した文だけ** で、まだ触れていない文は住人の声にならない。
// 間隔が長く育った文ほど「その街に根づいた言葉」なので先に出す。

import { JA_SENTENCES, type JaSentence } from "../data/jaCorpus";
import type { SrsMap } from "./srs";

/** 間隔がこれ以上なら「定着した文」として扱う (cityDistricts と同じ基準)。 */
const MATURE_INTERVAL = 21;

export interface DistrictVoice {
  sentence: JaSentence;
  /** 現在の出題間隔 (日)。 */
  interval: number;
  /** 間隔 21 日以上まで育っているか。 */
  mature: boolean;
}

/**
 * その分野で練習ずみの文を、育っている順に返す。
 * 一度も出題していない分野では空配列 (= まだ更地なので声も出ない)。
 */
export function districtVoices(domainId: number, srs: SrsMap): DistrictVoice[] {
  const out: DistrictVoice[] = [];
  for (const sentence of JA_SENTENCES) {
    if (sentence.domain !== domainId) continue;
    if (sentence.en.length === 0) continue;
    const card = srs[sentence.id];
    if (!card) continue;
    out.push({
      sentence,
      interval: card.interval,
      mature: card.interval >= MATURE_INTERVAL,
    });
  }
  return out.sort((a, b) => {
    if (b.interval !== a.interval) return b.interval - a.interval;
    return a.sentence.id < b.sentence.id ? -1 : 1;
  });
}

/**
 * 今と違う文の位置を返す。1 件以下しかなければそのまま。
 * 順番に回すのではなく毎回ばらけるようにしている。
 */
export function nextVoiceIndex(current: number, length: number): number {
  if (length <= 1) return 0;
  const step = 1 + Math.floor(Math.random() * (length - 1));
  return (current + step) % length;
}
