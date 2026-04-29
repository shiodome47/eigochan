// 同期設定の最小UI(Log ページに埋め込む想定)。
//
// 状態は「同期コードがローカルにあるか」で2つに分かれる:
//   * 未参加 … 「同期コードを作成」「同期コードで参加」のどちらかを選ばせる
//   * 参加済 … コード表示、コピー、参加解除
//
// 失敗時は localStorage / IndexedDB を一切いじらない。
// 既存の local-first 動作は維持(同期を有効にしないユーザーは今までどおり動く)。

import { useEffect, useMemo, useState } from "react";
import {
  loadCustomPhrases,
  saveCustomPhrases,
} from "../utils/customPhrases";
import { loadProgress, saveProgress } from "../utils/storage";
import {
  listAllPhraseAudio,
  savePhraseAudio,
} from "../utils/phraseAudioStorage";
import {
  clearSyncCode,
  createSyncCode,
  describeFailReason,
  getAudio,
  getSnapshot,
  listRemoteAudio,
  loadSyncCode,
  putAudio,
  putSnapshot,
  saveSyncCode,
  verifySyncCode,
} from "../utils/syncClient";
import {
  clearAllSyncState,
  getLastSyncedAt,
  runFlush,
  subscribeQueueChanged,
} from "../utils/autoSync";
import {
  loadQueue,
  removeFromQueue,
  type SyncQueueItem,
} from "../utils/syncQueue";

type Notice =
  | { kind: "idle" }
  | { kind: "info"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "err"; message: string };

type View = "idle" | "creating" | "joining";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function describeQueueItem(item: SyncQueueItem): string {
  if (item.type === "snapshotPush") return "全件スナップショット送信";
  if (item.type === "audioUpload")
    return `音声アップロード ${item.phraseId} / ${item.slot}`;
  return `音声削除 ${item.phraseId} / ${item.slot}`;
}

function describeQueueLastError(item: SyncQueueItem): string | null {
  if (!item.lastError) return null;
  const { reason, status } = item.lastError;
  const statusPart = typeof status === "number" ? ` HTTP ${status}` : "";
  switch (reason) {
    case "network":
      return `ネットワーク失敗${statusPart}`;
    case "unauthorized":
      return `認証エラー${statusPart} (同期コードを確認)`;
    case "bad_request":
      return `リクエスト不正${statusPart}`;
    case "server_error":
      return `サーバエラー${statusPart}`;
    default:
      return `失敗${statusPart} (${reason})`;
  }
}

export function SyncSettings() {
  const [code, setCode] = useState<string | null>(() => loadSyncCode());
  const [view, setView] = useState<View>("idle");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>({ kind: "idle" });
  const [showCode, setShowCode] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [audioBusy, setAudioBusy] = useState(false);
  const [audioProgress, setAudioProgress] = useState<{
    label: string;
    done: number;
    total: number;
  } | null>(null);
  // フレーズ・進捗の手動同期(push/pull)
  const [snapshotBusy, setSnapshotBusy] = useState(false);
  // 自動同期の状態(queue / 最終同期時刻)
  const [queue, setQueue] = useState<SyncQueueItem[]>(() => loadQueue());
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    getLastSyncedAt(),
  );
  const [retryBusy, setRetryBusy] = useState(false);
  // 保存量の見える化
  const [storageBusy, setStorageBusy] = useState(false);
  const [storage, setStorage] = useState<{
    localPhraseCount: number;
    localAudioCount: number;
    localAudioBytes: number;
    remoteAudioOk: boolean;
    remoteAudioCount: number;
    remoteAudioBytes: number;
    fetchedAt: string;
  } | null>(null);

  // 参加済になったら入力欄や中間ビューはクリア
  useEffect(() => {
    if (code) {
      setView("idle");
      setJoinInput("");
    }
  }, [code]);

  // 自動同期の queue / 最終同期時刻を購読してリアルタイム更新
  useEffect(() => {
    const unsubscribe = subscribeQueueChanged(() => {
      setQueue(loadQueue());
      setLastSyncedAt(getLastSyncedAt());
    });
    return unsubscribe;
  }, []);

  const isEnabled = code !== null;

  const maskedCode = useMemo(() => {
    if (!code) return "";
    if (code.length <= 8) return code;
    return `${code.slice(0, 4)}…${code.slice(-4)}`;
  }, [code]);

  // ---- 同期を有効にする(コード作成) -----------------------------------
  const handleCreate = async () => {
    setBusy(true);
    setNotice({ kind: "info", message: "同期コードを発行しています…" });

    const issued = await createSyncCode();
    if (!issued.ok) {
      setBusy(false);
      setNotice({ kind: "err", message: describeFailReason(issued.reason) });
      return;
    }
    const newCode = issued.value.syncCode;

    // この端末のフレーズと進捗をそのままアップロード(失敗時はコード保存しない)
    const phrases = loadCustomPhrases();
    const progress = loadProgress();
    const put = await putSnapshot(newCode, { phrases, progress });
    if (!put.ok) {
      setBusy(false);
      setNotice({
        kind: "err",
        message: `${describeFailReason(put.reason)}\nコードはまだ保存していません。もう一度試してね。`,
      });
      return;
    }

    saveSyncCode(newCode);
    setCode(newCode);
    setShowCode(true); // 初回はそのまま見せる(コピーしてもらう)
    setBusy(false);
    setNotice({
      kind: "ok",
      message:
        "同期を有効にしました。下のコードをスマホで入力すれば、同じデータが使えます。",
    });
  };

  // ---- コードで参加(別端末に同じデータを取り込む) -------------------
  const handleJoin = async () => {
    const input = joinInput.trim();
    if (!input) {
      setNotice({ kind: "err", message: "同期コードを入力してね。" });
      return;
    }
    setBusy(true);
    setNotice({ kind: "info", message: "同期コードを確認しています…" });

    const verify = await verifySyncCode(input);
    if (!verify.ok) {
      setBusy(false);
      setNotice({ kind: "err", message: describeFailReason(verify.reason) });
      return;
    }

    setNotice({ kind: "info", message: "サーバからデータを取得しています…" });
    const snap = await getSnapshot(input);
    if (!snap.ok) {
      setBusy(false);
      setNotice({ kind: "err", message: describeFailReason(snap.reason) });
      return;
    }

    const localCount = loadCustomPhrases().length;
    const serverCount = snap.value.phrases.length;
    const proceed = window.confirm(
      [
        "サーバから 取り込めるデータ:",
        `  ・自作フレーズ ${serverCount}件`,
        snap.value.progress
          ? `  ・進捗 XP=${snap.value.progress.totalXp} / レベル=${snap.value.progress.level}`
          : "  ・進捗 まだ無し",
        "",
        `この端末のいまのフレーズ ${localCount}件 と進捗は、サーバ側のデータに置き換わります。`,
        "(音声メモは自動同期されません。必要に応じて下のボタンで手動で取り込めます)",
        "続けますか？",
      ].join("\n"),
    );
    if (!proceed) {
      setBusy(false);
      setNotice({
        kind: "info",
        message: "参加を取り消しました。ローカルデータはそのままです。",
      });
      return;
    }

    // ここまで来たらサーバ側を信頼してローカルへ書き戻し。
    saveCustomPhrases(snap.value.phrases);
    if (snap.value.progress) {
      saveProgress(snap.value.progress);
    }
    saveSyncCode(input);
    setCode(input);
    setBusy(false);
    setNotice({
      kind: "ok",
      message:
        "同期コードでの参加が完了しました。次回以降は手動で同期を取り直す必要はありません(Phase 2 時点では自動同期はまだです)。",
    });
  };

  // ---- 同期を解除(コードのみ削除、ローカルデータは残す) ---------------
  const handleDisable = () => {
    const ok = window.confirm(
      "この端末から同期コードを消します。サーバ上のデータはそのまま残ります。続けますか？",
    );
    if (!ok) return;
    clearSyncCode();
    // 自動同期の queue / 最終同期時刻も掃除する(古いコード前提のリトライを残さない)
    clearAllSyncState();
    setCode(null);
    setShowCode(false);
    setQueue([]);
    setLastSyncedAt(null);
    setNotice({
      kind: "info",
      message: "同期を解除しました。データはこのブラウザ内に残っています。",
    });
  };

  // ---- 詰まったキュー項目を 1 件だけ破棄 -------------------------------
  const handleDiscardQueueItem = (id: string) => {
    if (!window.confirm("この未送信アイテムを破棄しますか？(取り消せません)")) {
      return;
    }
    removeFromQueue(id);
    setQueue(loadQueue());
    setNotice({ kind: "info", message: "未送信アイテムを破棄しました。" });
  };

  // ---- 自動同期の失敗分を今すぐ再送 ---------------------------------
  const handleRetryNow = async () => {
    if (retryBusy) return;
    setRetryBusy(true);
    setNotice({ kind: "info", message: "未送信ぶんを再送しています…" });
    try {
      await runFlush();
    } finally {
      setRetryBusy(false);
    }
    const remaining = loadQueue().length;
    if (remaining === 0) {
      setNotice({ kind: "ok", message: "未送信ぶんを送信しました。" });
    } else {
      setNotice({
        kind: "err",
        message: `${remaining}件 まだ送れていません。電波を確認してもう一度試してね。`,
      });
    }
  };

  // ---- 音声メモを R2 へアップロード(手動) ---------------------------
  // ローカル IndexedDB の全件をサーバへ送る。失敗してもローカルは消さない。
  const handleUploadAudio = async () => {
    if (!code || audioBusy) return;
    setAudioBusy(true);
    setNotice({ kind: "info", message: "音声メモを読み出しています…" });

    let local: Awaited<ReturnType<typeof listAllPhraseAudio>>;
    try {
      local = await listAllPhraseAudio();
    } catch {
      setAudioBusy(false);
      setNotice({
        kind: "err",
        message: "この端末の音声メモを読み出せませんでした。",
      });
      return;
    }

    // /phrases/new で使う一時 ID(draft_*)に紐づく音声は、保存前の下書きなので
    // R2 へ送らない。通常はキャンセル/離脱で消えるが、orphan が残った場合の防御。
    const uploadable = local.filter(
      (item) => !item.phraseId.startsWith("draft_"),
    );

    if (uploadable.length === 0) {
      setAudioBusy(false);
      setNotice({
        kind: "info",
        message: "アップロードする音声メモはありません。",
      });
      return;
    }

    let done = 0;
    let failed = 0;
    setAudioProgress({ label: "アップロード", done: 0, total: uploadable.length });
    for (const item of uploadable) {
      const res = await putAudio(
        code,
        item.phraseId,
        item.slot,
        item.blob,
        item.mimeType,
      );
      if (res.ok) {
        done += 1;
      } else {
        failed += 1;
      }
      setAudioProgress({
        label: "アップロード",
        done: done + failed,
        total: uploadable.length,
      });
    }

    setAudioBusy(false);
    setAudioProgress(null);
    if (failed === 0) {
      setNotice({
        kind: "ok",
        message: `${done}件の音声メモをアップロードしました。`,
      });
    } else {
      setNotice({
        kind: "err",
        message: `${done}件アップロード成功 / ${failed}件失敗。\nもう一度試すと続きから送れます。`,
      });
    }
  };

  // ---- 音声メモを R2 から取り込み(手動) -----------------------------
  // サーバ側のリストを取り、IndexedDB に書き戻す。既存ローカル音声は削除しない。
  const handleDownloadAudio = async () => {
    if (!code || audioBusy) return;
    setAudioBusy(true);
    setNotice({ kind: "info", message: "サーバの音声メモを確認しています…" });

    const list = await listRemoteAudio(code);
    if (!list.ok) {
      setAudioBusy(false);
      setNotice({ kind: "err", message: describeFailReason(list.reason) });
      return;
    }
    if (list.value.length === 0) {
      setAudioBusy(false);
      setNotice({
        kind: "info",
        message: "サーバに音声メモはまだありません。",
      });
      return;
    }

    let done = 0;
    let failed = 0;
    setAudioProgress({ label: "取り込み", done: 0, total: list.value.length });
    for (const meta of list.value) {
      const res = await getAudio(code, meta.phraseId, meta.slot);
      if (!res.ok) {
        failed += 1;
      } else {
        try {
          await savePhraseAudio(
            meta.phraseId,
            meta.slot,
            res.value.blob,
            res.value.mimeType,
          );
          done += 1;
        } catch {
          failed += 1;
        }
      }
      setAudioProgress({
        label: "取り込み",
        done: done + failed,
        total: list.value.length,
      });
    }

    setAudioBusy(false);
    setAudioProgress(null);
    if (failed === 0) {
      setNotice({
        kind: "ok",
        message: `${done}件の音声メモを取り込みました。`,
      });
    } else {
      setNotice({
        kind: "err",
        message: `${done}件取り込み成功 / ${failed}件失敗。\nもう一度試すと続きから取り込めます。`,
      });
    }
  };

  // ---- コピー -----------------------------------------------------------
  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setNotice({ kind: "ok", message: "同期コードをコピーしました。" });
    } catch {
      setNotice({
        kind: "err",
        message: "コピーできませんでした。コードを長押しなどで選択してね。",
      });
    }
  };

  // ---- フレーズ・進捗をサーバへ送信(全件)---------------------------
  // 現在のローカルを putSnapshot で投げる。LWW なのでサーバ側が古いものは更新される。
  const handlePushSnapshot = async () => {
    if (!code || snapshotBusy) return;
    setSnapshotBusy(true);
    setNotice({ kind: "info", message: "フレーズ・進捗をサーバへ送信しています…" });

    const phrases = loadCustomPhrases();
    const progress = loadProgress();
    const result = await putSnapshot(code, { phrases, progress });

    setSnapshotBusy(false);
    if (result.ok) {
      setNotice({
        kind: "ok",
        message: `フレーズ ${phrases.length}件 と進捗をサーバに送りました。`,
      });
    } else {
      setNotice({ kind: "err", message: describeFailReason(result.reason) });
    }
  };

  // ---- フレーズ・進捗をサーバから取り込み(全件)-----------------------
  // ユーザー確認のあと、ローカルを上書きする。失敗時はローカル不変。
  const handlePullSnapshot = async () => {
    if (!code || snapshotBusy) return;
    setSnapshotBusy(true);
    setNotice({ kind: "info", message: "サーバから取得しています…" });

    const result = await getSnapshot(code);
    if (!result.ok) {
      setSnapshotBusy(false);
      setNotice({ kind: "err", message: describeFailReason(result.reason) });
      return;
    }

    const localCount = loadCustomPhrases().length;
    const serverCount = result.value.phrases.length;
    const proceed = window.confirm(
      [
        "サーバから 取り込めるデータ:",
        `  ・自作フレーズ ${serverCount}件`,
        result.value.progress
          ? `  ・進捗 XP=${result.value.progress.totalXp} / レベル=${result.value.progress.level}`
          : "  ・進捗 まだ無し",
        "",
        `この端末のフレーズ ${localCount}件と進捗は、サーバ側のデータに置き換わります。`,
        "(音声メモは自動で取り込まれません。必要なら下の「音声メモをサーバから取り込む」を)",
        "続けますか？",
      ].join("\n"),
    );

    if (!proceed) {
      setSnapshotBusy(false);
      setNotice({ kind: "info", message: "取り込みを取り消しました。" });
      return;
    }

    saveCustomPhrases(result.value.phrases);
    if (result.value.progress) {
      saveProgress(result.value.progress);
    }
    setSnapshotBusy(false);
    setNotice({
      kind: "ok",
      message: `フレーズ ${serverCount}件 と進捗をこの端末に取り込みました。`,
    });
  };

  // ---- 保存量の更新 -----------------------------------------------------
  const handleRefreshStorage = async () => {
    if (storageBusy) return;
    setStorageBusy(true);
    try {
      const localAudio = await listAllPhraseAudio();
      const localPhrases = loadCustomPhrases();
      let remoteAudioOk = false;
      let remoteAudioCount = 0;
      let remoteAudioBytes = 0;
      if (code) {
        const remote = await listRemoteAudio(code);
        if (remote.ok) {
          remoteAudioOk = true;
          for (const m of remote.value) {
            remoteAudioCount += 1;
            remoteAudioBytes += m.size;
          }
        }
      }
      setStorage({
        localPhraseCount: localPhrases.length,
        localAudioCount: localAudio.length,
        localAudioBytes: localAudio.reduce((s, a) => s + a.size, 0),
        remoteAudioOk,
        remoteAudioCount,
        remoteAudioBytes,
        fetchedAt: new Date().toISOString(),
      });
    } finally {
      setStorageBusy(false);
    }
  };

  return (
    <section className="card">
      <h2 className="card__title">この端末のデータを同期する</h2>
      <p className="card__heading">PCとスマホで同じデータを使う</p>
      <p className="form-hint">
        同期を使わない場合、データはこのブラウザ内に保存されます。
        <br />
        音声メモは自動同期されません。必要に応じて手動でアップロード／取り込みできます。
      </p>

      {!isEnabled && view === "idle" && (
        <div className="btn-row" style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setNotice({ kind: "idle" });
              setView("creating");
            }}
          >
            同期コードを作成
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setNotice({ kind: "idle" });
              setView("joining");
            }}
          >
            同期コードで参加
          </button>
        </div>
      )}

      {!isEnabled && view === "creating" && (
        <div style={{ marginTop: 8 }}>
          <p className="form-hint-small">
            このボタンを押すと、新しい同期コードが作成され、いまこの端末にあるフレーズと進捗が
            サーバに保存されます。スマホ側では「同期コードで参加」を使ってください。
          </p>
          <div className="btn-row">
            <button
              type="button"
              className="btn"
              onClick={handleCreate}
              disabled={busy}
            >
              {busy ? "作成中…" : "同期を有効にする"}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setView("idle");
                setNotice({ kind: "idle" });
              }}
              disabled={busy}
            >
              やめる
            </button>
          </div>
        </div>
      )}

      {!isEnabled && view === "joining" && (
        <div style={{ marginTop: 8 }}>
          <p className="form-hint-small">
            別の端末で作成した同期コードを貼り付けてください。
          </p>
          <input
            type="text"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            placeholder="同期コードを貼り付け"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              boxSizing: "border-box",
            }}
            disabled={busy}
          />
          <div className="btn-row" style={{ marginTop: 10 }}>
            <button
              type="button"
              className="btn"
              onClick={handleJoin}
              disabled={busy || joinInput.trim().length === 0}
            >
              {busy ? "確認中…" : "このコードで参加する"}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setView("idle");
                setJoinInput("");
                setNotice({ kind: "idle" });
              }}
              disabled={busy}
            >
              やめる
            </button>
          </div>
        </div>
      )}

      {isEnabled && (
        <div style={{ marginTop: 8 }}>
          {/* ---- 自動同期のミニサマリー --------------------------------- */}
          <div
            style={{
              fontSize: 13,
              color: "var(--text-soft)",
              background: "var(--surface-soft)",
              borderRadius: 12,
              padding: "8px 12px",
              marginBottom: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 14px",
              alignItems: "center",
            }}
          >
            <span>自動同期: <strong style={{ color: "var(--primary-strong)" }}>有効</strong></span>
            <span>
              未送信:{" "}
              <strong style={{ color: queue.length > 0 ? "var(--warm)" : "var(--text)" }}>
                {queue.length}件
              </strong>
            </span>
            <span>
              最終同期:{" "}
              <strong style={{ color: "var(--text)" }}>
                {lastSyncedAt
                  ? new Date(lastSyncedAt).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </strong>
            </span>
            {queue.length > 0 && (
              <button
                type="button"
                className="chip-btn"
                onClick={handleRetryNow}
                disabled={retryBusy}
                style={{ marginLeft: "auto" }}
              >
                {retryBusy ? "再送中…" : "今すぐ再送"}
              </button>
            )}
          </div>

          {/* キュー詳細: 1 件以上ある場合だけ表示。何が詰まっているか / 失敗理由 / 個別破棄 */}
          {queue.length > 0 && (
            <div
              style={{
                fontSize: 12,
                background: "var(--surface-soft)",
                borderRadius: 12,
                padding: "8px 12px",
                marginBottom: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {queue.map((item) => {
                const errLabel = describeQueueLastError(item);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                      <strong style={{ color: "var(--text)" }}>
                        {describeQueueItem(item)}
                      </strong>
                      <span style={{ color: "var(--text-faint)" }}>
                        {" "}
                        — 失敗 {item.attempts} 回
                        {errLabel ? ` / ${errLabel}` : ""}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => handleDiscardQueueItem(item.id)}
                    >
                      破棄
                    </button>
                  </div>
                );
              })}
              <p
                className="form-hint-small"
                style={{ marginTop: 2, marginBottom: 0 }}
              >
                破棄すると未送信ぶんは送られず、ローカルだけに残ります。
                次にローカルで何かを変更すれば、新しいスナップショットとして送信されます。
              </p>
            </div>
          )}

          <p className="form-hint-small">
            この端末は同期に参加しています。コードを別の端末で入力すると同じデータが使えます。
          </p>
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              border: "1px dashed var(--border)",
              borderRadius: 12,
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              wordBreak: "break-all",
              background: "var(--surface-soft)",
            }}
          >
            {showCode ? code : maskedCode}
          </div>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setShowCode((v) => !v)}
            >
              {showCode ? "コードを隠す" : "同期コードを表示"}
            </button>
            <button type="button" className="btn btn--secondary" onClick={handleCopyCode}>
              コードをコピー
            </button>
          </div>

          {/* ---- フレーズ・進捗の同期 ------------------------------------ */}
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px dashed var(--border)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                margin: "0 0 4px",
                color: "var(--primary-strong)",
              }}
            >
              フレーズ・進捗の同期
            </h3>
            <p className="form-hint-small">
              ボタンを押したタイミングでだけ、フレーズと進捗をサーバとやり取りします。
              スマホで増やしたフレーズを PC に反映するときは、スマホで「サーバへ送信」、
              PC で「サーバから取り込む」を押してください。
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handlePushSnapshot}
                disabled={snapshotBusy || busy || audioBusy}
              >
                {snapshotBusy ? "処理中…" : "📤 サーバへ送信(全件)"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handlePullSnapshot}
                disabled={snapshotBusy || busy || audioBusy}
              >
                {snapshotBusy ? "処理中…" : "📥 サーバから取り込む(全件)"}
              </button>
            </div>
          </div>

          {/* ---- 音声メモの同期 ----------------------------------------- */}
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px dashed var(--border)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                margin: "0 0 4px",
                color: "var(--primary-strong)",
              }}
            >
              音声メモの同期(オプション)
            </h3>
            <p className="form-hint-small">
              録音した音声メモは、ボタンを押したタイミングでだけサーバとやり取りします。
              うまくいかなかった分は、もう一度押すと続きから送られます。
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleUploadAudio}
                disabled={audioBusy || busy || snapshotBusy}
              >
                {audioBusy && audioProgress?.label === "アップロード"
                  ? `送信中… ${audioProgress.done}/${audioProgress.total}`
                  : "音声メモをサーバへアップロード"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleDownloadAudio}
                disabled={audioBusy || busy || snapshotBusy}
              >
                {audioBusy && audioProgress?.label === "取り込み"
                  ? `取り込み中… ${audioProgress.done}/${audioProgress.total}`
                  : "音声メモをサーバから取り込む"}
              </button>
            </div>
          </div>

          {/* ---- 保存量の見える化 --------------------------------------- */}
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px dashed var(--border)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                margin: "0 0 4px",
                color: "var(--primary-strong)",
              }}
            >
              保存量
            </h3>
            <p className="form-hint-small">
              この端末とサーバに保存されているデータの量を確認できます。
            </p>
            {storage ? (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text)",
                  background: "var(--surface-soft)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  margin: "8px 0",
                }}
              >
                <div>
                  <strong>ローカル(この端末):</strong>{" "}
                  フレーズ {storage.localPhraseCount}件 / 音声 {storage.localAudioCount}件 (
                  {formatBytes(storage.localAudioBytes)})
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>サーバ:</strong>{" "}
                  {storage.remoteAudioOk
                    ? `音声 ${storage.remoteAudioCount}件 (${formatBytes(storage.remoteAudioBytes)})`
                    : "取得できませんでした"}
                </div>
              </div>
            ) : (
              <p className="form-hint-small" style={{ marginTop: 4 }}>
                「更新」を押すと現在の保存量を表示します。
              </p>
            )}
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleRefreshStorage}
                disabled={storageBusy}
              >
                {storageBusy ? "確認中…" : "保存量を更新"}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="danger-link"
            style={{ marginTop: 16 }}
            onClick={handleDisable}
          >
            この端末で同期を解除する
          </button>
        </div>
      )}

      {notice.kind === "info" && (
        <p className="data-notice" style={{ marginTop: 12 }}>
          {notice.message}
        </p>
      )}
      {notice.kind === "ok" && (
        <p className="data-notice data-notice--ok" style={{ marginTop: 12 }}>
          ✓ {notice.message}
        </p>
      )}
      {notice.kind === "err" && (
        <p
          className="data-notice data-notice--err"
          style={{ marginTop: 12, whiteSpace: "pre-line" }}
        >
          ⚠ {notice.message}
        </p>
      )}
    </section>
  );
}
