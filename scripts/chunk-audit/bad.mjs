import { JA_SENTENCES } from "/home/user/eigochan/src/data/jaCorpus/index.ts";

const W = s => s.trim().split(/\s+/).filter(Boolean);
const bare = s => s.toLowerCase().replace(/[^a-z0-9']/g, "");
const isPartition = s => s.chunks.length > 1 && !s.chunks.some(c=>c.includes("...")) &&
  bare(s.chunks.join(" ")) === bare(s.en);

// 次の語と切り離せない語で chunk が終わっている = 区切りが名詞句/不定詞をまたいでいる
const DANGLE = new Set(["a","an","the","my","your","his","her","our","their","its",
  "of","to","for","with","at","in","on","from","by","about","into","than","as","and","or",
  "is","am","are","was","were","be","been","do","does","did","have","has","had",
  "will","would","can","could","should","may","might","must","not","very","really","so","too","more","most"]);
// これだけでは反復する意味がない
const FUNC = new Set(["i","you","we","they","he","she","it","im","its","thats","youre","were","theyre",
  "ill","youll","ive","youve","id","dont","doesnt","didnt","cant","wont","isnt","arent",
  "a","an","the","to","of","in","on","at","for","with","and","but","or","so","just","not",
  "is","am","are","was","were","be","do","does","did","have","has","had","will","would","can","could","should",
  "lets","let","that","this","what","how","when","where","why","who","yeah","oh","sure","well"]);

const out = { short:[], dangle:[], func:[], lonely:[], elide:[] };
for (const s of JA_SENTENCES) {
  if (s.chunks.some(c=>c.includes("..."))) { out.elide.push(s); continue; }
  if (!isPartition(s)) continue;
  const ch = s.chunks, en = W(s.en);
  if (en.length <= 3) out.short.push(s);
  for (let i=0;i<ch.length-1;i++){
    const last = bare(W(ch[i]).at(-1) ?? "");
    if (DANGLE.has(last)) { out.dangle.push([s,last]); break; }
  }
  const f = ch.find(c => W(c).every(w => FUNC.has(bare(w))));
  if (f !== undefined && W(f).length >= 1 && en.length > 3) out.func.push([s,f]);
  const L = ch.map(c=>W(c).length);
  if (Math.min(...L) === 1 && Math.max(...L) >= 5) out.lonely.push(s);
}
const f1 = s => `${s.id}  ${s.en}`.padEnd(62) + `[${s.chunks.join(" | ")}]`;
const show=(t,a,fn)=>{console.log(`\n=== ${t} (${a.length}) ===`); a.forEach(x=>console.log("  "+fn(x)));};
show("A. 3語以下なのに割っている", out.short, f1);
show("B. 区切りの手前が宙ぶらりん", out.dangle, ([s,w])=>f1(s)+`  ←"${w}"で切れる`);
show("C. 機能語だけのチャンクがある", out.func, ([s,c])=>f1(s)+`  ←"${c}"`);
show("D. 1語 + 5語以上の不均衡", out.lonely, f1);
show("E. \"...\" を含む (画面に … と出る)", out.elide, f1);
