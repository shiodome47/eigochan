// 日→英モードの間隔反復 (SRS)。
//
// 設計の意図:
// - 報酬を「ボタンを押した回数」ではなく「思い出せたこと」に付ける。
// - 連打しても伸びず、間隔を空けて思い出すほど XP が増える。
// - SM-2 を単純化したもの。ease は 1.3〜2.8 に収める。
//
// 保存先はこの端末の localStorage (評価・メモと同じくローカル専用)。

import { daysBetween, parseDate, todayString } from "./date";

const STORAGE_KEY = "eigochan.jaSrs.v1";

/** 自己判定の 3 段階。UI では ✕ / ○ / ◎。 */
export type JaGrade = "again" | "ok" | "easy";

export interface SrsCard {
  /** 日本語コーパスの文 ID ("d01_003")。 */
  id: string;
  /** 次に出す日 (YYYY-MM-DD)。今日以前なら出題対象。 */
  due: string;
  /** 現在の間隔 (日)。0 は「今日中にもう一度」。 */
  interval: number;
  /** 記憶しやすさ。大きいほど間隔が伸びる。 */
  ease: number;
  /** 通算の出題回数。 */
  reps: number;
  /** 「言えなかった」を選んだ回数。 */
  lapses: number;
  /** 最後に出した日 (YYYY-MM-DD)。 */
  last: string;
}

export type SrsMap = Record<string, SrsCard>;

const EASE_MIN = 1.3;
const EASE_MAX = 2.8;
const EASE_START = 2.3;

function clampEase(v: number): number {
  return Math.min(EASE_MAX, Math.max(EASE_MIN, Number(v.toFixed(2))));
}

function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setDate(d.getDate() + days);
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isDue(card: SrsCard | undefined, today: string = todayString()): boolean {
  if (!card) return false;
  return daysBetween(card.due, today) >= 0;
}

/**
 * 次の出題日を決める。
 * - again: 今日中にもう一度。間隔と ease を落とす。
 * - ok:    interval × ease
 * - easy:  interval × ease × 1.3、ease も少し上げる
 */
export function schedule(
  prev: SrsCard | undefined,
  id: string,
  grade: JaGrade,
  today: string = todayString(),
): SrsCard {
  const base: SrsCard = prev ?? {
    id,
    due: today,
    interval: 0,
    ease: EASE_START,
    reps: 0,
    lapses: 0,
    last: today,
  };

  let { interval, ease, lapses } = base;

  if (grade === "again") {
    interval = 0;
    ease = clampEase(ease - 0.2);
    lapses += 1;
  } else if (base.reps === 0) {
    // 初回はまだ間隔がないので固定値から始める。
    interval = grade === "easy" ? 3 : 1;
  } else {
    const factor = grade === "easy" ? ease * 1.3 : ease;
    interval = Math.max(1, Math.round(Math.max(1, base.interval) * factor));
    if (grade === "easy") ease = clampEase(ease + 0.05);
  }

  return {
    id,
    due: addDays(today, interval),
    interval,
    ease,
    reps: base.reps + 1,
    lapses,
    last: today,
  };
}

/* ── XP ─────────────────────────────────────────────────────
   「思い出せた瞬間」に報酬を寄せる。
   同じ文を連打しても interval が伸びないので XP も伸びない。 */

export const JA_XP_RULES = {
  /** 初めて触れた文 (自己判定が ok / easy)。 */
  firstTouch: 2,
  /** 期日が来た文を言えた。 */
  review: 15,
  /** 間隔が 7 日以上に育った文を言えたときの上乗せ。 */
  matureBonus: 5,
  /** 間隔が 21 日以上に育った文を言えたときの上乗せ (matureBonus と合算)。 */
  longBonus: 5,
  /** 前に落とした文を取り戻した。 */
  recovery: 8,
} as const;

export interface JaXpDetail {
  label: string;
  xp: number;
}

/**
 * 1 文ぶんの XP を計算する。prev は判定前のカード (無ければ新規)。
 * 「言えなかった」は 0 XP。減点はしない。
 */
export function xpForGrade(prev: SrsCard | undefined, grade: JaGrade): JaXpDetail[] {
  if (grade === "again") return [];

  const details: JaXpDetail[] = [];
  if (!prev || prev.reps === 0) {
    details.push({ label: "はじめての文", xp: JA_XP_RULES.firstTouch });
    return details;
  }

  details.push({ label: "思い出せた", xp: JA_XP_RULES.review });
  if (prev.interval >= 7) {
    details.push({ label: "間隔が育った文", xp: JA_XP_RULES.matureBonus });
  }
  if (prev.interval >= 21) {
    details.push({ label: "長い間隔の文", xp: JA_XP_RULES.longBonus });
  }
  if (prev.lapses > 0) {
    details.push({ label: "落とした文の取り戻し", xp: JA_XP_RULES.recovery });
  }
  return details;
}

export function sumXp(details: JaXpDetail[]): number {
  return details.reduce((sum, d) => sum + d.xp, 0);
}

/* ── 保存 ───────────────────────────────────────────────── */

function isCard(v: unknown): v is SrsCard {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.due === "string" &&
    typeof o.interval === "number" &&
    typeof o.ease === "number" &&
    typeof o.reps === "number" &&
    typeof o.lapses === "number" &&
    typeof o.last === "string"
  );
}

export function loadSrs(): SrsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: SrsMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isCard(value)) out[id] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveSrs(map: SrsMap): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

export function clearSrs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 無視
  }
}

export interface SrsSummary {
  /** 一度でも出題した文の数。 */
  seen: number;
  /** 期日が来ている文の数 (今日ぶん)。 */
  due: number;
  /** 間隔が 21 日以上に育った文の数。 */
  mature: number;
  /** 直近で落としている文の数。 */
  lapsed: number;
}

export function summarizeSrs(map: SrsMap, today: string = todayString()): SrsSummary {
  let seen = 0;
  let due = 0;
  let mature = 0;
  let lapsed = 0;
  for (const card of Object.values(map)) {
    seen += 1;
    if (isDue(card, today)) due += 1;
    if (card.interval >= 21) mature += 1;
    if (card.interval === 0 && card.lapses > 0) lapsed += 1;
  }
  return { seen, due, mature, lapsed };
}

/** 分野ごとの定着状況。街を分野に紐づける次の段階で使う。 */
export interface DomainMastery {
  domain: number;
  seen: number;
  mature: number;
}

export function masteryByDomain(map: SrsMap): Map<number, DomainMastery> {
  const out = new Map<number, DomainMastery>();
  for (const card of Object.values(map)) {
    const domain = Number(card.id.slice(1, 3));
    if (!Number.isFinite(domain)) continue;
    const cur = out.get(domain) ?? { domain, seen: 0, mature: 0 };
    cur.seen += 1;
    if (card.interval >= 21) cur.mature += 1;
    out.set(domain, cur);
  }
  return out;
}
