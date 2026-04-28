// 日本時間(JST, UTC+9)基準の日付ユーティリティ。
// ブラウザのタイムゾーンに依存させたくないため、
// 端末がどこにあっても JST 基準で日付を扱う。

const JST_OFFSET_MIN = 9 * 60;

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

// 任意の Date を JST のローカル相当(年月日時分秒)で表す Date を返す。
// この Date の getFullYear/getMonth/getDate などを読み出すと JST 基準の値になる。
export function toJst(d: Date = new Date()): Date {
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60_000;
  return new Date(utcMs + JST_OFFSET_MIN * 60_000);
}

export function todayString(now: Date = new Date()): string {
  const j = toJst(now);
  return `${j.getFullYear()}-${pad(j.getMonth() + 1)}-${pad(j.getDate())}`;
}

export function yesterdayString(now: Date = new Date()): string {
  const j = toJst(now);
  const prev = new Date(j.getFullYear(), j.getMonth(), j.getDate() - 1);
  return `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}-${pad(prev.getDate())}`;
}

export function nowJstIso(now: Date = new Date()): string {
  const j = toJst(now);
  return `${j.getFullYear()}-${pad(j.getMonth() + 1)}-${pad(j.getDate())}T${pad(j.getHours())}:${pad(j.getMinutes())}:${pad(j.getSeconds())}+09:00`;
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map((v) => Number(v));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  const ms = db.getTime() - da.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatDateLabel(s: string | null): string {
  if (!s) return "—";
  const d = parseDate(s);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
