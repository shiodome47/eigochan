import type { UserProgress } from "../types";
import { xpToNextLevel } from "../utils/progress";

interface ProgressCardProps {
  progress: UserProgress;
  title?: string;
}

export function ProgressCard({ progress, title = "あなたのきろく" }: ProgressCardProps) {
  const xp = xpToNextLevel(progress.totalXp);
  const ratioPercent = Math.round(xp.ratio * 100);

  return (
    <section className="card" aria-labelledby="progress-title">
      <h2 className="card__title" id="progress-title">
        {title}
      </h2>
      <div className="progress-row">
        <div className="progress-cell">
          <div className="progress-cell__label">レベル</div>
          <div className="progress-cell__value">
            {progress.level}
            <span className="progress-cell__unit">Lv</span>
          </div>
        </div>
        <div className="progress-cell">
          <div className="progress-cell__label">けいけんち</div>
          <div className="progress-cell__value">
            {progress.totalXp}
            <span className="progress-cell__unit">XP</span>
          </div>
        </div>
        <div className="progress-cell">
          <div className="progress-cell__label">れんぞく</div>
          <div className="progress-cell__value">
            {progress.streakDays}
            <span className="progress-cell__unit">日</span>
          </div>
        </div>
      </div>
      <div className="xp-bar">
        <div className="xp-bar__meta">
          <span>次のレベルまで</span>
          <span>
            {xp.current} / {xp.next} XP
          </span>
        </div>
        <div
          className="xp-bar__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ratioPercent}
        >
          <div className="xp-bar__fill" style={{ width: `${ratioPercent}%` }} />
        </div>
      </div>
    </section>
  );
}
