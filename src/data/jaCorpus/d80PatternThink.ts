import type { JaSentenceInput } from "./types";

// 分野 80: 考えと確信を言う型
//
// I think / I heard that / I'm not sure if など、頭の中を外に出す型。
export const D80_SELF: JaSentenceInput[] = [];

export const D80_ADD: JaSentenceInput[] = [
  { ja: "今日は閉まっている気がします。", en: "I think they're closed today.", ch: ["I think", "they're closed today"], scene: "外出", to: "家族", imp: "must", pat: "I think ~" },
  { ja: "これは間違っている気がします。", en: "I think this is wrong.", ch: ["I think", "this is wrong"], scene: "仕事", to: "相手", imp: "must", pat: "I think ~" },
  { ja: "地図があった方がいいと思います。", en: "I think we need a map.", ch: ["I think", "we need a map"], scene: "外出", to: "家族", imp: "must", pat: "I think ~" },
  { ja: "彼女は気に入っていると思います。", en: "I think she likes it.", ch: ["I think", "she likes it"], scene: "会話", to: "相手", imp: "often", pat: "I think ~" },
  { ja: "そうは思いませんでした。", en: "I didn't think so.", ch: ["I didn't", "think so"], scene: "会話", to: "相手", imp: "must", pat: "I didn't think ~" },
  { ja: "そんなに遠いとは思いませんでした。", en: "I didn't think it was that far.", ch: ["I didn't think", "it was that far"], scene: "外出", to: "家族", imp: "must", pat: "I didn't think ~" },
  { ja: "自分が遅れているとは思いませんでした。", en: "I didn't think I was running late.", ch: ["I didn't think", "I was running late"], scene: "外出", to: "相手", imp: "often", pat: "I didn't think ~" },
  { ja: "こんなに高いとは思ってもいませんでした。", en: "I never thought it would cost this much.", ch: ["I never thought", "it would cost this much"], scene: "買い物", to: "家族", imp: "must", pat: "I never thought ~" },
  { ja: "自分がここまで来るとは思ってもいませんでした。", en: "I never thought I would get this far.", ch: ["I never thought", "I would get this far"], scene: "会話", to: "相手", imp: "often", pat: "I never thought ~" },
  { ja: "売り切れるとは思ってもいませんでした。", en: "I never thought they would sell out.", ch: ["I never thought", "they would sell out"], scene: "買い物", to: "家族", imp: "sub", pat: "I never thought ~" },
  { ja: "ここは有名だと聞きました。", en: "I heard this place is well known.", ch: ["I heard", "this place is well known"], scene: "外出", to: "相手", imp: "must", pat: "I heard that ~" },
  { ja: "今日は混むと聞きました。", en: "I heard it gets busy today.", ch: ["I heard", "it gets busy today"], scene: "外出", to: "家族", imp: "must", pat: "I heard that ~" },
  { ja: "来週から始まると聞きました。", en: "I heard it starts next week.", ch: ["I heard", "it starts next week"], scene: "仕事", to: "相手", imp: "must", pat: "I heard that ~" },
  { ja: "予約がいるなんて、全然知りませんでした。", en: "I had no idea we needed a reservation.", ch: ["I had no idea", "we needed a reservation"], scene: "レストラン", to: "家族", imp: "must", pat: "I had no idea ~" },
  { ja: "そんなに人気があるなんて、全然知りませんでした。", en: "I had no idea it was this popular.", ch: ["I had no idea", "it was this popular"], scene: "会話", to: "相手", imp: "often", pat: "I had no idea ~" },
  { ja: "今日だったなんて、全然知りませんでした。", en: "I had no idea it was today.", ch: ["I had no idea", "it was today"], scene: "仕事", to: "相手", imp: "must", pat: "I had no idea ~" },
  { ja: "在庫があるかどうか分かりません。", en: "I'm not sure if they still have it.", ch: ["I'm not sure if", "they still have it"], scene: "買い物", to: "家族", imp: "must", pat: "I'm not sure if ~" },
  { ja: "ここに止まるかどうか分かりません。", en: "I'm not sure if it stops here.", ch: ["I'm not sure if", "it stops here"], scene: "外出", to: "家族", imp: "must", pat: "I'm not sure if ~" },
  { ja: "もう遅すぎるかどうか分かりません。", en: "I'm not sure if it's too late.", ch: ["I'm not sure if", "it's too late"], scene: "仕事", to: "相手", imp: "must", pat: "I'm not sure if ~" },
  { ja: "これで合っているか自信がありません。", en: "I'm not sure if I've got this right.", ch: ["I'm not sure if", "I've got this right"], scene: "仕事", to: "相手", imp: "must", pat: "I'm not sure if ~" },
  { ja: "見ていて分かりました、困っていましたね。", en: "I could tell you were struggling.", ch: ["I could tell", "you were struggling"], scene: "会話", to: "相手", imp: "often", pat: "I could tell that ~" },
  { ja: "手作りだとすぐ分かりました。", en: "I could tell it was handmade.", ch: ["I could tell", "it was handmade"], scene: "会話", to: "相手", imp: "sub", pat: "I could tell that ~" },
  { ja: "地元の人だとすぐ分かりました。", en: "I could tell he was a local.", ch: ["I could tell", "he was a local"], scene: "外出", to: "家族", imp: "sub", pat: "I could tell that ~" },
  { ja: "間に合うかどうか、気になっています。", en: "I wonder if we'll make it.", ch: ["I wonder if", "we'll make it"], scene: "外出", to: "家族", imp: "must", pat: "I wonder if ~" },
  { ja: "手伝ってもらえるか、気になっています。", en: "I wonder if you could help me.", ch: ["I wonder if", "you could help me"], scene: "仕事", to: "相手", imp: "must", pat: "I wonder if ~" },
  { ja: "これで合っているか、気になっています。", en: "I wonder if this is right.", ch: ["I wonder if", "this is right"], scene: "仕事", to: "相手", imp: "must", pat: "I wonder if ~" },
  { ja: "正直、疲れているのは認めます。", en: "I must admit I'm tired.", ch: ["I must admit", "I'm tired"], scene: "会話", to: "相手", imp: "must", pat: "I must admit ~" },
  { ja: "正直、忘れていました。", en: "I must admit I forgot.", ch: ["I must admit", "I forgot"], scene: "仕事", to: "相手", imp: "must", pat: "I must admit ~" },
  { ja: "正直、助けがいります。", en: "I must admit I need help.", ch: ["I must admit", "I need help"], scene: "仕事", to: "相手", imp: "must", pat: "I must admit ~" },
  { ja: "何を言えばいいか分かります。", en: "I know what to say.", ch: ["I know", "what to say"], scene: "会話", to: "相手", imp: "must", pat: "I know what ~" },
  { ja: "何が問題か分かっています。", en: "I know what the problem is.", ch: ["I know", "what the problem is"], scene: "仕事", to: "相手", imp: "must", pat: "I know what ~" },
  { ja: "彼女が何を好きか分かります。", en: "I know what she likes.", ch: ["I know", "what she likes"], scene: "会話", to: "家族", imp: "often", pat: "I know what ~" },
  { ja: "理由は知っています。", en: "I know the reason.", ch: ["I know", "the reason"], scene: "仕事", to: "相手", imp: "must", pat: "I know ~" },
  { ja: "その店なら知っています。", en: "I know that place.", ch: ["I know", "that place"], scene: "会話", to: "友人", imp: "must", pat: "I know ~" },
  { ja: "今、値段のことを考えています。", en: "I'm thinking about the price.", ch: ["I'm thinking about", "the price"], scene: "買い物", to: "家族", imp: "must", pat: "I'm thinking about ~" },
  { ja: "今、来月の予定のことを考えています。", en: "I'm thinking about next month's schedule.", ch: ["I'm thinking about", "next month's schedule"], scene: "仕事", to: "相手", imp: "often", pat: "I'm thinking about ~" },
  { ja: "今、贈り物を何にするか考えています。", en: "I'm thinking about what to give as a gift.", ch: ["I'm thinking about", "what to give as a gift"], scene: "買い物", to: "家族", imp: "often", pat: "I'm thinking about ~" },
  { ja: "今、会議の話をしているんです。", en: "I'm talking about the meeting.", ch: ["I'm talking about", "the meeting"], scene: "仕事", to: "相手", imp: "must", pat: "I'm talking about ~" },
  { ja: "今、予約の話をしているんです。", en: "I'm talking about the booking.", ch: ["I'm talking about", "the booking"], scene: "仕事", to: "相手", imp: "often", pat: "I'm talking about ~" },
  { ja: "もっと良いやり方を思いつきました。", en: "I came up with a better way.", ch: ["I came up with", "a better way"], scene: "仕事", to: "相手", imp: "must", pat: "I came up with ~" },
];
