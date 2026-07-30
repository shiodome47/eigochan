import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhraseAudioRecorder } from "../components/PhraseAudioRecorder";
import {
  JA_DOMAINS,
  JA_DOMAIN_GROUPS,
  JA_SENTENCES,
  JA_TARGET_TOTAL,
  findJaDomain,
  jaSentenceCounts,
  type JaSentence,
} from "../data/jaCorpus";
import {
  JA_RATING_LABELS,
  JA_RATING_MARKS,
  buildJaCorpusExport,
  buildJaCorpusTsv,
  downloadText,
  jaPhraseId,
  loadJaReview,
  materializeJaSentence,
  materializeJaSentences,
  materializedJaSentenceIds,
  parseJaReviewImport,
  saveJaReview,
  setJaNote,
  summarizeJaReview,
  toggleJaRating,
  type JaRating,
  type JaReviewMap,
} from "../utils/jaCorpusReview";
import { isSpeechSupported, speakText } from "../utils/speech";
import { todayString } from "../utils/date";

type RatingFilter = "all" | "none" | JaRating | "keep" | "drop" | "note";
type ImpFilter = "all" | "must" | "often" | "sub";

const IMP_LABELS: Record<string, string> = {
  must: "必須",
  often: "よく使う",
  sub: "補助",
};

const RATING_FILTERS: { id: RatingFilter; label: string }[] = [
  { id: "all", label: "ぜんぶ" },
  { id: "none", label: "未評価" },
  { id: "keep", label: "◎○" },
  { id: "drop", label: "△×" },
  { id: "note", label: "メモあり" },
];

const IMP_FILTERS: { id: ImpFilter; label: string }[] = [
  { id: "all", label: "ぜんぶ" },
  { id: "must", label: "必須" },
  { id: "often", label: "よく使う" },
  { id: "sub", label: "補助" },
];

const PAGE_SIZE = 60;

const COUNTS = jaSentenceCounts();
const FIRST_SENTENCE = JA_SENTENCES[0];
const DEFAULT_DOMAIN = FIRST_SENTENCE ? FIRST_SENTENCE.domain : JA_DOMAINS[0].id;
const DEFAULT_GROUP = findJaDomain(DEFAULT_DOMAIN)?.group ?? JA_DOMAIN_GROUPS[0];

export function JaEnPage() {
  const [review, setReview] = useState<JaReviewMap>(() => loadJaReview());
  const [group, setGroup] = useState<string>(DEFAULT_GROUP);
  const [domainId, setDomainId] = useState<number>(DEFAULT_DOMAIN);
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [impFilter, setImpFilter] = useState<ImpFilter>("all");
  const [hideEnglish, setHideEnglish] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [materialized, setMaterialized] = useState<Set<string>>(() =>
    materializedJaSentenceIds(),
  );
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const trimmedQuery = query.trim();
  const searching = trimmedQuery.length > 0;

  const commitReview = useCallback((next: JaReviewMap) => {
    setReview(next);
    if (!saveJaReview(next)) {
      setMessage("⚠ この端末に保存できませんでした (容量オーバーかもしれません)");
    }
  }, []);

  const domainsOfGroup = useMemo(
    () => JA_DOMAINS.filter((d) => d.group === group),
    [group],
  );

  const list = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return JA_SENTENCES.filter((s) => {
      // 検索中は分野をまたいで探す。空なら選択中の分野だけ。
      if (!searching && s.domain !== domainId) return false;
      if (impFilter !== "all" && s.imp !== impFilter) return false;

      const entry = review[s.id];
      const rating = entry?.rating ?? "";
      switch (ratingFilter) {
        case "none":
          if (rating) return false;
          break;
        case "keep":
          if (rating !== "A" && rating !== "B") return false;
          break;
        case "drop":
          if (rating !== "C" && rating !== "D") return false;
          break;
        case "note":
          if (!entry?.note) return false;
          break;
        case "all":
          break;
        default:
          if (rating !== ratingFilter) return false;
      }

      if (q) {
        const hay = `${s.ja} ${s.en} ${s.chunks.join(" ")} ${s.scene} ${s.to}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [domainId, impFilter, ratingFilter, review, searching, trimmedQuery]);

  const shown = list.slice(0, limit);
  const overall = useMemo(() => summarizeJaReview(review), [review]);
  const domainInfo = findJaDomain(domainId);
  const domainCount = COUNTS.get(domainId) ?? 0;

  const resetPaging = useCallback(() => setLimit(PAGE_SIZE), []);

  const handleRating = useCallback(
    (sentence: JaSentence, rating: JaRating) => {
      commitReview(toggleJaRating(review, sentence, rating));
    },
    [commitReview, review],
  );

  const handleNote = useCallback(
    (sentence: JaSentence, note: string) => {
      if ((review[sentence.id]?.note ?? "") === note.trim()) return;
      commitReview(setJaNote(review, sentence, note));
    },
    [commitReview, review],
  );

  // 録音や練習ページで使うため、コーパスの文を自作フレーズとして実体化する。
  const ensurePhrase = useCallback((sentence: JaSentence): string | null => {
    const phraseId = materializeJaSentence(sentence);
    if (!phraseId) {
      setMessage("⚠ フレーズとして保存できませんでした");
      return null;
    }
    setMaterialized((prev) => {
      if (prev.has(sentence.id)) return prev;
      const next = new Set(prev);
      next.add(sentence.id);
      return next;
    });
    return phraseId;
  }, []);

  const handleBulkMaterialize = useCallback(() => {
    const keep = JA_SENTENCES.filter((s) => {
      const r = review[s.id]?.rating;
      return (r === "A" || r === "B") && s.en.length > 0;
    });
    if (keep.length === 0) {
      setMessage("◎ か ○ を付けた文がまだありません");
      return;
    }
    const result = materializeJaSentences(keep);
    if (!result.ok) {
      setMessage("⚠ 保存できませんでした (容量オーバーかもしれません)");
      return;
    }
    setMaterialized(materializedJaSentenceIds());
    setMessage(
      `◎○ の ${keep.length} 文をフレーズに取り込みました (新規 ${result.added} / 更新 ${result.replaced})`,
    );
  }, [review]);

  const handleExportJson = useCallback(() => {
    downloadText(
      `eigochan-ja-corpus-${todayString()}.json`,
      JSON.stringify(buildJaCorpusExport(review), null, 2),
      "application/json",
    );
    setMessage("評価つきの JSON を書き出しました");
  }, [review]);

  const handleExportTsv = useCallback(() => {
    downloadText(`eigochan-ja-corpus-${todayString()}.tsv`, buildJaCorpusTsv(review), "text/tab-separated-values");
    setMessage("表計算に貼れる TSV を書き出しました");
  }, [review]);

  const handleImport = useCallback(
    async (file: File) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(await file.text());
      } catch {
        setMessage("⚠ JSON として読めませんでした");
        return;
      }
      const result = parseJaReviewImport(parsed);
      if (!result.ok) {
        setMessage(`⚠ ${result.error ?? "読み込めませんでした"}`);
        return;
      }
      commitReview({ ...review, ...result.map });
      setMessage(
        `${result.applied} 件の評価を読み込みました` +
          (result.unknown > 0 ? ` (見つからない文 ${result.unknown} 件は無視)` : ""),
      );
    },
    [commitReview, review],
  );

  return (
    <div className="jaen">
      <section className="card">
        <h2 className="card__title">日→英モード</h2>
        <p className="jaen__lead">
          自分が実際に言いそうな日本語を並べて、英語に置き換える練習をするモードです。
          日本語を見て英語を言い、答え合わせをして、自分の声を録音できます。
        </p>
        <div className="jaen-stats">
          <div className="jaen-stat">
            <b>
              {JA_SENTENCES.length} <span>/ {JA_TARGET_TOTAL}</span>
            </b>
            <span>作成ずみ / 目標</span>
            <div className="jaen-bar">
              <i style={{ width: `${Math.min(100, (JA_SENTENCES.length / JA_TARGET_TOTAL) * 100)}%` }} />
            </div>
          </div>
          <div className="jaen-stat">
            <b>{overall.rated}</b>
            <span>評価ずみ</span>
            <div className="jaen-bar">
              <i
                style={{
                  width: `${overall.total ? Math.min(100, (overall.rated / overall.total) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="jaen-stat">
            <b>{overall.keep}</b>
            <span>◎○ 採用候補</span>
          </div>
          <div className="jaen-stat">
            <b>{overall.drop}</b>
            <span>△× 要見直し</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="card__heading">分野を選ぶ</h3>
        <div className="filter-row">
          {JA_DOMAIN_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              className={`filter-chip${g === group ? " is-active" : ""}`}
              onClick={() => {
                setGroup(g);
                const first = JA_DOMAINS.find((d) => d.group === g);
                if (first) setDomainId(first.id);
                resetPaging();
              }}
            >
              {g}
            </button>
          ))}
        </div>
        <select
          className="jaen-select"
          value={domainId}
          onChange={(e) => {
            setDomainId(Number(e.target.value));
            resetPaging();
          }}
        >
          {domainsOfGroup.map((d) => {
            const n = COUNTS.get(d.id) ?? 0;
            return (
              <option key={d.id} value={d.id}>
                {String(d.id).padStart(2, "0")}. {d.title}({n > 0 ? `${n}/${d.target} 文` : "未作成"})
              </option>
            );
          })}
        </select>
        {domainCount === 0 && !searching && (
          <p className="jaen-empty">
            この分野の日本語はまだ作っていません。
            作成ずみの分野は
            {JA_DOMAINS.filter((d) => (COUNTS.get(d.id) ?? 0) > 0)
              .map((d) => ` ${String(d.id).padStart(2, "0")}. ${d.title}`)
              .join(" /")}
            です。
          </p>
        )}
      </section>

      <section className="card">
        <h3 className="card__heading">絞り込み</h3>
        <input
          type="search"
          className="jaen-search"
          value={query}
          placeholder="日本語・英語・チャンクを検索 (全分野)"
          onChange={(e) => {
            setQuery(e.target.value);
            resetPaging();
          }}
        />
        <div className="filter-row">
          {RATING_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip${ratingFilter === f.id ? " is-active" : ""}`}
              onClick={() => {
                setRatingFilter(f.id);
                resetPaging();
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="filter-row">
          {IMP_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip${impFilter === f.id ? " is-active" : ""}`}
              onClick={() => {
                setImpFilter(f.id);
                resetPaging();
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="jaen-toggle">
          <input
            type="checkbox"
            checked={hideEnglish}
            onChange={(e) => setHideEnglish(e.target.checked)}
          />
          英語を隠す (日本語を見て自分で言ってから答え合わせ)
        </label>
      </section>

      <p className="jaen-count">
        {searching ? "検索結果 " : `${domainInfo?.title ?? ""} `}
        {list.length} 文
        {list.length > shown.length ? ` (${shown.length} 文を表示中)` : ""}
      </p>

      {message && (
        <p className="jaen-message" role="status">
          {message}
        </p>
      )}

      <div className="jaen-list">
        {shown.map((sentence) => (
          <JaSentenceCard
            key={sentence.id}
            sentence={sentence}
            rating={review[sentence.id]?.rating ?? ""}
            note={review[sentence.id]?.note ?? ""}
            storedJa={review[sentence.id]?.ja ?? ""}
            hideEnglish={hideEnglish}
            hasPhrase={materialized.has(sentence.id)}
            onRate={handleRating}
            onNote={handleNote}
            onEnsurePhrase={ensurePhrase}
          />
        ))}
        {shown.length === 0 && (
          <p className="jaen-empty">条件に合う文がありません。絞り込みを変えてみてください。</p>
        )}
      </div>

      {list.length > shown.length && (
        <button
          type="button"
          className="btn btn--secondary jaen-more"
          onClick={() => setLimit((n) => n + PAGE_SIZE)}
        >
          さらに {Math.min(PAGE_SIZE, list.length - shown.length)} 文を表示 (残り{" "}
          {list.length - shown.length} 文)
        </button>
      )}

      <section className="card">
        <h3 className="card__heading">まとめて扱う</h3>
        <p className="jaen__lead">
          ◎ ○ を付けた文は、いつものフレーズとして取り込めます。取り込むと Practice
          タブの音読・暗唱・録音がそのまま使えます (同じ文を何度取り込んでも増えません)。
        </p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleBulkMaterialize}>
            ◎○ をフレーズに取り込む
          </button>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn--secondary btn--small" onClick={handleExportJson}>
            評価つき JSON を書き出す
          </button>
          <button type="button" className="btn btn--secondary btn--small" onClick={handleExportTsv}>
            TSV を書き出す
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => fileRef.current?.click()}
          >
            評価を読み込む
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleImport(file);
          }}
        />
        <p className="jaen-note">
          評価とメモはこの端末だけに保存されます (同期には乗りません)。
          別の端末で続けるときは、書き出した JSON をそちらで読み込んでください。
        </p>
      </section>
    </div>
  );
}

interface CardProps {
  sentence: JaSentence;
  rating: JaRating | "";
  note: string;
  storedJa: string;
  hideEnglish: boolean;
  hasPhrase: boolean;
  onRate: (sentence: JaSentence, rating: JaRating) => void;
  onNote: (sentence: JaSentence, note: string) => void;
  onEnsurePhrase: (sentence: JaSentence) => string | null;
}

function JaSentenceCard({
  sentence,
  rating,
  note,
  storedJa,
  hideEnglish,
  hasPhrase,
  onRate,
  onNote,
  onEnsurePhrase,
}: CardProps) {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const speechOk = isSpeechSupported();
  const showEnglish = !hideEnglish || revealed;
  const drifted = storedJa.length > 0 && storedJa !== sentence.ja;
  const phraseId = jaPhraseId(sentence.id);

  const openRecorder = () => {
    if (onEnsurePhrase(sentence)) setRecorderOpen(true);
  };

  return (
    <article className={`jaen-card${rating ? ` is-${rating}` : ""}`}>
      <div className="jaen-card__head">
        <span className="jaen-card__id">{sentence.id}</span>
        {sentence.scene && <span className="jaen-card__tag">場面: {sentence.scene}</span>}
        {sentence.to && <span className="jaen-card__tag">相手: {sentence.to}</span>}
        <span className={`jaen-card__tag is-${sentence.imp}`}>{IMP_LABELS[sentence.imp]}</span>
        {hasPhrase && <span className="jaen-card__tag is-linked">フレーズ化ずみ</span>}
      </div>

      <p className="jaen-card__ja">{sentence.ja}</p>

      {showEnglish ? (
        <>
          <p className="jaen-card__en">
            {sentence.en || <span className="jaen-card__warn">英語 未入力</span>}
            {sentence.en && speechOk && (
              <button
                type="button"
                className="jaen-card__speak"
                onClick={() => void speakText(sentence.en, { rate: 0.95 })}
                aria-label="英語を読み上げる"
              >
                🔊
              </button>
            )}
          </p>
          {sentence.chunks.length > 0 && (
            <div className="jaen-card__chunks">
              {sentence.chunks.map((chunk, i) => (
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
        </>
      ) : (
        <button type="button" className="jaen-card__reveal" onClick={() => setRevealed(true)}>
          英語を見る
        </button>
      )}

      {drifted && (
        <p className="jaen-card__warn">
          ⚠ この文の日本語は評価したときから変わっています (評価: 「{storedJa}」)
        </p>
      )}

      <div className="jaen-card__rate">
        {(["A", "B", "C", "D"] as JaRating[]).map((r) => (
          <button
            key={r}
            type="button"
            className={`jaen-rate${rating === r ? ` is-on is-${r}` : ""}`}
            title={JA_RATING_LABELS[r]}
            aria-label={JA_RATING_LABELS[r]}
            onClick={() => onRate(sentence, r)}
          >
            {JA_RATING_MARKS[r]}
          </button>
        ))}
        <button
          type="button"
          className={`jaen-mini${note ? " has" : ""}`}
          onClick={() => setNoteOpen((v) => !v)}
        >
          {note ? "📝 メモ" : "＋ メモ"}
        </button>
        <button
          type="button"
          className={`jaen-mini${recorderOpen ? " has" : ""}`}
          onClick={() => (recorderOpen ? setRecorderOpen(false) : openRecorder())}
        >
          🎙 録音
        </button>
      </div>

      {(noteOpen || note) && (
        <textarea
          className="jaen-card__note"
          value={noteDraft}
          placeholder="言い回しの違和感・言い換え案をメモ"
          onChange={(e) => setNoteDraft(e.target.value)}
          onBlur={() => onNote(sentence, noteDraft)}
        />
      )}

      {recorderOpen && (
        <div className="jaen-card__recorder">
          <PhraseAudioRecorder
            key={`jaen-prc-${phraseId}`}
            phraseId={phraseId}
            slot="practice"
            title="自分の声"
            description="日本語を見て英語で言ってみて、録音して聞き返せます。"
          />
          <PhraseAudioRecorder
            key={`jaen-ref-${phraseId}`}
            phraseId={phraseId}
            slot="reference"
            title="お手本音声"
            description="まねしたいお手本があれば、ここに録音・取り込みできます。"
          />
          {sentence.en && (
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => {
                if (onEnsurePhrase(sentence)) navigate(`/practice/${phraseId}`);
              }}
            >
              Practice タブで音読・暗唱する →
            </button>
          )}
        </div>
      )}
    </article>
  );
}
