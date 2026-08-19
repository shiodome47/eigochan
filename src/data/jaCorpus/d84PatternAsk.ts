import type { JaSentenceInput } from "./types";

// 分野 84: 詳しく尋ねる型
//
// How long / How often / What if / Why don't you など、Wh- で掘り下げる型。
export const D84_SELF: JaSentenceInput[] = [];

export const D84_ADD: JaSentenceInput[] = [
  { ja: "こちらにはどのくらい滞在していますか。", en: "How long have you been staying here?", ch: ["How long have you been", "staying here?"], scene: "会話", to: "相手", imp: "must", pat: "How long have you been ~?" },
  { ja: "その仕事はどのくらい続けているんですか。", en: "How long have you been doing that job?", ch: ["How long have you been", "doing that job?"], scene: "会話", to: "相手", imp: "must", pat: "How long have you been ~?" },
  { ja: "その調子はいつからですか。", en: "How long have you been feeling like this?", ch: ["How long have you been", "feeling like this?"], scene: "病院", to: "医師", imp: "must", pat: "How long have you been ~?" },
  { ja: "どのくらい待つことになりますか。", en: "How long will we have to wait?", ch: ["How long will we", "have to wait?"], scene: "外出", to: "店員", imp: "must", pat: "How long will you ~?" },
  { ja: "どのくらい留守にしますか。", en: "How long will you be away?", ch: ["How long will you", "be away?"], scene: "会話", to: "家族", imp: "must", pat: "How long will you ~?" },
  { ja: "どのくらいの頻度でここに来ますか。", en: "How often do you come here?", ch: ["How often do you", "come here?"], scene: "会話", to: "相手", imp: "must", pat: "How often do you ~?" },
  { ja: "どのくらいの頻度で連絡していますか。", en: "How often do you keep in touch?", ch: ["How often do you", "keep in touch?"], scene: "会話", to: "相手", imp: "often", pat: "How often do you ~?" },
  { ja: "この会議はどのくらいの頻度でありますか。", en: "How often does this meeting happen?", ch: ["How often does", "this meeting happen?"], scene: "コール", to: "参加者", imp: "must", pat: "How often do you ~?" },
  { ja: "どのくらい早く確認できますか。", en: "How soon can you confirm?", ch: ["How soon can you", "confirm?"], scene: "仕事", to: "相手", imp: "must", pat: "How soon can you ~?" },
  { ja: "どのくらい早く送ってもらえますか。", en: "How soon can you send it?", ch: ["How soon can you", "send it?"], scene: "仕事", to: "相手", imp: "must", pat: "How soon can you ~?" },
  { ja: "どのくらい早く用意できますか。", en: "How soon can you have it ready?", ch: ["How soon can you", "have it ready?"], scene: "買い物", to: "店員", imp: "often", pat: "How soon can you ~?" },
  { ja: "これはどうやって選べばいいですか。", en: "How am I supposed to choose?", ch: ["How am I supposed to", "choose?"], scene: "買い物", to: "店員", imp: "must", pat: "How am I supposed to ~?" },
  { ja: "どうやって注文すればいいですか。", en: "How am I supposed to order?", ch: ["How am I supposed to", "order?"], scene: "レストラン", to: "店員", imp: "must", pat: "How am I supposed to ~?" },
  { ja: "どうやって連絡すればいいですか。", en: "How am I supposed to get in touch?", ch: ["How am I supposed to", "get in touch?"], scene: "仕事", to: "相手", imp: "must", pat: "How am I supposed to ~?" },
  { ja: "どうやってその道を知ったんですか。", en: "How do you know the way?", ch: ["How do you know", "the way?"], scene: "外出", to: "相手", imp: "must", pat: "How do you know ~?" },
  { ja: "お二人はどういう知り合いですか。", en: "How do you know each other?", ch: ["How do you know", "each other?"], scene: "会話", to: "相手", imp: "must", pat: "How do you know ~?" },
  { ja: "話すのに都合のいい時間はいつですか。", en: "When would be a good time to talk?", ch: ["When would be a good time to", "talk?"], scene: "仕事", to: "相手", imp: "must", pat: "When would be a good time to ~?" },
  { ja: "伺うのに都合のいい時間はいつですか。", en: "When would be a good time to come by?", ch: ["When would be a good time to", "come by?"], scene: "仕事", to: "相手", imp: "must", pat: "When would be a good time to ~?" },
  { ja: "出るのに良いのは何時ごろですか。", en: "When would be a good time to leave?", ch: ["When would be a good time to", "leave?"], scene: "外出", to: "家族", imp: "must", pat: "When would be a good time to ~?" },
  { ja: "この辺で写真を撮るなら、どこが一番いいですか。", en: "Where is the best place to take photos around here?", ch: ["Where is the best place to", "take photos around here?"], scene: "外出", to: "相手", imp: "must", pat: "Where is the best place to ~?" },
  { ja: "お土産を買うなら、どこが一番いいですか。", en: "Where is the best place to buy souvenirs?", ch: ["Where is the best place to", "buy souvenirs?"], scene: "外出", to: "相手", imp: "must", pat: "Where is the best place to ~?" },
  { ja: "ゆっくりするなら、どこが一番いいですか。", en: "Where is the best place to sit and relax?", ch: ["Where is the best place to", "sit and relax?"], scene: "外出", to: "相手", imp: "often", pat: "Where is the best place to ~?" },
  { ja: "入口はどこですか。", en: "Where is the entrance?", ch: ["Where is", "the entrance?"], scene: "外出", to: "相手", imp: "must", pat: "Where is ~?" },
  { ja: "エレベーターはどこですか。", en: "Where is the elevator?", ch: ["Where is", "the elevator?"], scene: "外出", to: "相手", imp: "must", pat: "Where is ~?" },
  { ja: "どんな種類の仕事ですか。", en: "What kind of work is it?", ch: ["What kind of work", "is it?"], scene: "会話", to: "相手", imp: "must", pat: "What kind of ~?" },
  { ja: "どんな種類の料理ですか。", en: "What kind of food is it?", ch: ["What kind of food", "is it?"], scene: "レストラン", to: "店員", imp: "must", pat: "What kind of ~?" },
  { ja: "その予約はどうなりましたか。", en: "What happened to the reservation?", ch: ["What happened to", "the reservation?"], scene: "レストラン", to: "店員", imp: "must", pat: "What happened to ~?" },
  { ja: "その手はどうしたんですか。", en: "What happened to your hand?", ch: ["What happened to", "your hand?"], scene: "会話", to: "相手", imp: "must", pat: "What happened to ~?" },
  { ja: "あの件はどうなりましたか。", en: "What happened to that other thing?", ch: ["What happened to", "that other thing?"], scene: "仕事", to: "相手", imp: "must", pat: "What happened to ~?" },
  { ja: "もし遅れたらどうしますか。", en: "What if I'm running late?", ch: ["What if", "I'm running late?"], scene: "外出", to: "相手", imp: "must", pat: "What if ~?" },
  { ja: "もし雨が降ったらどうしますか。", en: "What if it rains?", ch: ["What if", "it rains?"], scene: "外出", to: "家族", imp: "must", pat: "What if ~?" },
  { ja: "もし席が空いていなかったらどうしますか。", en: "What if there are no seats?", ch: ["What if", "there are no seats?"], scene: "レストラン", to: "家族", imp: "must", pat: "What if ~?" },
  { ja: "この案についてどう思いますか。", en: "What do you think of this idea?", ch: ["What do you think of", "this idea?"], scene: "仕事", to: "相手", imp: "must", pat: "What do you think of ~?" },
  { ja: "この場所についてどう思いますか。", en: "What do you think of this place?", ch: ["What do you think of", "this place?"], scene: "外出", to: "家族", imp: "must", pat: "What do you think of ~?" },
  { ja: "この値段についてどう思いますか。", en: "What do you think of the price?", ch: ["What do you think of", "the price?"], scene: "買い物", to: "家族", imp: "must", pat: "What do you think of ~?" },
  { ja: "なぜ遅れたんだと思いますか。", en: "Why do you think it was delayed?", ch: ["Why do you think", "it was delayed?"], scene: "仕事", to: "相手", imp: "must", pat: "Why do you think ~?" },
  { ja: "なぜ値段が変わったんだと思いますか。", en: "Why do you think the price changed?", ch: ["Why do you think", "the price changed?"], scene: "買い物", to: "家族", imp: "often", pat: "Why do you think ~?" },
  { ja: "聞いてみたらどうですか。", en: "Why don't you just ask?", ch: ["Why don't you", "just ask?"], scene: "会話", to: "相手", imp: "must", pat: "Why don't you ~?" },
  { ja: "一緒に来たらどうですか。", en: "Why don't you come with us?", ch: ["Why don't you", "come with us?"], scene: "外出", to: "友人", imp: "must", pat: "Why don't you ~?" },
  { ja: "その発表はどうでしたか。", en: "How did the presentation go?", ch: ["How did the presentation", "go?"], scene: "仕事", to: "同僚", imp: "must", pat: "How did [event] go?" },
];
