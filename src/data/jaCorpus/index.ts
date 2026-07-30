import { JA_DOMAINS } from "./domains";
import { D01_MORNING } from "./d01Morning";
import { D02_FAMILY } from "./d02Family";
import { D03_MEAL_DECISION } from "./d03MealDecision";
import type { JaDomain, JaSentence, JaSentenceInput } from "./types";

export type { JaDomain, JaImportance, JaSentence, JaSentenceInput } from "./types";
export { JA_DOMAINS, JA_DOMAIN_GROUPS } from "./domains";

// 分野番号 → その分野の文。
// 書き上げた分野をここに 1 行足していく (未作成の分野は載せない)。
const RAW_BY_DOMAIN: Record<number, JaSentenceInput[]> = {
  1: D01_MORNING,
  2: D02_FAMILY,
  3: D03_MEAL_DECISION,
};

/** "d01_003" 形式の ID。分野内の並び順で決まる (= 並べ替えると評価がずれる)。 */
export function buildJaSentenceId(domainId: number, indexInDomain: number): string {
  return `d${String(domainId).padStart(2, "0")}_${String(indexInDomain).padStart(3, "0")}`;
}

function expand(domainId: number, rows: JaSentenceInput[]): JaSentence[] {
  return rows.map((row, i) => ({
    id: buildJaSentenceId(domainId, i + 1),
    domain: domainId,
    ja: row.ja.trim(),
    en: (row.en ?? "").trim(),
    chunks:
      row.ch && row.ch.length > 0
        ? row.ch.map((c) => c.trim()).filter((c) => c.length > 0)
        : (row.en ?? "").trim()
          ? [(row.en ?? "").trim()]
          : [],
    scene: row.scene ?? "",
    to: row.to ?? "",
    imp: row.imp ?? "often",
  }));
}

// 分野番号の昇順で並べた全文。
export const JA_SENTENCES: JaSentence[] = Object.keys(RAW_BY_DOMAIN)
  .map((k) => Number(k))
  .sort((a, b) => a - b)
  .flatMap((domainId) => expand(domainId, RAW_BY_DOMAIN[domainId]));

const SENTENCE_BY_ID = new Map(JA_SENTENCES.map((s) => [s.id, s]));
const DOMAIN_BY_ID = new Map(JA_DOMAINS.map((d) => [d.id, d]));

export function findJaSentence(id: string): JaSentence | undefined {
  return SENTENCE_BY_ID.get(id);
}

export function findJaDomain(id: number): JaDomain | undefined {
  return DOMAIN_BY_ID.get(id);
}

export function jaSentencesOfDomain(domainId: number): JaSentence[] {
  return JA_SENTENCES.filter((s) => s.domain === domainId);
}

/** 分野番号 → 作成ずみ文数。サイドの進捗表示用。 */
export function jaSentenceCounts(): Map<number, number> {
  const counts = new Map<number, number>();
  for (const s of JA_SENTENCES) {
    counts.set(s.domain, (counts.get(s.domain) ?? 0) + 1);
  }
  return counts;
}

/** 全分野の目標文数の合計 (現状 66 分野 × 40 = 2,640)。 */
export const JA_TARGET_TOTAL = JA_DOMAINS.reduce((sum, d) => sum + d.target, 0);
