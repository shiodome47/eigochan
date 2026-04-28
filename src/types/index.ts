export type PhraseLevel = "beginner" | "intermediate" | "advanced";

export type PhraseCategory =
  | "daily"
  | "work"
  | "feeling"
  | "conversation"
  | "travel"
  | "learning"
  | "custom";

export type PhraseMood = "casual" | "polite" | "warm" | "neutral" | "natural";

export interface Phrase {
  id: string;
  english: string;
  japanese: string;
  chunks: string[];
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
}

export interface PracticeLog {
  id: string;
  phraseId: string;
  date: string; // YYYY-MM-DD (local)
  readCount: number;
  reciteCount: number;
  xpEarned: number;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  streakDays: number;
  totalPracticeCount: number;
  totalReadCount: number;
  totalReciteCount: number;
  completedPhraseIds: string[];
  recentPractices: PracticeLog[];
  lastPracticeDate: string | null; // YYYY-MM-DD (local)
}

export interface DailyMissionState {
  date: string; // YYYY-MM-DD (local)
  phraseId: string;
  completed: boolean;
}

export type SpeechOptions = {
  rate?: number;
  lang?: string;
  pitch?: number;
  volume?: number;
};

// 将来のスコアリング/音声認識拡張のためのインターフェース。
// MVPではユーザーの自己申告で代替する。
export interface PracticeScoring {
  evaluateRead?: (spoken: string, expected: string) => number;
  evaluateRecite?: (spoken: string, expected: string) => number;
}
