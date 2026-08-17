import type { JaSentenceInput } from "./types";

// 分野 100: 短い受け答え (会話をつなぐ一言)
//
// 会話の往復を止めないための **1〜3 語の返し**。
// 長い文が言えても、この一言が出てこないと相手の話が続かない。
// 分野 29 (共感) や 30 (驚く・喜ぶ) が気持ちを述べる分野なのに対して、
// ここは **とっさに口から出る短い相づち** だけを集めている。
// 短いぶん、考えてから言うのでは遅い。反射で出るまで回す用。
export const D100_SELF: JaSentenceInput[] = [];

export const D100_ADD: JaSentenceInput[] = [
  { ja: "どうしたんですか。", en: "What happened?", ch: ["What", "happened?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "何かありました?", en: "What's up?", ch: ["What's", "up?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "どうかしましたか。", en: "What's wrong?", ch: ["What's", "wrong?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "本当ですか。", en: "Really?", ch: ["Really?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "うそでしょう。", en: "Are you kidding?", ch: ["Are you", "kidding?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "まさか。", en: "No way.", ch: ["No", "way"], scene: "会話", to: "友人", imp: "must" },
  { ja: "分かる気がします。", en: "I get that.", ch: ["I", "get that"], scene: "会話", to: "相手", imp: "must" },
  { ja: "私も同じです。", en: "Same here.", ch: ["Same", "here"], scene: "会話", to: "相手", imp: "must" },
  { ja: "たしかに。", en: "True.", ch: ["True"], scene: "会話", to: "相手", imp: "must" },
  { ja: "そのとおりです。", en: "Exactly.", ch: ["Exactly"], scene: "会話", to: "相手", imp: "must" },
  { ja: "やっぱりね。", en: "I knew it.", ch: ["I", "knew it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "いいですね。", en: "Sounds good.", ch: ["Sounds", "good"], scene: "会話", to: "相手", imp: "must" },
  { ja: "悪くないですね。", en: "Not bad.", ch: ["Not", "bad"], scene: "会話", to: "相手", imp: "must" },
  { ja: "よさそうですね。", en: "Sounds nice.", ch: ["Sounds", "nice"], scene: "会話", to: "相手", imp: "must" },
  { ja: "乗ります。", en: "I'm in.", ch: ["I'm", "in"], scene: "会話", to: "友人", imp: "must" },
  { ja: "了解です。", en: "Got it.", ch: ["Got", "it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "任せてください。", en: "Leave it to me.", ch: ["Leave it", "to me"], scene: "会話", to: "相手", imp: "must" },
  { ja: "もちろんです。", en: "Of course.", ch: ["Of", "course"], scene: "会話", to: "相手", imp: "must" },
  { ja: "いいですよ。", en: "Sure thing.", ch: ["Sure", "thing"], scene: "会話", to: "相手", imp: "must" },
  { ja: "お安いご用です。", en: "No problem at all.", ch: ["No problem", "at all"], scene: "会話", to: "相手", imp: "must" },
  { ja: "すぐ戻ります。", en: "I'll be right back.", ch: ["I'll be", "right back"], scene: "会話", to: "相手", imp: "must" },
  { ja: "ちょっとそのままで。", en: "Hang on.", ch: ["Hang", "on"], scene: "会話", to: "相手", imp: "must" },
  { ja: "あ、そうだ。", en: "Oh, wait.", ch: ["Oh,", "wait"], scene: "会話", to: "相手", imp: "must" },
  { ja: "ほっとしました。", en: "I'm so relieved.", ch: ["I'm", "so relieved"], scene: "会話", to: "相手", imp: "must" },
  { ja: "とても助かります。", en: "That helps a lot.", ch: ["That helps", "a lot"], scene: "会話", to: "相手", imp: "must" },
  { ja: "それは大事ですね。", en: "That's important.", ch: ["That's", "important"], scene: "会話", to: "相手", imp: "must" },
  { ja: "なんとなく分かります。", en: "I sort of get it.", ch: ["I sort of", "get it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "それはきついですね。", en: "That sounds rough.", ch: ["That sounds", "rough"], scene: "会話", to: "友人", imp: "must" },
  { ja: "よかったですね。", en: "Good for you.", ch: ["Good", "for you"], scene: "会話", to: "友人", imp: "must" },
  { ja: "うらやましいです。", en: "Lucky you.", ch: ["Lucky", "you"], scene: "会話", to: "友人", imp: "must" },
  { ja: "さすがですね。", en: "Nice work.", ch: ["Nice", "work"], scene: "会話", to: "相手", imp: "must" },
  { ja: "いい写真ですね。", en: "Nice shot.", ch: ["Nice", "shot"], scene: "会話", to: "友人", imp: "often" },
  { ja: "行きましょう。", en: "Let's go.", ch: ["Let's", "go"], scene: "会話", to: "友人", imp: "must" },
  { ja: "急ぎましょう。", en: "Let's hurry.", ch: ["Let's", "hurry"], scene: "会話", to: "友人", imp: "must" },
  { ja: "戻りましょう。", en: "Let's head back.", ch: ["Let's", "head back"], scene: "会話", to: "友人", imp: "must" },
  { ja: "気にしないでください。", en: "Never mind that.", ch: ["Never mind", "that"], scene: "会話", to: "相手", imp: "must" },
  { ja: "無理しないでください。", en: "Don't push yourself.", ch: ["Don't push", "yourself"], scene: "会話", to: "相手", imp: "must" },
  { ja: "ゆっくりでいいですよ。", en: "Take your time.", ch: ["Take", "your time"], scene: "会話", to: "相手", imp: "must" },
  { ja: "いつでもどうぞ。", en: "Anytime.", ch: ["Anytime"], scene: "会話", to: "相手", imp: "must" },
  { ja: "それもそうですね。", en: "Fair enough.", ch: ["Fair", "enough"], scene: "会話", to: "相手", imp: "must" },
];
