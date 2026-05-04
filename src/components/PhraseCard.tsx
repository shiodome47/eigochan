import type { Phrase } from "../types";
import { effectiveSource, isCustomPhrase } from "../utils/customPhrases";

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
  const source = effectiveSource(phrase);
  const isMonologue = source === "monologue";
  const englishEmpty = phrase.english.trim().length === 0;
  // 「英語待ち」: ひとりごとで英語が未入力。「練習OK」: ひとりごとで英語入りずみ。
  const isDraftMonologue = isMonologue && englishEmpty;
  const showActions = custom && (onEdit || onDelete);

  // 出典タグの見た目: 通常の自作と分けて分かるようにする
  const sourceTagClass = isMonologue
    ? "tag tag--source tag--source-monologue"
    : custom
      ? "tag tag--source tag--source-custom"
      : "tag tag--source";
  const sourceTagLabel = isMonologue
    ? "ひとりごと"
    : custom
      ? "自作"
      : "初期フレーズ";

  // ひとりごと(英語待ち)はクリックで「英語を入れる」導線になる。
  // それ以外は従来通り「練習する」。aria-label もそれに合わせる。
  const ariaLabel = isDraftMonologue
    ? `${phrase.japanese} の英語を入れる`
    : `${phrase.english}を練習する`;

  return (
    <div className="phrase-card-wrapper">
      <button
        type="button"
        className="phrase-card phrase-card--clickable"
        onClick={() => onClick?.(phrase)}
        aria-label={ariaLabel}
      >
        {isDraftMonologue ? (
          // 英語未入力のひとりごと: 日本語を主役にして大きく出す。
          // 英語スロットには placeholder としての見出しのみ。
          <>
            <div className="phrase-card__japanese phrase-card__japanese--primary">
              {phrase.japanese}
            </div>
            <div className="phrase-card__english phrase-card__english--placeholder">
              英語はあとで入力できます
            </div>
          </>
        ) : (
          <>
            <div className="phrase-card__english">{phrase.english}</div>
            <div className="phrase-card__japanese">{phrase.japanese}</div>
          </>
        )}
        <div className="phrase-card__meta">
          <span className={sourceTagClass}>{sourceTagLabel}</span>
          <span className="tag">#{phrase.category}</span>
          <span className="tag">{LEVEL_LABEL[phrase.level]}</span>
          {/* MVP: 状態フィルタは省略、ステータスはバッジでだけ伝える */}
          {isMonologue && englishEmpty && (
            <span className="tag tag--waiting">⏳ 英語待ち</span>
          )}
          {isMonologue && !englishEmpty && !done && (
            <span className="tag tag--ready">✅ 練習OK</span>
          )}
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
