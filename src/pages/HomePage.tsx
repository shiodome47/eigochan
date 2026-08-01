import { Link } from "react-router-dom";
import type { DailyMissionState, Phrase, UserProgress } from "../types";
import { ProgressCard } from "../components/ProgressCard";
import { CityView } from "../components/CityView";
import { MissionCard } from "../components/MissionCard";
import { InstallHint } from "../components/InstallHint";
import { getStreakEncouragement, pickHomeTagline } from "../utils/messages";
import { JA_SENTENCES } from "../data/jaCorpus";
import { DAILY_PLAN_SIZE, buildDailyPlan, countUsable } from "../utils/dailyPlan";
import { loadFocus } from "../utils/practiceFocus";
import { loadSrs } from "../utils/srs";
import { todayString } from "../utils/date";

interface HomePageProps {
  progress: UserProgress;
  todaysPhrase: Phrase;
  mission: DailyMissionState;
  /** 今日のフレーズを引き直す。 */
  onShufflePhrase?: () => string | null;
}

export function HomePage({
  progress,
  todaysPhrase,
  mission,
  onShufflePhrase,
}: HomePageProps) {
  const completedToday = mission.completed;
  // 日→英モードの「今日の出題」。表示するだけなので描画のたびに計算してよい。
  const jaFocus = loadFocus();
  const jaPlan = buildDailyPlan(loadSrs(), todayString(), DAILY_PLAN_SIZE, new Set(), jaFocus);
  const today = todayString();
  const tagline = pickHomeTagline(today);
  const streakWord = getStreakEncouragement(progress.streakDays);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">eigochan</h1>
        <p className="hero__subtitle">英語を声に出すほど、街が育つ。</p>
        <p className="hero__streak">{streakWord}</p>
      </section>

      <MissionCard
        phrase={todaysPhrase}
        mission={mission}
        tagline={tagline}
        onShuffle={onShufflePhrase}
      />

      <ProgressCard progress={progress} />

      <section className="card">
        <h2 className="card__title">日→英モード</h2>
        <p className="card__heading">
          自分が言いそうな日本語を見て、英語で言ってみる練習です。
        </p>
        <p className="home-jaen__note">
          今日は <b>{jaPlan.items.length} 文</b> (復習 {jaPlan.reviewCount} ・ 新しい文{" "}
          {jaPlan.newCount})。まずはこれだけ。気が向いたら画面から足せます。
          コーパス全体は {JA_SENTENCES.length} 文です。
        </p>
        {jaFocus && (
          <p className="home-jaen__focus">
            🎯 いまは <b>{jaFocus}</b> だけを出しています ({countUsable(jaFocus)} 文)。
            範囲は「今日の練習」の画面で変えられます。
          </p>
        )}
        <div className="btn-row" style={{ marginTop: 12 }}>
          <Link to="/ja-en/today" className="btn">
            今日の {jaPlan.items.length} 文をやる →
          </Link>
        </div>
        <div className="btn-row">
          <Link to="/ja-en" className="btn btn--ghost btn--small">
            コーパス一覧を見る
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">あなたの街</h2>
        <p className="card__heading">
          {completedToday
            ? "今日も街に灯りがともりました 🕯️"
            : "練習するたびに、少しずつ育っていきます。"}
        </p>
        <CityView level={progress.level} variant="preview" />
        <div className="btn-row" style={{ marginTop: 12 }}>
          <Link to="/city" className="btn btn--ghost">
            街を見る
          </Link>
        </div>
      </section>

      <InstallHint />

      {/* 配信が新しくなったか目で確かめるための刻印 (キャッシュが残っていると古いまま)。 */}
      <p className="build-stamp">更新 {__BUILD_STAMP__}</p>
    </>
  );
}
