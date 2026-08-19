import { JA_SENTENCES } from "/home/user/eigochan/src/data/jaCorpus/index.ts";
const bare = t => t.toLowerCase().replace(/[^a-z0-9' ]/g," ").replace(/\s+/g," ").trim();
const W = t => bare(t).split(" ").filter(Boolean);

// 型/チャンクを持つ文で、型が 1 つのチャンクに収まっているか
const cut = [], ok = [], absent = [];
for (const s of JA_SENTENCES) {
  if (!s.pattern) continue;
  const pw = W(s.pattern.replace(/~|＿|_/g, ""));
  if (pw.length < 2) continue;
  const sw = W(s.en);
  let at = -1;
  for (let i = 0; i + pw.length <= sw.length; i++) if (pw.every((p,k)=>sw[i+k]===p)) { at = i; break; }
  if (at < 0) { absent.push(s); continue; }
  const cuts = []; let n = 0;
  for (let i = 0; i < s.chunks.length - 1; i++) { n += W(s.chunks[i]).length; cuts.push(n); }
  const broken = cuts.some(c => c > at && c < at + pw.length);
  (broken ? cut : ok).push(s);
}
console.log(`型つきの文 ${cut.length + ok.length + absent.length} | 型が 1 チャンクに収まっている ${ok.length} | 分断 ${cut.length} | 英文に型が見当たらない ${absent.length}`);
console.log(`\n=== 型が 2 つのチャンクに割れている (${cut.length}) ===`);
cut.forEach(s => console.log(`  ${s.id}  ${s.en}`.padEnd(58) + `[${s.chunks.join(" | ")}]  型: ${s.pattern}`));
console.log(`\n=== 英文中に型の語順が見当たらない (${absent.length}) ===`);
absent.slice(0,40).forEach(s => console.log(`  ${s.id}  ${s.en}`.padEnd(58) + `型: ${s.pattern}`));
