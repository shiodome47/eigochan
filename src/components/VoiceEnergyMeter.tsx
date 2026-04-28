import { VOICE_ENERGY_MAX_SCORE } from "../utils/audioAnalysis";

interface VoiceEnergyMeterProps {
  /** null = 解析中 / 解析できなかった、number = 表示する。 */
  score: number | null;
  /** true のとき "計測中…" を出す。 */
  loading?: boolean;
}

/**
 * 声のエネルギー量だけを表示するメーター。
 * 時間・無音率・平均/ピーク音量は意図的に出さない。
 */
export function VoiceEnergyMeter({ score, loading = false }: VoiceEnergyMeterProps) {
  if (loading) {
    return (
      <div className="voice-energy" aria-live="polite">
        <div className="voice-energy__row">
          <span className="voice-energy__label">Voice Energy</span>
          <span className="voice-energy__hint">計測中…</span>
        </div>
        <div className="voice-energy__meter">
          <div className="voice-energy__fill voice-energy__fill--placeholder" />
        </div>
      </div>
    );
  }
  if (score === null) return null;

  const ratio = Math.max(0, Math.min(1, score / VOICE_ENERGY_MAX_SCORE));

  return (
    <div
      className="voice-energy"
      role="status"
      aria-label={`Voice Energy: ${score}`}
    >
      <div className="voice-energy__row">
        <span className="voice-energy__label">Voice Energy</span>
        <span className="voice-energy__value">{score}</span>
      </div>
      <div className="voice-energy__meter">
        <div
          className="voice-energy__fill"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
