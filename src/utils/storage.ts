import type { DailyMissionState, UserProgress } from "../types";

const STORAGE_KEYS = {
  progress: "eigochan.progress.v1",
  mission: "eigochan.mission.v1",
  customPhrases: "eigochan.customPhrases.v1",
} as const;

export const INITIAL_PROGRESS: UserProgress = {
  totalXp: 0,
  level: 1,
  streakDays: 0,
  totalPracticeCount: 0,
  totalReadCount: 0,
  totalReciteCount: 0,
  completedPhraseIds: [],
  recentPractices: [],
  lastPracticeDate: null,
};

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage が使えない環境では握りつぶす(プライベートモード等)
  }
}

export function loadProgress(): UserProgress {
  const raw = safeGet(STORAGE_KEYS.progress);
  if (!raw) return { ...INITIAL_PROGRESS };
  try {
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      completedPhraseIds: parsed.completedPhraseIds ?? [],
      recentPractices: parsed.recentPractices ?? [],
    };
  } catch {
    return { ...INITIAL_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  safeSet(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export function loadMission(): DailyMissionState | null {
  const raw = safeGet(STORAGE_KEYS.mission);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyMissionState;
  } catch {
    return null;
  }
}

export function saveMission(mission: DailyMissionState): void {
  safeSet(STORAGE_KEYS.mission, JSON.stringify(mission));
}

export function resetAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.progress);
    localStorage.removeItem(STORAGE_KEYS.mission);
    localStorage.removeItem(STORAGE_KEYS.customPhrases);
  } catch {
    // 無視
  }
}
