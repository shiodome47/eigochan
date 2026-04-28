// 録音 Blob から「Voice Energy(声のエネルギー)」を算出する。
//
// これは発音評価ではなく、波形そのもののエネルギー量を定量化するもの。
// 内部的には音量(RMS)と時間が含まれるが、UI に出すのは voiceEnergyScore のみ。
// activeVoiceMs / silenceRatio / averageRms / peakRms は意図的に外部公開しない。

export interface AudioAnalysisResult {
  /** 録音の長さ(ms)。内部参照用に持たせるが、UI には出さない。 */
  durationMs: number;
  /** ノイズフロアを差し引いた RMS の総和(スケーリング前)。 */
  voiceEnergyRaw: number;
  /** 整数化された見やすいスコア。0 〜 VOICE_ENERGY_MAX_SCORE。 */
  voiceEnergyScore: number;
}

// 調整しやすいよう、定数はモジュール内で集約。
const FRAME_SIZE = 1024;
const NOISE_FLOOR = 0.015;
const VOICE_ENERGY_SCALE = 6;
export const VOICE_ENERGY_MAX_SCORE = 300;

type AudioCtxClass = typeof AudioContext;

function getAudioContextClass(): AudioCtxClass | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: AudioCtxClass;
    webkitAudioContext?: AudioCtxClass;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export function isAudioAnalysisSupported(): boolean {
  return getAudioContextClass() !== null;
}

/**
 * Blob を解析して Voice Energy を返す。
 * 解析できないブラウザ・破損 Blob などはエラーを投げる(呼び出し側で握りつぶす想定)。
 */
export async function analyzeAudioBlob(blob: Blob): Promise<AudioAnalysisResult> {
  const Ctor = getAudioContextClass();
  if (!Ctor) {
    throw new Error("AudioContext is not supported in this browser");
  }
  if (!blob || blob.size === 0) {
    throw new Error("Empty audio blob");
  }

  const arrayBuffer = await blob.arrayBuffer();

  const ctx = new Ctor();
  let audioBuffer: AudioBuffer;
  try {
    // Safari は同じ ArrayBuffer の再 decode で詰まることがあるので複製を渡す
    audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    try {
      void ctx.close();
    } catch {
      // ignore
    }
  }

  const channel = audioBuffer.getChannelData(0);
  const totalSamples = channel.length;
  const durationMs = Math.round(audioBuffer.duration * 1000);

  let voiceEnergyRaw = 0;
  for (let start = 0; start < totalSamples; start += FRAME_SIZE) {
    const end = Math.min(start + FRAME_SIZE, totalSamples);
    let sumSquares = 0;
    for (let i = start; i < end; i++) {
      const v = channel[i];
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, end - start));
    const above = rms - NOISE_FLOOR;
    if (above > 0) voiceEnergyRaw += above;
  }

  const scaled = Math.round(voiceEnergyRaw * VOICE_ENERGY_SCALE);
  const voiceEnergyScore = Math.max(0, Math.min(VOICE_ENERGY_MAX_SCORE, scaled));

  return {
    durationMs,
    voiceEnergyRaw,
    voiceEnergyScore,
  };
}
