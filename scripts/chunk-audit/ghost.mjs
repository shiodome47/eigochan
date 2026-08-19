import { JA_SENTENCES } from "/home/user/eigochan/src/data/jaCorpus/index.ts";
const norm = t => " " + t.toLowerCase().replace(/[^a-z0-9' ]/g," ").replace(/\s+/g," ").trim() + " ";
const ghosts = [], thin = [];
for (const s of JA_SENTENCES) {
  if (s.chunks.length < 2) continue;
  const en = norm(s.en);
  // ① チャンクが英文に文字列として存在しない = タップすると英文に無い音が出る
  const bad = s.chunks.filter(c => !en.includes(norm(c)));
  if (bad.length) { ghosts.push({ s, bad }); continue; }
  // ② 抜粋が英文の半分未満しか覆っていない
  const cov = s.chunks.join(" ").replace(/[^a-zA-Z0-9']/g,"").length / s.en.replace(/[^a-zA-Z0-9']/g,"").length;
  if (cov < 0.5) thin.push({ s, cov });
}
console.log(`=== ① チャンクが英文に存在しない (${ghosts.length}) ===`);
ghosts.forEach(g => console.log(`  ${g.s.id}  ${g.s.en}\n        [${g.s.chunks.join(" | ")}]   ✗ ${g.bad.map(b=>`"${b}"`).join(", ")}`));
console.log(`\n=== ② 抜粋が英文の半分未満 (${thin.length}) ===`);
thin.sort((a,b)=>a.cov-b.cov).slice(0,25).forEach(t => console.log(`  ${Math.round(t.cov*100)}%  ${t.s.id}  ${t.s.en}\n        [${t.s.chunks.join(" | ")}]`));
