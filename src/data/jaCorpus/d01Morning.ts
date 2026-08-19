import type { JaSentenceInput } from "./types";

// 分野 01: 朝起きてから出かけるまで
// SELF = 本人が書いた日本語 (原文のまま)。ADD = そこに口調を寄せて足した文。
export const D01_SELF: JaSentenceInput[] = [
  { ja: "もう起きる時間ですよ。", en: "It's time to get up.", ch: ["It's time to", "get up"], scene: "寝室", to: "家族", imp: "must" },
  { ja: "今日は少しゆっくりでいいんですか。", en: "Can you take it a bit slow today?", ch: ["Can you take it", "a bit slow today?"], scene: "寝室", to: "家族", imp: "must" },
  { ja: "昨日はよく眠れましたか。", en: "Did you sleep well last night?", ch: ["Did you sleep well", "last night?"], scene: "寝室", to: "家族", imp: "must" },
  { ja: "私はまだ少し眠いです。", en: "I'm still a little sleepy.", ch: ["I'm still", "a little sleepy"], scene: "寝室", to: "家族", imp: "must" },
  { ja: "なんとなく体が重いですね。", en: "I feel kind of sluggish.", ch: ["I feel kind of", "sluggish"], scene: "家", to: "家族", imp: "must" },
  { ja: "今日は起きるのが少し遅くなりました。", en: "I got up a little later than usual today.", ch: ["a little later", "than usual"], scene: "家", to: "家族", imp: "must" },
  { ja: "そろそろ起きないと間に合わないですよ。", en: "You need to get up soon, or you won't make it.", ch: ["You need to get up soon,", "or you won't make it"], scene: "寝室", to: "家族", imp: "must" },
  { ja: "先に顔を洗ってきます。", en: "I'm going to go wash my face first.", ch: ["I'm going to go", "wash my face"], scene: "洗面所", to: "家族", imp: "must" },
  { ja: "とりあえず、コーヒーを飲みます。", en: "For now, I'm just going to have some coffee.", ch: ["For now,", "have some coffee"], scene: "台所", to: "家族", imp: "must" },
  { ja: "朝ご飯は何か食べますか。", en: "Are you going to have some breakfast?", ch: ["Are you going to have", "some breakfast?"], scene: "台所", to: "家族", imp: "must" },
  { ja: "私は白ご飯だけでいいです。", en: "Just plain rice is fine for me.", ch: ["Just plain rice", "is fine for me"], scene: "台所", to: "家族", imp: "must" },
  { ja: "ヨーグルトも食べておいた方がいいですよ。", en: "You should have some yogurt too.", ch: ["You should have", "some yogurt too"], scene: "台所", to: "家族", imp: "must" },
  { ja: "忘れ物がないか、もう一度確認した方がいいですね。", en: "You should check one more time that you haven't forgotten anything.", ch: ["check one more time", "you haven't forgotten anything"], scene: "玄関", to: "家族", imp: "must" },
  { ja: "財布は持ちましたか。", en: "Do you have your wallet?", ch: ["Do you have", "your wallet?"], scene: "玄関", to: "家族", imp: "must" },
  { ja: "携帯電話は充電できていますか。", en: "Is your phone charged?", ch: ["Is your phone", "charged?"], scene: "家", to: "家族", imp: "must" },
  { ja: "今日は少し早めに出た方がよさそうです。", en: "It looks like we should leave a little early today.", ch: ["It looks like we should", "leave a little early"], scene: "家", to: "家族", imp: "must" },
  { ja: "まだ時間はあるので、そんなに急がなくても大丈夫です。", en: "We still have time, so there's no need to rush.", ch: ["We still have time,", "there's no need to rush"], scene: "家", to: "家族", imp: "must" },
  { ja: "準備ができたら声をかけてください。", en: "Let me know when you're ready.", ch: ["Let me know", "when you're ready"], scene: "家", to: "家族", imp: "must" },
  { ja: "では、そろそろ出ましょうか。", en: "All right, should we get going?", ch: ["All right,", "should we get going?"], scene: "玄関", to: "家族", imp: "must" },
];

export const D01_ADD: JaSentenceInput[] = [
  // 本人の 13 番目「薬はもう飲みましたか。」は分野 05 と重複していたため、
  // 朝の側はこの文に差し替え (原文は分野 05 に残っている)。
  { ja: "朝のニュースで何か言っていましたか。", en: "Did they say anything on the morning news?", ch: ["Did they say anything", "on the morning news?"], scene: "家", to: "家族", imp: "often" },
  { ja: "目覚ましが鳴らなかったみたいです。", en: "I don't think my alarm went off.", ch: ["I don't think", "my alarm went off"], scene: "寝室", to: "家族", imp: "often" },
  { ja: "カーテンを開けますね。", en: "I'll open the curtains.", ch: ["I'll open", "the curtains"], scene: "寝室", to: "家族", imp: "often" },
  { ja: "外はもう明るいですね。", en: "It's already light outside.", ch: ["It's already", "light outside"], scene: "家", to: "家族", imp: "often" },
  { ja: "先にシャワーを使ってもいいですか。", en: "Can I use the shower first?", ch: ["Can I use", "the shower first?"], scene: "洗面所", to: "家族", imp: "often" },
  { ja: "お湯が出るまで少しかかります。", en: "It takes a little while for the hot water to come.", ch: ["It takes a little while", "for the hot water"], scene: "洗面所", to: "家族", imp: "sub" },
  { ja: "歯を磨いてきます。", en: "I'm going to go brush my teeth.", ch: ["I'm going to go", "brush my teeth"], scene: "洗面所", to: "家族", imp: "often" },
  { ja: "コーヒーを入れますが、飲みますか。", en: "I'm making coffee. Would you like some?", ch: ["I'm making coffee.", "Would you like some?"], scene: "台所", to: "家族", imp: "often" },
  { ja: "パンを焼きましょうか。", en: "Should I make some toast?", ch: ["Should I make", "some toast?"], scene: "台所", to: "家族", imp: "often" },
  { ja: "今日はゴミを出す日でしたね。", en: "Today's the day we put the trash out, isn't it?", ch: ["Today's the day we put the trash out,", "isn't it?"], scene: "家", to: "家族", imp: "often" },
  { ja: "ゴミをまとめておきました。", en: "I've got the trash ready to go.", ch: ["I've got the trash", "ready to go"], scene: "家", to: "家族", imp: "often" },
  { ja: "洗濯機を回しておきます。", en: "I'll start the laundry.", ch: ["I'll start", "the laundry"], scene: "家", to: "家族", imp: "often" },
  { ja: "車の鍵を見ませんでしたか。", en: "Have you seen the car keys?", ch: ["Have you seen", "the car keys?"], scene: "玄関", to: "家族", imp: "often" },
  { ja: "靴はどれを履いていきますか。", en: "Which shoes are you going to wear?", ch: ["Which shoes", "are you going to wear?"], scene: "玄関", to: "家族", imp: "sub" },
  { ja: "エアコンは消しておきますね。", en: "I'll turn off the air conditioner.", ch: ["I'll turn off", "the air conditioner"], scene: "家", to: "家族", imp: "often" },
  { ja: "電気がつけっぱなしですよ。", en: "You left the light on.", ch: ["You left", "the light on"], scene: "家", to: "家族", imp: "often" },
  { ja: "何時ごろ帰ってきますか。", en: "About what time will you be back?", ch: ["About what time", "will you be back?"], scene: "玄関", to: "家族", imp: "must" },
  { ja: "お昼はどうするつもりですか。", en: "What are you planning to do for lunch?", ch: ["What are you planning to do", "for lunch?"], scene: "家", to: "家族", imp: "often" },
  { ja: "途中まで送りましょうか。", en: "Do you want me to drive you part of the way?", ch: ["Do you want me to drive you", "part of the way?"], scene: "玄関", to: "家族", imp: "often" },
  { ja: "気をつけて行ってきてください。", en: "Take care on your way.", ch: ["Take care", "on your way"], scene: "玄関", to: "家族", imp: "must" },
  { ja: "何かあったら連絡してください。", en: "Let me know if anything comes up.", ch: ["Let me know if", "anything comes up"], scene: "玄関", to: "家族", imp: "must" },
];
