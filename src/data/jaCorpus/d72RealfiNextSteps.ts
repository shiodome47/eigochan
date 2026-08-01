import type { JaSentenceInput } from "./types";

// 分野 72: RealFi コールの決めごとと次の一歩
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D72_SELF: JaSentenceInput[] = [];

export const D72_ADD: JaSentenceInput[] = [
  { ja: "今日決まったことを確認させてください。", en: "Let me go over what we decided today.", ch: ["Let me go over", "what we decided today"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "私がやることは、これで合っていますか。", en: "Is this right about what I'm taking on?", ch: ["Is this right about", "what I'm taking on?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "それは私がやります。", en: "I'll take that one.", ch: ["I'll take", "that one"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "それは私には少し難しいかもしれません。", en: "That one might be a bit much for me.", ch: ["That one might be", "a bit much for me"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "期限はいつまでにしますか。", en: "When should we set the deadline?", ch: ["When should we set", "the deadline?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "来週までにやっておきます。", en: "I'll have it done by next week.", ch: ["I'll have it done", "by next week"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "できたら共有します。", en: "I'll share it once it's ready.", ch: ["I'll share it", "once it's ready"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "誰がまとめてくれますか。", en: "Who's going to pull it together?", ch: ["Who's going to", "pull it together?"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "議事録はどこに置きますか。", en: "Where are we putting the notes?", ch: ["Where are we putting", "the notes?"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "次のコールはいつですか。", en: "When is the next call?", ch: ["When is", "the next call?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "その時間はこちらだと遅すぎます。", en: "That time is too late on my side.", ch: ["That time is too late", "on my side"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "一時間ずらしてもらえると助かります。", en: "It would help if we could move it an hour.", ch: ["It would help if", "we could move it an hour"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "出られないときは事前に伝えます。", en: "I'll tell you in advance if I can't make it.", ch: ["I'll tell you in advance", "if I can't make it"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "続きはチャットで話しましょう。", en: "Let's continue this in the chat.", ch: ["Let's continue this", "in the chat"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "何かあれば連絡してください。", en: "Reach out if anything comes up.", ch: ["Reach out if", "anything comes up"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "今日のコール、ありがとうございました。", en: "Thanks for the call today.", ch: ["Thanks for", "the call today"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "とても勉強になりました。", en: "I learned a lot from this.", ch: ["I learned a lot", "from this"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "うまく言えなかったところは、後で文章で送ります。", en: "I'll write up the parts I couldn't say well and send them later.", ch: ["the parts I couldn't say well", "and send them later"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "英語がまだ得意ではないので、ゆっくり話してもらえると助かります。", en: "My English isn't strong yet, so it helps if you speak slowly.", ch: ["My English isn't strong yet,", "it helps if you speak slowly"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "また来週お願いします。", en: "See you again next week.", ch: ["See you again", "next week"], scene: "コール", to: "参加者", imp: "must" },
];
