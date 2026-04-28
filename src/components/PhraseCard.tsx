import type { Phrase } from "../types";
import { isCustomPhrase } from "../utils/customPhrases";

interface PhraseCardProps {
  phrase: Phrase;
  done?: boolean;
  hasReferenceAudio?: boolean;
  hasPracticeAudio?: boolean;
  onClick?: (phrase: Phrase) => void;
  onEdit?: (phrase: Phrase) => void;
  onDelete?: (phrase: Phrase) => void;
}

const LEVEL_LABEL: Record<Phrase["level"], string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export function PhraseCard({
  phrase,
  done,
  hasReferenceAudio,
  hasPracticeAudio,
  onClick,
  onEdit,
  onDelete,
}: PhraseCardProps) {
  const custom = isCustomPhrase(phrase.id);
  const showActions = custom && (onEdit || onDelete);

  return (
    <div className="phrase-card-wrapper">
      <button
        type="button"
        className="phrase-card phrase-card--clickable"
        onClick={() => onClick?.(phrase)}
        aria-label={`${phrase.english}を練習する`}
      >
        <div className="phrase-card__english">{phrase.english}</div>
        <div className="phrase-card__japanese">{phrase.japanese}</div>
        <div className="phrase-card__meta">
          <span className={`tag tag--source${custom ? " tag--source-custom" : ""}`}>
            {custom ? "自作" : "初期フレーズ"}
          </span>
          <span className="tag">#{phrase.category}</span>
          <span className="tag">{LEVEL_LABEL[phrase.level]}</span>
          {done && <span className="tag tag--done">✓ 練習済み</span>}
          {hasReferenceAudio && <span className="tag tag--audio">🎵 お手本あり</span>}
          {hasPracticeAudio && <span className="tag tag--audio">🎙 練習あり</span>}
        </div>
      </button>
      {showActions && (
        <div className="phrase-card-actions">
          {onEdit && (
            <button
              type="button"
              className="chip-btn"
              onClick={() => onEdit(phrase)}
              aria-label={`${phrase.english}を編集`}
            >
              ✎ 編集
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="chip-btn chip-btn--ghost"
              onClick={() => onDelete(phrase)}
              aria-label={`${phrase.english}を削除`}
            >
              🗑 削除
            </button>
          )}
        </div>
      )}
    </div>
  );
}
