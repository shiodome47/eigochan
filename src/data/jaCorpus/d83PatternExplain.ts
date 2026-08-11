import type { JaSentenceInput } from "./types";

// 分野 83: 状況を説明する型
//
// That's why / It turns out / It depends on など、目の前の状況を言葉にする型。
export const D83_SELF: JaSentenceInput[] = [];

export const D83_ADD: JaSentenceInput[] = [
  { ja: "だから予定を変えたんです。", en: "That's why I changed my plan.", ch: ["That's why", "I changed my plan"], scene: "会話", to: "相手", imp: "must", pat: "That's why ~" },
  { ja: "だから心配していたんです。", en: "That's why I was worried.", ch: ["That's why", "I was worried"], scene: "会話", to: "相手", imp: "must", pat: "That's why ~" },
  { ja: "だからここに来たんです。", en: "That's why I came here.", ch: ["That's why", "I came here"], scene: "会話", to: "相手", imp: "must", pat: "That's why ~" },
  { ja: "だから人気があるんですね。", en: "That's why it's so popular.", ch: ["That's why", "it's so popular"], scene: "会話", to: "友人", imp: "often", pat: "That's why ~" },
  { ja: "聞かれなかったからです。", en: "That's because nobody asked.", ch: ["That's because", "nobody asked"], scene: "会話", to: "相手", imp: "must", pat: "That's because ~" },
  { ja: "電車が遅れたからです。", en: "That's because the train was delayed.", ch: ["That's because", "the train was delayed"], scene: "外出", to: "相手", imp: "must", pat: "That's because ~" },
  { ja: "彼女が忙しかったからです。", en: "That's because she was busy.", ch: ["That's because", "she was busy"], scene: "仕事", to: "相手", imp: "often", pat: "That's because ~" },
  { ja: "調べてみたら、こちらの方が安かったです。", en: "It turns out this one is cheaper.", ch: ["It turns out", "this one is cheaper"], scene: "買い物", to: "家族", imp: "must", pat: "It turns out ~" },
  { ja: "調べてみたら、今日は休みでした。", en: "It turns out they're closed today.", ch: ["It turns out", "they're closed today"], scene: "外出", to: "家族", imp: "must", pat: "It turns out ~" },
  { ja: "聞いてみたら、満室でした。", en: "It turns out they're fully booked.", ch: ["It turns out", "they're fully booked"], scene: "ホテル", to: "家族", imp: "must", pat: "It turns out ~" },
  { ja: "道に迷ったようです。", en: "It seems like we're lost.", ch: ["It seems like", "we're lost"], scene: "外出", to: "家族", imp: "must", pat: "It seems like ~" },
  { ja: "うまくいっているようです。", en: "It seems like it's working.", ch: ["It seems like", "it's working"], scene: "仕事", to: "相手", imp: "must", pat: "It seems like ~" },
  { ja: "皆さん同じ意見のようです。", en: "It seems like everyone agrees.", ch: ["It seems like", "everyone agrees"], scene: "コール", to: "参加者", imp: "must", pat: "It seems like ~" },
  { ja: "遅れているようです。", en: "It seems like it's running late.", ch: ["It seems like", "it's running late"], scene: "外出", to: "家族", imp: "must", pat: "It seems like ~" },
  { ja: "それは場合によります。", en: "It depends on the situation.", ch: ["It depends on", "the situation"], scene: "仕事", to: "相手", imp: "must", pat: "It depends on ~" },
  { ja: "それは人によります。", en: "It depends on the person.", ch: ["It depends on", "the person"], scene: "会話", to: "相手", imp: "must", pat: "It depends on ~" },
  { ja: "それは予算によります。", en: "It depends on the budget.", ch: ["It depends on", "the budget"], scene: "仕事", to: "相手", imp: "must", pat: "It depends on ~" },
  { ja: "それは道の混み具合によります。", en: "It depends on the traffic.", ch: ["It depends on", "the traffic"], scene: "外出", to: "家族", imp: "must", pat: "It depends on ~" },
  { ja: "選ぶのが難しいです。", en: "It's hard to choose.", ch: ["It's hard to", "choose"], scene: "買い物", to: "家族", imp: "must", pat: "It's hard to ~" },
  { ja: "早起きするのが難しいです。", en: "It's hard to get up early.", ch: ["It's hard to", "get up early"], scene: "家", to: "家族", imp: "must", pat: "It's hard to ~" },
  { ja: "この単語は発音が難しいです。", en: "It's hard to pronounce this word.", ch: ["It's hard to pronounce", "this word"], scene: "学習", to: "相手", imp: "must", pat: "It's hard to ~" },
  { ja: "説明するのが難しいです。", en: "It's hard to explain.", ch: ["It's hard", "to explain"], scene: "会話", to: "相手", imp: "must", pat: "It's hard to ~" },
  { ja: "あとから払うこともできます。", en: "It's possible to pay later.", ch: ["It's possible to", "pay later"], scene: "買い物", to: "店員", imp: "must", pat: "It's possible to ~" },
  { ja: "日程を変えることもできます。", en: "It's possible to reschedule.", ch: ["It's possible to", "reschedule"], scene: "仕事", to: "相手", imp: "must", pat: "It's possible to ~" },
  { ja: "早めにチェックインすることもできます。", en: "It's possible to check in early.", ch: ["It's possible to", "check in early"], scene: "ホテル", to: "フロント", imp: "often", pat: "It's possible to ~" },
  { ja: "別に高いわけでもないでしょう。", en: "It's not like it's expensive.", ch: ["It's not like", "it's expensive"], scene: "買い物", to: "家族", imp: "must", pat: "It's not like ~" },
  { ja: "別に遠いわけでもないでしょう。", en: "It's not like it's far.", ch: ["It's not like", "it's far"], scene: "外出", to: "家族", imp: "must", pat: "It's not like ~" },
  { ja: "別に急いでいるわけでもないでしょう。", en: "It's not like we're in a hurry.", ch: ["It's not like", "we're in a hurry"], scene: "外出", to: "家族", imp: "often", pat: "It's not like ~" },
  { ja: "何があってもやめません。", en: "No matter what happens, I won't quit.", ch: ["No matter what happens,", "I won't quit"], scene: "会話", to: "相手", imp: "must", pat: "No matter what ~" },
  { ja: "誰が何と言おうと、私はこれを続けます。", en: "No matter what people say, I'll keep at it.", ch: ["No matter what people say,", "I'll keep at it"], scene: "会話", to: "相手", imp: "often", pat: "No matter what ~" },
  { ja: "何時でも連絡してもらって大丈夫です。", en: "No matter what time it is, you can reach me.", ch: ["No matter what time it is,", "you can reach me"], scene: "仕事", to: "相手", imp: "often", pat: "No matter what ~" },
  { ja: "そこがチケット売り場です。", en: "That's where they sell the tickets.", ch: ["That's where", "they sell the tickets"], scene: "外出", to: "家族", imp: "must", pat: "That's where ~" },
  { ja: "そこにカバンを置いてきました。", en: "That's where I left my bag.", ch: ["That's where", "I left my bag"], scene: "外出", to: "家族", imp: "must", pat: "That's where ~" },
  { ja: "そこに車を止めました。", en: "That's where I parked.", ch: ["That's where", "I parked"], scene: "外出", to: "家族", imp: "often", pat: "That's where ~" },
  { ja: "まさにそれが言いたかったんです。", en: "That's exactly what I wanted to say.", ch: ["That's exactly what", "I wanted to say"], scene: "会話", to: "相手", imp: "must", pat: "That's exactly what ~" },
  { ja: "まさにそれが起きたんです。", en: "That's exactly what happened.", ch: ["That's exactly what", "happened"], scene: "会話", to: "相手", imp: "must", pat: "That's exactly what ~" },
  { ja: "まさにそれを聞きたかったんです。", en: "That's exactly what I wanted to hear.", ch: ["That's exactly what", "I wanted to hear"], scene: "仕事", to: "相手", imp: "often", pat: "That's exactly what ~" },
  { ja: "少し薄い味がします。", en: "It tastes a little bland.", ch: ["It tastes", "a little bland"], scene: "レストラン", to: "家族", imp: "often", pat: "It tastes ~" },
  { ja: "思ったより高そうに聞こえます。", en: "That sounds more expensive than I expected.", ch: ["That sounds more expensive", "than I expected"], scene: "買い物", to: "家族", imp: "often", pat: "It sounds ~" },
  { ja: "それは良さそうですね。", en: "That sounds good to me.", ch: ["That sounds good", "to me"], scene: "会話", to: "相手", imp: "must", pat: "It sounds ~" },
];
