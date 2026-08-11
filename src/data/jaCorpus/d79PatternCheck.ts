import type { JaSentenceInput } from "./types";

// 分野 79: 相手に確認する型
//
// 型 (Are you sure ~? / Do you mean ~? など) は資料から拾い、
// **中身は本人が実際に言いそうな場面** で書き起こしている。
// pat に型を持たせてあるので、カードに「型」として出る。
export const D79_SELF: JaSentenceInput[] = [];

export const D79_ADD: JaSentenceInput[] = [
  { ja: "鍵、かけたのは確かですか。", en: "Are you sure you locked up?", ch: ["Are you sure", "you locked up?"], scene: "家", to: "家族", imp: "must", pat: "Are you sure ~?" },
  { ja: "本当に手伝わなくて大丈夫ですか。", en: "Are you sure you don't need a hand?", ch: ["Are you sure", "you don't need a hand?"], scene: "家", to: "家族", imp: "must", pat: "Are you sure ~?" },
  { ja: "時間、本当に間に合いますか。", en: "Are you sure we have enough time?", ch: ["Are you sure", "we have enough time?"], scene: "外出", to: "家族", imp: "must", pat: "Are you sure ~?" },
  { ja: "この道で合っていますか。", en: "Are you sure this is the right way?", ch: ["Are you sure", "this is the right way?"], scene: "外出", to: "家族", imp: "must", pat: "Are you sure ~?" },
  { ja: "その金額で合っていますか。", en: "Are you sure that's the right amount?", ch: ["Are you sure", "that's the right amount?"], scene: "仕事", to: "相手", imp: "must", pat: "Are you sure ~?" },
  { ja: "つまり、間に合わないということですか。", en: "Are you saying we won't make it?", ch: ["Are you saying", "we won't make it?"], scene: "仕事", to: "相手", imp: "must", pat: "Are you saying ~?" },
  { ja: "今日はもう終わり、ということですか。", en: "Are you saying we're done for today?", ch: ["Are you saying", "we're done for today?"], scene: "仕事", to: "相手", imp: "must", pat: "Are you saying ~?" },
  { ja: "私のやり方が違う、ということですか。", en: "Are you saying I'm doing it wrong?", ch: ["Are you saying", "I'm doing it wrong?"], scene: "仕事", to: "相手", imp: "often", pat: "Are you saying ~?" },
  { ja: "来週の会議のことを言っていますか。", en: "Do you mean next week's meeting?", ch: ["Do you mean", "next week's meeting?"], scene: "コール", to: "参加者", imp: "must", pat: "Do you mean ~?" },
  { ja: "さっき送った資料のことですか。", en: "Do you mean the file I just sent?", ch: ["Do you mean", "the file I just sent?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you mean ~?" },
  { ja: "駅前のあのお店のことですか。", en: "Do you mean the place by the station?", ch: ["Do you mean", "the place by the station?"], scene: "外出", to: "家族", imp: "often", pat: "Do you mean ~?" },
  { ja: "この前話したこと、覚えていますか。", en: "Do you remember what we talked about?", ch: ["Do you remember", "what we talked about?"], scene: "会話", to: "相手", imp: "must", pat: "Do you remember ~?" },
  { ja: "待ち合わせの時間、覚えていますか。", en: "Do you remember what time we're meeting?", ch: ["Do you remember", "what time we're meeting?"], scene: "外出", to: "友人", imp: "must", pat: "Do you remember ~?" },
  { ja: "去年行ったお店、覚えていますか。", en: "Do you remember the place we went last year?", ch: ["Do you remember", "the place we went last year?"], scene: "会話", to: "友人", imp: "often", pat: "Do you remember ~?" },
  { ja: "私のメール、見てもらえましたか。", en: "Did you see my message?", ch: ["Did you see", "my message?"], scene: "仕事", to: "相手", imp: "must", pat: "Did you see ~?" },
  { ja: "今朝のニュース、見ましたか。", en: "Did you see the news this morning?", ch: ["Did you see the news", "this morning?"], scene: "会話", to: "友人", imp: "often", pat: "Did you see ~?" },
  { ja: "私のカバン、見ませんでしたか。", en: "Did you see my bag anywhere?", ch: ["Did you see my bag", "anywhere?"], scene: "家", to: "家族", imp: "must", pat: "Did you see ~?" },
  { ja: "ここの使い方、分かりますか。", en: "Do you know how to use this?", ch: ["Do you know how to", "use this?"], scene: "外出", to: "相手", imp: "must", pat: "Do you know how to ~?" },
  { ja: "ここからの行き方、分かりますか。", en: "Do you know how to get there from here?", ch: ["Do you know how to", "get there from here?"], scene: "外出", to: "相手", imp: "must", pat: "Do you know how to ~?" },
  { ja: "これの直し方、分かりますか。", en: "Do you know how to fix this?", ch: ["Do you know how to", "fix this?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you know how to ~?" },
  { ja: "何時からか知っていますか。", en: "Do you know what time it starts?", ch: ["Do you know", "what time it starts?"], scene: "外出", to: "相手", imp: "must", pat: "Do you know ~?" },
  { ja: "理由を知っていますか。", en: "Do you know the reason?", ch: ["Do you know", "the reason?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you know ~?" },
  { ja: "今日は開いていると思いますか。", en: "Do you think they're open today?", ch: ["Do you think", "they're open today?"], scene: "外出", to: "家族", imp: "must", pat: "Do you think ~?" },
  { ja: "これ、私に似合うと思いますか。", en: "Do you think this suits me?", ch: ["Do you think", "this suits me?"], scene: "買い物", to: "家族", imp: "often", pat: "Do you think ~?" },
  { ja: "予約はいると思いますか。", en: "Do you think we need a reservation?", ch: ["Do you think", "we need a reservation?"], scene: "外出", to: "家族", imp: "must", pat: "Do you think ~?" },
  { ja: "間に合うと思いますか。", en: "Do you think we'll make it in time?", ch: ["Do you think we'll", "make it in time?"], scene: "外出", to: "家族", imp: "must", pat: "Do you think ~?" },
  { ja: "これ、お借りしてもいいですか。", en: "Do you mind if I borrow this?", ch: ["Do you mind if I", "borrow this?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you mind if I ~?" },
  { ja: "カードで払ってもいいですか。", en: "Do you mind if I pay by card?", ch: ["Do you mind if I", "pay by card?"], scene: "買い物", to: "店員", imp: "must", pat: "Do you mind if I ~?" },
  { ja: "今日は早めに失礼してもいいですか。", en: "Do you mind if I head out early today?", ch: ["Do you mind if I", "head out early today?"], scene: "仕事", to: "同僚", imp: "must", pat: "Do you mind if I ~?" },
  { ja: "隣、座ってもいいですか。", en: "Do you mind if I sit here?", ch: ["Do you mind if I", "sit here?"], scene: "カフェ", to: "相手", imp: "must", pat: "Do you mind if I ~?" },
  { ja: "傘、いりますか。", en: "Do you need an umbrella?", ch: ["Do you need", "an umbrella?"], scene: "家", to: "家族", imp: "must", pat: "Do you need ~?" },
  { ja: "地図、いりますか。", en: "Do you need a map?", ch: ["Do you need", "a map?"], scene: "外出", to: "相手", imp: "often", pat: "Do you need ~?" },
  { ja: "もう少し時間がいりますか。", en: "Do you need more time?", ch: ["Do you need", "more time?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you need ~?" },
  { ja: "一緒に行きたいですか。", en: "Do you want to come along?", ch: ["Do you want to", "come along?"], scene: "外出", to: "家族", imp: "must", pat: "Do you want to ~?" },
  { ja: "そろそろ注文しますか。", en: "Do you want to order now?", ch: ["Do you want to", "order now?"], scene: "レストラン", to: "家族", imp: "must", pat: "Do you want to ~?" },
  { ja: "先に休みますか。", en: "Do you want to take a break first?", ch: ["Do you want to", "take a break first?"], scene: "仕事", to: "相手", imp: "often", pat: "Do you want to ~?" },
  { ja: "今、何か探していますか。", en: "Are you looking for something?", ch: ["Are you looking for", "something?"], scene: "家", to: "家族", imp: "must", pat: "Are you [verb-ing]?" },
  { ja: "もう寝ていますか。", en: "Are you already sleeping?", ch: ["Are you already", "sleeping?"], scene: "家", to: "家族", imp: "often", pat: "Are you [verb-ing]?" },
  { ja: "もう十二時だなんて、信じられますか。", en: "Can you believe it's already noon?", ch: ["Can you believe", "it's already noon?"], scene: "会話", to: "友人", imp: "often", pat: "Can you believe ~?" },
  { ja: "本当に戻ってきたなんて、信じられますか。", en: "Can you believe he actually came back?", ch: ["Can you believe", "he actually came back?"], scene: "会話", to: "友人", imp: "sub", pat: "Can you believe ~?" },
];
