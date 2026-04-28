import { useEffect, useRef, useState } from "react";
import {
  AudioRecorder,
  isMediaRecorderSupported,
  RecorderPermissionDeniedError,
  revokeRecording,
  type Recording,
} from "../utils/recording";
import {
  useRecorderRegistry,
  type RecorderSlotKey,
} from "../contexts/RecorderRegistry";
import { analyzeAudioBlob, isAudioAnalysisSupported } from "../utils/audioAnalysis";
import { VoiceEnergyMeter } from "./VoiceEnergyMeter";

export interface RecorderControlsProps {
  /** ステップごとの目的(例:「暗唱を録音」)。 */
  title?: string;
  /** 録音開始前のやさしい説明。 */
  hint?: string;
  /** 録音後の振り返りメッセージ。 */
  afterRecordingHint?: string;
  /** ID用のスコープ(複数Recorderの aria-label 衝突防止)。 */
  scopeId?: string;
  /**
   * ステップ間で録音を保持したいときに指定。
   * phraseId と slot がそろうと、登録された RecorderRegistry に保存され、
   * 同じ (phraseId, slot) で再マウントしても録音が復元される。
   */
  phraseId?: string;
  slot?: RecorderSlotKey;
  /**
   * Voice Energy のスコアが変わるたびに呼ばれる(録音保存・録り直し・削除・解析失敗で発火)。
   * 録音がない / 解析できない場合は null。
   * 親側で memo 化しなくても無限ループしないよう ref パターンで参照する。
   */
  onVoiceEnergyChange?: (score: number | null) => void;
}

type Transient = "none" | "starting" | "recording" | "denied" | "error";

export function RecorderControls({
  title,
  hint,
  afterRecordingHint,
  scopeId,
  phraseId,
  slot,
  onVoiceEnergyChange,
}: RecorderControlsProps) {
  const supported = isMediaRecorderSupported();
  const registry = useRecorderRegistry();
  const useRegistry = Boolean(phraseId && slot && registry);

  // レジストリ非使用時のフォールバック(後方互換)。
  const [localRecording, setLocalRecording] = useState<Recording | null>(null);

  // 実効の録音参照
  const recording: Recording | null = useRegistry
    ? registry!.get(phraseId!, slot!)
    : localRecording;

  // 一過性の状態(録音中・許可拒否など)。録音保持とは別軸。
  const [transient, setTransient] = useState<Transient>("none");

  // 効率のために自己チェック系も持つ(セッション内のみ、ステップ移動でリセット)
  const [playedOnce, setPlayedOnce] = useState(false);
  const [reviewedCheck, setReviewedCheck] = useState(false);

  // Voice Energy(録音波形のエネルギー量だけを表示)
  const [voiceEnergyScore, setVoiceEnergyScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // 親への通知関数を最新参照で保持(deps に入れずに済むように)
  const onScoreChangeRef = useRef(onVoiceEnergyChange);
  onScoreChangeRef.current = onVoiceEnergyChange;

  // 「次に走る解析は新規録音由来」を示すフラグ。
  // セッション復元(remount)では false のままなので、累計の二重カウントを防ぐ。
  const freshRecordingPendingRef = useRef(false);

  const recorderRef = useRef<AudioRecorder | null>(null);

  // ローカルモード時のみ:アンマウントで録音 URL を解放
  useEffect(() => {
    if (useRegistry) return;
    return () => {
      revokeRecording(localRecording);
    };
  }, [localRecording, useRegistry]);

  // 進行中の録音はアンマウント時に必ずキャンセル
  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
      recorderRef.current = null;
    };
  }, []);

  // 録音 Blob が変わったら Voice Energy を再計算する。
  // 録音がない状態(削除直後など)はスコアもクリア。
  // 親への通知は「freshRecordingPendingRef が true のとき」だけ行う:
  //   - 新規録音(handleStop)→ true → 1回通知 → セッション内累計に加算される
  //   - 削除 / 録り直し開始 / セッション復元(remount)→ false → 通知しない(累計は維持)
  useEffect(() => {
    if (!recording || !isAudioAnalysisSupported()) {
      setVoiceEnergyScore(null);
      setAnalyzing(false);
      // 削除や「もう一回録る」直後はメーターを消すだけで、親には通知しない
      // (累計を消したくないので)
      freshRecordingPendingRef.current = false;
      return;
    }
    let cancelled = false;
    setAnalyzing(true);
    analyzeAudioBlob(recording.blob)
      .then((result) => {
        if (cancelled) return;
        setVoiceEnergyScore(result.voiceEnergyScore);
        if (freshRecordingPendingRef.current) {
          onScoreChangeRef.current?.(result.voiceEnergyScore);
          freshRecordingPendingRef.current = false;
        }
      })
      .catch(() => {
        if (cancelled) return;
        // 解析失敗時はメーターを出さない(機能しない端末を責めない)
        setVoiceEnergyScore(null);
        freshRecordingPendingRef.current = false;
      })
      .finally(() => {
        if (cancelled) return;
        setAnalyzing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [recording]);

  const writeRecording = (rec: Recording | null) => {
    if (useRegistry) {
      registry!.set(phraseId!, slot!, rec);
    } else {
      // ローカルモード:古い URL を即座に解放
      if (localRecording && localRecording !== rec) {
        revokeRecording(localRecording);
      }
      setLocalRecording(rec);
    }
  };

  const handleStart = async () => {
    if (!supported) return;
    writeRecording(null);
    setPlayedOnce(false);
    setReviewedCheck(false);
    setTransient("starting");

    const rec = new AudioRecorder();
    recorderRef.current = rec;
    try {
      await rec.start();
      setTransient("recording");
    } catch (e) {
      recorderRef.current = null;
      if (e instanceof RecorderPermissionDeniedError) {
        setTransient("denied");
      } else {
        setTransient("error");
      }
    }
  };

  const handleStop = async () => {
    const rec = recorderRef.current;
    if (!rec) {
      setTransient("none");
      return;
    }
    const result = await rec.stop();
    recorderRef.current = null;
    if (result) {
      // 新規録音を保存する直前にフラグを立てる。
      // useEffect 側でこの録音だけ「累計通知」の対象にする。
      freshRecordingPendingRef.current = true;
      writeRecording(result);
      setTransient("none");
    } else {
      setTransient("none");
    }
  };

  const handleDelete = () => {
    writeRecording(null);
    setPlayedOnce(false);
    setReviewedCheck(false);
    setTransient("none");
  };

  const handlePlay = () => {
    if (!playedOnce) setPlayedOnce(true);
  };

  const handleReviewedToggle = () => {
    setReviewedCheck((v) => !v);
  };

  // 表示状態を recording 有無 + transient から導出
  const isRecording = transient === "recording";
  const isStarting = transient === "starting";
  const isDenied = transient === "denied";
  const isError = transient === "error";
  const showPlayback = !!recording && !isRecording && !isStarting;

  if (!supported) {
    return (
      <section className="recorder" aria-labelledby={scopeId ? `${scopeId}-title` : undefined}>
        {title && (
          <p className="recorder__title" id={scopeId ? `${scopeId}-title` : undefined}>
            🎙 {title}
          </p>
        )}
        <p className="recorder__notice">
          このブラウザは録音(MediaRecorder)に対応していません。
          手動で読んだあと、次に進んでね。
        </p>
      </section>
    );
  }

  return (
    <section
      className={`recorder${recording ? " recorder--has-rec" : ""}${
        isRecording ? " recorder--live" : ""
      }`}
      aria-labelledby={scopeId ? `${scopeId}-title` : undefined}
    >
      {title && (
        <p className="recorder__title" id={scopeId ? `${scopeId}-title` : undefined}>
          🎙 {title}
        </p>
      )}
      {hint && !recording && !isRecording && (
        <p className="recorder__hint">{hint}</p>
      )}

      {isDenied && (
        <p className="recorder__notice">
          マイクの使用が許可されていません。ブラウザの設定でマイクを許可してね。
        </p>
      )}
      {isError && (
        <p className="recorder__notice">
          録音を開始できませんでした。もう一度試してみてね。
        </p>
      )}

      {!recording && !isRecording && (
        <button
          type="button"
          className="btn btn--accent"
          onClick={handleStart}
          disabled={isStarting}
        >
          🎙️ {isStarting ? "じゅんび中…" : "録音してみる"}
        </button>
      )}

      {isRecording && (
        <>
          <button
            type="button"
            className="btn recorder__stop-btn"
            onClick={handleStop}
          >
            ■ 止める
          </button>
          <p className="recorder__live" aria-live="polite">
            <span className="recorder__dot" aria-hidden="true" />
            録音中… 落ち着いて声に出してね
          </p>
        </>
      )}

      {showPlayback && recording && (
        <div className="recorder__playback">
          <p className="recorder__playback-hint">▶ まずは聞き返してみよう</p>
          <audio
            className="recorder__audio"
            src={recording.url}
            controls
            preload="metadata"
            onPlay={handlePlay}
            aria-label="録音した自分の声を再生"
          />

          <VoiceEnergyMeter score={voiceEnergyScore} loading={analyzing} />

          {playedOnce && afterRecordingHint && (
            <p className="recorder__after-hint">{afterRecordingHint}</p>
          )}

          <div className="recorder__self-check" role="group" aria-label="自己チェック">
            <button
              type="button"
              className={`chip-btn${reviewedCheck ? " is-on" : ""}`}
              onClick={handleReviewedToggle}
              disabled={!playedOnce}
              aria-pressed={reviewedCheck}
              title={playedOnce ? "聞き返したらチェック" : "再生するとチェックできるよ"}
            >
              {reviewedCheck ? "✓ 聞き返した" : "聞き返した"}
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={handleStart}
            >
              🎙 もう一回録る
            </button>
            <button
              type="button"
              className="chip-btn chip-btn--ghost"
              onClick={handleDelete}
            >
              🗑 消す
            </button>
          </div>
          {!playedOnce && (
            <p className="recorder__nudge">▶ ボタンから再生して、自分の声を聞いてみよう</p>
          )}
        </div>
      )}
    </section>
  );
}
