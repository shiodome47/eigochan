import type { JaSentenceInput } from "./types";

// 分野 71: RealFi の資金・提案・パートナーの話
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D71_SELF: JaSentenceInput[] = [];

export const D71_ADD: JaSentenceInput[] = [
  { ja: "この費用はどこから出ていますか。", en: "Where is the funding for this coming from?", ch: ["Where is the funding", "coming from?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "予算はもう決まっていますか。", en: "Has the budget already been decided?", ch: ["Has the budget", "already been decided?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "Catalystに提案を出す予定ですか。", en: "Are you planning to submit a proposal to Catalyst?", ch: ["planning to submit", "a proposal to Catalyst"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "提案書を読ませてもらえますか。", en: "Could I read the proposal?", ch: ["Could I read", "the proposal?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "手伝えることがあれば言ってください。", en: "Let me know if there's anything I can take on.", ch: ["Let me know if", "there's anything I can take on"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "日本語への翻訳なら手伝えます。", en: "I can help with translating it into Japanese.", ch: ["I can help with", "translating it into Japanese"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "日本のコミュニティにも広げたいです。", en: "I'd like to spread this in the Japanese community too.", ch: ["I'd like to spread this", "in the Japanese community"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "興味を持ちそうな人を何人か知っています。", en: "I know a few people who might be interested.", ch: ["I know a few people", "who might be interested"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "その人たちを紹介してもいいですか。", en: "Would it be okay to introduce them to you?", ch: ["Would it be okay", "to introduce them to you?"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "まず小さく試すのはどうでしょう。", en: "How about trying it small first?", ch: ["How about trying it", "small first?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "続けられる仕組みかどうかが気になります。", en: "What I wonder is whether it can keep running.", ch: ["whether it can", "keep running"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "資金が止まったらどうなりますか。", en: "What happens if the funding stops?", ch: ["What happens if", "the funding stops?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "収入はどこから生まれる予定ですか。", en: "Where is the revenue supposed to come from?", ch: ["Where is the revenue", "supposed to come from?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "相手側にも利益がないと続かないと思います。", en: "I don't think it lasts unless the other side gains something too.", ch: ["unless the other side", "gains something too"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "契約や規制の問題はありませんか。", en: "Are there any contract or regulation issues?", ch: ["any contract or", "regulation issues"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その国の規制は厳しいのですか。", en: "Are the rules strict in that country?", ch: ["Are the rules strict", "in that country?"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "現地のパートナーはもう決まっていますか。", en: "Has a local partner been decided yet?", ch: ["Has a local partner", "been decided yet?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "信頼できる相手かどうかは大事ですね。", en: "Whether we can trust them really matters.", ch: ["Whether we can trust them", "really matters"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "期待を持たせすぎないようにしたいです。", en: "I don't want to raise expectations too high.", ch: ["I don't want to raise", "expectations too high"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "約束できることだけを言うようにしています。", en: "I try to only say what I can promise.", ch: ["I try to only say", "what I can promise"], scene: "議論", to: "参加者", imp: "must" },
];
