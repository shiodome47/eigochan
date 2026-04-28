import { useRef, useState } from "react";
import { findPhraseById } from "../data/phrases";
import type { UserProgress } from "../types";
import { formatDateLabel } from "../utils/date";
import { resetAll } from "../utils/storage";
import { getStreakEncouragement } from "../utils/messages";
import { exportToFile, mergeImport, readImportFile } from "../utils/dataIo";

interface LogPageProps {
  progress: UserProgress;
}

type ImportNotice =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; added: number; reassigned: number }
  | { kind: "exported"; count: number };

export function LogPage({ progress }: LogPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notice, setNotice] = useState<ImportNotice>({ kind: "idle" });

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
          端末やブラウザによっては、オフライン時に読み上げが使えない場合があります。
        </p>

        <button type="button" className="danger-link" onClick={handleReset}>
          学習データをリセットする
        </button>
      </section>
    </>
  );
}
