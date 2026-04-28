import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCustomPhrase,
  autoChunkText,
  chunksToText,
  CustomPhraseInput,
  deleteCustomPhrase,
  findCustomPhraseById,
  isCustomPhrase,
  parseChunkText,
  updateCustomPhrase,
  validateInput,
  VALID_CATEGORIES,
  VALID_LEVELS,
  VALID_MOODS,
} from "../utils/customPhrases";
import type { Phrase, PhraseCategory, PhraseLevel, PhraseMood } from "../types";

interface PhraseEditPageProps {
  mode: "new" | "edit";
}

interface FormState {
  english: string;
  japanese: string;
  chunksText: string;
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
}

const CATEGORY_LABEL: Record<PhraseCategory, string> = {
  custom: "ノート(その他)",
  daily: "日常",
  conversation: "会話",
  feeling: "気持ち",
  work: "仕事",
  learning: "学び",
  travel: "旅行",
};

const LEVEL_LABEL: Record<PhraseLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const MOOD_LABEL: Record<PhraseMood, string> = {
  natural: "ふつう",
  casual: "カジュアル",
  polite: "ていねい",
  warm: "あたたかい",
  neutral: "ニュートラル",
};

const DEFAULT_FORM: FormState = {
  english: "",
  japanese: "",
  chunksText: "",
  level: "beginner",
  category: "custom",
  mood: "natural",
};

function fromPhrase(p: Phrase): FormState {
  return {
    english: p.english,
    japanese: p.japanese,
    chunksText: chunksToText(p.chunks),
    level: p.level,
    category: p.category,
    mood: p.mood,
  };
}

export function PhraseEditPage({ mode }: PhraseEditPageProps) {
  const navigate = useNavigate();
  const params = useParams<{ phraseId?: string }>();

  const target = useMemo<Phrase | null>(() => {
    if (mode !== "edit") return null;
    if (!params.phraseId) return null;
    return findCustomPhraseById(params.phraseId) ?? null;
  }, [mode, params.phraseId]);

  const [form, setForm] = useState<FormState>(() =>
    target ? fromPhrase(target) : DEFAULT_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CustomPhraseInput, string>>>(
    {},
  );

  // 編集モードで対象が見つからなかった場合は一覧へ戻す
  useEffect(() => {
    if (mode === "edit" && !target) {
      navigate("/phrases", { replace: true });
    }
  }, [mode, target, navigate]);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutoSplit = () => {
    const chunks = autoChunkText(form.english);
    handleChange("chunksText", chunksToText(chunks));
  };

  const buildInput = (): CustomPhraseInput => ({
    english: form.english,
    japanese: form.japanese,
    chunks: parseChunkText(form.chunksText),
    level: form.level,
    category: form.category,
    mood: form.mood,
  });

  const handleSave = () => {
    const input = buildInput();
    const validation = validateInput(input);
    setErrors(validation.errors);
    if (!validation.ok) return;

    if (mode === "new") {
      const created = addCustomPhrase(input);
      navigate(`/practice/${created.id}`);
      return;
    }
    if (target && isCustomPhrase(target.id)) {
      const updated = updateCustomPhrase(target.id, input);
      if (updated) {
        navigate("/phrases");
        return;
      }
    }
    navigate("/phrases");
  };

  const handleDelete = () => {
    if (!target) return;
    if (!window.confirm("このフレーズを削除しますか？(取り消せません)")) return;
    deleteCustomPhrase(target.id);
    navigate("/phrases");
  };

  const handleCancel = () => {
    navigate("/phrases");
  };

  return (
    <>
      <button type="button" className="btn btn--ghost btn--small back-link" onClick={handleCancel}>
        ← 一覧へ戻る
      </button>

      <section className="card">
        <h2 className="card__title">{mode === "new" ? "フレーズを追加" : "フレーズを編集"}</h2>
        <p className="card__heading">
          {mode === "new" ? "覚えたいフレーズを追加しよう" : "言いまわしを微調整しよう"}
        </p>
        <p className="form-hint">
          自分だけの英語ノートを育てよう。追加したフレーズも、音読・録音・暗唱できます。
          データはこのブラウザに保存されます。大切なフレーズはExportしてバックアップできます。
        </p>

        <div className="form-grid">
          <label className="form-field">
            <span className="form-field__label">英文 *</span>
            <textarea
              className="form-input"
              rows={2}
              value={form.english}
              onChange={(e) => handleChange("english", e.target.value)}
              placeholder="例: I'm getting better at this."
              autoCapitalize="sentences"
              autoComplete="off"
              spellCheck="true"
            />
            {errors.english && <span className="form-error">{errors.english}</span>}
          </label>

          <label className="form-field">
            <span className="form-field__label">日本語訳 *</span>
            <textarea
              className="form-input"
              rows={2}
              value={form.japanese}
              onChange={(e) => handleChange("japanese", e.target.value)}
              placeholder="例: だんだん上手くなってきた。"
              autoComplete="off"
            />
            {errors.japanese && <span className="form-error">{errors.japanese}</span>}
          </label>

          <div className="form-field">
            <div className="form-field__row">
              <span className="form-field__label">チャンク *</span>
              <button
                type="button"
                className="chip-btn"
                onClick={handleAutoSplit}
                disabled={!form.english.trim()}
              >
                🪄 英文から自動分割
              </button>
            </div>
            <textarea
              className="form-input"
              rows={4}
              value={form.chunksText}
              onChange={(e) => handleChange("chunksText", e.target.value)}
              placeholder={"1行に1チャンク。例:\nI'm getting\nbetter at this."}
              autoComplete="off"
            />
            <span className="form-hint-small">
              1行に1チャンク。あとから自由に編集できます。
            </span>
            {errors.chunks && <span className="form-error">{errors.chunks}</span>}
          </div>

          <div className="form-field-row">
            <label className="form-field">
              <span className="form-field__label">カテゴリ</span>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value as PhraseCategory)}
              >
                {VALID_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span className="form-field__label">レベル</span>
              <select
                className="form-input"
                value={form.level}
                onChange={(e) => handleChange("level", e.target.value as PhraseLevel)}
              >
                {VALID_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABEL[l]}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span className="form-field__label">ムード</span>
              <select
                className="form-input"
                value={form.mood}
                onChange={(e) => handleChange("mood", e.target.value as PhraseMood)}
              >
                {VALID_MOODS.map((m) => (
                  <option key={m} value={m}>
                    {MOOD_LABEL[m]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: 16 }}>
          <button type="button" className="btn" onClick={handleSave}>
            {mode === "new" ? "追加して練習する" : "保存する"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleCancel}>
            キャンセル
          </button>
          {mode === "edit" && target && (
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
            >
              🗑 このフレーズを削除する
            </button>
          )}
        </div>
      </section>
    </>
  );
}
