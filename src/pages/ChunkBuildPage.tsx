import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VoicePicker } from "../components/VoicePicker";
import {
  COMBINATION_COUNT,
  chunkHints,
  chunkLine,
  drawChunks,
  type ChunkSet,
} from "../data/chunkBuilder";
import {
  countBuilt,
  loadChunkPractice,
  saveChunkPractice,
  type ChunkPracticeState,
} from "../utils/chunkPractice";
import { isSpeechSupported, speakText } from "../utils/speech";

/**
 * 組み合わせ練習。
 *
 * 言い出し × 動詞 × 補足 を 1 つずつ引いて、その 3 つで文を作る。
 * **正解の英文は出さない。** 組み合わせ次第でいくらでも作れるので、
 * 出せるのは部品だけで、文にするのは自分。
 * だから SRS にも XP にも乗せず、組み立てた回数だけ数える。
 */
export function ChunkBuildPage() {
  const [set, setSet] = useState<ChunkSet>(() => drawChunks());
  const [showJa, setShowJa] = useState(true);
  const [record, setRecord] = useState<ChunkPracticeState>(() => loadChunkPractice());
  const speechOk = isSpeechSupported();

  const commit = useCallback((next: ChunkPracticeState) => {
    setRecord(next);
    saveChunkPractice(next);
  }, []);

  // 日付が変わったら「今日」の数を数え直す。
  useEffect(() => {
    const handler = () => setRecord(loadChunkPractice());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const next = (built: boolean) => {
    if (built) commit(countBuilt(record));
    setSet((prev) => drawChunks(prev));
  };

  // 画面に出す形は空所つき。読み上げは空所を読ませたくないので素の並びを渡す。
  const line = chunkLine(set);
  const spoken = `${set.opener.en} ${set.verb.en} ${set.extra.en}`;
  const hints = chunkHints(set);

  return (
    <div className="jaen">
      <section className="card">
        <h2 className="card__title">組み合わせ練習</h2>
        <p className="jaen__lead">
          3 つの部品で文を作ってください。<b>正解はありません。</b>
          意味が通る形に整えて、声に出せたら次へ。
        </p>

        <div className="chunk-build">
          <div className="chunk-build__slot is-opener">
            <span className="chunk-build__role">言い出し</span>
            <span className="chunk-build__en">{set.opener.en}</span>
            {showJa && <span className="chunk-build__ja">{set.opener.ja}</span>}
          </div>
          <div className="chunk-build__slot is-verb">
            <span className="chunk-build__role">動詞</span>
            <span className="chunk-build__en">{set.verb.en}</span>
            {showJa && <span className="chunk-build__ja">{set.verb.ja}</span>}
          </div>
          <div className="chunk-build__slot is-extra">
            <span className="chunk-build__role">補足</span>
            <span className="chunk-build__en">{set.extra.en}</span>
            {showJa && <span className="chunk-build__ja">{set.extra.ja}</span>}
          </div>
        </div>

        <p className="chunk-build__hint">
          並べただけだと「{line}」。ここから <b>語順や形を整えて</b>、足りない語を足して、
          言える文にしてください。使いにくい組み合わせなら 🔀 で引き直して構いません。
        </p>

        {hints.length > 0 && (
          <ul className="chunk-build__notes">
            {hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        <div className="btn-row">
          <button type="button" className="btn" onClick={() => next(true)}>
            言えた! 次の 3 つへ →
          </button>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => next(false)}>
            🔀 引き直す (数えない)
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => setShowJa((v) => !v)}
          >
            {showJa ? "日本語を隠す" : "日本語を出す"}
          </button>
          {speechOk && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => void speakText(spoken, { rate: 0.9 })}
              aria-label="3 つの部品を読み上げる"
            >
              🔊 部品を聞く
            </button>
          )}
        </div>

        <div className="jaen-stats">
          <div className="jaen-stat">
            <b>{record.today}</b>
            <span>今日つくった文</span>
          </div>
          <div className="jaen-stat">
            <b>{record.total}</b>
            <span>これまでの合計</span>
          </div>
          <div className="jaen-stat">
            <b>{COMBINATION_COUNT.toLocaleString()}</b>
            <span>作れる組み合わせ</span>
          </div>
        </div>

        <VoicePicker />
      </section>

      <section className="card">
        <h3 className="card__heading">この練習について</h3>
        <p className="jaen-note">
          「今日の練習」が <b>決まった文を思い出す</b> 練習なのに対して、
          こちらは <b>部品から自分で組み立てる</b> 練習です。頭の使い方が違うので、
          回数だけ数えて、レベルや街には影響しません。
        </p>
        <div className="btn-row">
          <Link to="/ja-en/today" className="btn btn--secondary btn--small">
            今日の練習に戻る
          </Link>
          <Link to="/ja-en" className="btn btn--ghost btn--small">
            コーパス一覧へ
          </Link>
        </div>
      </section>
    </div>
  );
}
