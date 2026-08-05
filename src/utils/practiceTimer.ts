// 「この分野を N 分で 1 周する」ための持ち時間の設定。
//
// 音は鳴らさない。時間が来たら見た目だけで知らせる。
// (練習中に音が鳴ると、声を出している最中の集中が切れるため。)

const KEY = "eigochan.jaTimer.v1";

/** 0 = 使わない (タイマーを出さない)。 */
export const TIMER_PRESETS: { seconds: number; label: string }[] = [
  { seconds: 0, label: "使わない" },
  { seconds: 60, label: "1 分" },
  { seconds: 180, label: "3 分" },
  { seconds: 300, label: "5 分" },
  { seconds: 600, label: "10 分" },
  { seconds: 900, label: "15 分" },
  { seconds: 1200, label: "20 分" },
];

export const DEFAULT_TIMER_SECONDS = 600;

export function loadTimerSeconds(): number {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_TIMER_SECONDS;
    const n = Number(raw);
    // 設定にない値が入っていたら既定に戻す。
    return TIMER_PRESETS.some((p) => p.seconds === n) ? n : DEFAULT_TIMER_SECONDS;
  } catch {
    return DEFAULT_TIMER_SECONDS;
  }
}

export function saveTimerSeconds(seconds: number): boolean {
  try {
    localStorage.setItem(KEY, String(seconds));
    return true;
  } catch {
    return false;
  }
}

/** 123 → "2:03"。 */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

/** 持ち時間を文の数で割った、1 文あたりの目安 (秒)。秒数を決める助けに出す。 */
export function perSentenceHint(seconds: number, count: number): string {
  if (seconds <= 0 || count <= 0) return "";
  const per = seconds / count;
  if (per >= 60) return `1 文あたり 約 ${Math.round(per / 6) / 10} 分`;
  return `1 文あたり 約 ${Math.round(per)} 秒`;
}
