// Chrome の beforeinstallprompt を **アプリの起動直後から** 受け取っておくための箱。
//
// このイベントはページ読み込みの早い段階で 1 度だけ飛んでくるので、
// React のコンポーネントが useEffect でリスナーを付けるころには
// もう終わっていることがある。そこで main.tsx から最初に読み込んで、
// window に付けたリスナーでイベントを保持しておく。

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

function emit() {
  listeners.forEach((fn) => fn(deferred));
}

interface WindowWithInstall extends Window {
  __eigochanInstallEvent?: BeforeInstallPromptEvent;
}

/** main.tsx から 1 度だけ呼ぶ。 */
export function listenForInstallPrompt(): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithInstall;

  // index.html のインラインスクリプトが先に受け止めていたら、それを引き継ぐ。
  const takeStashed = () => {
    if (w.__eigochanInstallEvent && deferred !== w.__eigochanInstallEvent) {
      deferred = w.__eigochanInstallEvent;
      emit();
    }
  };
  takeStashed();
  window.addEventListener("eigochan:installready", takeStashed);

  window.addEventListener("beforeinstallprompt", (e) => {
    // 既定のミニバーは出さず、アプリ内のボタンから出す。
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    clearInstallPrompt();
  });
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferred;
}

export function clearInstallPrompt(): void {
  deferred = null;
  if (typeof window !== "undefined") {
    delete (window as WindowWithInstall).__eigochanInstallEvent;
  }
  emit();
}

export function subscribeInstallPrompt(
  fn: (e: BeforeInstallPromptEvent | null) => void,
): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
