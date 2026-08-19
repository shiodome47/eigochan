import type { JaSentenceInput } from "./types";

// 分野 104: 見送りと再会の約束
//
// 空港で見送る場面。分野 24 (観光・旅行) が行き先の話なのに対して、
// ここは **別れぎわの短いやりとり**。
// 気をつけて、連絡して、また会おう —— 決まり文句が多いぶん、
// 出てこないと沈黙になる場面なので、反射で言えるようにしておきたい。
export const D104_SELF: JaSentenceInput[] = [];

export const D104_ADD: JaSentenceInput[] = [
  { ja: "そろそろ搭乗の時間です。", en: "It's almost boarding time.", ch: ["It's almost", "boarding time"], scene: "外出", to: "家族", imp: "must" },
  { ja: "急に寂しくなってきました。", en: "I'm suddenly feeling a bit lonely.", ch: ["I'm suddenly feeling", "a bit lonely"], scene: "外出", to: "家族", imp: "must" },
  { ja: "そんな顔をしないでください。", en: "Don't make that face.", ch: ["Don't make", "that face"], scene: "外出", to: "家族", imp: "must" },
  { ja: "すぐ戻ってきます。", en: "I'll be back before you know it.", ch: ["I'll be back", "before you know it"], scene: "外出", to: "家族", imp: "must" },
  { ja: "一週間は長く感じます。", en: "A week feels so long.", ch: ["A week", "feels so long"], scene: "外出", to: "家族", imp: "must" },
  { ja: "あっという間ですよ。", en: "It'll go by fast.", ch: ["It'll go by", "fast"], scene: "外出", to: "家族", imp: "must" },
  { ja: "向こうで無理をしないでください。", en: "Don't push yourself while you're over there.", ch: ["Don't push yourself", "while you're over there"], scene: "外出", to: "家族", imp: "must" },
  { ja: "体に気をつけてください。", en: "Look after yourself.", scene: "外出", to: "家族", imp: "must" },
  { ja: "着いたら連絡してください。", en: "Message me when you land.", ch: ["Message me", "when you land"], scene: "外出", to: "家族", imp: "must" },
  { ja: "時差は気にしなくていいです。", en: "Don't worry about the time difference.", ch: ["Don't worry about", "the time difference"], scene: "外出", to: "家族", imp: "must" },
  { ja: "手が空いたら連絡します。", en: "I'll message you when I get a break.", ch: ["I'll message you", "when I get a break"], scene: "外出", to: "家族", imp: "must" },
  { ja: "少し安心しました。", en: "That makes me feel a bit better.", ch: ["That makes me feel", "a bit better"], scene: "外出", to: "家族", imp: "must" },
  { ja: "お土産を忘れないでください。", en: "Don't forget my souvenir.", ch: ["Don't forget", "my souvenir"], scene: "外出", to: "家族", imp: "must" },
  { ja: "好きそうなものを買ってきます。", en: "I'll get you something you'll like.", ch: ["I'll get you something", "you'll like"], scene: "外出", to: "家族", imp: "must" },
  { ja: "楽しみにしています。", en: "I'm looking forward to it.", ch: ["I'm looking forward", "to it"], scene: "外出", to: "家族", imp: "must" },
  { ja: "道中、気をつけてください。", en: "Safe travels.", scene: "外出", to: "家族", imp: "must" },
  { ja: "帰りも気をつけてください。", en: "Be careful on your way home too.", ch: ["Be careful on your way home", "too"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ゲートに入る前に手を振ってください。", en: "Wave at me before you go through the gate.", ch: ["Wave at me", "before you go through the gate"], scene: "外出", to: "家族", imp: "often" },
  { ja: "分かりました、振ります。", en: "Sure, I will.", scene: "外出", to: "家族", imp: "must" },
  { ja: "そろそろ行きます。", en: "I should get going.", ch: ["I should", "get going"], scene: "外出", to: "家族", imp: "must" },
  { ja: "荷物は全部持ちましたか。", en: "Do you have everything?", ch: ["Do you have", "everything?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "パスポートは手元にありますか。", en: "Do you have your passport on you?", ch: ["Do you have your passport", "on you?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "一度確認しておいてください。", en: "Just double-check.", scene: "外出", to: "家族", imp: "must" },
  { ja: "時間に余裕はありますか。", en: "Do you have enough time?", ch: ["Do you have", "enough time?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "もう少し話していられます。", en: "We still have a few minutes.", ch: ["We still have", "a few minutes"], scene: "外出", to: "家族", imp: "must" },
  { ja: "見送りに来てくれてありがとう。", en: "Thanks for coming to see me off.", ch: ["Thanks for coming", "to see me off"], scene: "外出", to: "家族", imp: "must" },
  { ja: "来てよかったです。", en: "I'm glad I came.", ch: ["I'm glad", "I came"], scene: "外出", to: "家族", imp: "must" },
  { ja: "また会えるのを楽しみにしています。", en: "I'm looking forward to seeing you again.", ch: ["I'm looking forward", "to seeing you again"], scene: "外出", to: "家族", imp: "must" },
  { ja: "帰ったら食事に行きましょう。", en: "Let's go out to eat when you're back.", ch: ["Let's go out to eat", "when you're back"], scene: "外出", to: "家族", imp: "must" },
  { ja: "予定を空けておきます。", en: "I'll keep my schedule open.", ch: ["I'll keep", "my schedule open"], scene: "外出", to: "家族", imp: "must" },
  { ja: "写真を送ってください。", en: "Send me photos.", scene: "外出", to: "家族", imp: "must" },
  { ja: "毎日でなくて構いません。", en: "It doesn't have to be every day.", ch: ["It doesn't have to be", "every day"], scene: "外出", to: "家族", imp: "must" },
  { ja: "向こうでも元気でいてください。", en: "Take care of yourself while you're gone.", ch: ["Take care of yourself", "while you're gone"], scene: "外出", to: "家族", imp: "must" },
  { ja: "あなたも元気で。", en: "You too.", scene: "外出", to: "家族", imp: "must" },
  { ja: "泣かないでください。", en: "Don't cry.", scene: "外出", to: "家族", imp: "must" },
  { ja: "泣いていません。", en: "I'm not crying.", scene: "外出", to: "家族", imp: "must" },
  { ja: "また、すぐ会えます。", en: "We'll see each other again soon.", ch: ["We'll see each other", "again soon"], scene: "外出", to: "家族", imp: "must" },
  { ja: "では、行ってきます。", en: "All right, I'm off.", ch: ["All right,", "I'm off"], scene: "外出", to: "家族", imp: "must" },
  { ja: "行ってらっしゃい。", en: "Have a good trip.", ch: ["Have a good", "trip"], scene: "外出", to: "家族", imp: "must" },
  { ja: "待っています。", en: "I'll be waiting.", scene: "外出", to: "家族", imp: "must" },
];
