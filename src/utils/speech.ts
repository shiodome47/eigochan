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

// macOS に標準で入っているジョーク音声。これらも lang は en-US を名乗るので、
// 「最初に見つかった en-US」を選ぶと Albert (かすれ声) や Whisper (ささやき声) が
// 当たってしまう。読み上げの見本にはならないので候補から外す。
const NOVELTY_VOICES = new Set(
  [
    "albert", "bad news", "bahh", "bells", "boing", "bubbles", "cellos",
    "deranged", "good news", "hysterical", "jester", "junior", "kathy",
    "organ", "pipe organ", "princess", "ralph", "superstar", "trinoids",
    "whisper", "wobble", "zarvox", "fred",
  ].map((n) => n.toLowerCase()),
);

/** 聞き取りやすい標準的な声。上から順に探す。 */
const PREFERRED_VOICES = [
  // macOS / iOS
  "samantha", "alex", "ava", "allison", "susan", "tom", "nicky", "aaron",
  // Windows
  "microsoft aria", "microsoft jenny", "microsoft guy", "microsoft zira",
  "microsoft david", "microsoft mark",
  // Chrome / Android
  "google us english", "google uk english female", "google uk english male",
  // その他の英語圏
  "daniel", "karen", "moira", "rishi", "serena", "tessa",
].map((n) => n.toLowerCase());

function isNovelty(voice: SpeechSynthesisVoice): boolean {
  return NOVELTY_VOICES.has(voice.name.trim().toLowerCase());
}

/** 読み上げに使えそうな英語の声だけを、おすすめ順に並べて返す (声の選択欄でも使う)。 */
export function englishVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en") && !isNovelty(v));
  return en.sort((a, b) => {
    const ia = PREFERRED_VOICES.indexOf(a.name.trim().toLowerCase());
    const ib = PREFERRED_VOICES.indexOf(b.name.trim().toLowerCase());
    // おすすめに載っている声を先に。載っていないものは後ろで名前順。
    if (ia !== ib) return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    return a.name.localeCompare(b.name);
  });
}

function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // 1. 本人が選んだ声があればそれを使う。
  const saved = loadVoiceUri();
  if (saved) {
    const chosen = voices.find((v) => v.voiceURI === saved);
    if (chosen) return chosen;
  }

  const usable = englishVoices(voices);
  if (usable.length === 0) {
    // 英語の声が 1 つも無ければ voice を指定しない (lang だけ渡してブラウザに任せる)。
    return null;
  }

  // 2. 言語が完全に一致するものを、おすすめ順に。
  const exact = usable.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  if (exact) return exact;

  // 3. なければ英語なら何でも (おすすめ順の先頭)。
  return usable[0];
}

const VOICE_KEY = "eigochan.voice.v1";

/** 選んだ声の voiceURI。未設定なら null (自動で選ぶ)。 */
export function loadVoiceUri(): string | null {
  try {
    return localStorage.getItem(VOICE_KEY);
  } catch {
    return null;
  }
}

export function saveVoiceUri(voiceUri: string | null): boolean {
  try {
    if (voiceUri) localStorage.setItem(VOICE_KEY, voiceUri);
    else localStorage.removeItem(VOICE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** 声の選択欄用。読み込みが終わっていなければ空配列。 */
export async function availableEnglishVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = cachedVoices ?? (await loadVoices());
  return englishVoices(voices);
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
    // 声の一覧が入れ替わったあとの古いオブジェクトを渡すと例外になることがある。
    // 声を指定できなくても、lang だけで読み上げは続けたい。
    if (voice) {
      try {
        utter.voice = voice;
      } catch {
        cachedVoices = null; // 次回は取り直す
      }
    }
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
