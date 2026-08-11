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
import { D13_ADD, D13_SELF } from "./d13Directions";
import { D14_ADD, D14_SELF } from "./d14Platform";
import { D15_ADD, D15_SELF } from "./d15Train";
import { D16_ADD, D16_SELF } from "./d16BusTaxi";
import { D17_ADD, D17_SELF } from "./d17Cafe";
import { D18_ADD, D18_SELF } from "./d18Restaurant";
import { D19_ADD, D19_SELF } from "./d19Konbini";
import { D20_ADD, D20_SELF } from "./d20Supermarket";
import { D21_ADD, D21_SELF } from "./d21Shopping";
import { D22_ADD, D22_SELF } from "./d22Clinic";
import { D23_ADD, D23_SELF } from "./d23Hotel";
import { D24_ADD, D24_SELF } from "./d24Sightseeing";
import { D25_ADD, D25_SELF } from "./d25FirstMeeting";
import { D26_ADD, D26_SELF } from "./d26SmallTalk";
import { D27_ADD, D27_SELF } from "./d27Asking";
import { D28_ADD, D28_SELF } from "./d28Experience";
import { D29_ADD, D29_SELF } from "./d29Empathy";
import { D30_ADD, D30_SELF } from "./d30Reactions";
import { D31_ADD, D31_SELF } from "./d31Inviting";
import { D32_ADD, D32_SELF } from "./d32Declining";
import { D33_ADD, D33_SELF } from "./d33Requests";
import { D34_ADD, D34_SELF } from "./d34Apology";
import { D35_ADD, D35_SELF } from "./d35Disagreeing";
import { D36_ADD, D36_SELF } from "./d36Messaging";
import { D37_ADD, D37_SELF } from "./d37EnglishStudy";
import { D38_ADD, D38_SELF } from "./d38NotUnderstanding";
import { D39_ADD, D39_SELF } from "./d39Computer";
import { D40_ADD, D40_SELF } from "./d40AiRequests";
import { D41_ADD, D41_SELF } from "./d41OnlineMeeting";
import { D42_ADD, D42_SELF } from "./d42Progress";
import { D43_ADD, D43_SELF } from "./d43ReportIssue";
import { D44_ADD, D44_SELF } from "./d44Confirming";
import { D45_ADD, D45_SELF } from "./d45Proposing";
import { D46_ADD, D46_SELF } from "./d46Explaining";
import { D47_ADD, D47_SELF } from "./d47CardanoBasics";
import { D48_ADD, D48_SELF } from "./d48Staking";
import { D49_ADD, D49_SELF } from "./d49Spo";
import { D50_ADD, D50_SELF } from "./d50Governance";
import { D51_ADD, D51_SELF } from "./d51Risk";
import { D52_ADD, D52_SELF } from "./d52RealFi";
import { D53_ADD, D53_SELF } from "./d53Community";
import { D54_ADD, D54_SELF } from "./d54SnsPost";
import { D55_ADD, D55_SELF } from "./d55TechSupport";
import { D56_ADD, D56_SELF } from "./d56Future";
import { D57_ADD, D57_SELF } from "./d57CheckUnderstanding";
import { D58_ADD, D58_SELF } from "./d58Rephrasing";
import { D59_ADD, D59_SELF } from "./d59Discomfort";
import { D60_ADD, D60_SELF } from "./d60FindingIssues";
import { D61_ADD, D61_SELF } from "./d61Assumptions";
import { D62_ADD, D62_SELF } from "./d62Comparing";
import { D63_ADD, D63_SELF } from "./d63Possibilities";
import { D64_ADD, D64_SELF } from "./d64Cautious";
import { D65_ADD, D65_SELF } from "./d65Revising";
import { D66_ADD, D66_SELF } from "./d66AskingDetail";
import { D67_ADD, D67_SELF } from "./d67RealfiCallOpen";
import { D68_ADD, D68_SELF } from "./d68RealfiUpdate";
import { D69_ADD, D69_SELF } from "./d69RealfiRespond";
import { D70_ADD, D70_SELF } from "./d70RealfiField";
import { D71_ADD, D71_SELF } from "./d71RealfiFunding";
import { D72_ADD, D72_SELF } from "./d72RealfiNextSteps";
import { D73_ADD, D73_SELF } from "./d73RealfiNumbers";
import { D74_ADD, D74_SELF } from "./d74RealfiSpoProgram";
import { D75_ADD, D75_SELF } from "./d75RealfiStablecoin";
import { D76_ADD, D76_SELF } from "./d76RealfiLiquidity";
import { D77_ADD, D77_SELF } from "./d77RealfiRoadmap";
import { D78_ADD, D78_SELF } from "./d78RealfiFeedback";
import { D79_ADD, D79_SELF } from "./d79PatternCheck";
import { D80_ADD, D80_SELF } from "./d80PatternThink";
import { D81_ADD, D81_SELF } from "./d81PatternPlan";
import { D82_ADD, D82_SELF } from "./d82PatternFeel";
import { D83_ADD, D83_SELF } from "./d83PatternExplain";
import { D84_ADD, D84_SELF } from "./d84PatternAsk";
import { D85_ADD, D85_SELF } from "./d85PatternRequest";
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
  /**
   * **あとから足した本人の文**。self / add の後ろに付くので、既にある文の ID がずれない。
   * 先に add だけ用意した分野 (RealFi など) に、文字起こしから起こした本人の文を
   * 足すときはここに入れる。self に足すと ID が総入れ替えになり、評価と SRS がずれる。
   */
  late?: JaSentenceInput[];
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
  13: { self: D13_SELF, add: D13_ADD },
  14: { self: D14_SELF, add: D14_ADD },
  15: { self: D15_SELF, add: D15_ADD },
  16: { self: D16_SELF, add: D16_ADD },
  17: { self: D17_SELF, add: D17_ADD },
  18: { self: D18_SELF, add: D18_ADD },
  19: { self: D19_SELF, add: D19_ADD },
  20: { self: D20_SELF, add: D20_ADD },
  21: { self: D21_SELF, add: D21_ADD },
  22: { self: D22_SELF, add: D22_ADD },
  23: { self: D23_SELF, add: D23_ADD },
  24: { self: D24_SELF, add: D24_ADD },
  25: { self: D25_SELF, add: D25_ADD },
  26: { self: D26_SELF, add: D26_ADD },
  27: { self: D27_SELF, add: D27_ADD },
  28: { self: D28_SELF, add: D28_ADD },
  29: { self: D29_SELF, add: D29_ADD },
  30: { self: D30_SELF, add: D30_ADD },
  31: { self: D31_SELF, add: D31_ADD },
  32: { self: D32_SELF, add: D32_ADD },
  33: { self: D33_SELF, add: D33_ADD },
  34: { self: D34_SELF, add: D34_ADD },
  35: { self: D35_SELF, add: D35_ADD },
  36: { self: D36_SELF, add: D36_ADD },
  37: { self: D37_SELF, add: D37_ADD },
  38: { self: D38_SELF, add: D38_ADD },
  39: { self: D39_SELF, add: D39_ADD },
  40: { self: D40_SELF, add: D40_ADD },
  41: { self: D41_SELF, add: D41_ADD },
  42: { self: D42_SELF, add: D42_ADD },
  43: { self: D43_SELF, add: D43_ADD },
  44: { self: D44_SELF, add: D44_ADD },
  45: { self: D45_SELF, add: D45_ADD },
  46: { self: D46_SELF, add: D46_ADD },
  47: { self: D47_SELF, add: D47_ADD },
  48: { self: D48_SELF, add: D48_ADD },
  49: { self: D49_SELF, add: D49_ADD },
  50: { self: D50_SELF, add: D50_ADD },
  51: { self: D51_SELF, add: D51_ADD },
  52: { self: D52_SELF, add: D52_ADD },
  53: { self: D53_SELF, add: D53_ADD },
  54: { self: D54_SELF, add: D54_ADD },
  55: { self: D55_SELF, add: D55_ADD },
  56: { self: D56_SELF, add: D56_ADD },
  57: { self: D57_SELF, add: D57_ADD },
  58: { self: D58_SELF, add: D58_ADD },
  59: { self: D59_SELF, add: D59_ADD },
  60: { self: D60_SELF, add: D60_ADD },
  61: { self: D61_SELF, add: D61_ADD },
  62: { self: D62_SELF, add: D62_ADD },
  63: { self: D63_SELF, add: D63_ADD },
  64: { self: D64_SELF, add: D64_ADD },
  65: { self: D65_SELF, add: D65_ADD },
  66: { self: D66_SELF, add: D66_ADD },
  67: { self: D67_SELF, add: D67_ADD },
  68: { self: D68_SELF, add: D68_ADD },
  69: { self: D69_SELF, add: D69_ADD },
  70: { self: D70_SELF, add: D70_ADD },
  71: { self: D71_SELF, add: D71_ADD },
  72: { self: D72_SELF, add: D72_ADD },
  73: { self: D73_SELF, add: D73_ADD },
  74: { self: D74_SELF, add: D74_ADD },
  75: { self: D75_SELF, add: D75_ADD },
  76: { self: D76_SELF, add: D76_ADD },
  77: { self: D77_SELF, add: D77_ADD },
  78: { self: D78_SELF, add: D78_ADD },
  79: { self: D79_SELF, add: D79_ADD },
  80: { self: D80_SELF, add: D80_ADD },
  81: { self: D81_SELF, add: D81_ADD },
  82: { self: D82_SELF, add: D82_ADD },
  83: { self: D83_SELF, add: D83_ADD },
  84: { self: D84_SELF, add: D84_ADD },
  85: { self: D85_SELF, add: D85_ADD },
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
    pattern: row.pat ?? "",
  };
}

// 本人の文 → 追加案 → あとから足した本人の文 の順に並べる。ID は通し番号。
// この順番を変えると既存の評価・SRS が別の文にずれるので、追加は必ず末尾に。
function expand(domainId: number, raw: DomainRaw): JaSentence[] {
  const out: JaSentence[] = [];
  raw.self.forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "self")));
  (raw.add ?? []).forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "add")));
  (raw.late ?? []).forEach((row) => out.push(toSentence(domainId, row, out.length + 1, "self")));
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

/** 全分野の目標文数の合計 (現状 85 分野 × 40 = 3,400)。 */
export const JA_TARGET_TOTAL = JA_DOMAINS.reduce((sum, d) => sum + d.target, 0);
