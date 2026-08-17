import type { JaSentenceInput } from "./types";

// 分野 96: 散歩と動物を見に行く
//
// 公園を歩く、動物園に行く。分野 24 (観光・旅行) が遠出なのに対して、
// ここは **近場をゆっくり歩きながらの会話**。
// 誘う → 感想を言う → 次を決める、の短い往復が中心。
export const D96_SELF: JaSentenceInput[] = [];

export const D96_ADD: JaSentenceInput[] = [
  { ja: "天気がいいので散歩しませんか。", en: "The weather's nice — want to go for a walk?", ch: ["The weather's nice —", "want to go for a walk?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "少し歩きたい気分です。", en: "I feel like walking a bit.", ch: ["I feel like", "walking a bit"], scene: "会話", to: "家族", imp: "must" },
  { ja: "公園まで歩いて行きましょう。", en: "Let's walk to the park.", ch: ["Let's walk", "to the park"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ここは風が気持ちいいですね。", en: "The breeze is lovely here.", ch: ["The breeze", "is lovely here"], scene: "外出", to: "家族", imp: "must" },
  { ja: "木陰で少し休みましょう。", en: "Let's rest in the shade for a bit.", ch: ["Let's rest in the shade", "for a bit"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ベンチが空いています。", en: "There's an open bench.", ch: ["There's", "an open bench"], scene: "外出", to: "家族", imp: "must" },
  { ja: "静かで落ち着きます。", en: "It's quiet and calming.", ch: ["It's quiet", "and calming"], scene: "外出", to: "家族", imp: "must" },
  { ja: "川沿いを歩くのが好きです。", en: "I like walking along the river.", ch: ["I like walking", "along the river"], scene: "外出", to: "家族", imp: "must" },
  { ja: "一周するとどのくらいですか。", en: "How long does one lap take?", ch: ["How long does", "one lap take?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ゆっくりで三十分くらいです。", en: "About thirty minutes at an easy pace.", ch: ["About thirty minutes", "at an easy pace"], scene: "外出", to: "家族", imp: "must" },
  { ja: "何も考えずに歩けるのがいいです。", en: "It's nice being able to walk without thinking.", ch: ["It's nice being able to walk", "without thinking"], scene: "外出", to: "家族", imp: "often" },
  { ja: "歩くと頭が整理されます。", en: "Walking helps me clear my head.", ch: ["Walking helps me", "clear my head"], scene: "外出", to: "家族", imp: "must" },
  { ja: "動物園に行ってみませんか。", en: "Want to go to the zoo?", ch: ["Want to go", "to the zoo?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "何年ぶりか分かりません。", en: "I don't even know how many years it's been.", ch: ["I don't even know", "how many years it's been"], scene: "会話", to: "家族", imp: "must" },
  { ja: "パンダは見られますか。", en: "Can we see the pandas?", ch: ["Can we see", "the pandas?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "並ぶことになるかもしれません。", en: "We might end up having to line up.", ch: ["We might end up", "having to line up"], scene: "外出", to: "家族", imp: "must" },
  { ja: "朝のうちが空いています。", en: "It's less crowded early in the morning.", ch: ["It's less crowded", "early in the morning"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ずっと寝ていますね。", en: "It's been sleeping the whole time.", ch: ["It's been sleeping", "the whole time"], scene: "外出", to: "家族", imp: "often" },
  { ja: "動いているところが見たいです。", en: "I want to see it moving around.", ch: ["I want to see it", "moving around"], scene: "外出", to: "家族", imp: "often" },
  { ja: "餌の時間に合わせて行きましょう。", en: "Let's go around feeding time.", ch: ["Let's go", "around feeding time"], scene: "外出", to: "家族", imp: "often" },
  { ja: "キリンは近くで見ると大きいですね。", en: "Giraffes are huge up close.", ch: ["Giraffes are huge", "up close"], scene: "外出", to: "家族", imp: "must" },
  { ja: "首がこんなに長いとは思いませんでした。", en: "I didn't realize their necks were this long.", ch: ["I didn't realize", "their necks were this long"], scene: "外出", to: "家族", imp: "often" },
  { ja: "思ったよりおとなしいです。", en: "They're calmer than I expected.", ch: ["They're calmer", "than I expected"], scene: "外出", to: "家族", imp: "must" },
  { ja: "こっちを見ています。", en: "It's looking right at us.", ch: ["It's looking", "right at us"], scene: "外出", to: "家族", imp: "must" },
  { ja: "目が合いました。", en: "We just made eye contact.", ch: ["We just made", "eye contact"], scene: "外出", to: "家族", imp: "often" },
  { ja: "写真を撮ってもいいですか。", en: "Is it okay to take photos here?", ch: ["Is it okay to take photos", "here?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "フラッシュはやめておきます。", en: "I'll skip the flash.", ch: ["I'll skip", "the flash"], scene: "外出", to: "家族", imp: "must" },
  { ja: "動物が驚いてしまいます。", en: "It would startle the animals.", ch: ["It would startle", "the animals"], scene: "外出", to: "家族", imp: "must" },
  { ja: "順路はこちらのようです。", en: "The route seems to go this way.", ch: ["The route seems", "to go this way"], scene: "外出", to: "家族", imp: "must" },
  { ja: "地図をもらってきます。", en: "I'll go grab a map.", ch: ["I'll go grab", "a map"], scene: "外出", to: "家族", imp: "must" },
  { ja: "次はどこを見ますか。", en: "What should we see next?", ch: ["What should we", "see next?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "足が疲れてきました。", en: "My feet are getting tired.", ch: ["My feet", "are getting tired"], scene: "外出", to: "家族", imp: "must" },
  { ja: "少し座りましょう。", en: "Let's sit down for a minute.", ch: ["Let's sit down", "for a minute"], scene: "外出", to: "家族", imp: "must" },
  { ja: "何か飲みませんか。", en: "Want to grab something to drink?", ch: ["Want to grab", "something to drink?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "売店はあちらにあります。", en: "The shop is over that way.", ch: ["The shop is", "over that way"], scene: "外出", to: "家族", imp: "must" },
  { ja: "閉園まであと一時間です。", en: "There's an hour until closing.", ch: ["There's an hour", "until closing"], scene: "外出", to: "家族", imp: "must" },
  { ja: "見たいところは回れました。", en: "We got to everything I wanted to see.", ch: ["We got to everything", "I wanted to see"], scene: "外出", to: "家族", imp: "often" },
  { ja: "また来たいですね。", en: "I'd like to come back sometime.", ch: ["I'd like to come back", "sometime"], scene: "外出", to: "家族", imp: "must" },
  { ja: "今度は水族館にしましょう。", en: "Let's do the aquarium next time.", ch: ["Let's do the aquarium", "next time"], scene: "外出", to: "家族", imp: "must" },
  { ja: "いい一日でした。", en: "It was a good day.", ch: ["It was", "a good day"], scene: "外出", to: "家族", imp: "must" },
];
