import { useMemo, useRef, useState } from "react";
import { findPhraseById } from "../data/phrases";
import type { UserProgress } from "../types";
import { formatDateLabel } from "../utils/date";
import { resetAll } from "../utils/storage";
import { getStreakEncouragement } from "../utils/messages";
import { exportToFile, mergeImport, readImportFile } from "../utils/dataIo";
import {
  generateDuo3PhraseId,
  importDuo3Phrases,
  parseDuo3PastedText,
  type Duo3ImportResult,
} from "../utils/customPhrases";
import { enqueueSnapshotPush } from "../utils/autoSync";
import { SyncSettings } from "../components/SyncSettings";

interface LogPageProps {
  progress: UserProgress;
}

type ImportNotice =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; added: number; reassigned: number }
  | { kind: "exported"; count: number };

const DUO_SECTION_MAX = 45;
const DUO_PREVIEW_LIMIT = 3;

export function LogPage({ progress }: LogPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notice, setNotice] = useState<ImportNotice>({ kind: "idle" });

  // DUO 3.0 テキスト貼り付け Import
  const [duoSection, setDuoSection] = useState<number>(1);
  const [duoStartIndex, setDuoStartIndex] = useState<string>("1");
  const [duoText, setDuoText] = useState<string>("");
  const [duoShowPreview, setDuoShowPreview] = useState<boolean>(false);
  const [duoResult, setDuoResult] = useState<Duo3ImportResult | null>(null);
  const [duoError, setDuoError] = useState<string | null>(null);

  const duoParsedLines = useMemo(
    () => parseDuo3PastedText(duoText),
    [duoText],
  );
  const duoStartIndexNum = useMemo(() => {
    const n = Number(duoStartIndex);
    return Number.isFinite(n) && Number.isInteger(n) && n > 0 ? n : null;
  }, [duoStartIndex]);
  const duoSampleIds = useMemo(() => {
    if (duoStartIndexNum === null) return [];
    const limit = Math.min(duoParsedLines.length, DUO_PREVIEW_LIMIT);
    const ids: string[] = [];
    for (let i = 0; i < limit; i += 1) {
      ids.push(generateDuo3PhraseId(duoSection, duoStartIndexNum + i));
    }
    return ids;
  }, [duoParsedLines.length, duoSection, duoStartIndexNum]);

  const handleDuoPreview = () => {
    setDuoError(null);
    setDuoResult(null);
    if (duoStartIndexNum === null) {
      setDuoError("開始 index は 1 以上の整数で入れてね");
      setDuoShowPreview(false);
      return;
    }
    if (duoParsedLines.length === 0) {
      setDuoError("取り込めそうな行が見つかりませんでした");
      setDuoShowPreview(false);
      return;
    }
    setDuoShowPreview(true);
  };

  const handleDuoImport = () => {
    setDuoError(null);
    if (duoStartIndexNum === null) {
      setDuoError("開始 index は 1 以上の整数で入れてね");
      return;
    }
    if (duoParsedLines.length === 0) {
      setDuoError("取り込めそうな行が見つかりませんでした");
      return;
    }
    const result = importDuo3Phrases({
      section: duoSection,
      startIndex: duoStartIndexNum,
      englishLines: duoParsedLines,
    });
    if (result.storageFailed) {
      setDuoError(
        "ブラウザのストレージに書き込めませんでした。容量や設定を確認してね。",
      );
      setDuoResult(null);
      return;
    }
    setDuoResult(result);
    setDuoShowPreview(false);
    // syncCode が設定されていれば同期キューに積む。未設定なら no-op。
    if (result.imported > 0) enqueueSnapshotPush();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "すべての学習データ(進捗・ミッション・自作フレーズ)を消去しますか？この操作は取り消せません。",
      )
    ) {
      resetAll();
      window.location.reload();
    }
  };

  const handleExport = () => {
    const { count } = exportToFile();
    setNotice({ kind: "exported", count });
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 同じファイルを再選択できるよう、毎回 value をリセット
    e.target.value = "";
    if (!file) return;

    const result = await readImportFile(file);
    if (!result.ok) {
      setNotice({
        kind: "error",
        message: result.error ?? "ファイルを読み込めませんでした",
      });
      return;
    }
    if (result.customPhrases.length === 0) {
      setNotice({
        kind: "error",
        message: "ファイル内に取り込めるフレーズが見つかりませんでした",
      });
      return;
    }
    const ok = window.confirm(
      `${result.customPhrases.length}件のフレーズを既存の自作フレーズに追加します。続けますか？`,
    );
    if (!ok) {
      setNotice({ kind: "idle" });
      return;
    }
    const merge = mergeImport(result.customPhrases);
    setNotice({ kind: "success", added: merge.added, reassigned: merge.reassigned });
  };

  const encouragement = getStreakEncouragement(progress.streakDays);
  const hasPractice = progress.totalPracticeCount > 0;

  return (
    <>
      <section className="card">
        <h2 className="card__title">あなたの学習ログ</h2>
        <p className="card__heading">
          {hasPractice ? encouragement : "ここに練習の記録がたまっていきます。"}
        </p>
        <div className="progress-row">
          <div className="progress-cell">
            <div className="progress-cell__label">れんしゅう</div>
            <div className="progress-cell__value">
              {progress.totalPracticeCount}
              <span className="progress-cell__unit">回</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">音読</div>
            <div className="progress-cell__value">
              {progress.totalReadCount}
              <span className="progress-cell__unit">回</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">暗唱</div>
            <div className="progress-cell__value">
              {progress.totalReciteCount}
              <span className="progress-cell__unit">回</span>
            </div>
          </div>
        </div>
        <div className="progress-row" style={{ marginTop: 8 }}>
          <div className="progress-cell">
            <div className="progress-cell__label">そうXP</div>
            <div className="progress-cell__value">
              {progress.totalXp}
              <span className="progress-cell__unit">XP</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">れんぞく</div>
            <div className="progress-cell__value">
              {progress.streakDays}
              <span className="progress-cell__unit">日</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">さいご</div>
            <div className="progress-cell__value" style={{ fontSize: 18 }}>
              {formatDateLabel(progress.lastPracticeDate)}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">最近練習したフレーズ</h2>
        {progress.recentPractices.length === 0 ? (
          <p className="empty">まだ練習記録がありません。今日の練習から始めてみよう。</p>
        ) : (
          <ul className="log-cards">
            {progress.recentPractices.slice(0, 12).map((log) => {
              const phrase = findPhraseById(log.phraseId);
              return (
                <li className="log-card" key={log.id}>
                  <div className="log-card__head">
                    <span className="log-card__date">{formatDateLabel(log.date)}</span>
                    <span className="log-card__xp">+{log.xpEarned} XP</span>
                  </div>
                  <p className="log-card__english">
                    {phrase?.english ?? "(削除済みフレーズ)"}
                  </p>
                  {phrase && <p className="log-card__japanese">{phrase.japanese}</p>}
                  <div className="log-card__meta">
                    <span className="log-card__chip">音読 {log.readCount}</span>
                    <span className="log-card__chip">暗唱 {log.reciteCount}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <SyncSettings />

      <section className="card">
        <h2 className="card__title">データ管理</h2>
        <p className="card__heading">大切なフレーズはバックアップできます</p>
        <p className="form-hint">
          自作フレーズはこのブラウザに保存されています。Exportでファイルにバックアップ、
          Importで別のブラウザに移したり、戻したりできます。
        </p>

        <div className="btn-row">
          <button type="button" className="btn btn--secondary" onClick={handleExport}>
            📤 自作フレーズをExport
          </button>
          <button type="button" className="btn btn--ghost" onClick={handlePickFile}>
            📥 自作フレーズをImport
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {notice.kind === "exported" && (
          <p className="data-notice data-notice--ok">
            ✓ {notice.count}件のフレーズを書き出しました
          </p>
        )}
        {notice.kind === "success" && (
          <p className="data-notice data-notice--ok">
            ✓ {notice.added}件を追加しました
            {notice.reassigned > 0 && `(うち${notice.reassigned}件は新IDを振り直し)`}
          </p>
        )}
        {notice.kind === "error" && (
          <p className="data-notice data-notice--err">⚠ {notice.message}</p>
        )}

        <p className="form-hint-small" style={{ marginTop: 14 }}>
          Exportされるのはフレーズデータのみです。音声メモは含まれません。
          <br />
          端末やブラウザによっては、オフライン時に読み上げが使えない場合があります。
        </p>

        <button type="button" className="danger-link" onClick={handleReset}>
          学習データをリセットする
        </button>
      </section>

      <section className="card">
        <h2 className="card__title">DUO 3.0 テキスト Import</h2>
        <p className="card__heading">英文を貼り付けて、Section 単位で取り込み</p>
        <p className="form-hint">
          1 行 1 フレーズで貼り付けてください。行頭の連番 (例: <code>1.</code>{" "}
          や <code>001.</code>、<code>1)</code>) は自動で取り除きます。空行は無視します。
          同じ Section / 通し番号で再 Import すると上書き更新されます (重複しません)。
        </p>
        <p className="form-hint-small">
          DUO 3.0 の本文・音声はリポジトリには含めません。お手元の正規データの範囲内で、
          自分の端末にだけ取り込んで使ってください。
        </p>

        <div className="form-grid">
          <div className="form-field-row">
            <label className="form-field">
              <span className="form-field__label">Section</span>
              <select
                className="form-input"
                value={String(duoSection)}
                onChange={(e) => {
                  setDuoSection(Number(e.target.value));
                  setDuoShowPreview(false);
                  setDuoResult(null);
                }}
              >
                {Array.from({ length: DUO_SECTION_MAX }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={String(n)}>
                      Section {n}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="form-field">
              <span className="form-field__label">開始 index</span>
              <input
                type="number"
                className="form-input"
                inputMode="numeric"
                min={1}
                value={duoStartIndex}
                onChange={(e) => {
                  setDuoStartIndex(e.target.value);
                  setDuoShowPreview(false);
                  setDuoResult(null);
                }}
              />
            </label>
          </div>

          <label className="form-field">
            <span className="form-field__label">英文 (1 行 1 フレーズ)</span>
            <textarea
              className="form-input"
              rows={8}
              value={duoText}
              onChange={(e) => {
                setDuoText(e.target.value);
                setDuoShowPreview(false);
                setDuoResult(null);
              }}
              placeholder={
                "例:\n1. We must respect the will of the individual.\n2. Take it easy. I can assure you that everything will turn out fine.\n3. Let go of your negative outlook on life."
              }
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="btn-row" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleDuoPreview}
            disabled={duoText.trim().length === 0}
          >
            👀 Preview
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleDuoImport}
            disabled={duoText.trim().length === 0}
          >
            📥 Import
          </button>
        </div>

        {duoError && (
          <p
            className="data-notice data-notice--err"
            style={{ marginTop: 12 }}
          >
            ⚠ {duoError}
          </p>
        )}

        {duoShowPreview && duoStartIndexNum !== null && (
          <div className="data-notice data-notice--ok" style={{ marginTop: 12 }}>
            <strong>取り込み予定: {duoParsedLines.length} 件</strong>
            {duoParsedLines.length > 0 && (
              <>
                <p
                  className="form-hint-small"
                  style={{ marginTop: 8, marginBottom: 4 }}
                >
                  最初の {Math.min(duoParsedLines.length, DUO_PREVIEW_LIMIT)} 件:
                </p>
                <ul className="duo-preview-list">
                  {duoParsedLines
                    .slice(0, DUO_PREVIEW_LIMIT)
                    .map((line, i) => (
                      <li key={i}>
                        <code>
                          {generateDuo3PhraseId(
                            duoSection,
                            duoStartIndexNum + i,
                          )}
                        </code>{" "}
                        — {line}
                      </li>
                    ))}
                </ul>
                {duoSampleIds.length > 0 && (
                  <p
                    className="form-hint-small"
                    style={{ marginTop: 4 }}
                  >
                    生成 ID 例: {duoSampleIds.join(" / ")}
                    {duoParsedLines.length > DUO_PREVIEW_LIMIT && " …"}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {duoResult && (
          <p
            className="data-notice data-notice--ok"
            style={{ marginTop: 12 }}
          >
            ✓ 取り込み {duoResult.imported} 件 (新規 {duoResult.inserted} /
            更新 {duoResult.replaced}
            {duoResult.skipped > 0 ? ` / スキップ ${duoResult.skipped}` : ""})
          </p>
        )}
      </section>
    </>
  );
}
