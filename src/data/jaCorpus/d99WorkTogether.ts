import type { JaSentenceInput } from "./types";

// 分野 99: 二人で手分けして進める
//
// 分野 04 (料理と片付け) が一人の作業なのに対して、
// ここは **相手と分担しながら進める** ときの言い方。
// 「そっちお願い」「次どうする?」「先にやっとくね」の往復が中心で、
// 料理に限らず、準備や片付けを二人でやる場面に効く。
export const D99_SELF: JaSentenceInput[] = [];

export const D99_ADD: JaSentenceInput[] = [
  { ja: "手伝えることはありますか。", en: "Is there anything I can do to help?", ch: ["Is there anything", "I can do to help?"], scene: "家", to: "家族", imp: "must" },
  { ja: "では、そちらをお願いします。", en: "Then could you take that side?", ch: ["Then could you", "take that side?"], scene: "家", to: "家族", imp: "must" },
  { ja: "私は野菜を切ります。", en: "I'll cut the vegetables.", ch: ["I'll cut", "the vegetables"], scene: "家", to: "家族", imp: "must" },
  { ja: "先にお湯を沸かしておいてください。", en: "Could you get the water boiling first?", ch: ["Could you get the water boiling", "first?"], scene: "家", to: "家族", imp: "must" },
  { ja: "次は何をすればいいですか。", en: "What should I do next?", ch: ["What should I", "do next?"], scene: "家", to: "家族", imp: "must" },
  { ja: "作り方を読み上げますね。", en: "I'll read the recipe out loud.", ch: ["I'll read the recipe", "out loud"], scene: "家", to: "家族", imp: "must" },
  { ja: "何分と書いてありますか。", en: "How many minutes does it say?", ch: ["How many minutes", "does it say?"], scene: "家", to: "家族", imp: "must" },
  { ja: "八分だそうです。", en: "It says eight minutes.", ch: ["It says", "eight minutes"], scene: "家", to: "家族", imp: "must" },
  { ja: "時間を計っておきます。", en: "I'll keep track of the time.", ch: ["I'll keep track", "of the time"], scene: "家", to: "家族", imp: "must" },
  { ja: "そろそろいい匂いがしてきました。", en: "It's starting to smell good.", ch: ["It's starting", "to smell good"], scene: "家", to: "家族", imp: "must" },
  { ja: "火を少し弱めましょう。", en: "Let's turn the heat down a bit.", ch: ["Let's turn the heat down", "a bit"], scene: "家", to: "家族", imp: "must" },
  { ja: "焦げると嫌なので弱火にします。", en: "I'll keep it on low so it doesn't burn.", ch: ["I'll keep it on low", "so it doesn't burn"], scene: "家", to: "家族", imp: "must" },
  { ja: "混ぜておいてもらえますか。", en: "Could you keep stirring it?", ch: ["Could you keep", "stirring it?"], scene: "家", to: "家族", imp: "must" },
  { ja: "味を見てもらえますか。", en: "Could you taste it for me?", ch: ["Could you taste it", "for me?"], scene: "家", to: "家族", imp: "must" },
  { ja: "もう少し味が要るかもしれません。", en: "I think it needs a bit more flavor.", ch: ["I think it needs", "a bit more flavor"], scene: "家", to: "家族", imp: "must" },
  { ja: "塩を足しましょうか。", en: "Should we add some salt?", ch: ["Should we add", "some salt?"], scene: "家", to: "家族", imp: "must" },
  { ja: "これくらいでちょうどいいです。", en: "That's just right.", ch: ["That's", "just right"], scene: "家", to: "家族", imp: "must" },
  { ja: "皿を出しておきます。", en: "I'll get the plates out.", ch: ["I'll get", "the plates out"], scene: "家", to: "家族", imp: "must" },
  { ja: "温めておいた方がいいですか。", en: "Should I warm them up?", ch: ["Should I", "warm them up?"], scene: "家", to: "家族", imp: "must" },
  { ja: "あと少しで出来上がります。", en: "It'll be ready in a minute.", ch: ["It'll be ready", "in a minute"], scene: "家", to: "家族", imp: "must" },
  { ja: "先に片付けを始めます。", en: "I'll start cleaning up.", ch: ["I'll start", "cleaning up"], scene: "家", to: "家族", imp: "must" },
  { ja: "使い終わったものから洗います。", en: "I'll wash things as we finish with them.", ch: ["I'll wash things", "as we finish with them"], scene: "家", to: "家族", imp: "often" },
  { ja: "手が空いたら声をかけてください。", en: "Let me know when you're free.", ch: ["Let me know", "when you're free"], scene: "家", to: "家族", imp: "must" },
  { ja: "二人でやると早いですね。", en: "It goes fast with two people.", ch: ["It goes fast", "with two people"], scene: "家", to: "家族", imp: "must" },
  { ja: "一人だと大変です。", en: "It's a lot to do alone.", ch: ["It's a lot", "to do alone"], scene: "家", to: "家族", imp: "must" },
  { ja: "分担するとちょうどいいです。", en: "Splitting it up works well.", ch: ["Splitting it up", "works well"], scene: "家", to: "家族", imp: "often" },
  { ja: "そちらは任せます。", en: "I'll leave that to you.", ch: ["I'll leave that", "to you"], scene: "家", to: "家族", imp: "must" },
  { ja: "こちらは私がやっておきます。", en: "I'll take care of this side.", ch: ["I'll take care of", "this side"], scene: "家", to: "家族", imp: "must" },
  { ja: "順番を決めておきましょう。", en: "Let's decide the order first.", ch: ["Let's decide the order", "first"], scene: "家", to: "家族", imp: "must" },
  { ja: "先にこちらを終わらせます。", en: "I'll finish this part first.", ch: ["I'll finish this part", "first"], scene: "家", to: "家族", imp: "must" },
  { ja: "あとは並べるだけです。", en: "All that's left is plating it.", ch: ["All that's left", "is plating it"], scene: "家", to: "家族", imp: "often" },
  { ja: "写真を撮ってから食べましょう。", en: "Let's take a picture before we eat.", ch: ["Let's take a picture", "before we eat"], scene: "家", to: "家族", imp: "must" },
  { ja: "おいしそうに撮れました。", en: "It came out looking delicious.", ch: ["It came out", "looking delicious"], scene: "家", to: "家族", imp: "often" },
  { ja: "一緒に作ると楽しいですね。", en: "Cooking together is fun.", ch: ["Cooking together", "is fun"], scene: "家", to: "家族", imp: "must" },
  { ja: "また今度やりましょう。", en: "Let's do this again sometime.", ch: ["Let's do this again", "sometime"], scene: "家", to: "家族", imp: "must" },
  { ja: "次は何を作りますか。", en: "What should we make next time?", ch: ["What should we make", "next time?"], scene: "家", to: "家族", imp: "must" },
  { ja: "片付けまでが料理です。", en: "Cleaning up is part of cooking.", ch: ["Cleaning up", "is part of cooking"], scene: "家", to: "家族", imp: "often" },
  { ja: "手伝ってくれて助かりました。", en: "Thanks, that was a big help.", ch: ["Thanks,", "that was a big help"], scene: "家", to: "家族", imp: "must" },
  { ja: "思ったより早く終わりました。", en: "We finished faster than I expected.", ch: ["We finished faster", "than I expected"], scene: "家", to: "家族", imp: "must" },
  { ja: "今日はここまでにしましょう。", en: "Let's leave it there for today.", ch: ["Let's leave it there", "for today"], scene: "家", to: "家族", imp: "must" },
];
