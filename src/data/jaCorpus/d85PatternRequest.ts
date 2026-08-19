import type { JaSentenceInput } from "./types";

// 分野 85: 頼む・すすめる・止める型
//
// Would you mind / Feel free to / You should / Don't ~ など、相手に働きかける型。
export const D85_SELF: JaSentenceInput[] = [];

export const D85_ADD: JaSentenceInput[] = [
  { ja: "もう一度言っていただけますか。", en: "Would you mind saying that again?", ch: ["Would you mind", "saying that again?"], scene: "コール", to: "参加者", imp: "must", pat: "Would you mind ~?" },
  { ja: "写真を撮っていただけますか。", en: "Would you mind taking a photo for us?", ch: ["Would you mind", "taking a photo for us?"], scene: "外出", to: "相手", imp: "must", pat: "Would you mind ~?" },
  { ja: "もう一度確認していただけますか。", en: "Would you mind checking again?", ch: ["Would you mind", "checking again?"], scene: "仕事", to: "相手", imp: "must", pat: "Would you mind ~?" },
  { ja: "窓を開けていただけますか。", en: "Would you mind opening the window?", ch: ["Would you mind", "opening the window?"], scene: "家", to: "家族", imp: "often", pat: "Would you mind ~?" },
  { ja: "タクシーを呼ぶのを手伝ってもらえますか。", en: "Can you help me get a taxi?", ch: ["Can you help me", "get a taxi?"], scene: "外出", to: "相手", imp: "must", pat: "Can you help me ~?" },
  { ja: "これを理解するのを手伝ってもらえますか。", en: "Can you help me understand this?", ch: ["Can you help me", "understand this?"], scene: "仕事", to: "相手", imp: "must", pat: "Can you help me ~?" },
  { ja: "これを運ぶのを手伝ってもらえますか。", en: "Can you help me carry this?", ch: ["Can you help me", "carry this?"], scene: "家", to: "家族", imp: "must", pat: "Can you help me ~?" },
  { ja: "遠慮なく連絡してください。", en: "Feel free to get in touch.", ch: ["Feel free to", "get in touch"], scene: "仕事", to: "相手", imp: "must", pat: "Feel free to ~" },
  { ja: "遠慮なく質問してください。", en: "Feel free to ask anything.", ch: ["Feel free to", "ask anything"], scene: "仕事", to: "相手", imp: "must", pat: "Feel free to ~" },
  { ja: "遠慮なくゆっくりしていってください。", en: "Feel free to stay as long as you like.", ch: ["Feel free to stay", "as long as you like"], scene: "家", to: "友人", imp: "often", pat: "Feel free to ~" },
  { ja: "何かあれば遠慮なく言ってください。", en: "Don't hesitate to say something.", ch: ["Don't hesitate to", "say something"], scene: "仕事", to: "相手", imp: "must", pat: "Don't hesitate to ~" },
  { ja: "鍵をかけるよう、あとで言ってください。", en: "Please remind me to lock the door.", ch: ["Please remind me to", "lock the door"], scene: "家", to: "家族", imp: "must", pat: "Please remind me to ~" },
  { ja: "支払いのこと、あとで言ってください。", en: "Please remind me to pay the bill.", ch: ["Please remind me to", "pay the bill"], scene: "家", to: "家族", imp: "must", pat: "Please remind me to ~" },
  { ja: "充電するよう、あとで言ってください。", en: "Please remind me to charge my phone.", ch: ["Please remind me to", "charge my phone"], scene: "家", to: "家族", imp: "often", pat: "Please remind me to ~" },
  { ja: "このボタンを押すだけで大丈夫です。", en: "All you have to do is press this button.", ch: ["All you have to do is", "press this button"], scene: "外出", to: "相手", imp: "must", pat: "All you have to do is ~" },
  { ja: "チケットを見せるだけで大丈夫です。", en: "All you have to do is show your ticket.", ch: ["All you have to do is", "show your ticket"], scene: "外出", to: "相手", imp: "must", pat: "All you have to do is ~" },
  { ja: "ついてきてもらうだけで大丈夫です。", en: "All you have to do is follow me.", ch: ["All you have to do is", "follow me"], scene: "外出", to: "相手", imp: "often", pat: "All you have to do is ~" },
  { ja: "必要なのは、あと一日だけです。", en: "All I need is one more day.", ch: ["All I need is", "one more day"], scene: "仕事", to: "相手", imp: "must", pat: "All I need is ~" },
  { ja: "必要なのは、領収書だけです。", en: "All I need is a receipt.", ch: ["All I need is", "a receipt"], scene: "買い物", to: "店員", imp: "must", pat: "All I need is ~" },
  { ja: "必要なのは、あなたの助けだけです。", en: "All I need is your help.", ch: ["All I need is", "your help"], scene: "仕事", to: "相手", imp: "often", pat: "All I need is ~" },
  { ja: "バスが来るか見てきます。", en: "Let me see if the bus is coming.", ch: ["Let me see if", "the bus is coming"], scene: "外出", to: "家族", imp: "must", pat: "See if ~" },
  { ja: "カードが使えるか聞いてみます。", en: "Let me see if they take cards.", ch: ["Let me see if", "they take cards"], scene: "買い物", to: "家族", imp: "must", pat: "See if ~" },
  { ja: "変えられるか確認してみます。", en: "Let me see if I can change it.", ch: ["Let me see if", "I can change it"], scene: "仕事", to: "相手", imp: "must", pat: "See if ~" },
  { ja: "先に電話した方がいいですよ。", en: "You should call first.", ch: ["You should", "call first"], scene: "外出", to: "家族", imp: "must", pat: "You should ~" },
  { ja: "早めに予約した方がいいですよ。", en: "You should book early.", ch: ["You should", "book early"], scene: "レストラン", to: "友人", imp: "must", pat: "You should ~" },
  { ja: "ここで待った方がいいですよ。", en: "You should wait here.", ch: ["You should", "wait here"], scene: "外出", to: "相手", imp: "must", pat: "You should ~" },
  { ja: "落ち着いた方がいいですよ。", en: "You should take it easy.", ch: ["You should", "take it easy"], scene: "会話", to: "相手", imp: "often", pat: "You should ~" },
  { ja: "これは食べてみるべきですよ。", en: "You must try this.", ch: ["You must", "try this"], scene: "レストラン", to: "友人", imp: "must", pat: "You must ~" },
  { ja: "ここに署名が必要です。", en: "You must sign here.", ch: ["You must", "sign here"], scene: "外出", to: "相手", imp: "must", pat: "You must ~" },
  { ja: "事前の予約が必要です。", en: "You must book in advance.", ch: ["You must", "book in advance"], scene: "レストラン", to: "相手", imp: "must", pat: "You must ~" },
  { ja: "そのまま続けてください。", en: "Keep going.", scene: "会話", to: "相手", imp: "must", pat: "Keep [verb-ing]" },
  { ja: "そのまま話してください。", en: "Keep talking.", scene: "会話", to: "相手", imp: "often", pat: "Keep [verb-ing]" },
  { ja: "急がないでください。", en: "Please don't rush.", scene: "会話", to: "相手", imp: "must", pat: "Please do not ~" },
  { ja: "気を使わないでください。", en: "Please don't go to any trouble.", ch: ["Please don't", "go to any trouble"], scene: "会話", to: "相手", imp: "must", pat: "Please do not ~" },
  { ja: "ここでは吸わないでください。", en: "Please don't smoke here.", ch: ["Please don't", "smoke here"], scene: "外出", to: "相手", imp: "often", pat: "Please do not ~" },
  { ja: "一人で直そうとしないでください。", en: "Don't try to fix it alone.", ch: ["Don't try to", "fix it alone"], scene: "家", to: "家族", imp: "must", pat: "Don't try to ~" },
  { ja: "完璧にしようとしないでください。", en: "Don't try to make it perfect.", ch: ["Don't try to", "make it perfect"], scene: "仕事", to: "相手", imp: "must", pat: "Don't try to ~" },
  { ja: "一人で持ち上げようとしないでください。", en: "Don't try to lift it by yourself.", ch: ["Don't try to lift it", "by yourself"], scene: "家", to: "家族", imp: "often", pat: "Don't try to ~" },
  { ja: "そんなに気にしないでください。", en: "Don't be so hard on yourself.", ch: ["Don't be", "so hard on yourself"], scene: "会話", to: "相手", imp: "must", pat: "Don't be ~" },
  { ja: "文句を言うのはやめましょう。", en: "Let's stop complaining.", scene: "会話", to: "家族", imp: "often", pat: "Stop [verb-ing]" },
];
