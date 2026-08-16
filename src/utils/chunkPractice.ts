// 組み合わせ練習の記録。
//
// SRS には乗せない。決まった文が無いので「思い出せたか」を判定できないため。
// 代わりに **何回組み立てたか** だけを数える。
// (「今日の練習」の報酬設計を壊さないよう、XP も出さない。)

import { todayString } from "./date";

const KEY = "eigochan.chunkPractice.v1";

export interface ChunkPracticeState {
  /** 通算で組み立てた回数。 */
  total: number;
  /** 今日組み立てた回数。 */
  today: number;
  /** today を数えている日付 (JST)。日付が変わったら 0 に戻す。 */
  date: string;
}

export const EMPTY_CHUNK_PRACTICE: ChunkPracticeState = { total: 0, today: 0, date: "" };

export function loadChunkPractice(today: string = todayString()): ChunkPracticeState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_CHUNK_PRACTICE, date: today };
    const parsed = JSON.parse(raw) as Partial<ChunkPracticeState>;
    const total = typeof parsed.total === "number" && parsed.total > 0 ? Math.floor(parsed.total) : 0;
    const sameDay = parsed.date === today;
    return {
      total,
      today: sameDay && typeof parsed.today === "number" && parsed.today > 0
        ? Math.floor(parsed.today)
        : 0,
      date: today,
    };
  } catch {
    return { ...EMPTY_CHUNK_PRACTICE, date: today };
  }
}

export function saveChunkPractice(state: ChunkPracticeState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** 1 回組み立てたぶんを足す。 */
export function countBuilt(
  state: ChunkPracticeState,
  today: string = todayString(),
): ChunkPracticeState {
  const base = state.date === today ? state : { ...state, today: 0, date: today };
  return { total: base.total + 1, today: base.today + 1, date: today };
}
