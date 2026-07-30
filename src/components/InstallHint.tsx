import { useEffect, useState } from "react";
import {
  clearInstallPrompt,
  getInstallPrompt,
  subscribeInstallPrompt,
  type BeforeInstallPromptEvent,
} from "../utils/installPrompt";

// 「ホーム画面に追加」の案内。
//
// PWA の要件 (manifest / アイコン / Service Worker / HTTPS) は満たしているので、
// あとは **どのブラウザで開いているか** で追加できるかどうかが決まる。
// そこで環境を見て、押せるならボタン、押せないなら手順を出す。
//
// Chrome の beforeinstallprompt は「まだ入れていない」「条件を満たした」ときにしか
// 飛んでこないので、**イベントが無くても手順は必ず出す**。
// (イベント待ちにすると、来なかった端末では画面に何も出ずに詰む。)

const DISMISS_KEY = "eigochan.installHintDismissed.v1";

type Platform = "ios" | "android" | "desktop";

/** ホーム画面のアイコンから開いている (= すでに追加ずみ) か。 */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  if (window.matchMedia?.("(display-mode: fullscreen)").matches) return true;
  // iOS Safari だけの独自プロパティ。
  return (window.navigator as { standalone?: boolean }).standalone === true;
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  // iPadOS 13 以降は Macintosh を名乗るので、タッチの有無で見分ける。
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/** 追加できないブラウザなら、その名前を返す。追加できるなら null。 */
function blockedBrowser(platform: Platform): string | null {
  const ua = navigator.userAgent;
  // アプリ内ブラウザ (LINE / Facebook / Instagram / X) は共有メニューも
  // インストールメニューも無いので、どの OS でも追加できない。
  if (/Line\//.test(ua)) return "LINE のアプリ内ブラウザ";
  if (/FBAN|FBAV/.test(ua)) return "Facebook のアプリ内ブラウザ";
  if (/Instagram/.test(ua)) return "Instagram のアプリ内ブラウザ";
  if (/\bTwitter/.test(ua)) return "X のアプリ内ブラウザ";
  if (platform === "ios") {
    if (/FxiOS/.test(ua)) return "Firefox";
    // iOS の Safari / Chrome / Edge は共有メニューから追加できる。
    if (/CriOS|EdgiOS/.test(ua)) return null;
    if (/Safari/.test(ua) && /Version\//.test(ua)) return null;
    return null;
  }
  return null;
}

const STEPS: Record<Platform, string[]> = {
  ios: [
    "画面の下 (または上) にある共有ボタン □↑ を押す",
    "メニューを下にスクロールして「ホーム画面に追加」を押す",
    "右上の「追加」で完了です",
  ],
  android: [
    "画面の右上のメニュー ⋮ を押す",
    "「アプリをインストール」または「ホーム画面に追加」を押す",
    "「インストール」/「追加」で完了です",
  ],
  desktop: [
    "アドレスバーの右にあるインストールアイコン ⊕ を押す",
    "「インストール」を押すと、アプリとして開けるようになります",
  ],
};

export function InstallHint() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(() =>
    getInstallPrompt(),
  );
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [installed, setInstalled] = useState(() => isStandalone());
  const [message, setMessage] = useState<string | null>(null);

  // 起動直後に捕まえたイベントを受け取る (後から飛んできた場合もここで拾う)。
  useEffect(() => subscribeInstallPrompt(setInstallEvent), []);

  useEffect(() => {
    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  if (installed || dismissed) return null;

  const platform = detectPlatform();
  const blocked = blockedBrowser(platform);

  const hide = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage が使えない環境ではこの回だけ閉じる。
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    // prompt() は 1 度しか使えないので、結果にかかわらず捨てる。
    clearInstallPrompt();
    if (choice.outcome === "accepted") setInstalled(true);
    else setMessage("下の手順で、あとからでも追加できます。");
  };

  return (
    <section className="card install-hint">
      <h2 className="card__title">ホーム画面に置く</h2>
      <p className="card__heading">
        アイコンから開けるようにすると、毎日の 1 回目が速くなります。
      </p>

      {installEvent && !blocked && (
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => void install()}>
            📲 ホーム画面に追加する
          </button>
        </div>
      )}

      {blocked ? (
        <p className="install-hint__warn">
          いま <b>{blocked}</b> で開いています。このブラウザからはホーム画面に追加できません。
          {platform === "ios"
            ? "URL を Safari で開き直してから、もう一度お試しください。"
            : "URL を Chrome で開き直してから、もう一度お試しください。"}
        </p>
      ) : (
        <>
          <p className="install-hint__lead">
            {installEvent ? "うまくいかないときは、手動でも追加できます:" : "追加のしかた:"}
          </p>
          <ol className="install-hint__steps">
            {STEPS[platform].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {platform === "android" && (
            <p className="install-hint__note">
              メニューに出てこないときは、Chrome で開いているか確認してください
              (LINE などのアプリ内ブラウザからは追加できません)。
            </p>
          )}
        </>
      )}

      {message && <p className="install-hint__note">{message}</p>}

      <div className="btn-row">
        <button type="button" className="btn btn--ghost btn--small" onClick={hide}>
          この案内を閉じる
        </button>
      </div>
    </section>
  );
}
