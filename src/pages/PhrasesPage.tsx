import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPhrases } from "../data/phrases";
import { PhraseCard } from "../components/PhraseCard";
import {
  deleteCustomPhrase,
  effectiveSource,
  isCustomPhrase,
} from "../utils/customPhrases";
import {
  listAllPhraseAudio,
  type PhraseAudioSlot,
} from "../utils/phraseAudioStorage";
import {
  enqueueAudioDelete,
  enqueueSnapshotPush,
} from "../utils/autoSync";
import type { Phrase, PhraseCategory, UserProgress } from "../types";

interface PhrasesPageProps {
  progress: UserProgress;
}

// 出典軸: ぜんぶ / 初期 / 自作 / DUO 3.0 / ひとりごと
type SourceFilter = "all" | "initial" | "original" | "duo3" | "monologue";
// コンテキスト軸: カテゴリ (初期/自作/ぜんぶ 用)
type CategoryFilter = PhraseCategory | "all";
// コンテキスト軸: DUO Section (DUO 3.0 用)
type SectionFilter = number | "all";

const SOURCE_FILTERS: { id: SourceFilter; label: string }[] = [
  { id: "all", label: "ぜんぶ" },
  { id: "initial", label: "初期" },
  { id: "original", label: "自作" },
  { id: "duo3", label: "DUO 3.0" },
  { id: "monologue", label: "ひとりごと" },
];

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "ぜんぶ" },
  { id: "daily", label: "日常" },
  { id: "conversation", label: "会話" },
  { id: "feeling", label: "気持ち" },
  { id: "work", label: "仕事" },
  { id: "learning", label: "学び" },
  { id: "travel", label: "旅行" },
];

// DUO 3.0 は Section 1〜45。
const DUO_SECTION_MAX = 45;

export function PhrasesPage({ progress }: PhrasesPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [version, setVersion] = useState(0);

  // 編集ページから戻ってきたら最新の自作フレーズを取り直す
  useEffect(() => {
    setVersion((v) => v + 1);
  }, [location.key]);

  const allPhrases = useMemo(() => getAllPhrases(), [version]);
  const sourceCounts = useMemo(() => {
    const c = { initial: 0, original: 0, duo3: 0, monologue: 0 };
    for (const p of allPhrases) {
      const s = effectiveSource(p);
      c[s] += 1;
    }
    return c;
  }, [allPhrases]);

  // 自作フレーズの音声メモ存在マップ。{ phraseId: Set<slot> }
  const [audioMap, setAudioMap] = useState<Map<string, Set<PhraseAudioSlot>>>(
    () => new Map(),
  );
  useEffect(() => {
    let active = true;
    void listAllPhraseAudio()
      .then((audios) => {
        if (!active) return;
        const m = new Map<string, Set<PhraseAudioSlot>>();
        for (const a of audios) {
          const set = m.get(a.phraseId) ?? new Set<PhraseAudioSlot>();
          set.add(a.slot);
          m.set(a.phraseId, set);
        }
        setAudioMap(m);
      })
      .catch(() => {
        // IDB が使えない端末ではバッジを出さないだけ
      });
    return () => {
      active = false;
    };
  }, [version]);

  const list = useMemo(() => {
    return allPhrases.filter((p) => {
      // 1. 出典軸
      if (sourceFilter !== "all" && effectiveSource(p) !== sourceFilter) {
        return false;
      }
      // 2. コンテキスト軸 (出典で意味が変わる)
      if (sourceFilter === "duo3") {
        if (sectionFilter !== "all" && p.sourceSection !== sectionFilter) {
          return false;
        }
      } else {
        if (categoryFilter !== "all" && p.category !== categoryFilter) {
          return false;
        }
      }
      return true;
    });
  }, [sourceFilter, categoryFilter, sectionFilter, allPhrases]);

  const completed = useMemo(
    () => new Set(progress.completedPhraseIds),
    [progress.completedPhraseIds],
  );
  const completedCount = useMemo(
    () => allPhrases.filter((p) => completed.has(p.id)).length,
    [allPhrases, completed],
  );

  const handleClick = (phrase: Phrase) => {
    // ひとりごとで英語が未入力なら、練習ではなく編集画面へ誘導する。
    // (PracticePage 側でもガードはあるが、最初から正しい導線に乗せる。)
    if (phrase.english.trim().length === 0) {
      navigate(`/phrases/edit/${phrase.id}`);
      return;
    }
    navigate(`/practice/${phrase.id}`);
  };

  const handleEdit = (phrase: Phrase) => {
    navigate(`/phrases/edit/${phrase.id}`);
  };

  const handleDelete = (phrase: Phrase) => {
    if (!window.confirm(`「${phrase.english}」を削除しますか？(取り消せません)`)) return;
    deleteCustomPhrase(phrase.id);
    // 同期側にも反映を予約(両 slot 分の音声 + 全件スナップショット)
    enqueueAudioDelete(phrase.id, "reference");
    enqueueAudioDelete(phrase.id, "practice");
    enqueueSnapshotPush();
    setVersion((v) => v + 1);
  };

  return (
    <>
      <section className="card">
        <div className="phrases-header">
          <div>
            <h2 className="card__title">フレーズ一覧</h2>
            <p className="card__heading">気になるフレーズで、声に出してみよう</p>
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--accent btn--small"
              onClick={() => navigate("/phrases/new")}
              aria-label="自作フレーズを追加"
            >
              + フレーズを追加
            </button>
            <button
              type="button"
              className="btn btn--small"
              onClick={() => navigate("/phrases/new?source=monologue")}
              aria-label="ひとりごと英語を追加(日本語だけでもOK)"
              title="頭に浮かんだ日本語をまず保存。英語はあとで入れられます。"
            >
              💭 ひとりごとを追加
            </button>
          </div>
        </div>

        <p className="phrase-list-progress">
          練習済み {completedCount} / {allPhrases.length}
          <span className="phrase-list-progress__sub">
            {" "}
            (初期 {sourceCounts.initial} / 自作 {sourceCounts.original}
            {sourceCounts.duo3 > 0 ? ` / DUO ${sourceCounts.duo3}` : ""}
            {sourceCounts.monologue > 0
              ? ` / ひとりごと ${sourceCounts.monologue}`
              : ""}
            )
          </span>
        </p>

        {/* 1段目: 出典軸 */}
        <div className="filter-row" role="tablist" aria-label="出典">
          {SOURCE_FILTERS.map((c) => (
            <button
              type="button"
              key={c.id}
              role="tab"
              aria-selected={sourceFilter === c.id}
              className={`filter-chip${sourceFilter === c.id ? " is-active" : ""}`}
              onClick={() => setSourceFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 2段目: コンテキスト軸 (出典で内容が変わる) */}
        {sourceFilter === "duo3" ? (
          <div className="filter-row" aria-label="DUO セクション">
            <label className="form-field" style={{ flex: 1, marginBottom: 12 }}>
              <span className="form-field__label">Section</span>
              <select
                className="form-input"
                value={sectionFilter === "all" ? "all" : String(sectionFilter)}
                onChange={(e) => {
                  const v = e.target.value;
                  setSectionFilter(v === "all" ? "all" : Number(v));
                }}
              >
                <option value="all">ぜんぶ</option>
                {Array.from({ length: DUO_SECTION_MAX }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      Section {n}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        ) : (
          <div className="filter-row" role="tablist" aria-label="カテゴリ">
            {CATEGORY_FILTERS.map((c) => (
              <button
                type="button"
                key={c.id}
                role="tab"
                aria-selected={categoryFilter === c.id}
                className={`filter-chip${categoryFilter === c.id ? " is-active" : ""}`}
                onClick={() => setCategoryFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="phrase-list">
          {list.map((p) => {
            const slots = audioMap.get(p.id);
            return (
              <PhraseCard
                key={p.id}
                phrase={p}
                done={completed.has(p.id)}
                hasReferenceAudio={slots?.has("reference")}
                hasPracticeAudio={slots?.has("practice")}
                onClick={handleClick}
                onEdit={isCustomPhrase(p.id) ? handleEdit : undefined}
                onDelete={isCustomPhrase(p.id) ? handleDelete : undefined}
              />
            );
          })}
        </div>
        {list.length === 0 && (
          <p className="empty">
            {sourceFilter === "original"
              ? "まだ自作フレーズはありません。「+ フレーズを追加」から作ってみよう。"
              : sourceFilter === "duo3"
                ? "DUO 3.0 のフレーズはまだ取り込まれていません。"
                : sourceFilter === "monologue"
                  ? "まだひとりごとはありません。「💭 ひとりごとを追加」から、頭に浮かんだ日本語を保存してみよう。"
                  : "該当するフレーズがありません。"}
          </p>
        )}
      </section>
    </>
  );
}
