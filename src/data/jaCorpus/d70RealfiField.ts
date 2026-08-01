import type { JaSentenceInput } from "./types";

// 分野 70: RealFi の現場と数字について聞く・話す
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D70_SELF: JaSentenceInput[] = [];

export const D70_ADD: JaSentenceInput[] = [
  { ja: "実際に使っている人はどのくらいいますか。", en: "How many people are actually using it?", ch: ["How many people", "are actually using it?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その数字はどこから出ていますか。", en: "Where does that number come from?", ch: ["Where does that number", "come from?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "先月と比べてどうですか。", en: "How does that compare with last month?", ch: ["How does that compare", "with last month?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "増えているのか、減っているのかを知りたいです。", en: "I want to know whether it's going up or down.", ch: ["whether it's going up", "or down"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "現地では実際にどう使われていますか。", en: "How is it actually being used on the ground?", ch: ["How is it actually being used", "on the ground?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "使い方を教える人は足りていますか。", en: "Are there enough people to show them how to use it?", ch: ["enough people to show them", "how to use it"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "通信環境は問題になっていませんか。", en: "Is the network connection causing problems?", ch: ["Is the network connection", "causing problems?"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "スマホを持っていない人はどうしていますか。", en: "What about people who don't have a smartphone?", ch: ["What about people", "who don't have a smartphone?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "手数料は利用者の負担になっていませんか。", en: "Are the fees a burden for the users?", ch: ["Are the fees a burden", "for the users?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "続けて使ってくれている人はどのくらいですか。", en: "How many of them keep using it?", ch: ["How many of them", "keep using it?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "途中でやめてしまう理由は分かっていますか。", en: "Do we know why people stop partway?", ch: ["Do we know why", "people stop partway?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "現地の人の声を直接聞いてみたいです。", en: "I'd like to hear directly from the people there.", ch: ["hear directly from", "the people there"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "写真や動画はありますか。", en: "Do you have any photos or videos?", ch: ["Do you have", "any photos or videos?"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "数字だけでは分からない部分がありますね。", en: "There are things the numbers alone don't show.", ch: ["things the numbers alone", "don't show"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "これは一時的な増加かもしれません。", en: "This could be a temporary bump.", ch: ["This could be", "a temporary bump"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "小さくても、実際に動いていることが大事だと思います。", en: "Even if it's small, I think what matters is that it actually works.", ch: ["Even if it's small,", "it actually works"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "目標に対して、今どのくらいまで来ていますか。", en: "Where are we now against the target?", ch: ["Where are we now", "against the target?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "次の目標はどこに置きますか。", en: "Where should we set the next target?", ch: ["Where should we set", "the next target?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その数字は外に出してもいいものですか。", en: "Is that number okay to share publicly?", ch: ["Is that number okay", "to share publicly?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "日本語でも紹介したいので、出典を教えてください。", en: "I'd like to write about it in Japanese, so could you tell me the source?", ch: ["I'd like to write about it in Japanese,", "could you tell me the source?"], scene: "議論", to: "参加者", imp: "must" },
];
