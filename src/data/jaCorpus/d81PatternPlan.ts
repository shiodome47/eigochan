import type { JaSentenceInput } from "./types";

// 分野 81: 意志と予定を言う型
//
// I'm going to / I have to / I'm about to など、これからのことを言う型。
export const D81_SELF: JaSentenceInput[] = [];

export const D81_ADD: JaSentenceInput[] = [
  { ja: "あとで確認するつもりです。", en: "I'm going to check it later.", ch: ["I'm going to", "check it later"], scene: "仕事", to: "相手", imp: "must", pat: "I'm going to ~" },
  { ja: "こちらから電話するつもりです。", en: "I'm going to give them a call.", ch: ["I'm going to", "give them a call"], scene: "仕事", to: "相手", imp: "must", pat: "I'm going to ~" },
  { ja: "ここで待つつもりです。", en: "I'm going to wait here.", ch: ["I'm going to", "wait here"], scene: "外出", to: "家族", imp: "must", pat: "I'm going to ~" },
  { ja: "今日はもう寝るつもりです。", en: "I'm going to call it a night.", ch: ["I'm going to", "call it a night"], scene: "家", to: "家族", imp: "often", pat: "I'm going to ~" },
  { ja: "これを終わらせないといけません。", en: "I have to finish this.", ch: ["I have to", "finish this"], scene: "仕事", to: "相手", imp: "must", pat: "I have to ~" },
  { ja: "明日は早く起きないといけません。", en: "I have to get up early tomorrow.", ch: ["I have to", "get up early tomorrow"], scene: "家", to: "家族", imp: "must", pat: "I have to ~" },
  { ja: "先に払わないといけません。", en: "I have to pay first.", ch: ["I have to", "pay first"], scene: "買い物", to: "店員", imp: "must", pat: "I have to ~" },
  { ja: "家に連絡しないといけません。", en: "I have to contact my family.", ch: ["I have to", "contact my family"], scene: "外出", to: "相手", imp: "must", pat: "I have to ~" },
  { ja: "ちょうど今、終わるところです。", en: "I'm about to finish.", ch: ["I'm about to", "finish"], scene: "仕事", to: "相手", imp: "must", pat: "I'm about to ~" },
  { ja: "ちょうど今、出るところです。", en: "I'm about to head out.", ch: ["I'm about to", "head out"], scene: "外出", to: "家族", imp: "must", pat: "I'm about to ~" },
  { ja: "ちょうど今、始めるところです。", en: "I'm about to start.", ch: ["I'm about to", "start"], scene: "仕事", to: "相手", imp: "must", pat: "I'm about to ~" },
  { ja: "ちょうど今、電話するところでした。", en: "I was about to call you.", ch: ["I was about to", "call you"], scene: "仕事", to: "相手", imp: "often", pat: "I'm about to ~" },
  { ja: "今ちょうど支払いを済ませたところです。", en: "I've just paid.", ch: ["I've just", "paid"], scene: "買い物", to: "店員", imp: "must", pat: "I have just ~" },
  { ja: "今ちょうど注文したところです。", en: "I've just ordered.", ch: ["I've just", "ordered"], scene: "レストラン", to: "店員", imp: "must", pat: "I have just ~" },
  { ja: "今ちょうど戻ったところです。", en: "I've just got back.", ch: ["I've just", "got back"], scene: "家", to: "家族", imp: "must", pat: "I have just ~" },
  { ja: "来月、休みを取る予定です。", en: "I'm planning to take some time off next month.", ch: ["I'm planning to", "take some time off"], scene: "仕事", to: "同僚", imp: "must", pat: "I'm planning to ~" },
  { ja: "早めに出発する予定です。", en: "I'm planning to leave early.", ch: ["I'm planning to", "leave early"], scene: "外出", to: "家族", imp: "must", pat: "I'm planning to ~" },
  { ja: "今夜は自分で作る予定です。", en: "I'm planning to cook tonight.", ch: ["I'm planning to", "cook tonight"], scene: "家", to: "家族", imp: "often", pat: "I'm planning to ~" },
  { ja: "三時に着くことになっています。", en: "I'm supposed to arrive at three.", ch: ["I'm supposed to", "arrive at three"], scene: "外出", to: "相手", imp: "must", pat: "I'm supposed to ~" },
  { ja: "先に払うことになっています。", en: "I'm supposed to pay in advance.", ch: ["I'm supposed to", "pay in advance"], scene: "買い物", to: "店員", imp: "must", pat: "I'm supposed to ~" },
  { ja: "今日は出社することになっています。", en: "I'm supposed to be at the office today.", ch: ["I'm supposed to", "be at the office today"], scene: "仕事", to: "同僚", imp: "must", pat: "I'm supposed to ~" },
  { ja: "手続きをしにここへ来ました。", en: "I'm here to take care of some paperwork.", ch: ["I'm here to", "take care of some paperwork"], scene: "外出", to: "相手", imp: "must", pat: "I'm here to ~" },
  { ja: "受け取りに来ました。", en: "I'm here to pick something up.", ch: ["I'm here to", "pick something up"], scene: "買い物", to: "店員", imp: "must", pat: "I'm here to ~" },
  { ja: "診てもらいに来ました。", en: "I'm here to see a doctor.", ch: ["I'm here to", "see a doctor"], scene: "病院", to: "受付", imp: "must", pat: "I'm here to ~" },
  { ja: "ドアを開けようとしました。", en: "I tried to open the door.", ch: ["I tried to", "open the door"], scene: "外出", to: "相手", imp: "must", pat: "I tried to ~" },
  { ja: "自分で直そうとしました。", en: "I tried to fix it myself.", ch: ["I tried to", "fix it myself"], scene: "家", to: "家族", imp: "must", pat: "I tried to ~" },
  { ja: "連絡しようとはしました。", en: "I did try to reach you.", ch: ["I did try to", "reach you"], scene: "仕事", to: "相手", imp: "often", pat: "I tried to ~" },
  { ja: "明日なら払えると思います。", en: "I'll be able to pay tomorrow.", ch: ["I'll be able to", "pay tomorrow"], scene: "仕事", to: "相手", imp: "must", pat: "I'll be able to ~" },
  { ja: "あとから合流できると思います。", en: "I'll be able to join you later.", ch: ["I'll be able to", "join you later"], scene: "外出", to: "友人", imp: "must", pat: "I'll be able to ~" },
  { ja: "迎えに行けると思います。", en: "I'll be able to pick you up.", ch: ["I'll be able to", "pick you up"], scene: "外出", to: "家族", imp: "must", pat: "I'll be able to ~" },
  { ja: "忘れるかもしれません。", en: "I may forget.", ch: ["I may", "forget"], scene: "会話", to: "相手", imp: "must", pat: "I may ~" },
  { ja: "早めに出るかもしれません。", en: "I may leave early.", ch: ["I may", "leave early"], scene: "仕事", to: "同僚", imp: "must", pat: "I may ~" },
  { ja: "また戻ってくるかもしれません。", en: "I may come back later.", ch: ["I may", "come back later"], scene: "買い物", to: "店員", imp: "often", pat: "I may ~" },
  { ja: "先に謝っておいた方がよさそうです。", en: "I'd better apologize first.", ch: ["I'd better", "apologize first"], scene: "会話", to: "相手", imp: "must", pat: "I'd better ~" },
  { ja: "予約しておいた方がよさそうです。", en: "I'd better book ahead.", ch: ["I'd better", "book ahead"], scene: "レストラン", to: "家族", imp: "must", pat: "I'd better ~" },
  { ja: "そろそろ寝た方がよさそうです。", en: "I'd better get some sleep.", ch: ["I'd better", "get some sleep"], scene: "家", to: "家族", imp: "must", pat: "I'd better ~" },
  { ja: "結局タクシーに乗ることになりました。", en: "I ended up taking a taxi.", ch: ["I ended up", "taking a taxi"], scene: "外出", to: "家族", imp: "must", pat: "I ended up ~" },
  { ja: "結局、道に迷いました。", en: "I ended up getting lost.", ch: ["I ended up", "getting lost"], scene: "外出", to: "家族", imp: "must", pat: "I ended up ~" },
  { ja: "結局、一本乗り遅れました。", en: "I ended up missing my train.", ch: ["I ended up", "missing my train"], scene: "外出", to: "相手", imp: "must", pat: "I ended up ~" },
  { ja: "もっと早く言うべきでした。", en: "I should have said something sooner.", ch: ["I should have", "said something sooner"], scene: "仕事", to: "相手", imp: "must", pat: "I should have ~" },
];
