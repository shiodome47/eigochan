import { useEffect, useState } from "react";

// 「ホーム画面に追加」の案内。
//
// PWA の要件 (manifest / アイコン / Service Worker / HTTPS) は満たしているが、
// 実際に追加できるかは **ブラウザ次第** なので、環境を見て案内を出し分ける。
//
// - Android Chrome など: beforeinstallprompt を捕まえてボタン 1 つで追加できる。
// - iPhone / iPad: OS 側が API を出していないので、Safari の共有メニューを案内する。
// - すでにホーム画面から開いている場合: 何も出さない。

const DISMISS_KEY = "eigochan.installHintDismissed.v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** ホーム画面のアイコンから開いている (= すでに追加ずみ) か。 */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS Safari だけの独自プロパティ。
  return (window.navigator as { standalone?: boolean }).standalone === true;
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  // iPadOS 13 以降は Macintosh を名乗るので、タッチの有無で見分ける。
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}

/**
 * iOS で「ホーム画面に追加」が出るブラウザか。
 * Safari と、iOS 版 Chrome / Edge (中身は WebKit) は共有メニューから追加できる。
 * LINE や X のアプリ内ブラウザには共有メニューが無く、追加できない。
 */
function iosBrowserLabel(): { canAdd: boolean; name: string } {
  const ua = navigator.userAgent;
  if (/CriOS/.test(ua)) return { canAdd: true, name: "Chrome" };
  if (/EdgiOS/.test(ua)) return { canAdd: true, name: "Edge" };
  if (/FxiOS/.test(ua)) return { canAdd: false, name: "Firefox" };
  // アプリ内ブラウザ (LINE / Facebook / X など) は Safari を名乗るが Version/ を持たない。
  if (/Line|FBAN|FBAV|Instagram|Twitter/.test(ua)) {
    return { canAdd: false, name: "アプリ内ブラウザ" };
  }
  if (/Safari/.test(ua) && /Version\//.test(ua)) return { canAdd: true, name: "Safari" };
  return { canAdd: false, name: "このブラウザ" };
}

export function InstallHint() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [installed, setInstalled] = useState(() => isStandalone());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // 既定のミニバーを止めて、こちらのボタンから出す。
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  const ios = isIos();
  const iosBrowser = ios ? iosBrowserLabel() : null;
  // Android などで API も無く iOS でもない = 追加できるか判断できないので出さない
  // (PC のブラウザで毎回この案内が出ると邪魔なため)。
  if (!ios && !installEvent) return null;

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
    setInstallEvent(null);
    if (choice.outcome === "accepted") setInstalled(true);
    else setMessage("あとからブラウザのメニューでも追加できます。");
  };

  return (
    <section className="card install-hint">
      <h2 className="card__title">ホーム画面に置く</h2>
      <p className="card__heading">
        アイコンから開けるようにすると、毎日の 1 回目が速くなります。
      </p>

      {installEvent ? (
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => void install()}>
            📲 ホーム画面に追加する
          </button>
        </div>
      ) : (
        <ol className="install-hint__steps">
          <li>
            画面下 (または上) の <b>共有ボタン</b> <span aria-hidden="true">□↑</span> を押す
          </li>
          <li>
            メニューを下にスクロールして <b>「ホーム画面に追加」</b> を押す
          </li>
          <li>右上の「追加」で完了です</li>
        </ol>
      )}

      {iosBrowser && !iosBrowser.canAdd && (
        <p className="install-hint__warn">
          いま {iosBrowser.name} で開いています。iPhone / iPad では
          <b> Safari で開いたときだけ</b> ホーム画面に追加できます。
          このページの URL を Safari で開き直してから、もう一度お試しください。
        </p>
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
