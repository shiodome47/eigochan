// MediaRecorder ベースの録音ユーティリティ。
// ページを閉じたら破棄でよい想定なので、永続化は行わない。

export interface Recording {
  blob: Blob;
  url: string;
  mimeType: string;
  durationMs: number;
}

export type RecorderRuntimeState = "idle" | "recording" | "inactive";

export class RecorderUnsupportedError extends Error {
  constructor() {
    super("MediaRecorder is not supported in this browser.");
    this.name = "RecorderUnsupportedError";
  }
}

export class RecorderPermissionDeniedError extends Error {
  readonly originalError?: Error;
  constructor(originalError?: unknown) {
    super("Microphone permission was denied.");
    this.name = "RecorderPermissionDeniedError";
    if (originalError instanceof Error) this.originalError = originalError;
  }
}

export function isMediaRecorderSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.MediaRecorder === "undefined") return false;
  const md = navigator.mediaDevices;
  if (!md || typeof md.getUserMedia !== "function") return false;
  return true;
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4", // Safari
  ];
  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      // ignore
    }
  }
  return undefined;
}

export class AudioRecorder {
  private mr: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startedAt = 0;

  async start(): Promise<void> {
    if (!isMediaRecorderSupported()) throw new RecorderUnsupportedError();
    if (this.mr) {
      // 既に録音中なら何もしない(状態の取り違いを避ける)
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        throw new RecorderPermissionDeniedError(err);
      }
      throw err;
    }

    this.stream = stream;
    const mimeType = pickMimeType();
    let mr: MediaRecorder;
    try {
      mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch (e) {
      // ブラウザが渡した mimeType を拒否することがある。フォールバック。
      mr = new MediaRecorder(stream);
      void e;
    }
    this.mr = mr;
    this.chunks = [];

    mr.addEventListener("dataavailable", (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) this.chunks.push(ev.data);
    });

    this.startedAt = Date.now();
    mr.start();
  }

  async stop(): Promise<Recording | null> {
    const mr = this.mr;
    if (!mr || mr.state === "inactive") {
      this.cleanup();
      return null;
    }

    const startedAt = this.startedAt;
    const result = await new Promise<Recording | null>((resolve) => {
      const onStop = () => {
        const mimeType = mr.mimeType || "audio/webm";
        const blob = new Blob(this.chunks, { type: mimeType });
        if (blob.size === 0) {
          resolve(null);
          return;
        }
        const url = URL.createObjectURL(blob);
        const durationMs = Date.now() - startedAt;
        resolve({ blob, url, mimeType, durationMs });
      };
      mr.addEventListener("stop", onStop, { once: true });
      try {
        mr.stop();
      } catch {
        resolve(null);
      }
    });

    this.cleanup();
    return result;
  }

  cancel(): void {
    try {
      if (this.mr && this.mr.state !== "inactive") this.mr.stop();
    } catch {
      // ignore
    }
    this.cleanup();
  }

  getState(): RecorderRuntimeState {
    if (!this.mr) return "idle";
    return this.mr.state === "recording" ? "recording" : "inactive";
  }

  private cleanup(): void {
    try {
      this.stream?.getTracks().forEach((t) => t.stop());
    } catch {
      // ignore
    }
    this.stream = null;
    this.mr = null;
    this.chunks = [];
    this.startedAt = 0;
  }
}

export function revokeRecording(rec: Recording | null): void {
  if (!rec) return;
  try {
    URL.revokeObjectURL(rec.url);
  } catch {
    // ignore
  }
}
