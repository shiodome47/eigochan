import { useEffect, useState } from "react";
import {
  availableEnglishVoices,
  isSpeechSupported,
  loadVoiceUri,
  saveVoiceUri,
  speakText,
} from "../utils/speech";

/**
 * 読み上げの声を選ぶ欄。
 *
 * 端末によって入っている声が違い、自動で選んだものが好みに合わないことがある
 * (macOS には Albert のようなかすれ声も入っている)。
 * ジョーク音声は候補から外してあるが、それでも合わなければここで選び直せる。
 */
export function VoicePicker({ label = "読み上げの声" }: { label?: string }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState<string>(() => loadVoiceUri() ?? "");

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void availableEnglishVoices().then((list) => {
        if (!cancelled) setVoices(list);
      });
    };
    load();
    // 声の一覧は遅れて届くことがある。
    if (isSpeechSupported()) {
      window.speechSynthesis.addEventListener("voiceschanged", load);
      return () => {
        cancelled = true;
        window.speechSynthesis.removeEventListener("voiceschanged", load);
      };
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isSpeechSupported() || voices.length === 0) return null;

  const change = (uri: string) => {
    setSelected(uri);
    saveVoiceUri(uri === "" ? null : uri);
    // 選んだ声をその場で確かめられるように、一言だけ読み上げる。
    void speakText("This is how I sound.", { rate: 0.95 });
  };

  return (
    <div className="voice-picker">
      <label className="voice-picker__label" htmlFor="eigochan-voice">
        🗣 {label}
      </label>
      <select
        id="eigochan-voice"
        className="voice-picker__select"
        value={selected}
        onChange={(e) => change(e.target.value)}
      >
        <option value="">自動で選ぶ</option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
    </div>
  );
}
