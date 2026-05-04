import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RecorderRegistryProvider } from "./contexts/RecorderRegistry";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { CityPage } from "./pages/CityPage";
import { PhrasesPage } from "./pages/PhrasesPage";
import { PhraseEditPage } from "./pages/PhraseEditPage";
import { LogPage } from "./pages/LogPage";
import { findPhraseById, getAllPhrases, PHRASES } from "./data/phrases";
import { loadMission, loadProgress, saveMission, saveProgress } from "./utils/storage";
import { todayString } from "./utils/date";
import { bootstrapAutoSync, enqueueSnapshotPush } from "./utils/autoSync";
import { reChunkDuo3Phrases } from "./utils/customPhrases";
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

  // 起動時に自動同期(syncCode が無ければ no-op)。
  // pull 成功時は localStorage が書き換わっているので React state を再ロード。
  useEffect(() => {
    void bootstrapAutoSync().then((result) => {
      if (result.pulled) {
        setProgress(loadProgress());
        setMission(ensureMission());
      }
    });
  }, []);

  // 起動時に 1 度だけ DUO 3.0 フレーズの chunks を再計算する移行処理。
  // 既に複数チャンクに分かれているレコードはユーザー編集とみなして触らない。
  useEffect(() => {
    try {
      if (localStorage.getItem(DUO3_CHUNKS_MIGRATION_KEY)) return;
      const changed = reChunkDuo3Phrases();
      localStorage.setItem(DUO3_CHUNKS_MIGRATION_KEY, "1");
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
              <HomePage progress={progress} todaysPhrase={todaysPhrase} mission={mission} />
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
              />
            }
          />
          <Route path="/city" element={<CityPage progress={progress} />} />
          <Route path="/phrases" element={<PhrasesPage progress={progress} />} />
          <Route path="/phrases/new" element={<PhraseEditPage mode="new" />} />
          <Route path="/phrases/edit/:phraseId" element={<PhraseEditPage mode="edit" />} />
          <Route path="/log" element={<LogPage progress={progress} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </RecorderRegistryProvider>
  );
}
