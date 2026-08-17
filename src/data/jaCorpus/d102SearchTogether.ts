import type { JaSentenceInput } from "./types";

// 分野 102: なくし物を一緒に探す
//
// 分野 08 (物を探す・場所を確認する) が自分で探す分野なのに対して、
// ここは **二人で探す** 分野。心当たりを聞く、鳴らしてみる、
// 見つかったあとの「騒いで損した」まで含めた一連の流れ。
export const D102_SELF: JaSentenceInput[] = [];

export const D102_ADD: JaSentenceInput[] = [
  { ja: "財布が見当たりません。", en: "I can't find my wallet.", ch: ["I can't find", "my wallet"], scene: "外出", to: "家族", imp: "must" },
  { ja: "どこに置きましたか。", en: "Where did you put it?", ch: ["Where did you", "put it?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "かばんの中をもう一度見てください。", en: "Check inside your bag one more time.", ch: ["Check inside your bag", "one more time"], scene: "外出", to: "家族", imp: "must" },
  { ja: "もう見ましたが、ありません。", en: "I already looked, and it's not there.", ch: ["I already looked,", "and it's not there"], scene: "外出", to: "家族", imp: "must" },
  { ja: "さっきのカフェかもしれません。", en: "It might be at that cafe.", ch: ["It might be", "at that cafe"], scene: "外出", to: "家族", imp: "must" },
  { ja: "最後に見たのはどこですか。", en: "Where did you see it last?", ch: ["Where did you", "see it last?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "会計のときには持っていました。", en: "I had it when I paid.", ch: ["I had it", "when I paid"], scene: "外出", to: "家族", imp: "must" },
  { ja: "戻ってみましょう。", en: "Let's go back and check.", ch: ["Let's go back", "and check"], scene: "外出", to: "家族", imp: "must" },
  { ja: "先に電話をかけてみますか。", en: "Should we call them first?", ch: ["Should we call them", "first?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "番号は分かりますか。", en: "Do you know the number?", ch: ["Do you know", "the number?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "調べてみます。", en: "Let me look it up.", ch: ["Let me", "look it up"], scene: "外出", to: "家族", imp: "must" },
  { ja: "カードが全部入っています。", en: "All my cards are in there.", ch: ["All my cards", "are in there"], scene: "外出", to: "家族", imp: "must" },
  { ja: "止めた方がいいでしょうか。", en: "Should I have them frozen?", ch: ["Should I have them", "frozen?"], scene: "外出", to: "家族", imp: "often" },
  { ja: "もう少し探してからにしましょう。", en: "Let's look a bit more before we do that.", ch: ["Let's look a bit more", "before we do that"], scene: "外出", to: "家族", imp: "must" },
  { ja: "あわてないでください。", en: "Don't panic.", ch: ["Don't", "panic"], scene: "外出", to: "家族", imp: "must" },
  { ja: "きっと出てきます。", en: "It'll turn up.", ch: ["It'll", "turn up"], scene: "外出", to: "家族", imp: "must" },
  { ja: "上着のポケットは見ましたか。", en: "Did you check your coat pocket?", ch: ["Did you check", "your coat pocket?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ありました。", en: "Found it.", ch: ["Found", "it"], scene: "外出", to: "家族", imp: "must" },
  { ja: "ポケットに入っていました。", en: "It was in my pocket.", ch: ["It was", "in my pocket"], scene: "外出", to: "家族", imp: "must" },
  { ja: "驚かせないでください。", en: "Don't scare me like that.", ch: ["Don't scare me", "like that"], scene: "外出", to: "家族", imp: "must" },
  { ja: "見つかってよかったです。", en: "I'm glad you found it.", ch: ["I'm glad", "you found it"], scene: "外出", to: "家族", imp: "must" },
  { ja: "本当に心配しました。", en: "I was really worried there.", ch: ["I was really worried", "there"], scene: "外出", to: "家族", imp: "must" },
  { ja: "無意識に入れたようです。", en: "I must have put it there without thinking.", ch: ["I must have put it there", "without thinking"], scene: "外出", to: "家族", imp: "often" },
  { ja: "次は気をつけます。", en: "I'll be more careful next time.", ch: ["I'll be more careful", "next time"], scene: "外出", to: "家族", imp: "must" },
  { ja: "今度はスマホが見当たりません。", en: "Now I can't find my phone.", ch: ["Now I can't find", "my phone"], scene: "家", to: "家族", imp: "must" },
  { ja: "さっきソファにいましたよね。", en: "You were on the sofa a minute ago, right?", ch: ["You were on the sofa", "a minute ago, right?"], scene: "家", to: "家族", imp: "must" },
  { ja: "クッションの下は見ましたか。", en: "Did you look under the cushions?", ch: ["Did you look", "under the cushions?"], scene: "家", to: "家族", imp: "must" },
  { ja: "鳴らしてみます。", en: "I'll call it.", ch: ["I'll", "call it"], scene: "家", to: "家族", imp: "must" },
  { ja: "音が鳴ればすぐ分かります。", en: "If it rings, we'll know right away.", ch: ["If it rings,", "we'll know right away"], scene: "家", to: "家族", imp: "must" },
  { ja: "かばんの中から聞こえます。", en: "I hear it coming from my bag.", ch: ["I hear it coming", "from my bag"], scene: "家", to: "家族", imp: "must" },
  { ja: "最近そこに入れっぱなしですね。", en: "You've been leaving it in there a lot lately.", ch: ["You've been leaving it in there", "a lot lately"], scene: "家", to: "家族", imp: "often" },
  { ja: "騒いで損しました。", en: "I panicked for nothing.", ch: ["I panicked", "for nothing"], scene: "家", to: "家族", imp: "must" },
  { ja: "外で落とさなくてよかったです。", en: "At least you didn't drop it outside.", ch: ["At least you didn't", "drop it outside"], scene: "家", to: "家族", imp: "must" },
  { ja: "外だったら大変でした。", en: "That would have been a real problem.", ch: ["That would have been", "a real problem"], scene: "家", to: "家族", imp: "must" },
  { ja: "置き場所を決めておきましょう。", en: "Let's decide on one spot for it.", ch: ["Let's decide on", "one spot for it"], scene: "家", to: "家族", imp: "must" },
  { ja: "玄関に置く場所を作ります。", en: "I'll make a spot for it by the door.", ch: ["I'll make a spot for it", "by the door"], scene: "家", to: "家族", imp: "often" },
  { ja: "次からは落ち着いて探しましょう。", en: "Let's stay calm when we search next time.", ch: ["Let's stay calm", "when we search next time"], scene: "家", to: "家族", imp: "must" },
  { ja: "鳴らすのが一番早いですね。", en: "Calling it really is the fastest way.", ch: ["Calling it really is", "the fastest way"], scene: "家", to: "家族", imp: "must" },
  { ja: "探すのを手伝ってくれてありがとう。", en: "Thanks for helping me look.", ch: ["Thanks for helping me", "look"], scene: "家", to: "家族", imp: "must" },
  { ja: "一人だと見つからなかったです。", en: "I never would have found it alone.", ch: ["I never would have found it", "alone"], scene: "家", to: "家族", imp: "often" },
];
