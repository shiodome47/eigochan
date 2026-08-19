import { JA_SENTENCES } from "/home/user/eigochan/src/data/jaCorpus/index.ts";
import { JA_DOMAINS } from "/home/user/eigochan/src/data/jaCorpus/domains.ts";

const bare = s => s.toLowerCase().replace(/[^a-z0-9']/g, "");
const kind = s => {
  if (s.chunks.length <= 1) return "single";
  if (s.chunks.some(c => c.includes("..."))) return "elide";      // 「Just ...」のように省略記号入り
  return bare(s.chunks.join(" ")) === bare(s.en) ? "partition" : "select";
};

const byDomain = new Map();
const tally = { single: 0, partition: 0, select: 0, elide: 0 };
for (const s of JA_SENTENCES) {
  const k = kind(s);
  tally[k]++;
  if (!byDomain.has(s.domain)) byDomain.set(s.domain, { single:0, partition:0, select:0, elide:0 });
  byDomain.get(s.domain)[k]++;
}
console.log("全体:", tally);
console.log("\n分野ごと (partition = 全文を漏れなく分割 / select = 要点だけ抜粋 / elide = ... 入り)");
console.log("id  分野".padEnd(38), "part  sel  elide  single");
for (const d of JA_DOMAINS) {
  const t = byDomain.get(d.id); if (!t) continue;
  const label = `${String(d.id).padStart(3)} ${d.title}`;
  console.log(label.padEnd(36), String(t.partition).padStart(5), String(t.select).padStart(5), String(t.elide).padStart(5), String(t.single).padStart(6));
}
