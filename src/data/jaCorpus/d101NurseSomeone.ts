import type { JaSentenceInput } from "./types";

// 分野 101: 具合の悪い人の世話をする
//
// 分野 05 (相手の体調を気遣う) が「大丈夫?」と声をかける側なのに対して、
// ここは **世話をする側** の言い方。買ってきましょうか、寝ていてください、
// 連絡はしておきます —— 相手の代わりに動くための文。
export const D101_SELF: JaSentenceInput[] = [];

export const D101_ADD: JaSentenceInput[] = [
  { ja: "熱を測りましたか。", en: "Did you check your temperature?", ch: ["Did you check", "your temperature?"], scene: "家", to: "家族", imp: "must" },
  { ja: "少し高いですね。", en: "That's a bit high.", ch: ["That's", "a bit high"], scene: "家", to: "家族", imp: "must" },
  { ja: "朝からだるいのですか。", en: "Have you been sluggish since this morning?", ch: ["Have you been sluggish", "since this morning?"], scene: "家", to: "家族", imp: "must" },
  { ja: "顔色がよくないです。", en: "You look pale.", ch: ["You look", "pale"], scene: "家", to: "家族", imp: "must" },
  { ja: "横になっていてください。", en: "Just lie down.", ch: ["Just", "lie down"], scene: "家", to: "家族", imp: "must" },
  { ja: "今日は休んでください。", en: "Take the day off.", ch: ["Take", "the day off"], scene: "家", to: "家族", imp: "must" },
  { ja: "無理して動かないでください。", en: "Don't push yourself to move around.", ch: ["Don't push yourself", "to move around"], scene: "家", to: "家族", imp: "must" },
  { ja: "何か買ってきましょうか。", en: "Should I go buy you something?", ch: ["Should I go buy you", "something?"], scene: "家", to: "家族", imp: "must" },
  { ja: "スポーツドリンクを買ってきます。", en: "I'll go get you a sports drink.", ch: ["I'll go get you", "a sports drink"], scene: "家", to: "家族", imp: "must" },
  { ja: "水分をこまめに取ってください。", en: "Keep sipping water.", ch: ["Keep sipping", "water"], scene: "家", to: "家族", imp: "must" },
  { ja: "のどは渇いていませんか。", en: "Are you thirsty?", ch: ["Are you", "thirsty?"], scene: "家", to: "家族", imp: "must" },
  { ja: "他に要るものはありますか。", en: "Anything else you need?", ch: ["Anything else", "you need?"], scene: "家", to: "家族", imp: "must" },
  { ja: "スープなら食べられますか。", en: "Could you manage some soup?", ch: ["Could you manage", "some soup?"], scene: "家", to: "家族", imp: "must" },
  { ja: "消化にいいものにしましょう。", en: "Let's go with something easy on the stomach.", ch: ["Let's go with something", "easy on the stomach"], scene: "家", to: "家族", imp: "often" },
  { ja: "薬は飲みましたか。", en: "Have you taken anything for it?", ch: ["Have you taken", "anything for it?"], scene: "家", to: "家族", imp: "must" },
  { ja: "何か食べてから飲んでください。", en: "Take it after you eat something.", ch: ["Take it", "after you eat something"], scene: "家", to: "家族", imp: "must" },
  { ja: "病院に行った方がいいかもしれません。", en: "You might want to see a doctor.", ch: ["You might want to", "see a doctor"], scene: "家", to: "家族", imp: "must" },
  { ja: "病院に電話しておきましょうか。", en: "Want me to call the clinic for you?", ch: ["Want me to call the clinic", "for you?"], scene: "家", to: "家族", imp: "must" },
  { ja: "車で送ります。", en: "I'll drive you there.", ch: ["I'll drive you", "there"], scene: "家", to: "家族", imp: "must" },
  { ja: "一人で行けますか。", en: "Can you make it on your own?", ch: ["Can you make it", "on your own?"], scene: "家", to: "家族", imp: "must" },
  { ja: "熱が下がらないようなら連絡してください。", en: "Let me know if the fever doesn't come down.", ch: ["Let me know", "if the fever doesn't come down"], scene: "家", to: "家族", imp: "must" },
  { ja: "夜中でも構いません。", en: "Even in the middle of the night is fine.", ch: ["Even in the middle of the night", "is fine"], scene: "家", to: "家族", imp: "must" },
  { ja: "部屋を暖かくしておきます。", en: "I'll keep the room warm.", ch: ["I'll keep", "the room warm"], scene: "家", to: "家族", imp: "must" },
  { ja: "汗をかいたら着替えてください。", en: "Change your clothes if you sweat.", ch: ["Change your clothes", "if you sweat"], scene: "家", to: "家族", imp: "often" },
  { ja: "タオルを持ってきます。", en: "I'll bring you a towel.", ch: ["I'll bring you", "a towel"], scene: "家", to: "家族", imp: "must" },
  { ja: "眠れそうですか。", en: "Do you think you can sleep?", ch: ["Do you think", "you can sleep?"], scene: "家", to: "家族", imp: "must" },
  { ja: "静かにしておきます。", en: "I'll keep it quiet in here.", ch: ["I'll keep it quiet", "in here"], scene: "家", to: "家族", imp: "must" },
  { ja: "仕事は休んだ方がいいです。", en: "You should take the day off work.", ch: ["You should take", "the day off work"], scene: "家", to: "家族", imp: "must" },
  { ja: "連絡は私がしておきます。", en: "I'll let them know for you.", ch: ["I'll let them know", "for you"], scene: "家", to: "家族", imp: "must" },
  { ja: "そこは心配しなくて大丈夫です。", en: "Don't worry about any of that.", ch: ["Don't worry", "about any of that"], scene: "家", to: "家族", imp: "must" },
  { ja: "少しはよくなりましたか。", en: "Are you feeling any better?", ch: ["Are you feeling", "any better?"], scene: "家", to: "家族", imp: "must" },
  { ja: "昨日よりは楽です。", en: "I'm better than yesterday.", ch: ["I'm better", "than yesterday"], scene: "家", to: "家族", imp: "must" },
  { ja: "まだ本調子ではありません。", en: "I'm not back to normal yet.", ch: ["I'm not back to normal", "yet"], scene: "家", to: "家族", imp: "must" },
  { ja: "治りかけが一番危ないです。", en: "You're most at risk when you're almost better.", ch: ["You're most at risk", "when you're almost better"], scene: "家", to: "家族", imp: "often" },
  { ja: "うつるといけないので離れています。", en: "I'll keep my distance so I don't catch it.", ch: ["I'll keep my distance", "so I don't catch it"], scene: "家", to: "家族", imp: "often" },
  { ja: "マスクをしておきます。", en: "I'll put on a mask.", ch: ["I'll put on", "a mask"], scene: "家", to: "家族", imp: "must" },
  { ja: "手を洗ってきます。", en: "I'll go wash my hands.", ch: ["I'll go", "wash my hands"], scene: "家", to: "家族", imp: "must" },
  { ja: "何かあったら呼んでください。", en: "Call me if you need anything.", ch: ["Call me", "if you need anything"], scene: "家", to: "家族", imp: "must" },
  { ja: "すぐ隣にいます。", en: "I'll be right next door.", ch: ["I'll be", "right next door"], scene: "家", to: "家族", imp: "must" },
  { ja: "早くよくなってください。", en: "I hope you feel better soon.", ch: ["I hope you feel better", "soon"], scene: "家", to: "家族", imp: "must" },
];
