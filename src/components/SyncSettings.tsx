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

type Notice =
  | { kind: "idle" }
  | { kind: "info"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "err"; message: string };

type View = "idle" | "creating" | "joining";

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

  // 参加済になったら入力欄や中間ビューはクリア
  useEffect(() => {
    if (code) {
      setView("idle");
      setJoinInput("");
    }
  }, [code]);

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
        "(音声メモはまだ同期されません)",
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
    setCode(null);
    setShowCode(false);
    setNotice({
      kind: "info",
      message: "同期を解除しました。データはこのブラウザ内に残っています。",
    });
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

    if (local.length === 0) {
      setAudioBusy(false);
      setNotice({
        kind: "info",
        message: "アップロードする音声メモはありません。",
      });
      return;
    }

    let done = 0;
    let failed = 0;
    setAudioProgress({ label: "アップロード", done: 0, total: local.length });
    for (const item of local) {
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
      setAudioProgress({ label: "アップロード", done: done + failed, total: local.length });
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

  return (
    <section className="card">
      <h2 className="card__title">この端末のデータを同期する</h2>
      <p className="card__heading">PCとスマホで同じデータを使う</p>
      <p className="form-hint">
        同期を使わない場合、データはこのブラウザ内に保存されます。
        <br />
        音声メモの同期はまだ対応していません。
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
                disabled={audioBusy || busy}
              >
                {audioBusy && audioProgress?.label === "アップロード"
                  ? `送信中… ${audioProgress.done}/${audioProgress.total}`
                  : "音声メモをサーバへアップロード"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleDownloadAudio}
                disabled={audioBusy || busy}
              >
                {audioBusy && audioProgress?.label === "取り込み"
                  ? `取り込み中… ${audioProgress.done}/${audioProgress.total}`
                  : "音声メモをサーバから取り込む"}
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
