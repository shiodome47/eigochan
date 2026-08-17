import type { JaSentenceInput } from "./types";

// 分野 92: 部屋の暑さ寒さを調節する
//
// エアコン・扇風機・窓。分野 09 (天気と服装) が外の話なのに対して、
// ここは **部屋の中を相手と一緒に快適にする** ときの言い方。
// 「暑くないですか」から入って提案し、合意するまでの流れ。
export const D92_SELF: JaSentenceInput[] = [];

export const D92_ADD: JaSentenceInput[] = [
  { ja: "ちょっと暑くないですか。", en: "Isn't it a bit hot in here?", ch: ["Isn't it a bit hot", "in here?"], scene: "家", to: "家族", imp: "must" },
  { ja: "少し寒いかもしれません。", en: "It might be a little cold.", ch: ["It might be", "a little cold"], scene: "家", to: "家族", imp: "must" },
  { ja: "エアコンをつけましょうか。", en: "Should I turn on the air conditioner?", ch: ["Should I turn on", "the air conditioner?"], scene: "家", to: "家族", imp: "must" },
  { ja: "温度を下げてもいいですか。", en: "Do you mind if I lower the temperature?", ch: ["Do you mind if I", "lower the temperature?"], scene: "家", to: "家族", imp: "must" },
  { ja: "二度くらい上げましょうか。", en: "Should we raise it a couple of degrees?", ch: ["Should we raise it", "a couple of degrees?"], scene: "家", to: "家族", imp: "must" },
  { ja: "今、何度に設定していますか。", en: "What's it set to right now?", ch: ["What's it set to", "right now?"], scene: "家", to: "家族", imp: "must" },
  { ja: "二十六度くらいがちょうどいいです。", en: "About twenty-six degrees feels just right.", ch: ["About twenty-six degrees", "feels just right"], scene: "家", to: "家族", imp: "must" },
  { ja: "風が直接当たって寒いです。", en: "The air is blowing right on me and it's cold.", ch: ["The air is blowing right on me", "and it's cold"], scene: "家", to: "家族", imp: "must" },
  { ja: "風向きを変えてもらえますか。", en: "Could you change the direction of the airflow?", ch: ["Could you change", "the direction of the airflow?"], scene: "家", to: "家族", imp: "must" },
  { ja: "弱風にしておきます。", en: "I'll set the fan to low.", ch: ["I'll set the fan", "to low"], scene: "家", to: "家族", imp: "must" },
  { ja: "除湿にした方が過ごしやすいです。", en: "Dry mode feels more comfortable.", ch: ["Dry mode feels", "more comfortable"], scene: "家", to: "家族", imp: "often" },
  { ja: "じめじめしていますね。", en: "It feels muggy in here.", ch: ["It feels muggy", "in here"], scene: "家", to: "家族", imp: "must" },
  { ja: "窓を開けた方が気持ちいいかもしれません。", en: "It might feel nicer to open a window.", ch: ["It might feel nicer", "to open a window"], scene: "家", to: "家族", imp: "must" },
  { ja: "風が入ってきて気持ちいいです。", en: "The breeze coming in feels good.", ch: ["The breeze coming in", "feels good"], scene: "家", to: "家族", imp: "often" },
  { ja: "少し風を入れましょうか。", en: "Should we let some air in?", ch: ["Should we let", "some air in?"], scene: "家", to: "家族", imp: "must" },
  { ja: "扇風機を回すだけで十分です。", en: "Just the fan is enough.", ch: ["Just the fan", "is enough"], scene: "家", to: "家族", imp: "often" },
  { ja: "つけっぱなしで寝ると体がだるくなります。", en: "I feel sluggish if I sleep with it on all night.", ch: ["I feel sluggish", "if I sleep with it on all night"], scene: "家", to: "家族", imp: "often" },
  { ja: "タイマーをかけておきます。", en: "I'll put it on a timer.", ch: ["I'll put it", "on a timer"], scene: "家", to: "家族", imp: "must" },
  { ja: "一時間で切れるようにしました。", en: "I set it to turn off in an hour.", ch: ["I set it to turn off", "in an hour"], scene: "家", to: "家族", imp: "must" },
  { ja: "電気代が気になります。", en: "I'm worried about the electricity bill.", ch: ["I'm worried about", "the electricity bill"], scene: "家", to: "家族", imp: "must" },
  { ja: "つけたり消したりする方が高くつくそうです。", en: "Apparently turning it on and off costs more.", ch: ["Apparently turning it on and off", "costs more"], scene: "家", to: "家族", imp: "often" },
  { ja: "フィルターを掃除したら効きがよくなりました。", en: "It works better after I cleaned the filter.", ch: ["It works better", "after I cleaned the filter"], scene: "家", to: "家族", imp: "often" },
  { ja: "しばらく掃除していませんでした。", en: "I hadn't cleaned it in a while.", ch: ["I hadn't cleaned it", "in a while"], scene: "家", to: "家族", imp: "often" },
  { ja: "冷えるまで少しかかります。", en: "It takes a while to cool down.", ch: ["It takes a while", "to cool down"], scene: "家", to: "家族", imp: "must" },
  { ja: "だいぶ涼しくなりました。", en: "It's gotten a lot cooler.", ch: ["It's gotten", "a lot cooler"], scene: "家", to: "家族", imp: "must" },
  { ja: "これ以上下げると寒くなります。", en: "Any lower and it'll get cold.", ch: ["Any lower", "and it'll get cold"], scene: "家", to: "家族", imp: "must" },
  { ja: "上着を一枚持ってきます。", en: "I'll go grab a jacket.", ch: ["I'll go grab", "a jacket"], scene: "家", to: "家族", imp: "must" },
  { ja: "毛布、使いますか。", en: "Do you want a blanket?", ch: ["Do you want", "a blanket?"], scene: "家", to: "家族", imp: "must" },
  { ja: "足元が冷えます。", en: "My feet are cold.", ch: ["My feet", "are cold"], scene: "家", to: "家族", imp: "must" },
  { ja: "暖房を入れましょうか。", en: "Should I turn the heat on?", ch: ["Should I turn", "the heat on?"], scene: "家", to: "家族", imp: "must" },
  { ja: "部屋が乾燥しています。", en: "The room is really dry.", ch: ["The room", "is really dry"], scene: "家", to: "家族", imp: "must" },
  { ja: "加湿器をつけておきます。", en: "I'll turn on the humidifier.", ch: ["I'll turn on", "the humidifier"], scene: "家", to: "家族", imp: "often" },
  { ja: "のどが痛くなりそうです。", en: "I feel like my throat's going to get sore.", ch: ["I feel like my throat's", "going to get sore"], scene: "家", to: "家族", imp: "must" },
  { ja: "朝は冷え込みますね。", en: "It gets chilly in the mornings.", ch: ["It gets chilly", "in the mornings"], scene: "家", to: "家族", imp: "must" },
  { ja: "昼間との差が大きいです。", en: "There's a big gap between day and night.", ch: ["There's a big gap", "between day and night"], scene: "家", to: "家族", imp: "often" },
  { ja: "体調を崩しやすい時期です。", en: "It's the time of year when people get sick easily.", ch: ["It's the time of year", "when people get sick easily"], scene: "会話", to: "相手", imp: "often" },
  { ja: "今日は一日つけっぱなしでした。", en: "I left it on all day today.", ch: ["I left it on", "all day today"], scene: "家", to: "家族", imp: "often" },
  { ja: "外の方が涼しいかもしれません。", en: "It might actually be cooler outside.", ch: ["It might actually be", "cooler outside"], scene: "家", to: "家族", imp: "often" },
  { ja: "日が当たると一気に暑くなります。", en: "It gets hot fast once the sun hits.", ch: ["It gets hot fast", "once the sun hits"], scene: "家", to: "家族", imp: "often" },
  { ja: "カーテンを閉めておくと違います。", en: "Closing the curtains makes a difference.", ch: ["Closing the curtains", "makes a difference"], scene: "家", to: "家族", imp: "often" },
];
