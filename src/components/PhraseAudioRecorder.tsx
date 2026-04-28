import { useEffect, useRef, useState } from "react";
import {
  AudioRecorder,
  isMediaRecorderSupported,
  RecorderPermissionDeniedError,
} from "../utils/recording";
import {
  deletePhraseAudio,
  isPhraseAudioSupported,
  loadPhraseAudio,
  savePhraseAudio,
  type PhraseAudioSlot,
  type SavedPhraseAudio,
} from "../utils/phraseAudioStorage";
import {
  enqueueAudioDelete,
  enqueueAudioUpload,
} from "../utils/autoSync";

interface Props {
  phraseId: string;
  slot: PhraseAudioSlot;
  title: string;
  description: string;
  /** ファイル取込の上限。デフォルト 10MB。 */
  maxBytes?: number;
  /** 保存・削除のたびに呼ばれる(親が一覧を更新したい時に使う)。 */
  onChange?: () => void;
}

type Phase =
  | "loading"
  | "idle"
  | "starting"
  | "recording"
  | "saving"
  | "ready"
  | "denied"
  | "error";

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function PhraseAudioRecorder({
  phraseId,
  slot,
  title,
  description,
  maxBytes = DEFAULT_MAX_BYTES,
  onChange,
}: Props) {
  const supported = isMediaRecorderSupported() && isPhraseAudioSupported();
  const [phase, setPhase] = useState<Phase>("loading");
  const [saved, setSaved] = useState<SavedPhraseAudio | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // マウント時 / phraseId, slot 変更時に既存音声をロード
  useEffect(() => {
    let active = true;
    if (!supported) {
      setPhase("idle");
      return;
    }
    setPhase("loading");
    void loadPhraseAudio(phraseId, slot).then((existing) => {
      if (!active) return;
      if (existing) {
        const url = URL.createObjectURL(existing.blob);
        setSaved(existing);
        setAudioUrl(url);
        setPhase("ready");
      } else {
        setSaved(null);
        setAudioUrl(null);
        setPhase("idle");
      }
    });
    return () => {
      active = false;
    };
  }, [phraseId, slot, supported]);

  // ObjectURL のクリーンアップ
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // 進行中の録音はアンマウントでキャンセル
  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
      recorderRef.current = null;
    };
  }, []);

  const replaceUrl = (next: string | null) => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next;
    });
  };

  const handleStart = async () => {
    if (!supported) return;
    setError(null);
    setPhase("starting");
    const rec = new AudioRecorder();
    recorderRef.current = rec;
    try {
      await rec.start();
      setPhase("recording");
    } catch (e) {
      recorderRef.current = null;
      if (e instanceof RecorderPermissionDeniedError) {
        setPhase("denied");
      } else {
        setError("録音を開始できませんでした");
        setPhase("error");
      }
    }
  };

  const handleStop = async () => {
    const rec = recorderRef.current;
    if (!rec) {
      setPhase(saved ? "ready" : "idle");
      return;
    }
    setPhase("saving");
    try {
      const result = await rec.stop();
      recorderRef.current = null;
      if (!result) {
        setPhase(saved ? "ready" : "idle");
        return;
      }
      // 録音中に作られた一時 URL は使わず、保存後の Blob から作り直す
      try {
        URL.revokeObjectURL(result.url);
      } catch {
        // 無視
      }
      const newSaved = await savePhraseAudio(phraseId, slot, result.blob, result.mimeType);
      replaceUrl(URL.createObjectURL(newSaved.blob));
      setSaved(newSaved);
      setPhase("ready");
      onChange?.();
      // 同期側へも反映予約(syncCode 無し / draft_ なら no-op)
      enqueueAudioUpload(phraseId, slot);
    } catch {
      setError("録音の保存に失敗しました");
      setPhase("error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`${title}を削除しますか? (取り消せません)`)) return;
    try {
      await deletePhraseAudio(phraseId, slot);
      replaceUrl(null);
      setSaved(null);
      setPhase("idle");
      onChange?.();
      // 同期側からも消す予約(syncCode 無し / draft_ なら no-op)
      enqueueAudioDelete(phraseId, slot);
    } catch {
      setError("削除に失敗しました");
      setPhase("error");
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setError("音声ファイル(audio/*)を選んでね。");
      setPhase("error");
      return;
    }
    if (file.size > maxBytes) {
      const limitMb = (maxBytes / 1024 / 1024).toFixed(0);
      setError(`ファイルが大きすぎます。${limitMb}MB 以下にしてね。`);
      setPhase("error");
      return;
    }
    setError(null);
    setPhase("saving");
    try {
      const newSaved = await savePhraseAudio(phraseId, slot, file, file.type || "audio/webm");
      replaceUrl(URL.createObjectURL(newSaved.blob));
      setSaved(newSaved);
      setPhase("ready");
      onChange?.();
      enqueueAudioUpload(phraseId, slot);
    } catch {
      setError("ファイルの保存に失敗しました");
      setPhase("error");
    }
  };

  if (!supported) {
    return (
      <section className="audio-slot" aria-label={title}>
        <h4 className="audio-slot__title">🎵 {title}</h4>
        <p className="audio-slot__desc">{description}</p>
        <p className="audio-slot__notice">
          このブラウザは録音または保存に対応していません。
          別のブラウザを試すか、後で開き直してね。
        </p>
      </section>
    );
  }

  const isBusy = phase === "starting" || phase === "saving";

  return (
    <section className="audio-slot" aria-label={title}>
      <h4 className="audio-slot__title">🎵 {title}</h4>
      <p className="audio-slot__desc">{description}</p>

      {phase === "denied" && (
        <p className="audio-slot__notice">
          マイクの使用が許可されていません。ブラウザの設定でマイクを許可してね。
        </p>
      )}
      {phase === "error" && error && (
        <p className="audio-slot__notice">{error}</p>
      )}

      {/* 録音開始ボタン(待機中・エラー後) */}
      {(phase === "idle" || phase === "denied" || phase === "error") && !saved && (
        <div className="audio-slot__row">
          <button type="button" className="btn btn--accent" onClick={handleStart}>
            🎙 録音する
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handlePickFile}
          >
            📂 ファイルを選ぶ
          </button>
        </div>
      )}

      {/* 録音準備中 / 録音中 */}
      {(phase === "starting" || phase === "recording") && (
        <>
          {phase === "starting" ? (
            <button type="button" className="btn" disabled>
              🎙 じゅんび中…
            </button>
          ) : (
            <button type="button" className="btn audio-slot__stop" onClick={handleStop}>
              ■ 止める
            </button>
          )}
          {phase === "recording" && (
            <p className="audio-slot__live" aria-live="polite">
              <span className="audio-slot__dot" aria-hidden="true" /> 録音中…
              落ち着いて声に出してね
            </p>
          )}
        </>
      )}

      {/* 保存中 */}
      {phase === "saving" && (
        <p className="audio-slot__hint">保存中…</p>
      )}

      {/* 再生 + アクション */}
      {phase === "ready" && saved && audioUrl && (
        <>
          <audio
            src={audioUrl}
            controls
            preload="metadata"
            className="audio-slot__player"
            aria-label={`${title}を再生`}
          />
          <p className="audio-slot__meta">保存済み:{formatSize(saved.size)}</p>
          <div className="audio-slot__row">
            <button
              type="button"
              className="chip-btn"
              onClick={handleStart}
              disabled={isBusy}
            >
              🎙 録り直す
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={handlePickFile}
              disabled={isBusy}
            >
              📂 差し替える
            </button>
            <button
              type="button"
              className="chip-btn chip-btn--ghost"
              onClick={handleDelete}
              disabled={isBusy}
            >
              🗑 削除
            </button>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        hidden
        onChange={handleFileSelected}
        aria-label={`${title}の音声ファイルを選ぶ`}
      />
    </section>
  );
}
