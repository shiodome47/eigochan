import type { JaSentenceInput } from "./types";

// 分野 76: 流動性と DeFi 連携
//
// 2026-07-31 の Office Hours (流動性の三つの見方) で出た話題から起こした文。
// 板の厚み、想定どおりの価格で交換できるか、現金化までの時間、連携、図解の要望など。
export const D76_SELF: JaSentenceInput[] = [];

export const D76_ADD: JaSentenceInput[] = [
  { ja: "流動性の話をもう少し聞かせてください。", en: "Could you tell me a bit more about liquidity?", ch: ["Could you tell me a bit more", "about liquidity?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "取引の場には、どのくらいの厚みがありますか。", en: "How much depth is there on the trading side?", ch: ["How much depth is there", "on the trading side?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "大きく交換しても価格が動かないようにしたいですね。", en: "We'd want the price not to move even on a large swap.", ch: ["the price not to move", "even on a large swap"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "思っていた値段で交換できることが大事だと思います。", en: "I think what matters is getting the price you expected.", ch: ["what matters is getting", "the price you expected"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "どこの取引の場で使えるようになりますか。", en: "Which venues will it be available on?", ch: ["Which venues will it", "be available on?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その大きさはどうやって決めているのですか。", en: "How do you decide the size of those?", ch: ["How do you decide", "the size of those?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "相場を予想しなくても成り立つ設計なのですね。", en: "So the design works without having to predict the market.", ch: ["works without having to", "predict the market"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "予想に頼らない方が、私は安心できます。", en: "I feel safer when it doesn't rest on predictions.", ch: ["I feel safer when", "it doesn't rest on predictions"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "現金に戻すまでの時間も見ているのですね。", en: "So you're also looking at how long it takes to turn into cash.", ch: ["how long it takes", "to turn into cash"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "資産によって、戻せるまでの期間が違うのですね。", en: "So the time to get it back differs from asset to asset.", ch: ["the time to get it back", "differs from asset to asset"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "預かっている量に対して、十分な流動性がありますか。", en: "Is there enough liquidity for the amount you're holding?", ch: ["Is there enough liquidity", "for the amount you're holding?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "他のチェーンの資金も呼び込みたいのですね。", en: "So you want to bring in capital from other chains as well.", ch: ["bring in capital", "from other chains"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "使い道が増えれば、預ける人も増えますね。", en: "If there are more uses for it, more people will put money in.", ch: ["If there are more uses for it,", "more people will put money in"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "そこが伸びの起点になるという理解でいいですか。", en: "Is it right that that's where the growth starts?", ch: ["Is it right that", "that's where the growth starts?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その流れが分かる図があると助かります。", en: "A diagram showing that cycle would really help.", ch: ["A diagram showing that cycle", "would really help"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "図にすれば、言葉が違っても伝わりますね。", en: "With a diagram, it gets across even across languages.", ch: ["With a diagram,", "it gets across even across languages"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "日本語でも紹介できるようにしておきたいです。", en: "I'd like to be ready to introduce it in Japanese too.", ch: ["ready to introduce it", "in Japanese too"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "連携先はこれから増えていく予定ですか。", en: "Are more integrations planned from here?", ch: ["Are more integrations", "planned from here?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "どの連携から優先しますか。", en: "Which integration comes first?", ch: ["Which integration", "comes first?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "提案がある場合は、どこに送ればいいですか。", en: "If I have a suggestion, where should I send it?", ch: ["If I have a suggestion,", "where should I send it?"], scene: "議論", to: "参加者", imp: "must" },
];
