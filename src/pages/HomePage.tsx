import { Link } from "react-router-dom";
import type { DailyMissionState, Phrase, UserProgress } from "../types";
import { ProgressCard } from "../components/ProgressCard";
import { CityView } from "../components/CityView";
import { MissionCard } from "../components/MissionCard";
import { getStreakEncouragement, pickHomeTagline } from "../utils/messages";
import { todayString } from "../utils/date";

interface HomePageProps {
  progress: UserProgress;
  todaysPhrase: Phrase;
  mission: DailyMissionState;
}

export function HomePage({ progress, todaysPhrase, mission }: HomePageProps) {
  const completedToday = mission.completed;
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

      <MissionCard phrase={todaysPhrase} mission={mission} tagline={tagline} />

      <ProgressCard progress={progress} />

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
    </>
  );
}
