// 「今日の練習」で出す範囲。
//
// 既定は全分野。**グループ単位 / 分野単位** のどちらでも絞れる。
// 「今週は RealFi のコールが近いので RealFi だけ」も
// 「今日は 41. オンライン会議だけ」も、同じ 1 文ずつの流れで練習できる。
//
// 別モードを作らずに範囲だけ変えているので、SRS・XP・街・録音はすべて共通。

import { JA_DOMAIN_GROUPS, findJaDomain } from "../data/jaCorpus";

const KEY = "eigochan.practiceFocus.v1";

export type PracticeFocus =
  | { kind: "all" }
  | { kind: "group"; group: string }
  | { kind: "domain"; domain: number };

export const FOCUS_ALL: PracticeFocus = { kind: "all" };

/** その文 (分野) が今の範囲に入っているか。 */
export function focusMatches(focus: PracticeFocus, domainId: number): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return focus.domain === domainId;
  return findJaDomain(domainId)?.group === focus.group;
}

/** 消えた分野・グループを指したままにならないよう、実在するものだけ通す。 */
function sanitize(focus: PracticeFocus): PracticeFocus {
  if (focus.kind === "group") {
    return JA_DOMAIN_GROUPS.includes(focus.group) ? focus : FOCUS_ALL;
  }
  if (focus.kind === "domain") {
    return findJaDomain(focus.domain) ? focus : FOCUS_ALL;
  }
  return FOCUS_ALL;
}

export function loadFocus(): PracticeFocus {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return FOCUS_ALL;
    // v1 初期はグループ名をそのまま入れていたので、そのまま読めるようにしておく。
    if (!raw.startsWith("{")) return sanitize({ kind: "group", group: raw });
    const parsed = JSON.parse(raw) as PracticeFocus;
    return sanitize(parsed);
  } catch {
    return FOCUS_ALL;
  }
}

export function saveFocus(focus: PracticeFocus): boolean {
  try {
    if (focus.kind === "all") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(focus));
    return true;
  } catch {
    return false;
  }
}

/** 画面に出す名前。 */
export function focusLabel(focus: PracticeFocus): string {
  if (focus.kind === "all") return "全分野";
  if (focus.kind === "group") return focus.group;
  const d = findJaDomain(focus.domain);
  return d ? `${String(d.id).padStart(2, "0")}. ${d.title}` : "全分野";
}

/** <select> の value ↔ PracticeFocus。"all" / "g:日常生活" / "d:41"。 */
export function focusToValue(focus: PracticeFocus): string {
  if (focus.kind === "all") return "all";
  if (focus.kind === "group") return `g:${focus.group}`;
  return `d:${focus.domain}`;
}

export function focusFromValue(value: string): PracticeFocus {
  if (value.startsWith("g:")) return sanitize({ kind: "group", group: value.slice(2) });
  if (value.startsWith("d:")) return sanitize({ kind: "domain", domain: Number(value.slice(2)) });
  return FOCUS_ALL;
}

/**
 * `/ja-en/today?domain=41` や `?group=RealFi` から範囲を作る。
 * 分野一覧から「この分野を 1 文ずつ練習する」で飛んでくるときに使う。
 */
export function focusFromParams(params: URLSearchParams): PracticeFocus | null {
  const domain = params.get("domain");
  if (domain !== null && domain !== "") {
    const focus = sanitize({ kind: "domain", domain: Number(domain) });
    return focus.kind === "all" ? null : focus;
  }
  const group = params.get("group");
  if (group) {
    const focus = sanitize({ kind: "group", group });
    return focus.kind === "all" ? null : focus;
  }
  return null;
}
