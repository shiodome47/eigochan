import type { JaSentenceInput } from "./types";

// 分野 33: 頼む・助けを求める
export const D33_SELF: JaSentenceInput[] = [
  { ja: "少し手伝ってもらえますか。", en: "Could you give me a hand?", ch: ["Could you give me", "a hand?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "これを一緒に確認してもらえますか。", en: "Could you check this with me?", ch: ["Could you check this", "with me?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "私だけでは判断が難しいです。", en: "It's hard for me to judge on my own.", ch: ["It's hard for me to judge", "on my own"], scene: "会話", to: "相手", imp: "must" },
  { ja: "この部分について、意見を聞かせてもらえますか。", en: "Could I hear your opinion on this part?", ch: ["Could I hear your opinion", "on this part?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "どこが間違っているのか見てもらえますか。", en: "Could you look at where it's wrong?", ch: ["Could you look at", "where it's wrong?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "もう少し分かりやすく説明してもらえると助かります。", en: "It would help if you could explain it a little more clearly.", ch: ["It would help if you could", "explain it a little more clearly."], scene: "会話", to: "相手", imp: "must" },
  { ja: "具体的な例を一つ挙げてもらえますか。", en: "Could you give me one concrete example?", ch: ["Could you give me", "one concrete example?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "まず何をすればいいか教えてください。", en: "Please tell me what to do first.", ch: ["Please tell me", "what to do first"], scene: "会話", to: "相手", imp: "must" },
  { ja: "手順を一つずつ教えてもらえますか。", en: "Could you walk me through the steps one at a time?", ch: ["Could you walk me through", "the steps one at a time?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "念のため、もう一度確認してもらえますか。", en: "Just to be safe, could you check it once more?", ch: ["Just to be safe", ", could you check it once more?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "これで問題ないか見てもらえますか。", en: "Could you see whether this is all right?", ch: ["Could you see whether", "this is all right?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "時間があるときでいいので、お願いできますか。", en: "Whenever you have time, could you take care of it?", ch: ["Whenever you have time,", "could you take care of it?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "急ぎではないので、無理のないときで大丈夫です。", en: "It's not urgent, so whenever it's convenient is fine.", ch: ["It's not urgent", ", so whenever it's convenient is fine."], scene: "会話", to: "相手", imp: "must" },
  { ja: "可能であれば、今日中に確認してもらえると助かります。", en: "If possible, it would help if you could check it by the end of today.", ch: ["If possible,", "by the end of today"], scene: "会話", to: "相手", imp: "must" },
  { ja: "この件について、詳しい人を知りませんか。", en: "Do you know anyone who knows about this?", ch: ["Do you know anyone", "who knows about this?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "誰に聞けばいいのか分からないんです。", en: "I don't know who to ask.", ch: ["I don't know", "who to ask"], scene: "会話", to: "相手", imp: "must" },
  { ja: "必要な情報があれば、こちらで用意します。", en: "If you need any information, I'll get it ready.", ch: ["If you need any information,", "I'll get it ready"], scene: "会話", to: "相手", imp: "must" },
  { ja: "助けてもらえると本当にありがたいです。", en: "I'd really appreciate the help.", ch: ["I'd really appreciate", "the help"], scene: "会話", to: "相手", imp: "must" },
  { ja: "よろしくお願いします。", en: "Thank you in advance.", ch: ["Thank you", "in advance"], scene: "会話", to: "相手", imp: "must" },
];

export const D33_ADD: JaSentenceInput[] = [
  // 本人の文にあった「私にできることがあれば言ってください。」は分野 05 と重複していたため、
  // 頼む側はこの文に差し替え。
  { ja: "無理であれば、遠慮なく言ってください。", en: "If it's not doable, please just say so.", ch: ["If it's not doable,", "please just say so"], scene: "会話", to: "相手", imp: "must" },
  { ja: "少しお願いしたいことがあります。", en: "There's something I'd like to ask you.", ch: ["There's something", "I'd like to ask you"], scene: "会話", to: "相手", imp: "must" },
  { ja: "今、お時間よろしいですか。", en: "Do you have a moment right now?", ch: ["Do you have a moment", "right now?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "五分ほどで終わります。", en: "It'll only take about five minutes.", ch: ["It'll only take", "about five minutes"], scene: "会話", to: "相手", imp: "often" },
  { ja: "こちらの資料を見ていただけますか。", en: "Could you take a look at this document?", ch: ["Could you take a look at", "this document?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "この部分だけで構いません。", en: "Just this part is fine.", ch: ["Just this part", "is fine"], scene: "仕事", to: "同僚", imp: "often" },
  { ja: "気になる点があれば教えてください。", en: "Please tell me if anything stands out.", ch: ["Please tell me if", "anything stands out"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "英語の表現を直してもらえますか。", en: "Could you fix my English wording?", ch: ["Could you fix", "my English wording?"], scene: "学習", to: "相手", imp: "must" },
  { ja: "私の書いた文を確認してもらえますか。", en: "Could you check the sentences I wrote?", ch: ["Could you check", "the sentences I wrote?"], scene: "学習", to: "相手", imp: "must" },
  { ja: "参考になる資料はありますか。", en: "Are there materials I could refer to?", ch: ["Are there materials", "I could refer to?"], scene: "会話", to: "相手", imp: "often" },
  { ja: "誰か紹介していただけませんか。", en: "Could you introduce me to someone?", ch: ["Could you introduce me", "to someone?"], scene: "会話", to: "相手", imp: "often" },
  { ja: "一緒に見ていただけると助かります。", en: "It would help if you could look at it with me.", ch: ["It would help if you could", "look at it with me"], scene: "会話", to: "相手", imp: "must" },
  { ja: "手が空いたときで大丈夫です。", en: "Whenever you're free is fine.", ch: ["Whenever you're free", "is fine"], scene: "会話", to: "相手", imp: "must" },
  { ja: "期限は特にありません。", en: "There's no particular deadline.", ch: ["There's no", "particular deadline"], scene: "会話", to: "相手", imp: "often" },
  { ja: "できれば今週中にお願いできますか。", en: "If possible, could you do it this week?", ch: ["If possible,", "could you do it this week?"], scene: "会話", to: "相手", imp: "often" },
  { ja: "難しければ、別の方法を考えます。", en: "If it's difficult, I'll think of another way.", ch: ["If it's difficult,", "I'll think of another way"], scene: "会話", to: "相手", imp: "must" },
  { ja: "何度もお願いしてすみません。", en: "Sorry for asking again and again.", ch: ["Sorry for asking", "again and again"], scene: "会話", to: "相手", imp: "often" },
  { ja: "お忙しいところ、ありがとうございます。", en: "Thank you for taking the time when you're busy.", ch: ["Thank you for taking the time", "when you're busy"], scene: "会話", to: "相手", imp: "must" },
  { ja: "何かお返しできることがあれば言ってください。", en: "If there's any way I can return the favor, let me know.", ch: ["any way I can", "return the favor"], scene: "会話", to: "相手", imp: "often" },
  { ja: "それでは、お願いいたします。", en: "Then I'll leave it with you.", ch: ["Then I'll leave it", "with you"], scene: "会話", to: "相手", imp: "must" },
  { ja: "もし可能でしたら、今日中にお返事をいただけますか。", en: "If possible, could I get a reply today?", ch: ["If possible,", "could I get a reply today?"], scene: "会話", to: "相手", imp: "often" },
];
