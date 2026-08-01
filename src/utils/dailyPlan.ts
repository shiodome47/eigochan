// 「今日の N 文」を組み立てる。
//
// 方針:
// - まず期日が来た文 (復習) を古い順に入れる。復習が最優先。
// - 残り枠に新規の文を入れる。重要度 must を優先し、
//   まだ手をつけていない分野から順に散らす (1 分野に偏らせない)。
// - 同じ日なら並びが変わらないように、日付から作った seed で決める。

import { JA_SENTENCES, type JaSentence } from "../data/jaCorpus";
import { daysBetween, todayString } from "./date";
import { FOCUS_ALL, focusMatches, type PracticeFocus } from "./practiceFocus";
import { isDue, type SrsMap } from "./srs";

function inFocus(s: JaSentence, focus: PracticeFocus): boolean {
  return focusMatches(focus, s.domain);
}

// 既定は 3 文。毎日必ず終わる量にしておき、気が乗ったら画面から足す。
export const DAILY_PLAN_SIZE = 3;
/** 「もう少しやる」で 1 回に足す文数。 */
export const EXTRA_PLAN_SIZE = 3;
/** 「まとめてやる」で 1 回に足す文数。 */
export const BIG_PLAN_SIZE = 7;

export interface DailyPlan {
  date: string;
  /** 出題順に並んだ文。 */
  items: JaSentence[];
  /** items のうち復習 (期日到来) の件数。 */
  reviewCount: number;
  /** items のうち新規の件数。 */
  newCount: number;
  /** 今日の期日が来ている総数 (プランに入りきらなかった分も含む)。範囲を絞ればその中の数。 */
  dueTotal: number;
  /** 絞っている範囲。 */
  focus: PracticeFocus;
  /** 範囲の外で期日が来ている文の数。絞っている間は出ないので、数だけ知らせる。 */
  dueOutside: number;
}

const IMP_WEIGHT: Record<string, number> = { must: 0, often: 1, sub: 2 };

export function buildDailyPlan(
  srs: SrsMap,
  today: string = todayString(),
  size: number = DAILY_PLAN_SIZE,
  /** すでに今日やった文 (続けて足すときに重複させない)。 */
  exclude: ReadonlySet<string> = new Set(),
  /** グループ / 分野を渡すと、その日の出題をそこだけに絞る。 */
  focus: PracticeFocus = FOCUS_ALL,
): DailyPlan {
  const all = JA_SENTENCES.filter((s) => s.en.length > 0 && !exclude.has(s.id));
  const usable = all.filter((s) => inFocus(s, focus));
  // 絞っている間は範囲外の復習が出ないので、溜まっている数だけ数えて知らせる。
  const dueOutside =
    focus.kind === "all"
      ? 0
      : all.filter((s) => !inFocus(s, focus) && isDue(srs[s.id], today)).length;

  // 1. 復習: 期日が来ているものを、期日が古い順 → 落とした回数が多い順。
  const dueItems = usable
    .filter((s) => isDue(srs[s.id], today))
    .sort((a, b) => {
      const ca = srs[a.id];
      const cb = srs[b.id];
      const overdue = daysBetween(cb.due, today) - daysBetween(ca.due, today);
      if (overdue !== 0) return overdue;
      return cb.lapses - ca.lapses;
    });

  const items: JaSentence[] = dueItems.slice(0, size);
  const reviewCount = items.length;

  // 2. 新規: 未出題の文から、分野を散らしつつ重要度順に。
  if (items.length < size) {
    const fresh = usable.filter((s) => !srs[s.id]);

    // 分野ごとに、その分野で既に出題ずみの数を数える (少ない分野を優先)。
    const seenByDomain = new Map<number, number>();
    for (const s of usable) {
      if (srs[s.id]) seenByDomain.set(s.domain, (seenByDomain.get(s.domain) ?? 0) + 1);
    }

    const sorted = fresh.slice().sort((a, b) => {
      const sa = seenByDomain.get(a.domain) ?? 0;
      const sb = seenByDomain.get(b.domain) ?? 0;
      if (sa !== sb) return sa - sb;
      const ia = IMP_WEIGHT[a.imp] ?? 1;
      const ib = IMP_WEIGHT[b.imp] ?? 1;
      if (ia !== ib) return ia - ib;
      // 分野の若い順 → 分野内は並び順 (「朝」の頭から順に進む方が自然)。
      if (a.domain !== b.domain) return a.domain - b.domain;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

    // 1 分野に固まらないよう、同じ分野は最大 4 文まで。
    const perDomain = new Map<number, number>();
    for (const s of sorted) {
      if (items.length >= size) break;
      const used = perDomain.get(s.domain) ?? 0;
      if (used >= 4) continue;
      perDomain.set(s.domain, used + 1);
      items.push(s);
    }
    // それでも埋まらなければ、分野の上限を無視して埋める。
    for (const s of sorted) {
      if (items.length >= size) break;
      if (!items.includes(s)) items.push(s);
    }
  }

  return {
    date: today,
    items,
    reviewCount,
    newCount: items.length - reviewCount,
    dueTotal: dueItems.length,
    focus,
    dueOutside,
  };
}

/** ホーム等で「今日やることが何件あるか」だけ知りたいとき用。 */
export function countDueToday(
  srs: SrsMap,
  today: string = todayString(),
  focus: PracticeFocus = FOCUS_ALL,
): number {
  let n = 0;
  for (const s of JA_SENTENCES) {
    if (s.en.length > 0 && inFocus(s, focus) && isDue(srs[s.id], today)) n += 1;
  }
  return n;
}

/** 範囲を絞ったときに出せる文が何文あるか (英語が入っているもの)。 */
export function countUsable(focus: PracticeFocus = FOCUS_ALL): number {
  return JA_SENTENCES.filter((s) => s.en.length > 0 && inFocus(s, focus)).length;
}
