// 「今日の練習」で出す範囲。
//
// 既定は全分野。グループを選ぶと、その日の出題を **そのグループだけ** に絞る。
// RealFi のコールが近い週は RealFi だけ、というふうに集中できるようにするための仕組み。
// 分野を分けずに絞れるので、SRS・XP・街・録音はそのまま共有される。

import { JA_DOMAIN_GROUPS } from "../data/jaCorpus";

const KEY = "eigochan.practiceFocus.v1";

/** null = 全分野。文字列 = そのグループだけ。 */
export type PracticeFocus = string | null;

export function loadFocus(): PracticeFocus {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    // グループ名を変えた・消した場合に備えて、実在するものだけ通す。
    return JA_DOMAIN_GROUPS.includes(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveFocus(focus: PracticeFocus): boolean {
  try {
    if (focus === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, focus);
    return true;
  } catch {
    return false;
  }
}

export function focusLabel(focus: PracticeFocus): string {
  return focus ?? "全分野";
}
