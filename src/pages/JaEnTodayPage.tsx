import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PhraseAudioRecorder } from "../components/PhraseAudioRecorder";
import { findJaDomain, type JaSentence } from "../data/jaCorpus";
import {
  BIG_PLAN_SIZE,
  DAILY_PLAN_SIZE,
  EXTRA_PLAN_SIZE,
  buildDailyPlan,
} from "../utils/dailyPlan";
import { analyzeAudioBlob, isAudioAnalysisSupported } from "../utils/audioAnalysis";
import { loadPhraseAudio } from "../utils/phraseAudioStorage";
import { jaPhraseId, materializeJaSentence } from "../utils/jaCorpusReview";
import { applyPractice } from "../utils/progress";
import {
  loadSrs,
  saveSrs,
  schedule,
  summarizeSrs,
  sumXp,
  xpForGrade,
  type JaGrade,
  type SrsMap,
} from "../utils/srs";
import { isSpeechSupported, speakText } from "../utils/speech";
import { todayString } from "../utils/date";
import type { UserProgress } from "../types";

interface Props {
  progress: UserProgress;
  onCommit: (next: UserProgress) => void;
}

const GRADES: { id: JaGrade; mark: string; label: string; hint: string }[] = [
  { id: "again", mark: "✕", label: "言えなかった", hint: "また今日出ます" },
  { id: "ok", mark: "○", label: "言えた", hint: "少し先にまた出ます" },
  { id: "easy", mark: "◎", label: "すぐ言えた", hint: "ずっと先に出ます" },
];

/** 録音に声が入っていると認められる最低ライン。音量を競わせないための足切り。 */
const VOICE_BONUS_MIN_SCORE = 20;
/** 「ちゃんと声に出した」ボーナス。1 文につき 1 回だけ。 */
const VOICE_BONUS_XP = 3;

interface Answered {
  sentence: JaSentence;
  grade: JaGrade;
  xp: number;
}

export function JaEnTodayPage({ progress, onCommit }: Props) {
  const today = todayString();
  const [srs, setSrs] = useState<SrsMap>(() => loadSrs());
  // 出題は開いた時点で固定する (答えるたびに並びが変わらないように)。
  // 足りなければ画面のボタンで足す。
  const [plan, setPlan] = useState(() => buildDailyPlan(loadSrs(), today));
  const [items, setItems] = useState<JaSentence[]>(() => plan.items);
  const [voiceBonusIds, setVoiceBonusIds] = useState<Set<string>>(() => new Set());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // まだ progress に反映していない XP。離脱時にも取りこぼさない。
  const pendingRef = useRef({ xp: 0, said: 0, easy: 0 });
  const commitRef = useRef(onCommit);
  const progressRef = useRef(progress);
  commitRef.current = onCommit;
  progressRef.current = progress;

  const flush = useCallback(() => {
    const { xp, said, easy } = pendingRef.current;
    if (xp <= 0 && said <= 0) return;
    pendingRef.current = { xp: 0, said: 0, easy: 0 };
    commitRef.current(
      applyPractice(progressRef.current, {
        phraseId: `jaen_today_${today}`,
        readCount: said,
        reciteCount: easy,
        xpEarned: xp,
      }),
    );
  }, [today]);

  // 途中で離れても、そこまでの XP は残す。
  useEffect(() => flush, [flush]);

  const current: JaSentence | undefined = items[index];
  const domain = current ? findJaDomain(current.domain) : undefined;
  const speechOk = isSpeechSupported();
  const done = index >= items.length;
  const sessionXp =
    answered.reduce((sum, a) => sum + a.xp, 0) + voiceBonusIds.size * VOICE_BONUS_XP;

  const summary = useMemo(() => summarizeSrs(srs, today), [srs, today]);

  const grade = useCallback(
    (g: JaGrade) => {
      if (!current) return;
      const prev = srs[current.id];
      const gained = sumXp(xpForGrade(prev, g));
      const nextCard = schedule(prev, current.id, g, today);
      const nextSrs = { ...srs, [current.id]: nextCard };
      setSrs(nextSrs);
      if (!saveSrs(nextSrs)) {
        setMessage("⚠ この端末に保存できませんでした");
      }

      pendingRef.current.xp += gained;
      if (g !== "again") pendingRef.current.said += 1;
      if (g === "easy") pendingRef.current.easy += 1;

      setAnswered((prevList) => [...prevList, { sentence: current, grade: g, xp: gained }]);
      setRevealed(false);
      setRecorderOpen(false);
      setIndex((i) => i + 1);
    },
    [current, srs, today],
  );

  // 全問終わったら progress に反映する。
  useEffect(() => {
    if (done) flush();
  }, [done, flush]);

  // 「もう少しやる」。すでに ○ ◎ を付けた文と、まだ出していない文は除いて足す。
  const extend = useCallback(
    (count: number) => {
      const settled = new Set<string>();
      answered.forEach((a) => {
        if (a.grade !== "again") settled.add(a.sentence.id);
      });
      items.slice(index).forEach((s) => settled.add(s.id));
      const more = buildDailyPlan(srs, today, count, settled);
      if (more.items.length === 0) {
        setMessage("これ以上出せる文がありません");
        return;
      }
      setPlan(more);
      setItems((prev) => [...prev, ...more.items]);
    },
    [answered, index, items, srs, today],
  );

  // 録音に声が入っていたら 1 文につき 1 回だけボーナス。
  // 音量を競わせないよう、閾値を超えたかどうかだけを見る。
  const checkVoice = useCallback(async () => {
    if (!current || voiceBonusIds.has(current.id)) return;
    if (!isAudioAnalysisSupported()) return;
    try {
      const saved = await loadPhraseAudio(jaPhraseId(current.id), "practice");
      if (!saved) return;
      const result = await analyzeAudioBlob(saved.blob);
      if (result.voiceEnergyScore < VOICE_BONUS_MIN_SCORE) return;
      pendingRef.current.xp += VOICE_BONUS_XP;
      setVoiceBonusIds((prev) => new Set(prev).add(current.id));
      setMessage(`🎙 声に出せました +${VOICE_BONUS_XP} XP`);
    } catch {
      // 解析できない環境では何もしない (ボーナスが無いだけ)。
    }
  }, [current, voiceBonusIds]);

  const openRecorder = () => {
    if (!current) return;
    if (materializeJaSentence(current)) setRecorderOpen(true);
    else setMessage("⚠ 録音用にフレーズを保存できませんでした");
  };

  if (items.length === 0) {
    return (
      <div className="jaen">
        <section className="card">
          <h2 className="card__title">今日の練習</h2>
          <p className="jaen__lead">
            今日ぶんの文がありません。コーパスの文がすべて先の日付に予約されています。
          </p>
          <div className="btn-row">
            <Link to="/ja-en" className="btn btn--secondary">
              日→英モードに戻る
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (done) {
    const again = answered.filter((a) => a.grade === "again").length;
    return (
      <div className="jaen">
        <section className="card">
          <h2 className="card__title">今日の {answered.length} 文、終わりました</h2>
          <div className="jaen-stats">
            <div className="jaen-stat">
              <b>+{sessionXp}</b>
              <span>獲得 XP</span>
            </div>
            <div className="jaen-stat">
              <b>{answered.length - again}</b>
              <span>言えた文</span>
            </div>
            <div className="jaen-stat">
              <b>{again}</b>
              <span>また出る文</span>
            </div>
            <div className="jaen-stat">
              <b>{summary.seen}</b>
              <span>これまでに触れた文</span>
            </div>
          </div>
          <p className="jaen-note">
            「言えなかった」文は今日のうちにもう一度出ます。
            「すぐ言えた」文は間隔が伸びて、しばらく先に出ます。
          </p>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => extend(EXTRA_PLAN_SIZE)}>
              もう {EXTRA_PLAN_SIZE} 文やる
            </button>
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => extend(BIG_PLAN_SIZE)}
            >
              まとめて {BIG_PLAN_SIZE} 文やる
            </button>
            <Link to="/city" className="btn btn--ghost btn--small">
              街を見る
            </Link>
          </div>
          <p className="jaen-note">
            今日のぶんは終わりです。ここでやめても大丈夫。気が向いたら足してください。
          </p>
        </section>

        <section className="card">
          <h3 className="card__heading">この回の内訳</h3>
          <ul className="jaen-review-list">
            {answered.map((a, i) => (
              <li key={`${a.sentence.id}-${i}`} className={`jaen-review-row is-${a.grade}`}>
                <span className="jaen-review-mark">
                  {GRADES.find((g) => g.id === a.grade)?.mark}
                </span>
                <span className="jaen-review-ja">{a.sentence.ja}</span>
                <span className="jaen-review-xp">{a.xp > 0 ? `+${a.xp}` : "—"}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const prevCard = current ? srs[current.id] : undefined;
  const isReview = Boolean(prevCard);

  return (
    <div className="jaen">
      <section className="card">
        <div className="jaen-today__head">
          <span className="jaen-today__count">
            {index + 1} / {items.length}
          </span>
          <span className="jaen-today__xp">+{sessionXp} XP</span>
        </div>
        <div className="jaen-today__bar">
          <i style={{ width: `${(index / items.length) * 100}%` }} />
        </div>
        <p className="jaen-today__meta">
          {isReview ? `復習 ・ 前回から ${prevCard?.interval ?? 0} 日` : "はじめての文"}
          {domain ? ` ・ ${domain.title}` : ""}
        </p>

        <p className="jaen-today__ja">{current?.ja}</p>

        {!revealed ? (
          <>
            <p className="jaen-today__prompt">声に出して英語で言ってみてください。</p>
            <button type="button" className="btn" onClick={() => setRevealed(true)}>
              英語を見る
            </button>
          </>
        ) : (
          <>
            <p className="jaen-today__en">
              {current?.en}
              {speechOk && current && (
                <button
                  type="button"
                  className="jaen-card__speak"
                  onClick={() => void speakText(current.en, { rate: 0.95 })}
                  aria-label="英語を読み上げる"
                >
                  🔊
                </button>
              )}
            </p>
            {current && current.chunks.length > 0 && (
              <div className="jaen-card__chunks">
                {current.chunks.map((chunk, i) => (
                  <button
                    key={`${chunk}-${i}`}
                    type="button"
                    className="jaen-card__chunk"
                    onClick={() => speechOk && void speakText(chunk, { rate: 0.9 })}
                  >
                    {chunk}
                  </button>
                ))}
              </div>
            )}

            <div className="jaen-grade">
              {GRADES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`jaen-grade__btn is-${g.id}`}
                  onClick={() => grade(g.id)}
                >
                  <span className="jaen-grade__mark">{g.mark}</span>
                  <span className="jaen-grade__label">{g.label}</span>
                  <span className="jaen-grade__hint">{g.hint}</span>
                </button>
              ))}
            </div>

            <div className="btn-row">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => (recorderOpen ? setRecorderOpen(false) : openRecorder())}
              >
                🎙 声を録っておく
              </button>
            </div>
            {recorderOpen && current && (
              <div className="jaen-card__recorder">
                <PhraseAudioRecorder
                  key={`jaen-today-${current.id}`}
                  phraseId={jaPhraseId(current.id)}
                  slot="practice"
                  title="自分の声"
                  description="今の言い方を録って、あとで聞き返せます。声が入っていればボーナス XP。"
                  onChange={() => void checkVoice()}
                />
              </div>
            )}
          </>
        )}

        {message && (
          <p className="jaen-message" role="status">
            {message}
          </p>
        )}
      </section>

      <p className="jaen-note">
        今日の出題: 復習 {plan.reviewCount} 文 ・ 新規 {plan.newCount} 文
        {plan.dueTotal > plan.reviewCount
          ? ` (期日が来ている文は全部で ${plan.dueTotal} 文)`
          : ""}
      </p>
    </div>
  );
}

export { DAILY_PLAN_SIZE };
