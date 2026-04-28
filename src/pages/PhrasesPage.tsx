import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPhrases, PHRASES } from "../data/phrases";
import { PhraseCard } from "../components/PhraseCard";
import {
  deleteCustomPhrase,
  isCustomPhrase,
  loadCustomPhrases,
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

type FilterId = PhraseCategory | "all" | "source-custom";

const CATEGORIES: { id: FilterId; label: string }[] = [
  { id: "all", label: "ぜんぶ" },
  { id: "source-custom", label: "自作のみ" },
  { id: "daily", label: "日常" },
  { id: "conversation", label: "会話" },
  { id: "feeling", label: "気持ち" },
  { id: "work", label: "仕事" },
  { id: "learning", label: "学び" },
  { id: "travel", label: "旅行" },
];

export function PhrasesPage({ progress }: PhrasesPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<FilterId>("all");
  const [version, setVersion] = useState(0);

  // 編集ページから戻ってきたら最新の自作フレーズを取り直す
  useEffect(() => {
    setVersion((v) => v + 1);
  }, [location.key]);

  const allPhrases = useMemo(() => getAllPhrases(), [version]);
  const customCount = useMemo(() => loadCustomPhrases().length, [version]);

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
    if (filter === "all") return allPhrases;
    if (filter === "source-custom") {
      return allPhrases.filter((p) => isCustomPhrase(p.id));
    }
    return allPhrases.filter((p) => p.category === filter);
  }, [filter, allPhrases]);

  const completed = useMemo(
    () => new Set(progress.completedPhraseIds),
    [progress.completedPhraseIds],
  );
  const completedCount = useMemo(
    () => allPhrases.filter((p) => completed.has(p.id)).length,
    [allPhrases, completed],
  );

  const handleClick = (phrase: Phrase) => {
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
          <button
            type="button"
            className="btn btn--accent btn--small"
            onClick={() => navigate("/phrases/new")}
            aria-label="自作フレーズを追加"
          >
            + 追加
          </button>
        </div>

        <p className="phrase-list-progress">
          練習済み {completedCount} / {allPhrases.length}
          <span className="phrase-list-progress__sub">
            {" "}
            (初期 {PHRASES.length} / 自作 {customCount})
          </span>
        </p>

        <div className="filter-row" role="tablist" aria-label="カテゴリ">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              className={`filter-chip${filter === c.id ? " is-active" : ""}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

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
            {filter === "source-custom"
              ? "まだ自作フレーズはありません。「+ 追加」から作ってみよう。"
              : "該当するフレーズがありません。"}
          </p>
        )}
      </section>
    </>
  );
}
