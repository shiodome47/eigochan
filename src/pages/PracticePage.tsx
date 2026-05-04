import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findPhraseById, PHRASES } from "../data/phrases";
import { StepIndicator } from "../components/StepIndicator";
import { RecorderControls } from "../components/RecorderControls";
import { CompletionSummary } from "../components/CompletionSummary";
import { useRecorderRegistry } from "../contexts/RecorderRegistry";
import { cancelSpeech, isSpeechSupported, speakRepeated, speakText } from "../utils/speech";
import {
  applyPractice,
  diffLevels,
  getXpBreakdown,
  totalXpFromBreakdown,
  type LevelTransition,
  type XpBreakdownItem,
} from "../utils/progress";
import { getCompletionHeadline, pickCityGrowthMessage } from "../utils/messages";
import { todayString } from "../utils/date";
import { isCustomPhrase } from "../utils/customPhrases";
import { loadPhraseAudio, type SavedPhraseAudio } from "../utils/phraseAudioStorage";
import type { UserProgress } from "../types";

type Step = 1 | 2 | 3 | 4 | 5;

interface PracticePageProps {
  progress: UserProgress;
  onCommit: (next: UserProgress) => void;
  onMissionComplete: (phraseId: string) => boolean;
}

interface CompletionState {
  breakdown: XpBreakdownItem[];
  totalXp: number;
  levelTransition: LevelTransition;
  cityMessage: string;
  headline: string;
  streakDays: number;
  totalVoiceEnergy: number;
}

function rateLabel(rate: number): string {
  if (rate <= 0.7) return "ゆっくり";
  if (rate <= 0.85) return "ややゆっくり";
  if (rate < 0.95) return "ふつう";
  return "はやめ";
}

export function PracticePage({ progress, onCommit, onMissionComplete }: PracticePageProps) {
  const navigate = useNavigate();
  const params = useParams<{ phraseId?: string }>();
  const recorderRegistry = useRecorderRegistry();
  // clearForPhrase は useCallback([]) で参照が安定しているので個別に取り出す。
  // recorderRegistry オブジェクト自体は store 更新で参照が変わるため、
  // 直接 deps に入れると保存直後の cleanup が発火してしまう。
  const clearRecordingsForPhrase = recorderRegistry?.clearForPhrase;
  const phrase = useMemo(() => {
    if (params.phraseId) {
      const p = findPhraseById(params.phraseId);
      if (p) return p;
    }
    return PHRASES[0];
  }, [params.phraseId]);

  const [step, setStep] = useState<Step>(1);
  const [chunkDone, setChunkDone] = useState<boolean[]>(() =>
    new Array(phrase.chunks.length).fill(false),
  );
  const [fullReadDone, setFullReadDone] = useState(false);
  const [reciteDone, setReciteDone] = useState(false);
  const [showEnglishInRecite, setShowEnglishInRecite] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [completion, setCompletion] = useState<CompletionState | null>(null);
  // 各 step の Voice Energy。録音なし / 解析失敗時は null。
  const [chunksScore, setChunksScore] = useState<number | null>(null);
  const [fullScore, setFullScore] = useState<number | null>(null);
  const [reciteScore, setReciteScore] = useState<number | null>(null);
  // 自作フレーズに保存された「お手本音声」(IndexedDB)。あれば再生ボタンを出す。
  const [referenceAudio, setReferenceAudio] = useState<SavedPhraseAudio | null>(null);
  const referenceUrlRef = useRef<string | null>(null);
  const referencePlayerRef = useRef<HTMLAudioElement | null>(null);
  const supported = isSpeechSupported();

  useEffect(() => {
    setStep(1);
    setChunkDone(new Array(phrase.chunks.length).fill(false));
    setFullReadDone(false);
    setReciteDone(false);
    setShowEnglishInRecite(false);
    setCompletion(null);
    setChunksScore(null);
    setFullScore(null);
    setReciteScore(null);
  }, [phrase.id, phrase.chunks.length]);

  useEffect(() => {
    return () => {
      cancelSpeech();
      // アンマウントでお手本音声も停止
      if (referencePlayerRef.current) {
        referencePlayerRef.current.pause();
        referencePlayerRef.current = null;
      }
      if (referenceUrlRef.current) {
        URL.revokeObjectURL(referenceUrlRef.current);
        referenceUrlRef.current = null;
      }
    };
  }, []);

  // ステップ移動時には進行中のリピート再生もお手本音声も止める
  useEffect(() => {
    return () => {
      cancelSpeech();
      if (referencePlayerRef.current) {
        referencePlayerRef.current.pause();
        referencePlayerRef.current = null;
      }
    };
  }, [step]);

  // フレーズ切替時にお手本音声をロード(自作フレーズの reference スロットのみ)
  useEffect(() => {
    let cancelled = false;
    // 切替時に旧 URL を解放
    if (referenceUrlRef.current) {
      URL.revokeObjectURL(referenceUrlRef.current);
      referenceUrlRef.current = null;
    }
    if (referencePlayerRef.current) {
      referencePlayerRef.current.pause();
      referencePlayerRef.current = null;
    }
    setReferenceAudio(null);

    if (!isCustomPhrase(phrase.id)) return;

    void loadPhraseAudio(phrase.id, "reference")
      .then((audio) => {
        if (cancelled) return;
        if (audio) {
          referenceUrlRef.current = URL.createObjectURL(audio.blob);
          setReferenceAudio(audio);
        }
      })
      .catch(() => {
        // IDB 非対応や読み込み失敗時はお手本ボタンを出さない
      });

    return () => {
      cancelled = true;
    };
  }, [phrase.id]);

  // 別フレーズへ切替 / PracticePage アンマウント時に
  // そのフレーズの録音を全 slot 破棄(URL も revoke)。
  // 同じフレーズ内のステップ移動・録音保存では発火しない。
  useEffect(() => {
    if (!clearRecordingsForPhrase) return;
    const id = phrase.id;
    return () => {
      clearRecordingsForPhrase(id);
    };
  }, [phrase.id, clearRecordingsForPhrase]);

  const stopReferencePlayback = () => {
    if (referencePlayerRef.current) {
      referencePlayerRef.current.pause();
      referencePlayerRef.current = null;
    }
  };

  const handlePlayReference = () => {
    if (!referenceUrlRef.current) return;
    cancelSpeech();           // TTS と被らないように先に止める
    stopReferencePlayback();  // 連打時、前回の再生も止める
    const audio = new Audio(referenceUrlRef.current);
    referencePlayerRef.current = audio;
    audio.onended = () => {
      if (referencePlayerRef.current === audio) {
        referencePlayerRef.current = null;
      }
    };
    audio.onerror = () => {
      if (referencePlayerRef.current === audio) {
        referencePlayerRef.current = null;
      }
    };
    void audio.play().catch(() => {
      // autoplay 制限などで再生できなかった場合は無視
    });
  };

  const handleSpeakAll = () => {
    stopReferencePlayback();
    void speakText(phrase.english, { rate });
  };

  const handleRepeatAll = () => {
    stopReferencePlayback();
    void speakRepeated(phrase.english, { rate }, { count: 3, gapMs: 600 });
  };

  const handleSpeakChunk = (chunk: string) => {
    stopReferencePlayback();
    void speakText(chunk, { rate });
  };

  const handleRepeatChunk = (chunk: string) => {
    stopReferencePlayback();
    void speakRepeated(chunk, { rate }, { count: 2, gapMs: 400 });
  };

  const handleChunkDone = (idx: number) => {
    if (chunkDone[idx]) return;
    const next = [...chunkDone];
    next[idx] = true;
    setChunkDone(next);
  };

  // 各 step の Voice Energy を「セッション累計」として加算する。
  // 録り直しは別練習扱いなので減算/上書きはしない。
  // null(削除など)は通知が来ない設計なのでガードしておくだけ。
  const accumulate = (set: typeof setChunksScore) => (score: number | null) => {
    if (score == null || score <= 0) return;
    set((prev) => (prev ?? 0) + score);
  };
  const handleChunksScore = accumulate(setChunksScore);
  const handleFullScore = accumulate(setFullScore);
  const handleReciteScore = accumulate(setReciteScore);

  const allChunksDone = chunkDone.every(Boolean);
  const chunkReadCount = chunkDone.filter(Boolean).length;

  const handleFullRead = () => {
    if (!fullReadDone) setFullReadDone(true);
  };

  const handleReciteDone = () => {
    if (!reciteDone) setReciteDone(true);
  };

  const handleComplete = () => {
    const isFirstToday = onMissionComplete(phrase.id);
    const breakdown = getXpBreakdown({
      chunkReadCount,
      fullRead: fullReadDone,
      recited: reciteDone,
      missionComplete: isFirstToday,
    });
    const totalXp = totalXpFromBreakdown(breakdown);
    const readCount = chunkReadCount + (fullReadDone ? 1 : 0);
    const reciteCount = reciteDone ? 1 : 0;
    const next = applyPractice(progress, {
      phraseId: phrase.id,
      readCount,
      reciteCount,
      xpEarned: totalXp,
    });
    const transition = diffLevels(progress.level, next.level);
    const cityMessage = pickCityGrowthMessage(`${todayString()}-${phrase.id}`);
    const totalVoiceEnergy =
      (chunksScore ?? 0) + (fullScore ?? 0) + (reciteScore ?? 0);
    onCommit(next);
    setCompletion({
      breakdown,
      totalXp,
      levelTransition: transition,
      cityMessage,
      headline: getCompletionHeadline(next.streakDays),
      streakDays: next.streakDays,
      totalVoiceEnergy,
    });
    setStep(5);
  };

  // ひとりごと英語など、英語が未入力のフレーズはここで早期 return。
  // (フックはすべて呼び終わった後なので Rules of Hooks 違反にならない。)
  // 編集画面へ誘導してから再訪してもらう。
  if (phrase.english.trim().length === 0) {
    return (
      <>
        <Link to="/" className="btn btn--ghost btn--small back-link">
          ← Home
        </Link>
        <section className="card practice-card">
          <h2 className="card__title">英語を入力すると練習できます</h2>
          <p className="practice-japanese">{phrase.japanese}</p>
          <p className="form-hint" style={{ marginTop: 12 }}>
            このひとりごとは、まだ英語が入っていません。
            まず英語表現を追加すると、音読・暗唱・録音・Voice Energy の練習ができるようになります。
          </p>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/phrases/edit/${phrase.id}`)}
            >
              ✏️ 英語を入れる
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/phrases")}
            >
              フレーズ一覧へ
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Link to="/" className="btn btn--ghost btn--small back-link">
        ← Home
      </Link>
      <StepIndicator current={step} total={5} />

      {!supported && (
        <div className="notice">
          このブラウザは音声読み上げ(Web Speech API)に対応していません。
          手動で英文を読んでもステップは進められます。
        </div>
      )}

      {step !== 5 && (
        <section className="card practice-card">
          <h2 className="card__title">今日のフレーズ</h2>
          <p className="practice-english">{phrase.english}</p>
          <p className="practice-japanese">{phrase.japanese}</p>

          <div className="rate-row">
            <span>読み上げのはやさ</span>
            <input
              type="range"
              min={0.6}
              max={1.1}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label="読み上げ速度"
            />
            <span className="rate-row__label">{rateLabel(rate)}</span>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="card step-card">
          <p className="step-card__eyebrow">Step 1 / 5</p>
          <h3 className="step-card__title">まずは英語の音を聞いてみよう</h3>
          <p className="step-card__lead">
            意味が全部わからなくてOK。リズムと音のかたまりを感じてみよう。
          </p>
          <div className="btn-row">
            {referenceAudio && (
              <button
                type="button"
                className="btn"
                onClick={handlePlayReference}
                aria-label="保存しておいたお手本音声を聞く"
              >
                🎵 お手本音声を聞く
              </button>
            )}
            <button
              type="button"
              className={referenceAudio ? "btn btn--secondary" : "btn"}
              onClick={handleSpeakAll}
              disabled={!supported}
            >
              🔊 英文を聞く{referenceAudio ? "(機械音声)" : ""}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleRepeatAll}
              disabled={!supported}
              aria-label="英文を3回くりかえして聞く"
            >
              🔁 3回くりかえして聞く
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setStep(2)}
            >
              聞いた! 次へ →
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card step-card">
          <p className="step-card__eyebrow">Step 2 / 5</p>
          <h3 className="step-card__title">短いかたまりごとに声に出そう</h3>
          <p className="step-card__lead">
            完璧じゃなくてOK。まずは口を動かしてみよう。読めたらチェック。
          </p>

          <ul className="chunk-list" aria-label="チャンク一覧">
            {phrase.chunks.map((chunk, idx) => (
              <li
                key={`${chunk}-${idx}`}
                className={`chunk-row${chunkDone[idx] ? " is-done" : ""}`}
              >
                <span className="chunk-row__number" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="chunk-row__text">{chunk}</span>
                <span className="chunk-row__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleSpeakChunk(chunk)}
                    disabled={!supported}
                    aria-label={`チャンク${idx + 1}を聞く`}
                    title="聞く"
                  >
                    🔊
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--repeat"
                    onClick={() => handleRepeatChunk(chunk)}
                    disabled={!supported}
                    aria-label={`チャンク${idx + 1}を2回くりかえして聞く`}
                    title="2回くりかえす"
                  >
                    🔁
                  </button>
                  <button
                    type="button"
                    className={`icon-btn icon-btn--accent${chunkDone[idx] ? " is-on" : ""}`}
                    onClick={() => handleChunkDone(idx)}
                    aria-label={chunkDone[idx] ? "読んだ済み" : "読んだ"}
                    aria-pressed={chunkDone[idx]}
                    title="読んだ"
                  >
                    {chunkDone[idx] ? "✓" : "🗣"}
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className="chunk-progress">
            {chunkReadCount} / {phrase.chunks.length} 読めた
          </p>

          <RecorderControls
            key={`rec-chunks-${phrase.id}`}
            scopeId={`rec-chunks-${phrase.id}`}
            phraseId={phrase.id}
            slot="chunks"
            title="チャンク音読を録音"
            hint="短いかたまりごとに読んだあと、最後に一度録音してみよう。"
            afterRecordingHint="再生して、英語のリズムをまねできているか聞いてみよう。"
            onVoiceEnergyChange={handleChunksScore}
          />

          <div className="btn-row">
            <button
              type="button"
              className="btn"
              onClick={() => setStep(3)}
              disabled={!allChunksDone}
            >
              次へ:全文を読む →
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep(1)}
            >
              ← もう一回聞く
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card step-card">
          <p className="step-card__eyebrow">Step 3 / 5</p>
          <h3 className="step-card__title">今度は全文をつなげて読もう</h3>
          <p className="step-card__lead">
            つっかえても大丈夫。一文として声に出すのが目的です。
          </p>

          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleSpeakAll}
              disabled={!supported}
            >
              🔊 もう一度聞く
            </button>
            <button
              type="button"
              className={`btn${fullReadDone ? " btn--ghost" : ""}`}
              onClick={handleFullRead}
              aria-pressed={fullReadDone}
            >
              {fullReadDone ? "✓ 全文を読んだ" : "全文を読んだ"}
            </button>
          </div>

          <RecorderControls
            key={`rec-full-${phrase.id}`}
            scopeId={`rec-full-${phrase.id}`}
            phraseId={phrase.id}
            slot="full"
            title="全文音読を録音"
            hint="全文をつなげて読めたら録音してみよう。"
            afterRecordingHint="つっかえた場所があっても大丈夫。もう一回録ればOK。"
            onVoiceEnergyChange={handleFullScore}
          />

          <div className="btn-row">
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => setStep(4)}
              disabled={!fullReadDone}
            >
              次へ:暗唱モード →
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep(2)}
            >
              ← チャンクに戻る
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="card step-card">
          <p className="step-card__eyebrow">Step 4 / 5</p>
          <h3 className="step-card__title">英文を見ずに言ってみよう</h3>
          <p className="step-card__lead">
            忘れてもOK。必要ならチラッと見てもいいよ。
          </p>

          <div className="recite-card">
            <p className="recite-card__hint">日本語訳を見て、英文を思い出してみよう</p>
            <p className="recite-card__japanese">{phrase.japanese}</p>
            <div className="recite-card__chunks-hint" aria-hidden="true">
              {phrase.chunks.map((_, i) => (
                <span key={i} className="recite-dot" />
              ))}
              <span className="recite-card__chunks-label">
                ヒント:{phrase.chunks.length}つのかたまり
              </span>
            </div>

            {showEnglishInRecite ? (
              <p className="recite-card__english-peek">{phrase.english}</p>
            ) : (
              <p className="recite-card__hidden" aria-hidden="true">
                ・・・・・・
              </p>
            )}

            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setShowEnglishInRecite((v) => !v)}
              style={{ marginTop: 10 }}
            >
              {showEnglishInRecite ? "👁 英文を隠す" : "👁 英文をちらっと見る"}
            </button>
          </div>

          <RecorderControls
            key={`rec-recite-${phrase.id}`}
            scopeId={`rec-recite-${phrase.id}`}
            phraseId={phrase.id}
            slot="recite"
            title="暗唱を録音"
            hint="英文を見ずに言えたら録音して聞いてみよう。"
            afterRecordingHint="言えた部分だけでもOK。声に出したことが成果です。"
            onVoiceEnergyChange={handleReciteScore}
          />

          <div className="btn-row">
            {referenceAudio && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handlePlayReference}
                aria-label="お手本音声で答え合わせ"
              >
                🎵 お手本で答え合わせ
              </button>
            )}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleSpeakAll}
              disabled={!supported}
            >
              🔊 答え合わせに聞く{referenceAudio ? "(機械音声)" : ""}
            </button>
            <button
              type="button"
              className={`btn${reciteDone ? " btn--ghost" : " btn--accent"}`}
              onClick={handleReciteDone}
              aria-pressed={reciteDone}
            >
              {reciteDone ? "✓ 見ずに言えた!" : "見ずに言えた!"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleComplete}
              disabled={!reciteDone}
            >
              練習を完了する 🎉
            </button>
          </div>
        </section>
      )}

      {step === 5 && completion && (
        <>
          <CompletionSummary
            headline={completion.headline}
            cityMessage={completion.cityMessage}
            breakdown={completion.breakdown}
            totalXp={completion.totalXp}
            levelTransition={completion.levelTransition}
            recap={{
              chunkReadCount,
              chunkTotal: phrase.chunks.length,
              fullRead: fullReadDone,
              recited: reciteDone,
              missionComplete: completion.breakdown.some((b) => b.key === "missionComplete"),
            }}
            streakDays={completion.streakDays}
            totalVoiceEnergy={completion.totalVoiceEnergy}
          />
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => navigate("/city")}>
              街を見にいく 🌆
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate("/phrases")}
            >
              別のフレーズも練習する
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/")}
            >
              Homeに戻る
            </button>
          </div>
        </>
      )}
    </>
  );
}
