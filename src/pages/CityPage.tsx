import type { UserProgress } from "../types";
import { CityView } from "../components/CityView";
import { lockedFacilities, unlockedFacilities } from "../utils/progress";

interface CityPageProps {
  progress: UserProgress;
}

export function CityPage({ progress }: CityPageProps) {
  const unlocked = unlockedFacilities(progress.level);
  const locked = lockedFacilities(progress.level);

  return (
    <>
      <section className="card">
        <h2 className="card__title">あなたの街</h2>
        <p className="card__heading">Your city is growing!</p>
        <CityView level={progress.level} variant="stage" interactive />

        <div className="progress-row">
          <div className="progress-cell">
            <div className="progress-cell__label">レベル</div>
            <div className="progress-cell__value">
              {progress.level}
              <span className="progress-cell__unit">Lv</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">そうXP</div>
            <div className="progress-cell__value">
              {progress.totalXp}
              <span className="progress-cell__unit">XP</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">れんしゅう</div>
            <div className="progress-cell__value">
              {progress.totalPracticeCount}
              <span className="progress-cell__unit">回</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">解放された施設</h2>
        {unlocked.length === 0 ? (
          <p className="empty">最初の練習で「家」が建ちます。</p>
        ) : (
          <div className="facility-list">
            {unlocked.map((f) => (
              <div className="facility-chip" key={f.id}>
                <span className="facility-chip__emoji">{f.emoji}</span>
                {f.name}
              </div>
            ))}
          </div>
        )}
      </section>

      {locked.length > 0 && (
        <section className="card">
          <h2 className="card__title">これから解放される施設</h2>
          <div className="facility-list">
            {locked.map((f) => (
              <div className="facility-chip is-locked" key={f.id}>
                <span className="facility-chip__emoji">{f.emoji}</span>
                Lv {f.level} で {f.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
