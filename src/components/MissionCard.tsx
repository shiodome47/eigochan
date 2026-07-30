import { Link, useNavigate } from "react-router-dom";
import type { DailyMissionState, Phrase } from "../types";

interface MissionCardProps {
  phrase: Phrase;
  mission: DailyMissionState;
  tagline: string;
  /** 今日のフレーズを引き直す。押すと別のフレーズに入れ替わる。 */
  onShuffle?: () => string | null;
}

export function MissionCard({ phrase, mission, tagline, onShuffle }: MissionCardProps) {
  const navigate = useNavigate();
  const completedToday = mission.completed;

  return (
    <section className="card mission-card">
      <p className="mission-card__tagline">{tagline}</p>
      <div className="mission-card__head">
        <h2 className="mission-card__title">今日のフレーズ</h2>
        {onShuffle && (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => onShuffle()}
            aria-label="別のフレーズに入れ替える"
          >
            🔀 別のフレーズ
          </button>
        )}
      </div>

      <div className="mission-card__phrase">
        <p className="mission-card__english">{phrase.english}</p>
        <p className="mission-card__japanese">{phrase.japanese}</p>
        <div className="phrase-card__meta">
          <span className="tag">#{phrase.category}</span>
          {completedToday && <span className="tag tag--done">✓ 今日達成</span>}
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button
          type="button"
          className="btn"
          onClick={() => navigate(`/practice/${phrase.id}`)}
        >
          {completedToday ? "もう一度練習する" : "今日の練習を始める"}
        </button>
        <Link to="/phrases" className="btn btn--secondary">
          フレーズ一覧を見る
        </Link>
      </div>
    </section>
  );
}
