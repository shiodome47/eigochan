import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addCustomPhrase,
  autoChunkText,
  chunksToText,
  CustomPhraseInput,
  deleteCustomPhrase,
  effectiveSource,
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
import {
  enqueueAudioDelete,
  enqueueSnapshotPush,
} from "../utils/autoSync";
import { PhraseAudioRecorder } from "../components/PhraseAudioRecorder";
import type {
  Phrase,
  PhraseCategory,
  PhraseLevel,
  PhraseMood,
  PhraseSource,
} from "../types";

interface PhraseEditPageProps {
  mode: "new" | "edit";
}

// 編集フォームに乗せる出典は original / duo3 / monologue の 3 種類。
// "initial" は同梱データ専用で、ユーザーが新規作成・編集する場面では選べない。
// monologue は通常フォームの出典セレクタには出さない (専用導線
// /phrases/new?source=monologue 経由でだけ入る)。
type EditableSource = Extract<PhraseSource, "original" | "duo3" | "monologue">;

interface FormState {
  english: string;
  japanese: string;
  chunksText: string;
  level: PhraseLevel;
  category: PhraseCategory;
  mood: PhraseMood;
  source: EditableSource;
  sourceSection: string; // 入力中は文字列、保存時に number へ
  sourceIndex: string;
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

const SOURCE_LABEL: Record<EditableSource, string> = {
  original: "自作",
  duo3: "DUO 3.0",
  monologue: "ひとりごと",
};

// 通常フォームの出典セレクタに出す候補。monologue は専用導線からだけ入るため除外。
const SELECTABLE_SOURCES: readonly Extract<EditableSource, "original" | "duo3">[] = [
  "original",
  "duo3",
] as const;

const DUO_SECTION_MAX = 45;

const DEFAULT_FORM: FormState = {
  english: "",
  japanese: "",
  chunksText: "",
  level: "beginner",
  category: "custom",
  mood: "natural",
  source: "original",
  sourceSection: "",
  sourceIndex: "",
};

function fromPhrase(p: Phrase): FormState {
  // initial 由来のものは編集対象外なので original として表示するだけ (実体は変えない)。
  const src = effectiveSource(p);
  const editable: EditableSource =
    src === "duo3" ? "duo3" : src === "monologue" ? "monologue" : "original";
  return {
    english: p.english,
    japanese: p.japanese,
    chunksText: chunksToText(p.chunks),
    level: p.level,
    category: p.category,
    mood: p.mood,
    source: editable,
    sourceSection:
      typeof p.sourceSection === "number" ? String(p.sourceSection) : "",
    sourceIndex:
      typeof p.sourceIndex === "number" ? String(p.sourceIndex) : "",
  };
}

// /phrases/new?source=monologue で開かれたときの初期フォーム。
// 日本語が主役、英語は後追い。カテゴリは「ノート(その他)」相当の custom 固定。
const MONOLOGUE_DEFAULT_FORM: FormState = {
  english: "",
  japanese: "",
  chunksText: "",
  level: "beginner",
  category: "custom",
  mood: "natural",
  source: "monologue",
  sourceSection: "",
  sourceIndex: "",
};

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

  // /phrases/new?source=monologue で開かれた場合、初期フォームを「ひとりごと」用に切替。
  // 編集モードでは target.source が事実なので query は無視する。
  const initialIsMonologueRoute =
    mode === "new" &&
    new URLSearchParams(location.search).get("source") === "monologue";

  const [form, setForm] = useState<FormState>(() => {
    if (target) return fromPhrase(target);
    return initialIsMonologueRoute ? MONOLOGUE_DEFAULT_FORM : DEFAULT_FORM;
  });
  // 画面全体を「ひとりごと英語」モードで描画するかどうか。
  // - new + ?source=monologue → true
  // - edit + 既存の monologue フレーズ → true
  // 切替後はフォーム上で source を変えられないので、form.source を素直に見れば良い。
  const isMonologue = form.source === "monologue";
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

  const buildInput = (): CustomPhraseInput => {
    const base: CustomPhraseInput = {
      english: form.english,
      japanese: form.japanese,
      chunks: parseChunkText(form.chunksText),
      level: form.level,
      category: form.category,
      mood: form.mood,
      source: form.source,
    };
    if (form.source === "duo3") {
      const sec = Number(form.sourceSection);
      const idx = Number(form.sourceIndex);
      if (Number.isFinite(sec) && sec > 0) base.sourceSection = sec;
      if (Number.isFinite(idx) && idx > 0) base.sourceIndex = idx;
    }
    // 既存 monologue を編集する場合、作成日時を失わないように引き継ぐ。
    // (新規 monologue は addCustomPhrase 内で自動付与される。)
    if (form.source === "monologue" && target?.thoughtCreatedAt) {
      base.thoughtCreatedAt = target.thoughtCreatedAt;
    }
    return base;
  };

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

        // 同期が有効ならサーバへ反映予約(syncCode 無しなら no-op)
        enqueueSnapshotPush();

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
        enqueueSnapshotPush();
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
    // ローカル削除と同期側の削除を別々に予約。サーバ側の音声削除は 2 slot 分。
    // (該当 slot に音声が無ければ server 側で no-op になるだけ。)
    enqueueAudioDelete(target.id, "reference");
    enqueueAudioDelete(target.id, "practice");
    enqueueSnapshotPush();
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
          フォームよりも上にこのカードを置く。draftId に紐づけて IndexedDB に保存される。
          ただし「ひとりごと英語」モードでは英語が後追いなので、お手本音声録音は出さない。 */}
      {mode === "new" && !isMonologue && (
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
        <h2 className="card__title">
          {isMonologue
            ? mode === "new"
              ? "ひとりごと英語"
              : "ひとりごとを編集"
            : mode === "new"
              ? "フレーズを追加"
              : "フレーズを編集"}
        </h2>
        <p className="card__heading">
          {isMonologue
            ? "頭に浮かんだ日本語を、まずそのまま保存しましょう。英語はあとで入力できます。"
            : mode === "new"
              ? "覚えたいフレーズを追加しよう"
              : "言いまわしを微調整しよう"}
        </p>
        <p className="form-hint">
          {isMonologue
            ? "AIによる自動翻訳・自動添削はしません。ChatGPT や Claude、辞書などを参考にしながら、自分が言いたい英語に整えてください。データはこのブラウザに保存されます。"
            : "自分だけの英語ノートを育てよう。追加したフレーズも、音読・録音・暗唱できます。データはこのブラウザに保存されます。大切なフレーズはExportしてバックアップできます。"}
        </p>

        <div className="form-grid">
          {isMonologue ? (
            <>
              {/* 1) 日本語: ひとりごとモードでは主役。英語より先に大きく出す。 */}
              <label className="form-field">
                <span className="form-field__label">日本語メモ *</span>
                <textarea
                  className="form-input"
                  rows={4}
                  value={form.japanese}
                  onChange={(e) => handleChange("japanese", e.target.value)}
                  placeholder="例: これ、あとでちゃんと整理した方がよさそう。"
                  autoComplete="off"
                  autoFocus={mode === "new"}
                />
                {errors.japanese && (
                  <span className="form-error">{errors.japanese}</span>
                )}
              </label>

              {/* 2) 英語: あとで入力できる。空のまま保存OK。 */}
              <label className="form-field">
                <span className="form-field__label">
                  英語にしてみる(あとでもOK)
                </span>
                <textarea
                  className="form-input"
                  rows={2}
                  value={form.english}
                  onChange={(e) => handleChange("english", e.target.value)}
                  placeholder="例: I should probably organize this properly later."
                  autoCapitalize="sentences"
                  autoComplete="off"
                  spellCheck="true"
                />
                <span className="form-hint-small">
                  ChatGPT や Claude などを参考にして、自分が実際に言いたい英語に整えてください。
                  英語が入ると、音読・暗唱・録音・Voice Energy の練習に進めます。
                </span>
                {errors.english && (
                  <span className="form-error">{errors.english}</span>
                )}
              </label>

              {/* 3) チャンク: 英語が入ってから初めて意味がある。空でも保存OK。 */}
              {form.english.trim().length > 0 && (
                <div className="form-field">
                  <div className="form-field__row">
                    <span className="form-field__label">チャンク</span>
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
                    rows={3}
                    value={form.chunksText}
                    onChange={(e) => handleChange("chunksText", e.target.value)}
                    placeholder={"1行に1チャンク。空のままでもOK。"}
                    autoComplete="off"
                  />
                  <span className="form-hint-small">
                    自動分割を使うと、英文を音のかたまりに区切れます。
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}

          {/* 出典セレクタは monologue モードでは出さない (専用導線で固定済み)。 */}
          {!isMonologue && (
          <div className="form-field-row">
            <label className="form-field">
              <span className="form-field__label">出典</span>
              <select
                className="form-input"
                value={form.source}
                onChange={(e) =>
                  handleChange("source", e.target.value as EditableSource)
                }
              >
                {SELECTABLE_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {SOURCE_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            {form.source === "duo3" && (
              <>
                <label className="form-field">
                  <span className="form-field__label">Section</span>
                  <select
                    className="form-input"
                    value={form.sourceSection}
                    onChange={(e) =>
                      handleChange("sourceSection", e.target.value)
                    }
                  >
                    <option value="">—</option>
                    {Array.from({ length: DUO_SECTION_MAX }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={String(n)}>
                          {n}
                        </option>
                      ),
                    )}
                  </select>
                  {errors.sourceSection && (
                    <span className="form-error">{errors.sourceSection}</span>
                  )}
                </label>
                <label className="form-field">
                  <span className="form-field__label">通し番号</span>
                  <input
                    type="number"
                    className="form-input"
                    inputMode="numeric"
                    min={1}
                    value={form.sourceIndex}
                    onChange={(e) =>
                      handleChange("sourceIndex", e.target.value)
                    }
                    placeholder="例: 87"
                  />
                  {errors.sourceIndex && (
                    <span className="form-error">{errors.sourceIndex}</span>
                  )}
                </label>
              </>
            )}
          </div>
          )}

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
              : isMonologue
                ? mode === "new"
                  ? form.english.trim().length > 0
                    ? "保存する"
                    : "日本語だけ保存する"
                  : "保存する"
                : mode === "new"
                  ? "フレーズを保存する"
                  : "保存する"}
          </button>
          {/* monologue で英語未入力の場合は練習に進めないので、ボタンを出さない。 */}
          {mode === "edit" && target && target.english.trim().length > 0 && (
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

        {mode === "new" && !isMonologue && (
          <p className="form-hint-small" style={{ marginTop: 12 }}>
            🎵 まずお手本音声を録音できます。英文と日本語訳を入れて保存すると、
            この音声がそのままフレーズに紐づきます。
          </p>
        )}
        {mode === "new" && isMonologue && (
          <p className="form-hint-small" style={{ marginTop: 12 }}>
            💭 日本語だけでも保存できます。英語が入ったら、音読・暗唱・録音・Voice Energy の練習に進めます。
          </p>
        )}
      </section>

      {/* 音声メモは「英語が入っているフレーズ」用。
          monologue で英語未入力の段階ではお手本音声は不要なので出さない。 */}
      {mode === "edit" && target && target.english.trim().length > 0 && (
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
