import type { JaSentenceInput } from "./types";

// 分野 75: ステーブルコインと利回りを説明する
//
// 2026-07-24 / 07-31 の Office Hours で出た話題から起こした文。
// USDR と sUSDR の違い、交換レート、ペッグ、裏づけ資産、初めての人への説明など。
export const D75_SELF: JaSentenceInput[] = [];

export const D75_ADD: JaSentenceInput[] = [
  { ja: "こちらは一ドルに連動するステーブルコインです。", en: "This one is a stablecoin pegged to one dollar.", ch: ["a stablecoin pegged", "to one dollar"], scene: "説明", to: "相手", imp: "must" },
  { ja: "もう一方は、ステーキングした側のトークンです。", en: "The other one is the staked version of it.", ch: ["the staked version", "of it"], scene: "説明", to: "相手", imp: "must" },
  { ja: "そちらは価格が動くので、ステーブルコインではありません。", en: "That one moves in value, so it isn't a stablecoin.", ch: ["That one moves in value,", "so it isn't a stablecoin"], scene: "説明", to: "相手", imp: "must" },
  { ja: "利回りは、その価格の差として受け取ります。", en: "You receive the yield as that difference in price.", ch: ["You receive the yield as", "that difference in price"], scene: "説明", to: "相手", imp: "must" },
  { ja: "預けると、そのときのレートで受け取ります。", en: "When you stake, you get it at the rate at that time.", ch: ["When you stake,", "at the rate at that time"], scene: "説明", to: "相手", imp: "must" },
  { ja: "引き出すときも、そのときのレートで戻ります。", en: "When you unstake, it converts back at the rate at that time.", ch: ["it converts back", "at the rate at that time"], scene: "説明", to: "相手", imp: "must" },
  { ja: "レートは全員同じですか。", en: "Is the rate the same for everyone?", ch: ["Is the rate the same", "for everyone?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "トークンごとに違うわけではないのですね。", en: "So it isn't different from token to token.", ch: ["So it isn't different", "from token to token"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "取引所でも売り買いできるのですか。", en: "Can it be bought and sold on exchanges as well?", ch: ["Can it be bought and sold", "on exchanges as well?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "二種類あると、初めての人は混乱しませんか。", en: "With two of them, won't newcomers get confused?", ch: ["With two of them,", "won't newcomers get confused?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "画面では一つに見せた方が親切かもしれません。", en: "It might be kinder to show it as one thing on the screen.", ch: ["to show it as one thing", "on the screen"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "価格を保つための仕組みも用意されているのですね。", en: "So there's also a mechanism to hold the price steady.", ch: ["a mechanism to hold", "the price steady"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "裏づけになっているのは暗号資産ではありません。", en: "What backs it is not crypto assets.", ch: ["What backs it", "is not crypto assets"], scene: "説明", to: "相手", imp: "must" },
  { ja: "現実の資産を組み合わせて運用しています。", en: "It's run with a mix of real-world assets.", ch: ["a mix of", "real-world assets"], scene: "説明", to: "相手", imp: "must" },
  { ja: "だから相場の上下に強い、という説明ですね。", en: "So the explanation is that it holds up against market swings.", ch: ["it holds up against", "market swings"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "妻に説明するとしたら、どう言えばいいですか。", en: "If I were explaining it to my wife, how should I put it?", ch: ["If I were explaining it to my wife,", "how should I put it?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "難しい言葉を使わずに説明したいです。", en: "I want to explain it without using difficult words.", ch: ["explain it without", "using difficult words"], scene: "説明", to: "相手", imp: "must" },
  { ja: "元本が保証されるという意味ではありませんよね。", en: "It doesn't mean the principal is guaranteed, does it?", ch: ["It doesn't mean the principal", "is guaranteed, does it?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "そこは正確に伝えないといけません。", en: "That's a part I have to get exactly right.", ch: ["That's a part I have to", "get exactly right"], scene: "説明", to: "相手", imp: "must" },
  { ja: "資料はどこを読むのが早いですか。", en: "Where in the docs is the quickest place to read?", ch: ["Where in the docs is", "the quickest place to read?"], scene: "コール", to: "参加者", imp: "often" },
];
