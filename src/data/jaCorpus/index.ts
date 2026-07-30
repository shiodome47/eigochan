import { JA_DOMAINS } from "./domains";
import { D01_ADD, D01_SELF } from "./d01Morning";
import { D02_ADD, D02_SELF } from "./d02Family";
import { D03_ADD, D03_SELF } from "./d03MealDecision";
import { D04_ADD, D04_SELF } from "./d04Cooking";
import { D05_ADD, D05_SELF } from "./d05Health";
import { D06_ADD, D06_SELF } from "./d06Housework";
import { D07_ADD, D07_SELF } from "./d07BathBed";
import { D08_ADD, D08_SELF } from "./d08Finding";
import { D09_ADD, D09_SELF } from "./d09Weather";
import { D10_ADD, D10_SELF } from "./d10Planning";
import type { JaAuthor, JaDomain, JaSentence, JaSentenceInput } from "./types";

export type {
  JaAuthor,
  JaDomain,
  JaImportance,
  JaSentence,
  JaSentenceInput,
} from "./types";
export { JA_DOMAINS, JA_DOMAIN_GROUPS } from "./domains";

interface DomainRaw {
  /** 本人が書いた日本語 (原文のまま) */
  self: JaSentenceInput[];
  /** 本人の文に口調を寄せて足した提案文 */
  add: JaSentenceInput[];
}

// 分野番号 → その分野の文。
// 書き上げた分野をここに 1 行足していく (未作成の分野は載せない)。
const RAW_BY_DOMAIN: Record<number, DomainRaw> = {
  1: { self: D01_SELF, add: D01_ADD },
  2: { self: D02_SELF, add: D02_ADD },
  3: { self: D03_SELF, add: D03_ADD },
  4: { self: D04_SELF, add: D04_ADD },
  5: { self: D05_SELF, add: D05_ADD },
  6: { self: D06_SELF, add: D06_ADD },
  7: { self: D07_SELF, add: D07_ADD },
  8: { self: D08_SELF, add: D08_ADD },
  9: { self: D09_SELF, add: D09_ADD },
  10: { self: D10_SELF, add: D10_ADD },
};

/** "d01_003" 形式の ID。分野内の並び順で決まる (= 並べ替えると評価がずれる)。 */
export function buildJaSentenceId(domainId: number, indexInDomain: number): string {
  return `d${String(domainId).padStart(2, "0")}_${String(indexInDomain).padStart(3, "0")}`;
}

function toSentence(
  domainId: number,
  row: JaSentenceInput,
  indexInDomain: number,
  by: JaAuthor,
): JaSentence {
  const en = (row.en ?? "").trim();
  return {
    id: buildJaSentenceId(domainId, indexInDomain),
    domain: domainId,
    ja: row.ja.trim(),
    en,
    chunks:
      row.ch && row.ch.length > 0
        ? row.ch.map((c) => c.trim()).filter((c) => c.length > 0)
        : en
          ? [en]
          : [],
    scene: row.scene ?? "",
    to: row.to ?? "",
    imp: row.imp ?? "often",
    by,
  };
}

// 本人の文 → 追加案 の順に並べる。ID は通し番号。
function expand(domainId: number, raw: DomainRaw): JaSentence[] {
  const out: JaSentence[] = [];
  raw.self.forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "self")));
  raw.add.forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "add")));
  return out;
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

/** 分野番号 → 作成ずみ文数。分野選択の進捗表示用。 */
export function jaSentenceCounts(): Map<number, number> {
  const counts = new Map<number, number>();
  for (const s of JA_SENTENCES) {
    counts.set(s.domain, (counts.get(s.domain) ?? 0) + 1);
  }
  return counts;
}

/** 全分野の目標文数の合計 (現状 66 分野 × 40 = 2,640)。 */
export const JA_TARGET_TOTAL = JA_DOMAINS.reduce((sum, d) => sum + d.target, 0);
