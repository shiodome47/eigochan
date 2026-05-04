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

// 出典: "initial"=同梱, "original"=ユーザー自作, "duo3"=DUO 3.0 取り込み、
// "monologue"=ひとりごと英語(日本語先入力 → 後で英語化)。
// 既存データで未設定 (undefined) の場合は "original" として解釈する。
// DUO 3.0 等の市販教材本文・音声はリポジトリに含めない方針。
export type PhraseSource = "initial" | "original" | "duo3" | "monologue";

export interface Phrase {
  id: string;
  english: string;
  japanese: string;
  chunks: string[];
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
  source?: PhraseSource;
  sourceSection?: number;
  sourceIndex?: number;
  // ひとりごと英語の作成日時 (ISO)。並び替え用の保留メタ。
  // monologue 以外では使わない。MVP では D1 同期に乗せていない。
  thoughtCreatedAt?: string;
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
