import { JA_SENTENCES } from "/home/user/eigochan/src/data/jaCorpus/index.ts";
import { OPENERS, VERBS, EXTRAS } from "/home/user/eigochan/src/data/chunkBuilder.ts";

const bare = t => t.toLowerCase().replace(/[^a-z0-9' ]/g," ").replace(/\s+/g," ").trim();
const W = t => bare(t).split(" ").filter(Boolean);

// 分断されたら困る定型表現を集める
const set = new Set();
const add = t => { const w = W(String(t).replace(/~|＿|_/g,"")); if (w.length >= 2) set.add(w.join(" ")); };
JA_SENTENCES.forEach(s => s.pattern && add(s.pattern));
[...OPENERS, ...VERBS, ...EXTRAS].forEach(c => add(c.en));
// 手で足す、切れると痛い定番
`do the dishes|keep the change|a lot of|kind of|sort of|out of|as soon as|at all|
in the middle of|take care of|make sure|no need to|end up|used to|have to|ought to|
first of all|by the way|for a while|a bit of|a couple of|plenty of|instead of|
in front of|next to|because of|thanks to|according to|on my way|at the same time|
more than|less than|as well as|not only|either way|both of|all of|one of`
  .split("|").map(x=>x.trim()).filter(Boolean).forEach(add);

const COLLOC = [...set].sort((a,b)=>W(b).length - W(a).length);
console.log(`定型表現 ${COLLOC.length} 個で照合`);

const hits = [];
for (const s of JA_SENTENCES) {
  if (s.chunks.length < 2) continue;
  if (s.chunks.some(c => c.includes("..."))) continue;
  if (W(s.chunks.join(" ")).join(" ") !== W(s.en).join(" ")) continue; // 全文分割のものだけ

  // 各チャンクの語数から、区切りの位置 (語インデックス) を出す
  const cuts = [];
  let n = 0;
  for (let i = 0; i < s.chunks.length - 1; i++) { n += W(s.chunks[i]).length; cuts.push(n); }
  const sw = W(s.en);
  for (const col of COLLOC) {
    const cw = col.split(" ");
    for (let i = 0; i + cw.length <= sw.length; i++) {
      if (!cw.every((x,k) => sw[i+k] === x)) continue;
      const cut = cuts.find(c => c > i && c < i + cw.length);
      if (cut !== undefined) { hits.push({ s, col, cut }); }
    }
  }
}
// 1文につき最長の1件だけ
const seen = new Set(); const uniq = [];
for (const h of hits.sort((a,b)=>b.col.length-a.col.length)) {
  if (seen.has(h.s.id)) continue; seen.add(h.s.id); uniq.push(h);
}
uniq.sort((a,b)=>a.s.id.localeCompare(b.s.id));
console.log(`\n=== 定型表現を区切りが分断している (${uniq.length}) ===`);
uniq.forEach(h => console.log(`  ${h.s.id}  ${h.s.en}`.padEnd(60) + `[${h.s.chunks.join(" | ")}]   ✂ "${h.col}"`));
