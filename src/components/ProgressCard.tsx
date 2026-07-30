import type { UserProgress } from "../types";
import { weeklyPractice, xpToNextLevel } from "../utils/progress";

interface ProgressCardProps {
  progress: UserProgress;
  title?: string;
}

export function ProgressCard({ progress, title = "あなたのきろく" }: ProgressCardProps) {
  const xp = xpToNextLevel(progress.totalXp);
  const ratioPercent = Math.round(xp.ratio * 100);
  const week = weeklyPractice(progress);

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
          <div className="progress-cell__label">今週</div>
          <div className="progress-cell__value">
            {week.days}
            <span className="progress-cell__unit">/ {week.goal} 日</span>
          </div>
        </div>
      </div>
      <div className="week-dots" aria-label={`直近7日で${week.days}日練習しました`}>
        {week.marks.map((m) => (
          <span
            key={m.date}
            className={`week-dot${m.practiced ? " is-on" : ""}`}
            title={m.date}
          />
        ))}
        <span className="week-dots__note">
          {week.reached
            ? "今週の目標クリア。無理のない範囲で続けましょう。"
            : `週 ${week.goal} 日できれば十分です。`}
        </span>
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
