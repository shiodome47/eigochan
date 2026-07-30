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
import { D11_ADD, D11_SELF } from "./d11Car";
import { D12_ADD, D12_SELF } from "./d12Parking";
import { D13_SELF } from "./d13Directions";
import { D14_SELF } from "./d14Platform";
import { D15_SELF } from "./d15Train";
import { D16_SELF } from "./d16BusTaxi";
import { D17_SELF } from "./d17Cafe";
import { D18_SELF } from "./d18Restaurant";
import { D19_SELF } from "./d19Konbini";
import { D20_SELF } from "./d20Supermarket";
import { D21_SELF } from "./d21Shopping";
import { D22_SELF } from "./d22Clinic";
import { D23_SELF } from "./d23Hotel";
import { D24_SELF } from "./d24Sightseeing";
import { D25_SELF } from "./d25FirstMeeting";
import { D26_SELF } from "./d26SmallTalk";
import { D27_SELF } from "./d27Asking";
import { D28_SELF } from "./d28Experience";
import { D29_SELF } from "./d29Empathy";
import { D30_SELF } from "./d30Reactions";
import { D31_SELF } from "./d31Inviting";
import { D32_SELF } from "./d32Declining";
import { D33_SELF } from "./d33Requests";
import { D34_SELF } from "./d34Apology";
import { D35_SELF } from "./d35Disagreeing";
import { D36_SELF } from "./d36Messaging";
import { D37_SELF } from "./d37EnglishStudy";
import { D38_SELF } from "./d38NotUnderstanding";
import { D39_SELF } from "./d39Computer";
import { D40_SELF } from "./d40AiRequests";
import { D41_SELF } from "./d41OnlineMeeting";
import { D42_SELF } from "./d42Progress";
import { D43_SELF } from "./d43ReportIssue";
import { D44_SELF } from "./d44Confirming";
import { D45_SELF } from "./d45Proposing";
import { D46_SELF } from "./d46Explaining";
import { D47_SELF } from "./d47CardanoBasics";
import { D48_SELF } from "./d48Staking";
import { D49_SELF } from "./d49Spo";
import { D50_SELF } from "./d50Governance";
import { D51_SELF } from "./d51Risk";
import { D52_SELF } from "./d52RealFi";
import { D53_SELF } from "./d53Community";
import { D54_SELF } from "./d54SnsPost";
import { D55_SELF } from "./d55TechSupport";
import { D56_SELF } from "./d56Future";
import { D57_SELF } from "./d57CheckUnderstanding";
import { D58_SELF } from "./d58Rephrasing";
import { D59_SELF } from "./d59Discomfort";
import { D60_SELF } from "./d60FindingIssues";
import { D61_SELF } from "./d61Assumptions";
import { D62_SELF } from "./d62Comparing";
import { D63_SELF } from "./d63Possibilities";
import { D64_SELF } from "./d64Cautious";
import { D65_SELF } from "./d65Revising";
import { D66_SELF } from "./d66AskingDetail";
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
  /** 本人の文に口調を寄せて足した提案文。まだ用意していない分野では省略。 */
  add?: JaSentenceInput[];
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
  11: { self: D11_SELF, add: D11_ADD },
  12: { self: D12_SELF, add: D12_ADD },
  13: { self: D13_SELF },
  14: { self: D14_SELF },
  15: { self: D15_SELF },
  16: { self: D16_SELF },
  17: { self: D17_SELF },
  18: { self: D18_SELF },
  19: { self: D19_SELF },
  20: { self: D20_SELF },
  21: { self: D21_SELF },
  22: { self: D22_SELF },
  23: { self: D23_SELF },
  24: { self: D24_SELF },
  25: { self: D25_SELF },
  26: { self: D26_SELF },
  27: { self: D27_SELF },
  28: { self: D28_SELF },
  29: { self: D29_SELF },
  30: { self: D30_SELF },
  31: { self: D31_SELF },
  32: { self: D32_SELF },
  33: { self: D33_SELF },
  34: { self: D34_SELF },
  35: { self: D35_SELF },
  36: { self: D36_SELF },
  37: { self: D37_SELF },
  38: { self: D38_SELF },
  39: { self: D39_SELF },
  40: { self: D40_SELF },
  41: { self: D41_SELF },
  42: { self: D42_SELF },
  43: { self: D43_SELF },
  44: { self: D44_SELF },
  45: { self: D45_SELF },
  46: { self: D46_SELF },
  47: { self: D47_SELF },
  48: { self: D48_SELF },
  49: { self: D49_SELF },
  50: { self: D50_SELF },
  51: { self: D51_SELF },
  52: { self: D52_SELF },
  53: { self: D53_SELF },
  54: { self: D54_SELF },
  55: { self: D55_SELF },
  56: { self: D56_SELF },
  57: { self: D57_SELF },
  58: { self: D58_SELF },
  59: { self: D59_SELF },
  60: { self: D60_SELF },
  61: { self: D61_SELF },
  62: { self: D62_SELF },
  63: { self: D63_SELF },
  64: { self: D64_SELF },
  65: { self: D65_SELF },
  66: { self: D66_SELF },
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
  (raw.add ?? []).forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "add")));
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
