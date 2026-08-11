// localStorage / IndexedDB を React の外から書き換えたあと、
// 画面上の state を再読み込みさせるための軽い pub/sub。
//
// 手動同期 pull / 参加、起動時の自動 pull などで使う。

type Listener = () => void;

let listeners: Listener[] = [];

export function subscribeLocalDataReload(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

export function notifyLocalDataReload(): void {
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      // 無視
    }
  }
}
