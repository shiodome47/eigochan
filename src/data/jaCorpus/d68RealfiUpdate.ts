import type { JaSentenceInput } from "./types";

// 分野 68: RealFi コールで自分の進捗を報告する
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D68_SELF: JaSentenceInput[] = [];

export const D68_ADD: JaSentenceInput[] = [
  { ja: "今週やったことを共有します。", en: "Let me share what I worked on this week.", ch: ["Let me share", "what I worked on this week"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "先に結論から話します。", en: "Let me start with the conclusion.", ch: ["Let me start with", "the conclusion"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "予定していた作業は終わりました。", en: "I finished what I had planned.", ch: ["I finished", "what I had planned"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "半分くらいまで進みました。", en: "I'm about halfway through.", ch: ["I'm about", "halfway through"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "思っていたより時間がかかっています。", en: "It's taking longer than I expected.", ch: ["It's taking longer", "than I expected"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "一つ問題が起きました。", en: "One problem came up.", ch: ["One problem", "came up"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "原因はまだ特定できていません。", en: "I haven't pinned down the cause yet.", ch: ["I haven't pinned down", "the cause yet"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "来週には終わる見込みです。", en: "I expect to be done by next week.", ch: ["I expect to be done", "by next week"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "今のところ、順調です。", en: "So far, it's going well.", ch: ["So far,", "it's going well"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "確認してほしいものが一つあります。", en: "There's one thing I'd like you to check.", ch: ["There's one thing", "I'd like you to check"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "そこで手が止まっています。", en: "That's where I'm stuck.", ch: ["That's where", "I'm stuck"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "これは私の担当という理解でいいですか。", en: "Am I right that this one is on me?", ch: ["Am I right that", "this one is on me?"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "誰に聞けばいいのか分かりませんでした。", en: "I wasn't sure who to ask.", ch: ["I wasn't sure", "who to ask"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "資料はもう共有してあります。", en: "I've already shared the document.", ch: ["I've already shared", "the document"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "数字は後でまとめて送ります。", en: "I'll send the numbers together afterwards.", ch: ["I'll send the numbers", "afterwards"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "日本語で記事を一本書きました。", en: "I wrote an article in Japanese.", ch: ["I wrote an article", "in Japanese"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "日本のコミュニティにも共有しました。", en: "I shared it with the Japanese community as well.", ch: ["I shared it with", "the Japanese community"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "反応は思っていたより良かったです。", en: "The response was better than I expected.", ch: ["The response was better", "than I expected"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "来週は少し忙しくなりそうです。", en: "Next week is looking a bit busy for me.", ch: ["Next week is looking", "a bit busy for me"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "できる範囲で進めておきます。", en: "I'll move it forward as much as I can.", ch: ["I'll move it forward", "as much as I can"], scene: "報告", to: "参加者", imp: "must" },
];
