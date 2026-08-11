// 分野ごとのメモと周回カウンター。
//
// 「この分野をとりあえず 21 周回そう」のように、**自分で決めた回し方を記録しておく** ための場所。
// SRS が出題を決めるのとは別に、人が自分で数えて満足するための欄なので、
// 中身の意味はアプリ側では一切解釈しない (数字も文章も自由)。
//
// 評価・メモと同じくこの端末の localStorage だけに保存する。

const KEY = "eigochan.jaDomainNote.v1";

export interface JaDomainNote {
  /** 自由メモ。 */
  note: string;
  /** 周回した回数。＋ボタンで増やす。 */
  rounds: number;
  /** 最後に触った日時 (ISO)。 */
  updated: string;
}

export type JaDomainNoteMap = Record<number, JaDomainNote>;

export const EMPTY_DOMAIN_NOTE: JaDomainNote = { note: "", rounds: 0, updated: "" };

export function loadJaDomainNotes(): JaDomainNoteMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: JaDomainNoteMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      const row = (v ?? {}) as Record<string, unknown>;
      out[id] = {
        note: typeof row.note === "string" ? row.note : "",
        rounds: typeof row.rounds === "number" && row.rounds >= 0 ? Math.floor(row.rounds) : 0,
        updated: typeof row.updated === "string" ? row.updated : "",
      };
    }
    return out;
  } catch {
    return {};
  }
}

export function saveJaDomainNotes(map: JaDomainNoteMap): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

export function clearJaDomainNotes(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 無視
  }
}

function touch(prev: JaDomainNote | undefined, patch: Partial<JaDomainNote>): JaDomainNote {
  const base = prev ?? EMPTY_DOMAIN_NOTE;
  return { ...base, ...patch, updated: new Date().toISOString() };
}

export function setDomainNoteText(
  map: JaDomainNoteMap,
  domainId: number,
  note: string,
): JaDomainNoteMap {
  return { ...map, [domainId]: touch(map[domainId], { note }) };
}

/** 周回数を増減する。0 未満にはしない。 */
export function bumpDomainRounds(
  map: JaDomainNoteMap,
  domainId: number,
  delta: number,
): JaDomainNoteMap {
  const rounds = Math.max(0, (map[domainId]?.rounds ?? 0) + delta);
  return { ...map, [domainId]: touch(map[domainId], { rounds }) };
}
