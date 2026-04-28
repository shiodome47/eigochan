import type { PracticeLog, UserProgress } from "../types";
import { todayString, yesterdayString } from "./date";

export const XP_RULES = {
  chunkRead: 5,
  fullRead: 10,
  recite: 20,
  missionComplete: 30,
} as const;

export function levelFromXp(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export function xpToNextLevel(totalXp: number): { current: number; next: number; ratio: number } {
  const lv = levelFromXp(totalXp);
  const base = (lv - 1) * 100;
  const current = totalXp - base;
  const next = 100;
  return { current, next, ratio: Math.min(1, current / next) };
}

function nextStreakDays(prev: string | null, prevStreak: number, today: string): number {
  if (prev === today) return Math.max(prevStreak, 1);
  if (prev === yesterdayString()) return prevStreak + 1;
  if (prev === null) return 1;
  return 1;
}

export interface ApplyPracticeInput {
  phraseId: string;
  readCount: number;
  reciteCount: number;
  xpEarned: number;
}

export function applyPractice(prev: UserProgress, input: ApplyPracticeInput): UserProgress {
  const today = todayString();
  const log: PracticeLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    phraseId: input.phraseId,
    date: today,
    readCount: input.readCount,
    reciteCount: input.reciteCount,
    xpEarned: input.xpEarned,
  };

  const totalXp = prev.totalXp + input.xpEarned;
  const completedSet = new Set(prev.completedPhraseIds);
  if (input.reciteCount > 0) completedSet.add(input.phraseId);

  return {
    ...prev,
    totalXp,
    level: levelFromXp(totalXp),
    streakDays: nextStreakDays(prev.lastPracticeDate, prev.streakDays, today),
    totalPracticeCount: prev.totalPracticeCount + 1,
    totalReadCount: prev.totalReadCount + input.readCount,
    totalReciteCount: prev.totalReciteCount + input.reciteCount,
    completedPhraseIds: Array.from(completedSet),
    recentPractices: [log, ...prev.recentPractices].slice(0, 30),
    lastPracticeDate: today,
  };
}

export function isCompletedToday(progress: UserProgress): boolean {
  return progress.lastPracticeDate === todayString();
}

export interface UnlockedFacility {
  id: string;
  emoji: string;
  name: string;
  level: number;
}

const FACILITIES: UnlockedFacility[] = [
  { id: "house", emoji: "🏠", name: "家", level: 1 },
  { id: "lamp", emoji: "💡", name: "街灯", level: 2 },
  { id: "tree", emoji: "🌳", name: "木", level: 2 },
  { id: "cafe", emoji: "☕️", name: "カフェ", level: 3 },
  { id: "bench", emoji: "🪑", name: "ベンチ", level: 3 },
  { id: "park", emoji: "🌷", name: "公園", level: 4 },
  { id: "library", emoji: "📚", name: "図書館", level: 5 },
  { id: "station", emoji: "🚉", name: "駅", level: 6 },
  { id: "balloon", emoji: "🎈", name: "気球", level: 7 },
  { id: "stars", emoji: "✨", name: "夜空のあかり", level: 7 },
];

export function unlockedFacilities(level: number): UnlockedFacility[] {
  return FACILITIES.filter((f) => f.level <= level);
}

export function lockedFacilities(level: number): UnlockedFacility[] {
  return FACILITIES.filter((f) => f.level > level);
}

// --- v0.2: XP内訳 / レベル遷移 / 新規解放 ---

export type XpBreakdownKey = keyof typeof XP_RULES;

export interface XpBreakdownItem {
  key: XpBreakdownKey;
  label: string;
  count: number;
  xpEach: number;
  subtotal: number;
}

export interface XpBreakdownInput {
  chunkReadCount: number;
  fullRead: boolean;
  recited: boolean;
  missionComplete: boolean;
}

const BREAKDOWN_LABELS: Record<XpBreakdownKey, string> = {
  chunkRead: "チャンク音読",
  fullRead: "全文音読",
  recite: "暗唱",
  missionComplete: "今日のミッション完了",
};

export function getXpBreakdown(input: XpBreakdownInput): XpBreakdownItem[] {
  const items: XpBreakdownItem[] = [];
  if (input.chunkReadCount > 0) {
    items.push({
      key: "chunkRead",
      label: BREAKDOWN_LABELS.chunkRead,
      count: input.chunkReadCount,
      xpEach: XP_RULES.chunkRead,
      subtotal: input.chunkReadCount * XP_RULES.chunkRead,
    });
  }
  if (input.fullRead) {
    items.push({
      key: "fullRead",
      label: BREAKDOWN_LABELS.fullRead,
      count: 1,
      xpEach: XP_RULES.fullRead,
      subtotal: XP_RULES.fullRead,
    });
  }
  if (input.recited) {
    items.push({
      key: "recite",
      label: BREAKDOWN_LABELS.recite,
      count: 1,
      xpEach: XP_RULES.recite,
      subtotal: XP_RULES.recite,
    });
  }
  if (input.missionComplete) {
    items.push({
      key: "missionComplete",
      label: BREAKDOWN_LABELS.missionComplete,
      count: 1,
      xpEach: XP_RULES.missionComplete,
      subtotal: XP_RULES.missionComplete,
    });
  }
  return items;
}

export function totalXpFromBreakdown(items: XpBreakdownItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export interface LevelTransition {
  before: number;
  after: number;
  leveledUp: boolean;
  newlyUnlocked: UnlockedFacility[];
}

export function diffLevels(before: number, after: number): LevelTransition {
  const newlyUnlocked = FACILITIES.filter((f) => f.level > before && f.level <= after);
  return {
    before,
    after,
    leveledUp: after > before,
    newlyUnlocked,
  };
}
