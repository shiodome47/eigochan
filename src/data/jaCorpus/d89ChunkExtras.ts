import type { JaSentenceInput } from "./types";

// 分野 89: 言い出し・補足のチャンク
//
// 文のあたま (言い出し) と、うしろに足す一言 (いつ・どこで・どんなふうに)。
// 既存コーパスに無かったものだけを入れている。
export const D89_SELF: JaSentenceInput[] = [];

export const D89_ADD: JaSentenceInput[] = [
  // ── 言い出しチャンク ──────────────────────
  { ja: "そろそろ休みたいです。", en: "I wanna call it a day.", ch: ["I wanna", "call it a day"], scene: "仕事", to: "同僚", imp: "must", pat: "I wanna ~" },
  { ja: "今日は早く帰りたいです。", en: "I wanna head home early today.", ch: ["I wanna head home", "early today"], scene: "仕事", to: "同僚", imp: "must", pat: "I wanna ~" },
  { ja: "あとで確認しておきますね。", en: "I'm gonna check it later.", ch: ["I'm gonna", "check it later"], scene: "仕事", to: "相手", imp: "must", pat: "I'm gonna ~" },
  { ja: "今から出るところです。", en: "I'm gonna head out now.", ch: ["I'm gonna", "head out now"], scene: "外出", to: "家族", imp: "must", pat: "I'm gonna ~" },
  { ja: "毎日少しずつ続けようとしています。", en: "I'm trying to keep at it every day.", ch: ["I'm trying to", "keep at it every day"], scene: "学習", to: "相手", imp: "must", pat: "I'm trying to ~" },
  { ja: "英語で話すようにしています。", en: "I'm trying to speak in English.", ch: ["I'm trying to", "speak in English"], scene: "コール", to: "参加者", imp: "must", pat: "I'm trying to ~" },
  { ja: "早く寝ようとしているところです。", en: "I'm trying to get to bed earlier.", ch: ["I'm trying to", "get to bed earlier"], scene: "家", to: "家族", imp: "often", pat: "I'm trying to ~" },
  { ja: "それは今日中にやらないといけませんか。", en: "Do you have to do it today?", ch: ["Do you have to", "do it today?"], scene: "仕事", to: "相手", imp: "must", pat: "Do you have to ~?" },
  { ja: "先に払わないといけませんか。", en: "Do you have to pay first?", ch: ["Do you have to", "pay first?"], scene: "買い物", to: "店員", imp: "must", pat: "Do you have to ~?" },
  { ja: "予約は必要ですか。", en: "Do you need to book ahead?", ch: ["Do you need to", "book ahead?"], scene: "レストラン", to: "店員", imp: "must", pat: "Do you need to ~?" },
  { ja: "私も何か持っていく必要がありますか。", en: "Do I need to bring anything?", ch: ["Do I need to", "bring anything?"], scene: "会話", to: "友人", imp: "must", pat: "Do you need to ~?" },
  { ja: "ここに置いても大丈夫ですか。", en: "Is it fine if I leave this here?", ch: ["Is it fine if I", "leave this here?"], scene: "外出", to: "相手", imp: "must", pat: "Is it fine if I ~?" },
  { ja: "少し早く出ても大丈夫ですか。", en: "Is it fine if I leave a bit early?", ch: ["Is it fine if I", "leave a bit early?"], scene: "仕事", to: "同僚", imp: "must", pat: "Is it fine if I ~?" },
  { ja: "今日は参加する予定ですか。", en: "Are you gonna join today?", ch: ["Are you gonna", "join today?"], scene: "コール", to: "参加者", imp: "must", pat: "Are you gonna ~?" },
  { ja: "それはもう頼む予定ですか。", en: "Are you gonna order that?", ch: ["Are you gonna", "order that?"], scene: "レストラン", to: "家族", imp: "often", pat: "Are you gonna ~?" },
  { ja: "それを一人でやろうとしているんですか。", en: "Are you trying to do that alone?", ch: ["Are you trying to", "do that alone?"], scene: "仕事", to: "相手", imp: "must", pat: "Are you trying to ~?" },
  { ja: "どうせなら今やってしまいましょう。", en: "We might as well do it now.", ch: ["We might as well", "do it now"], scene: "仕事", to: "相手", imp: "must", pat: "might as well ~" },
  { ja: "せっかくなので歩いていきましょう。", en: "We might as well walk.", ch: ["We might as well", "walk"], scene: "外出", to: "家族", imp: "often", pat: "might as well ~" },
  { ja: "私は何をすればいいですか。", en: "What can I do to help?", ch: ["What can I do", "to help?"], scene: "仕事", to: "相手", imp: "must", pat: "What can I ~?" },
  { ja: "何を持っていけばいいですか。", en: "What can I bring?", ch: ["What can I", "bring?"], scene: "会話", to: "友人", imp: "must", pat: "What can I ~?" },
  { ja: "どうすれば連絡できますか。", en: "How can I reach you?", ch: ["How can I", "reach you?"], scene: "仕事", to: "相手", imp: "must", pat: "How can I ~?" },
  { ja: "どうすれば直せますか。", en: "How can I fix this?", ch: ["How can I", "fix this?"], scene: "仕事", to: "相手", imp: "must", pat: "How can I ~?" },
  { ja: "どうして今日なんですか。", en: "How come it's today?", ch: ["How come", "it's today?"], scene: "会話", to: "相手", imp: "must", pat: "How come ~?" },
  { ja: "どうして誰も来なかったんですか。", en: "How come nobody came?", ch: ["How come", "nobody came?"], scene: "会話", to: "相手", imp: "often", pat: "How come ~?" },

  // ── 補足チャンク ──────────────────────────
  { ja: "この前、そこで会いました。", en: "I saw them there the other day.", ch: ["I saw them there", "the other day"], scene: "会話", to: "相手", imp: "must", pat: "the other day" },
  { ja: "この前の話の続きですが。", en: "About what we talked about the other day.", ch: ["what we talked about", "the other day"], scene: "仕事", to: "相手", imp: "must", pat: "the other day" },
  { ja: "お昼ごろに着きます。", en: "I'll get there around noon.", ch: ["I'll get there", "around noon"], scene: "外出", to: "家族", imp: "must", pat: "around noon" },
  { ja: "今、向かっているところです。", en: "I'm on my way.", scene: "外出", to: "家族", imp: "must", pat: "on my way" },
  { ja: "帰りに寄っていきます。", en: "I'll stop by on my way home.", ch: ["I'll stop by", "on my way home"], scene: "買い物", to: "家族", imp: "must", pat: "on my way" },
  { ja: "隣に座ってもいいですか。", en: "Can you sit next to me?", ch: ["Can you sit", "next to me?"], scene: "外出", to: "家族", imp: "must", pat: "next to me" },
  { ja: "一人で行ってきます。", en: "I'll go by myself.", ch: ["I'll go", "by myself"], scene: "外出", to: "家族", imp: "must", pat: "by myself" },
  { ja: "これは一人でやりました。", en: "I did this by myself.", ch: ["I did this", "by myself"], scene: "仕事", to: "相手", imp: "must", pat: "by myself" },
  { ja: "家族と一緒に行く予定です。", en: "I'm going with my family.", ch: ["I'm going", "with my family"], scene: "会話", to: "相手", imp: "must", pat: "with my family" },
  { ja: "困っている人がいます。", en: "Someone over there is in trouble.", ch: ["Someone over there", "is in trouble"], scene: "外出", to: "相手", imp: "must", pat: "in trouble" },
  { ja: "今、少し困っています。", en: "I'm in a bit of trouble right now.", ch: ["I'm in a bit of trouble", "right now"], scene: "会話", to: "相手", imp: "must", pat: "in trouble" },
  { ja: "人前で話すのは苦手です。", en: "I'm not good at speaking in public.", ch: ["speaking", "in public"], scene: "会話", to: "相手", imp: "must", pat: "in public" },
  { ja: "その話は二人のときにしましょう。", en: "Let's talk about that in private.", ch: ["Let's talk about that", "in private"], scene: "仕事", to: "相手", imp: "must", pat: "in private" },
  { ja: "うっかり消してしまいました。", en: "I deleted it by accident.", ch: ["I deleted it", "by accident"], scene: "仕事", to: "相手", imp: "must", pat: "by accident" },
  { ja: "偶然、見つけました。", en: "I found it by accident.", ch: ["I found it", "by accident"], scene: "会話", to: "相手", imp: "often", pat: "by accident" },
  { ja: "この状況ではそれが一番だと思います。", en: "That's the best we can do in this situation.", ch: ["the best we can do", "in this situation"], scene: "仕事", to: "相手", imp: "must", pat: "in this situation" },
];
