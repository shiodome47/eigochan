import type { JaSentenceInput } from "./types";

// 分野 86: 経験・好み・伝える型
//
// 79〜85 で拾いきれなかった型を埋める分野。
// 型が 1 文しかないと「この型はこの文」と丸暗記になるので、
// 薄かった型にも 1 文ずつ足して 2〜3 文にしている。
export const D86_SELF: JaSentenceInput[] = [];

export const D86_ADD: JaSentenceInput[] = [
  // ── 抜けていた型 ──────────────────────────
  { ja: "今、お時間ありますか。", en: "Are you free right now?", ch: ["Are you free", "right now?"], scene: "仕事", to: "相手", imp: "must", pat: "Are you [adj]?" },
  { ja: "寒くないですか。", en: "Are you cold?", ch: ["Are you", "cold?"], scene: "家", to: "家族", imp: "must", pat: "Are you [adj]?" },
  { ja: "海外で運転したことはありますか。", en: "Have you ever driven overseas?", ch: ["Have you ever", "driven overseas?"], scene: "会話", to: "相手", imp: "must", pat: "Have you ever ~?" },
  { ja: "日本に来たことはありますか。", en: "Have you ever been to Japan?", ch: ["Have you ever", "been to Japan?"], scene: "コール", to: "参加者", imp: "must", pat: "Have you ever ~?" },
  { ja: "こういうことは前にもありましたか。", en: "Have you ever run into this before?", ch: ["Have you ever run into this", "before?"], scene: "仕事", to: "相手", imp: "must", pat: "Have you ever ~?" },
  { ja: "全部でいくらになりますか。", en: "How much is it altogether?", ch: ["How much is it", "altogether?"], scene: "買い物", to: "店員", imp: "must", pat: "How much / How many ~?" },
  { ja: "何泊のご予約でしたか。", en: "How many nights is it?", ch: ["How many nights", "is it?"], scene: "ホテル", to: "フロント", imp: "must", pat: "How much / How many ~?" },
  { ja: "いくつ乗り換えがありますか。", en: "How many transfers are there?", ch: ["How many transfers", "are there?"], scene: "外出", to: "相手", imp: "must", pat: "How much / How many ~?" },
  { ja: "なんて気持ちのいい場所でしょう。", en: "What a nice spot!", ch: ["What a", "nice spot!"], scene: "外出", to: "家族", imp: "often", pat: "What a [adj] [noun]!" },
  { ja: "なんて長い一日でしょう。", en: "What a long day!", ch: ["What a", "long day!"], scene: "家", to: "家族", imp: "often", pat: "What a [adj] [noun]!" },
  { ja: "世間は狭いですね。", en: "What a small world!", ch: ["What a", "small world!"], scene: "会話", to: "相手", imp: "often", pat: "What a [adj] [noun]!" },
  { ja: "少し休みたいです。", en: "I want to take a short break.", ch: ["I want to take", "a short break"], scene: "仕事", to: "同僚", imp: "must", pat: "I want to ~" },
  { ja: "先に確認したいです。", en: "I want to check first.", ch: ["I want to", "check first"], scene: "仕事", to: "相手", imp: "must", pat: "I want to ~" },
  { ja: "領収書がほしいです。", en: "I want a receipt, please.", ch: ["I want a receipt,", "please"], scene: "買い物", to: "店員", imp: "must", pat: "I want ~" },
  { ja: "午後に会議があります。", en: "I have a meeting this afternoon.", ch: ["I have a meeting", "this afternoon"], scene: "仕事", to: "相手", imp: "must", pat: "I have ~" },
  { ja: "聞きたいことがあります。", en: "I have a question.", ch: ["I have", "a question"], scene: "コール", to: "参加者", imp: "must", pat: "I have ~" },
  { ja: "予約を入れてあります。", en: "I have a booking under my name.", ch: ["I have a booking", "under my name"], scene: "レストラン", to: "店員", imp: "must", pat: "I have ~" },
  { ja: "そこには行ったことがあります。", en: "I've been there before.", ch: ["I've been there", "before"], scene: "会話", to: "相手", imp: "must", pat: "I have been to ~" },
  { ja: "その市場には行ったことがあります。", en: "I've been to that market.", ch: ["I've been to", "that market"], scene: "会話", to: "友人", imp: "often", pat: "I have been to ~" },
  { ja: "たぶん一人で行くと思います。", en: "I'll probably go on my own.", ch: ["I'll probably go", "on my own"], scene: "外出", to: "家族", imp: "must", pat: "I probably ~" },
  { ja: "たぶん今日は遅くなります。", en: "I'll probably be late today.", ch: ["I'll probably be", "late today"], scene: "家", to: "家族", imp: "must", pat: "I probably ~" },
  { ja: "私ならこちらを選びます。", en: "I would go with this one.", ch: ["I would go with", "this one"], scene: "買い物", to: "家族", imp: "must", pat: "I would ~" },
  { ja: "私ならここで待ちます。", en: "I would wait here.", ch: ["I would", "wait here"], scene: "外出", to: "家族", imp: "must", pat: "I would ~" },
  { ja: "私からはこの進め方をおすすめします。", en: "I would suggest doing it this way.", ch: ["I would suggest", "doing it this way"], scene: "仕事", to: "相手", imp: "must", pat: "I would suggest ~" },
  { ja: "一番好きな飲み物はコーヒーです。", en: "My favorite drink is coffee.", ch: ["My favorite drink", "is coffee"], scene: "カフェ", to: "友人", imp: "must", pat: "My favorite ~ is ~" },
  { ja: "一番好きな時間は朝です。", en: "My favorite time of day is the morning.", ch: ["My favorite time of day", "is the morning"], scene: "会話", to: "相手", imp: "often", pat: "My favorite ~ is ~" },
  { ja: "これは完全に想定外です。", en: "This is totally unexpected.", ch: ["This is totally", "unexpected"], scene: "仕事", to: "相手", imp: "must", pat: "This is totally ~" },
  { ja: "これで全く問題ありません。", en: "This is totally fine.", ch: ["This is totally", "fine"], scene: "仕事", to: "相手", imp: "must", pat: "This is totally ~" },
  { ja: "分かっているのは、彼がここで働いているということだけです。", en: "All I know is that he works here.", ch: ["All I know is that", "he works here"], scene: "会話", to: "相手", imp: "must", pat: "All I know is ~" },
  { ja: "分かっているのは、今日は無理だということだけです。", en: "All I know is that it can't happen today.", ch: ["All I know is that", "it can't happen today"], scene: "仕事", to: "相手", imp: "often", pat: "All I know is ~" },
  { ja: "どこで買えるか教えてください。", en: "Tell me where I can buy it.", ch: ["Tell me where", "I can buy it"], scene: "買い物", to: "店員", imp: "must", pat: "Tell me [wh-] ~" },
  { ja: "何時に着くか教えてください。", en: "Tell me what time you'll arrive.", ch: ["Tell me what time", "you'll arrive"], scene: "外出", to: "家族", imp: "must", pat: "Tell me [wh-] ~" },
  { ja: "私の仕事について少しお話しします。", en: "Let me tell you about what I do.", ch: ["Let me tell you about", "what I do"], scene: "コール", to: "参加者", imp: "must", pat: "Let me tell you about ~" },
  { ja: "うちのプールについて少しお話しします。", en: "Let me tell you about my pool.", ch: ["Let me tell you about", "my pool"], scene: "コール", to: "参加者", imp: "must", pat: "Let me tell you about ~" },
  { ja: "受付で払うように言われました。", en: "I was told to pay at the counter.", ch: ["I was told to", "pay at the counter"], scene: "買い物", to: "店員", imp: "must", pat: "I was told to ~" },
  { ja: "ここで待つように言われました。", en: "I was told to wait here.", ch: ["I was told to", "wait here"], scene: "外出", to: "相手", imp: "must", pat: "I was told to ~" },

  // ── 1 文しかなかった型を厚くする ────────────
  { ja: "もっと早く聞いておくべきでした。", en: "I should have asked sooner.", ch: ["I should have", "asked sooner"], scene: "仕事", to: "相手", imp: "must", pat: "I should have ~" },
  { ja: "この味は少し濃いです。", en: "It tastes a bit strong.", ch: ["It tastes", "a bit strong"], scene: "レストラン", to: "家族", imp: "often", pat: "It tastes ~" },
  { ja: "その旅行はどうでしたか。", en: "How did the trip go?", ch: ["How did the trip", "go?"], scene: "会話", to: "友人", imp: "must", pat: "How did [event] go?" },
  { ja: "遠慮せずに聞いてください。", en: "Don't hesitate to ask.", ch: ["Don't hesitate to", "ask"], scene: "仕事", to: "相手", imp: "must", pat: "Don't hesitate to ~" },
];
