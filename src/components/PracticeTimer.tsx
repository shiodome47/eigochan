import { useCallback, useEffect, useRef, useState } from "react";
import { formatClock } from "../utils/practiceTimer";

interface Props {
  /** 持ち時間 (秒)。0 なら何も出さない。 */
  seconds: number;
}

type Phase = "idle" | "running" | "paused" | "done";

/**
 * 1 周ぶんの持ち時間を測るタイマー。
 *
 * - 押すと開始 / 一時停止 / 再開。↺ で最初から。
 * - **音は鳴らさない。** 0 になったら見た目だけで知らせる。
 * - 残り時間はピルの背景が減っていく形でも見せるので、数字を読まなくても分かる。
 * - 残り時間は「終わる時刻」から毎回計算する。画面を止められても数字がずれない。
 */
export function PracticeTimer({ seconds }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(seconds);
  // 動いている間の「終わる時刻」(ミリ秒)。止めている間は null。
  const endAtRef = useRef<number | null>(null);

  // 設定を変えたら止めて入れ直す。
  useEffect(() => {
    endAtRef.current = null;
    setPhase("idle");
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const end = endAtRef.current;
      if (end === null) return;
      const remain = (end - Date.now()) / 1000;
      if (remain <= 0) {
        setLeft(0);
        setPhase("done");
        endAtRef.current = null;
        return;
      }
      setLeft(remain);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = useCallback((from: number) => {
    endAtRef.current = Date.now() + from * 1000;
    setLeft(from);
    setPhase("running");
  }, []);

  const handleTap = () => {
    if (phase === "running") {
      // 一時停止。残りを持ったまま止める。
      endAtRef.current = null;
      setPhase("paused");
      return;
    }
    if (phase === "paused") {
      start(left);
      return;
    }
    // idle / done → 最初から
    start(seconds);
  };

  const handleReset = () => {
    endAtRef.current = null;
    setPhase("idle");
    setLeft(seconds);
  };

  if (seconds <= 0) return null;

  const ratio = seconds > 0 ? Math.max(0, Math.min(1, left / seconds)) : 0;
  const label =
    phase === "idle"
      ? `⏱ ${formatClock(seconds)}`
      : phase === "done"
        ? "⏱ 0:00 終了"
        : formatClock(left);
  const hint =
    phase === "idle"
      ? "はじめる"
      : phase === "running"
        ? "とめる"
        : phase === "paused"
          ? "つづける"
          : "もう一周";

  return (
    <div className="practice-timer">
      <button
        type="button"
        className={`practice-timer__pill is-${phase}`}
        // 残り時間ぶんだけ色を残す。数字を読まなくても減り具合が分かる。
        style={{ ["--left" as string]: `${ratio * 100}%` }}
        onClick={handleTap}
        aria-label={`練習タイマー ${hint}`}
        title={hint}
      >
        <span className="practice-timer__time">{label}</span>
        <span className="practice-timer__hint">{hint}</span>
      </button>
      {phase !== "idle" && (
        <button
          type="button"
          className="practice-timer__reset"
          onClick={handleReset}
          aria-label="タイマーを最初に戻す"
          title="最初に戻す"
        >
          ↺
        </button>
      )}
    </div>
  );
}
