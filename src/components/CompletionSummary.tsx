import type { LevelTransition, XpBreakdownItem } from "../utils/progress";
import { XpBreakdown } from "./XpBreakdown";

export interface PracticeRecap {
  chunkReadCount: number;
  chunkTotal: number;
  fullRead: boolean;
  recited: boolean;
  missionComplete: boolean;
}

interface CompletionSummaryProps {
  headline: string;
  cityMessage: string;
  breakdown: XpBreakdownItem[];
  totalXp: number;
  levelTransition: LevelTransition;
  recap: PracticeRecap;
  streakDays: number;
}

/**
 * 完了直後だけ流れる「夜→朝」のサンライズ演出。
 * 一発再生(loop なし)、CSS アニメーションのみ。
 * prefers-reduced-motion: reduce 環境ではアニメは抑制される(CSS側)。
 */
function DawnScene() {
  return (
    <div className="dawn-scene" aria-hidden="true">
      <div className="dawn-scene__sky" />
      <span className="dawn-scene__star dawn-scene__star--1">✦</span>
      <span className="dawn-scene__star dawn-scene__star--2">✦</span>
      <span className="dawn-scene__star dawn-scene__star--3">✦</span>
      <div className="dawn-scene__sun" />
      <div className="dawn-scene__ground" />
      <div className="dawn-scene__house dawn-scene__house--small">
        <span className="dawn-scene__roof" />
        <span className="dawn-scene__window" />
      </div>
      <div className="dawn-scene__house dawn-scene__house--big">
        <span className="dawn-scene__roof" />
        <span className="dawn-scene__window" />
      </div>
    </div>
  );
}

export function CompletionSummary({
  headline,
  cityMessage,
  breakdown,
  totalXp,
  levelTransition,
  recap,
  streakDays,
}: CompletionSummaryProps) {
  return (
    <div className="complete-card">
      <DawnScene />

      <p className="complete-card__title">{headline}</p>
      <p className="complete-card__sub">{cityMessage}</p>
      <div className="complete-card__xp">+{totalXp} XP</div>

      {streakDays >= 2 && (
        <p className="complete-card__streak">🔥 {streakDays}日連続</p>
      )}

      <ul className="recap-list" aria-label="今日やったこと">
        <li className={recap.chunkReadCount > 0 ? "is-done" : ""}>
          <span aria-hidden="true">{recap.chunkReadCount > 0 ? "✓" : "・"}</span>
          チャンク音読
          {recap.chunkTotal > 0 && (
            <span className="recap-list__sub">
              {" "}
              ({recap.chunkReadCount}/{recap.chunkTotal})
            </span>
          )}
        </li>
        <li className={recap.fullRead ? "is-done" : ""}>
          <span aria-hidden="true">{recap.fullRead ? "✓" : "・"}</span>
          全文音読
        </li>
        <li className={recap.recited ? "is-done" : ""}>
          <span aria-hidden="true">{recap.recited ? "✓" : "・"}</span>
          暗唱
        </li>
        {recap.missionComplete && (
          <li className="is-done">
            <span aria-hidden="true">★</span>
            今日のミッション
          </li>
        )}
      </ul>

      <div className="complete-card__breakdown">
        <p className="complete-card__breakdown-title">XPのうちわけ</p>
        <XpBreakdown items={breakdown} total={totalXp} />
      </div>

      {levelTransition.leveledUp && (
        <div className="level-up">
          <p className="level-up__title">
            🎉 レベルアップ! Lv {levelTransition.before} → Lv {levelTransition.after}
          </p>
          {levelTransition.newlyUnlocked.length > 0 && (
            <ul className="level-up__list">
              {levelTransition.newlyUnlocked.map((f, idx) => (
                <li
                  key={f.id}
                  className="level-up__item"
                  style={{ animationDelay: `${0.2 + idx * 0.18}s` }}
                >
                  <span className="level-up__ripple" aria-hidden="true" />
                  <span className="level-up__emoji" aria-hidden="true">
                    {f.emoji}
                  </span>
                  新しい施設「{f.name}」が解放されました
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
