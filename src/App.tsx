import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RecorderRegistryProvider } from "./contexts/RecorderRegistry";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { CityPage } from "./pages/CityPage";
import { PhrasesPage } from "./pages/PhrasesPage";
import { PhraseEditPage } from "./pages/PhraseEditPage";
import { JaEnPage } from "./pages/JaEnPage";
import { JaEnTodayPage } from "./pages/JaEnTodayPage";
import { LogPage } from "./pages/LogPage";
import { findPhraseById, getAllPhrases, PHRASES } from "./data/phrases";
import { loadMission, loadProgress, saveMission, saveProgress } from "./utils/storage";
import { todayString } from "./utils/date";
import { bootstrapAutoSync, enqueueSnapshotPush } from "./utils/autoSync";
import { subscribeLocalDataReload } from "./utils/localDataEvents";
import { reChunkDuo3Phrases } from "./utils/customPhrases";
import { pickRandomPhraseId } from "./utils/phrasePicker";
import type { DailyMissionState, UserProgress } from "./types";

// 旧バージョンの DUO 3.0 取り込みでは chunks が 1 つにまとまっていたので、
// 起動時に 1 度だけ autoChunkText で割り直す。フラグで再実行を抑止する。
const DUO3_CHUNKS_MIGRATION_KEY = "eigochan.duo3ChunksAutoSplit.v1";

function pickDailyPhraseId(date: string): string {
  // ひとりごと英語など、まだ english が入っていないフレーズは
  // 今日のミッションに当たっても練習できないので除外する。
  const all = getAllPhrases().filter((p) => p.english.trim().length > 0);
  const pool = all.length > 0 ? all : PHRASES;
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length].id;
}

function ensureMission(): DailyMissionState {
  const today = todayString();
  const stored = loadMission();
  // 今日のミッションが存在し、参照先のフレーズも生きている場合だけ再利用
  if (stored && stored.date === today && findPhraseById(stored.phraseId)) {
    return stored;
  }
  const fresh: DailyMissionState = {
    date: today,
    phraseId: pickDailyPhraseId(today),
    completed: false,
  };
  saveMission(fresh);
  return fresh;
}

export function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [mission, setMission] = useState<DailyMissionState>(() => ensureMission());

  useEffect(() => {
    const handler = () => setMission(ensureMission());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  // 手動同期 pull / 参加、起動時の自動 pull などで localStorage が
  // 書き換わったあと、画面上の進捗・ミッションを再読み込みする。
  useEffect(() => {
    return subscribeLocalDataReload(() => {
      setProgress(loadProgress());
      setMission(ensureMission());
    });
  }, []);

  // 起動時に自動同期(syncCode が無ければ no-op)。
  useEffect(() => {
    void bootstrapAutoSync();
  }, []);

  // 起動時に 1 度だけ DUO 3.0 フレーズの chunks を再計算する移行処理。
  // 既に複数チャンクに分かれているレコードはユーザー編集とみなして触らない。
  useEffect(() => {
    try {
      if (localStorage.getItem(DUO3_CHUNKS_MIGRATION_KEY)) return;
      const { changed, complete } = reChunkDuo3Phrases();
      if (complete) localStorage.setItem(DUO3_CHUNKS_MIGRATION_KEY, "1");
      if (changed > 0) enqueueSnapshotPush();
    } catch {
      // localStorage が使えない環境ではスキップ (次回起動でリトライされる)。
    }
  }, []);

  const todaysPhrase = useMemo(() => {
    return findPhraseById(mission.phraseId) ?? PHRASES[0];
  }, [mission.phraseId]);

  const commitProgress = useCallback((next: UserProgress) => {
    setProgress(next);
    saveProgress(next);
    // 同期が有効ならサーバへ反映予約(失敗は queue に積まれて後で再送)
    enqueueSnapshotPush();
  }, []);

  // 「今日のフレーズ」を引き直す。今日すでに達成していたら completed は保ったままにする
  // (1 日 1 回のミッションボーナスがシャッフルで増えないように)。
  const shuffleMission = useCallback((): string | null => {
    const nextId = pickRandomPhraseId(mission.phraseId);
    if (!nextId) return null;
    const updated: DailyMissionState = {
      date: todayString(),
      phraseId: nextId,
      completed: mission.completed,
    };
    setMission(updated);
    saveMission(updated);
    return nextId;
  }, [mission]);

  const handleMissionComplete = useCallback(
    (phraseId: string): boolean => {
      const today = todayString();
      const isFirstToday =
        !mission.completed && mission.date === today && mission.phraseId === phraseId;
      const updated: DailyMissionState = {
        date: today,
        phraseId: mission.phraseId,
        completed: mission.completed || isFirstToday,
      };
      setMission(updated);
      saveMission(updated);
      return isFirstToday;
    },
    [mission],
  );

  return (
    <RecorderRegistryProvider>
      <Layout streakDays={progress.streakDays}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                progress={progress}
                todaysPhrase={todaysPhrase}
                mission={mission}
                onShufflePhrase={shuffleMission}
              />
            }
          />
          <Route
            path="/practice"
            element={
              <PracticePage
                progress={progress}
                onCommit={commitProgress}
                onMissionComplete={handleMissionComplete}
                defaultPhraseId={mission.phraseId}
                onShufflePhrase={shuffleMission}
              />
            }
          />
          <Route
            path="/practice/:phraseId"
            element={
              <PracticePage
                progress={progress}
                onCommit={commitProgress}
                onMissionComplete={handleMissionComplete}
                defaultPhraseId={mission.phraseId}
                onShufflePhrase={shuffleMission}
              />
            }
          />
          <Route path="/city" element={<CityPage progress={progress} />} />
          <Route path="/phrases" element={<PhrasesPage progress={progress} />} />
          <Route path="/phrases/new" element={<PhraseEditPage mode="new" />} />
          <Route path="/phrases/edit/:phraseId" element={<PhraseEditPage mode="edit" />} />
          <Route path="/ja-en" element={<JaEnPage />} />
          <Route
            path="/ja-en/today"
            element={<JaEnTodayPage progress={progress} onCommit={commitProgress} />}
          />
          <Route path="/log" element={<LogPage progress={progress} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </RecorderRegistryProvider>
  );
}
