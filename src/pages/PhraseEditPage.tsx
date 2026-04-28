import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  deletePhraseAudio,
  loadPhraseAudio,
  savePhraseAudio,
} from "../utils/phraseAudioStorage";
import { PhraseAudioRecorder } from "../components/PhraseAudioRecorder";
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
  const location = useLocation();

  const target = useMemo<Phrase | null>(() => {
    if (mode !== "edit") return null;
    if (!params.phraseId) return null;
    return findCustomPhraseById(params.phraseId) ?? null;
  }, [mode, params.phraseId]);

  // /phrases/new でフレーズ保存前に「お手本音声」を録っておくための一時 ID。
  // useState の初期化関数で1回だけ生成し、画面が再描画されてもブレない。
  // edit モードでは使わないので空文字。
  const [draftId] = useState<string>(() => {
    if (mode !== "new") return "";
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 9);
    return `draft_custom_${ts}_${rand}`;
  });

  const [form, setForm] = useState<FormState>(() =>
    target ? fromPhrase(target) : DEFAULT_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CustomPhraseInput, string>>>(
    {},
  );
  // localStorage 書き込み失敗等、フォームレベルのエラー(入力エラーは errors と分離)
  const [saveError, setSaveError] = useState<string | null>(null);
  // 保存中の二重クリックを防ぐ
  const [saving, setSaving] = useState(false);

  // 直前画面で draft 音声の引き継ぎに失敗していた場合のフラグ
  // (location.state は React Router のソフトナビゲーションで渡される)
  const audioMigrationFailed =
    mode === "edit" &&
    (location.state as { audioMigrationFailed?: boolean } | null)?.audioMigrationFailed ===
      true;

  // /phrases/new からの離脱時(成功遷移を含む)、draft 音声を IndexedDB から消す。
  //   - 成功パスでは handleSave 内で既に削除済 → ここは no-op
  //   - 失敗パスや bottom nav 経由の離脱では、ここで掃除される
  //   - 削除に失敗しても無視(orphan は将来の掃除機能で回収)
  useEffect(() => {
    if (mode !== "new") return;
    return () => {
      void deletePhraseAudio(draftId, "reference").catch(() => {
        // 無視
      });
    };
  }, [mode, draftId]);

  // edit モードで対象が無いケースは return 直下の早期描画で扱う(暗黙リダイレクトしない)。

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

  const handleSave = async () => {
    if (saving) return;
    const input = buildInput();
    const validation = validateInput(input);
    setErrors(validation.errors);
    if (!validation.ok) return;
    setSaveError(null);
    setSaving(true);

    const STORAGE_FAIL_MESSAGE =
      "保存できませんでした。ブラウザのストレージが満杯か、書き込みできない設定になっているかもしれません。\n入力内容はそのままです。もう一度お試しください。";

    try {
      if (mode === "new") {
        const created = addCustomPhrase(input);
        if (!created) {
          // フレーズ自体が保存できなかった: 入力もお手本音声も維持する
          setSaveError(STORAGE_FAIL_MESSAGE);
          return;
        }

        // draft 音声を created.id へ移し替える。
        // 失敗してもフレーズ作成自体は成立しているので edit 画面へは進む。
        let migrationFailed = false;
        try {
          const draftAudio = await loadPhraseAudio(draftId, "reference");
          if (draftAudio) {
            await savePhraseAudio(
              created.id,
              "reference",
              draftAudio.blob,
              draftAudio.mimeType,
            );
            await deletePhraseAudio(draftId, "reference");
          }
        } catch {
          migrationFailed = true;
        }

        navigate(`/phrases/edit/${created.id}`, {
          state: migrationFailed ? { audioMigrationFailed: true } : undefined,
        });
        return;
      }
      if (target && isCustomPhrase(target.id)) {
        const updated = updateCustomPhrase(target.id, input);
        if (!updated) {
          setSaveError(STORAGE_FAIL_MESSAGE);
          return;
        }
        navigate("/phrases");
        return;
      }
      // mode === "edit" だが target が無いケース。通常はこの関数まで到達しない
      // (return 直下の not-found 早期描画で先に止まる)。
      navigate("/phrases");
    } finally {
      // navigate 後にアンマウントされても害はない(React 18 は無視)
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!target) return;
    if (!window.confirm("このフレーズを削除しますか？(取り消せません)")) return;
    deleteCustomPhrase(target.id);
    navigate("/phrases");
  };

  const handleCancel = () => {
    if (mode === "new") {
      // 新規作成のキャンセル時は draft 音声も掃除する(orphan を残さないため)。
      // 失敗しても navigate は進める。
      void deletePhraseAudio(draftId, "reference").catch(() => {
        // 無視
      });
    }
    navigate("/phrases");
  };

  // edit モードで対象フレーズが見つからない場合は、専用のエラー画面を表示する。
  // 黙って一覧へ戻さない(同期で取り込み中、削除直後、URL 直打ち等を切り分けやすくするため)。
  if (mode === "edit" && !target) {
    return (
      <>
        <button
          type="button"
          className="btn btn--ghost btn--small back-link"
          onClick={() => navigate("/phrases")}
        >
          ← 一覧へ戻る
        </button>

        <section className="card">
          <h2 className="card__title">フレーズが見つかりませんでした</h2>
          <p className="card__heading">
            このフレーズはこの端末に保存されていないようです。
          </p>
          <p className="form-hint">
            削除されたか、別の端末で作ったあと まだ取り込まれていない可能性があります。
            一覧から確認してください。
          </p>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/phrases")}
            >
              フレーズ一覧へ戻る
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <button type="button" className="btn btn--ghost btn--small back-link" onClick={handleCancel}>
        ← 一覧へ戻る
      </button>

      {/* /phrases/new では「お手本音声を先に録る」ことを推奨し、
          フォームよりも上にこのカードを置く。draftId に紐づけて IndexedDB に保存される。 */}
      {mode === "new" && (
        <section className="card audio-section">
          <h3 className="audio-section__title">お手本音声を先に録ろう(任意)</h3>
          <p className="audio-section__lead">
            まねしたい英語のワンフレーズを先に録音できます。
            録音した音声を聞きながら、下のフォームに英文・日本語訳を入れていきましょう。
          </p>
          <p className="audio-section__notice">
            録音はいったんこの端末に一時保存されます。
            「保存する」を押すと、このフレーズに正式に紐づきます。
            「キャンセル」を押すと削除されます。
          </p>
          <PhraseAudioRecorder
            key={`draft-ref-${draftId}`}
            phraseId={draftId}
            slot="reference"
            title="お手本音声"
            description="まねしたい短い音声を録音できます。30〜60秒くらいがおすすめです。"
          />
        </section>
      )}

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
          <button
            type="button"
            className="btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "保存中…"
              : mode === "new"
                ? "フレーズを保存する"
                : "保存する"}
          </button>
          {mode === "edit" && target && (
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => navigate(`/practice/${target.id}`)}
            >
              🎤 このフレーズで練習する
            </button>
          )}
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

        {saveError && (
          <p
            className="data-notice data-notice--err"
            style={{ marginTop: 12, whiteSpace: "pre-line" }}
          >
            ⚠ {saveError}
          </p>
        )}

        {mode === "new" && (
          <p className="form-hint-small" style={{ marginTop: 12 }}>
            🎵 まずお手本音声を録音できます。英文と日本語訳を入れて保存すると、
            この音声がそのままフレーズに紐づきます。
          </p>
        )}
      </section>

      {mode === "edit" && target && (
        <section className="card audio-section">
          <h3 className="audio-section__title">音声メモ</h3>
          <p className="audio-section__lead">
            お手本にしたい音声や、自分の練習音声をこのブラウザに保存できます。
          </p>
          <p className="audio-section__notice">
            録音データはクラウドには送信されません。この端末・このブラウザ内に保存されます。
          </p>

          {audioMigrationFailed && (
            <p
              className="data-notice data-notice--err"
              style={{ marginTop: 4, marginBottom: 8 }}
            >
              ⚠ お手本音声の引き継ぎに失敗しました。下の「お手本音声」でもう一度録音してください。
            </p>
          )}

          <PhraseAudioRecorder
            key={`ref-${target.id}`}
            phraseId={target.id}
            slot="reference"
            title="お手本音声"
            description="まねしたい短い音声を保存できます。30〜60秒くらいがおすすめです。"
          />

          <PhraseAudioRecorder
            key={`prc-${target.id}`}
            phraseId={target.id}
            slot="practice"
            title="自分の練習音声"
            description="自分で音読・暗唱した声を保存できます。"
          />

          <p className="audio-section__small">
            外部サービスの音声を使う場合は、利用できる範囲に注意してください。
            録音データはこのブラウザ内に保存されます。ブラウザのデータを削除すると、録音も消えます。
          </p>
        </section>
      )}
    </>
  );
}
