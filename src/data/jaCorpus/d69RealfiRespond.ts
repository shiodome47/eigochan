import type { JaSentenceInput } from "./types";

// 分野 69: RealFi コールで相手の報告に反応する・掘り下げる
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D69_SELF: JaSentenceInput[] = [];

export const D69_ADD: JaSentenceInput[] = [
  { ja: "報告ありがとうございます。", en: "Thanks for the update.", ch: ["Thanks for", "the update"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "それは良い進み方ですね。", en: "That sounds like good progress.", ch: ["That sounds like", "good progress"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "そこをもう少し詳しく聞かせてください。", en: "Could you walk me through that part?", ch: ["Could you walk me through", "that part?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "どうしてそうなったのですか。", en: "What led to that?", ch: ["What led", "to that?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "それはいつ決まったことですか。", en: "When was that decided?", ch: ["When was", "that decided?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "私の理解が合っているか確認させてください。", en: "Let me check that I've got this right.", ch: ["Let me check that", "I've got this right"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "つまり、こういうことですか。", en: "So, is this what you mean?", ch: ["So, is this", "what you mean?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その話は初めて聞きました。", en: "That's news to me.", ch: ["That's news", "to me"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "そこは想定していませんでした。", en: "I hadn't expected that part.", ch: ["I hadn't expected", "that part"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "その点は私も気になっていました。", en: "That's something I was wondering about too.", ch: ["That's something", "I was wondering about too"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "同じことがこちらでも起きています。", en: "The same thing is happening on my side.", ch: ["The same thing", "is happening on my side"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "それは後で個別に話しませんか。", en: "Shall we talk about that separately later?", ch: ["Shall we talk about that", "separately later?"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "それは誰が担当しているのですか。", en: "Who's handling that one?", ch: ["Who's handling", "that one?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "期限はいつになっていますか。", en: "When is that due?", ch: ["When is", "that due?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "私に手伝えることはありますか。", en: "Is there anything I can help with?", ch: ["Is there anything", "I can help with?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その資料を共有してもらえますか。", en: "Could you share that document with me?", ch: ["Could you share", "that document with me?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "少し前に戻ってもいいですか。", en: "Can we go back a little?", ch: ["Can we go back", "a little?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "一つだけ確認させてください。", en: "Let me check just one thing.", ch: ["Let me check", "just one thing"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "今の説明でよく分かりました。", en: "That explanation made it clear.", ch: ["That explanation", "made it clear"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "最後の部分が聞き取れませんでした。", en: "I didn't catch the last part.", ch: ["I didn't catch", "the last part"], scene: "議論", to: "参加者", imp: "must" },
];
