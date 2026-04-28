import type { SpeechOptions } from "../types";

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let cachedVoices: SpeechSynthesisVoice[] | null = null;

// 進行中の "発話セッション" を識別するためのカウンタ。
// 新しく speakText / speakRepeated / cancelSpeech が呼ばれるたびに増える。
// speakRepeated のループは自分のセッションが古くなっていたら抜ける。
let speechSession = 0;

function bumpSession(): number {
  speechSession += 1;
  return speechSession;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const initial = synth.getVoices();
    if (initial && initial.length > 0) {
      cachedVoices = initial;
      resolve(initial);
      return;
    }
    const handler = () => {
      const voices = synth.getVoices();
      cachedVoices = voices;
      synth.removeEventListener("voiceschanged", handler);
      resolve(voices);
    };
    synth.addEventListener("voiceschanged", handler);
    // Safari等では voiceschanged が発火しないことがあるためフォールバック
    setTimeout(() => {
      const voices = synth.getVoices();
      if (voices.length > 0 && !cachedVoices) {
        cachedVoices = voices;
        resolve(voices);
      }
    }, 250);
  });
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  if (exact) return exact;
  const enAny = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (enAny) return enAny;
  return voices[0] ?? null;
}

// 内部プリミティブ:1回だけ発話する。セッション管理はしない。
async function _speakOne(text: string, options: SpeechOptions): Promise<void> {
  if (!isSpeechSupported()) return;
  const synth = window.speechSynthesis;
  const voices = cachedVoices ?? (await loadVoices());
  const lang = options.lang ?? "en-US";
  const voice = pickEnglishVoice(voices, lang);

  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = options.rate ?? 0.9;
    utter.pitch = options.pitch ?? 1.0;
    utter.volume = options.volume ?? 1.0;
    if (voice) utter.voice = voice;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);
  });
}

function sleep(ms: number, sessionAtStart: number): Promise<void> {
  return new Promise((resolve) => {
    const tick = 50;
    let remaining = ms;
    const id = window.setInterval(() => {
      if (sessionAtStart !== speechSession) {
        window.clearInterval(id);
        resolve();
        return;
      }
      remaining -= tick;
      if (remaining <= 0) {
        window.clearInterval(id);
        resolve();
      }
    }, tick);
  });
}

export async function speakText(text: string, options: SpeechOptions = {}): Promise<void> {
  if (!isSpeechSupported() || !text) return;
  bumpSession();
  window.speechSynthesis.cancel();
  await _speakOne(text, options);
}

export interface SpeakRepeatOptions {
  /** 繰り返す回数。デフォルト 1。 */
  count?: number;
  /** 各回のあいだの無音時間(ms)。デフォルト 500。 */
  gapMs?: number;
}

/**
 * テキストを指定回数くりかえし読み上げる。同一セッション中のキャンセル耐性あり。
 * 途中で speakText / cancelSpeech / 別の speakRepeated が呼ばれたら静かに抜ける。
 */
export async function speakRepeated(
  text: string,
  options: SpeechOptions = {},
  repeat: SpeakRepeatOptions = {},
): Promise<void> {
  if (!isSpeechSupported() || !text) return;
  const count = Math.max(1, Math.floor(repeat.count ?? 1));
  const gapMs = Math.max(0, repeat.gapMs ?? 500);

  const mySession = bumpSession();
  window.speechSynthesis.cancel();

  for (let i = 0; i < count; i++) {
    if (mySession !== speechSession) return;
    await _speakOne(text, options);
    if (mySession !== speechSession) return;
    if (i < count - 1 && gapMs > 0) {
      await sleep(gapMs, mySession);
      if (mySession !== speechSession) return;
    }
  }
}

export function cancelSpeech(): void {
  if (!isSpeechSupported()) return;
  bumpSession();
  window.speechSynthesis.cancel();
}
