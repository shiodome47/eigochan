import type { JaSentenceInput } from "./types";

// 分野 98: 落ち込んだ相手を励ます
//
// 分野 29 (相手に共感する) が「分かります」と受け止める側なのに対して、
// ここは **相手が落ちているときに声をかける** 分野。
// うまくいかなかった、失恋した、という相手に何を言うか。
// 決まり文句がすぐ出るかどうかで差が出る場面なので、短い文を多めにしている。
export const D98_SELF: JaSentenceInput[] = [];

export const D98_ADD: JaSentenceInput[] = [
  { ja: "元気がなさそうですね。", en: "You don't seem like yourself.", ch: ["You don't seem", "like yourself"], scene: "会話", to: "友人", imp: "must" },
  { ja: "何かありましたか。", en: "Did something happen?", ch: ["Did something", "happen?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "話したくなければ大丈夫です。", en: "You don't have to talk about it.", ch: ["You don't have to", "talk about it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "聞くことならできます。", en: "I can at least listen.", ch: ["I can", "at least listen"], scene: "会話", to: "友人", imp: "must" },
  { ja: "それはつらかったですね。", en: "That must have been hard.", ch: ["That must have", "been hard"], scene: "会話", to: "友人", imp: "must" },
  { ja: "よく頑張ったと思います。", en: "I think you did really well.", ch: ["I think you did", "really well"], scene: "会話", to: "友人", imp: "must" },
  { ja: "あなたのせいではありません。", en: "It's not your fault.", ch: ["It's not", "your fault"], scene: "会話", to: "友人", imp: "must" },
  { ja: "そこまで背負わなくていいです。", en: "You don't have to carry all of that.", ch: ["You don't have to carry", "all of that"], scene: "会話", to: "友人", imp: "must" },
  { ja: "誰にでもあることです。", en: "It happens to everyone.", ch: ["It happens", "to everyone"], scene: "会話", to: "友人", imp: "must" },
  { ja: "私も同じ経験があります。", en: "I've been through the same thing.", ch: ["I've been through", "the same thing"], scene: "会話", to: "友人", imp: "must" },
  { ja: "あのときは本当につらかったです。", en: "It was really rough at the time.", ch: ["It was really rough", "at the time"], scene: "会話", to: "友人", imp: "must" },
  { ja: "立ち直るのに時間がかかりました。", en: "It took me a while to get over it.", ch: ["It took me a while", "to get over it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "でも、必ず楽になります。", en: "But it does get easier.", ch: ["But it does", "get easier"], scene: "会話", to: "友人", imp: "must" },
  { ja: "今は無理しなくていいです。", en: "You don't have to push yourself right now.", ch: ["You don't have to push yourself", "right now"], scene: "会話", to: "友人", imp: "must" },
  { ja: "今日はしっかり寝てください。", en: "Get some real sleep tonight.", ch: ["Get some real sleep", "tonight"], scene: "会話", to: "友人", imp: "must" },
  { ja: "続かなくても気にしないでください。", en: "Don't worry if it doesn't stick.", ch: ["Don't worry", "if it doesn't stick"], scene: "会話", to: "友人", imp: "must" },
  { ja: "一回うまくいかなかっただけです。", en: "It's just one setback.", ch: ["It's just", "one setback"], scene: "会話", to: "友人", imp: "must" },
  { ja: "明日からまた始めれば大丈夫です。", en: "You can start again tomorrow.", ch: ["You can start again", "tomorrow"], scene: "会話", to: "友人", imp: "must" },
  { ja: "今日は一つできれば十分です。", en: "One thing today is plenty.", ch: ["One thing today", "is plenty"], scene: "会話", to: "友人", imp: "must" },
  { ja: "完璧でなくていいんです。", en: "It doesn't have to be perfect.", ch: ["It doesn't have to", "be perfect"], scene: "会話", to: "友人", imp: "must" },
  { ja: "前より確実に進んでいます。", en: "You're definitely further along than before.", ch: ["You're definitely further along", "than before"], scene: "会話", to: "友人", imp: "must" },
  { ja: "自分では気づきにくいだけです。", en: "It's just hard to see in yourself.", ch: ["It's just hard", "to see in yourself"], scene: "会話", to: "友人", imp: "often" },
  { ja: "周りはちゃんと見ています。", en: "People around you do notice.", ch: ["People around you", "do notice"], scene: "会話", to: "友人", imp: "often" },
  { ja: "力になれることがあれば言ってください。", en: "Tell me if there's any way I can help.", ch: ["Tell me if there's any way", "I can help"], scene: "会話", to: "友人", imp: "must" },
  { ja: "いつでも連絡してください。", en: "Reach out anytime.", ch: ["Reach out", "anytime"], scene: "会話", to: "友人", imp: "must" },
  { ja: "一人で抱えないでください。", en: "Don't carry it alone.", ch: ["Don't carry it", "alone"], scene: "会話", to: "友人", imp: "must" },
  { ja: "気晴らしに出かけませんか。", en: "Want to go out and take your mind off it?", ch: ["Want to go out", "and take your mind off it?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "おいしいものでも食べましょう。", en: "Let's go get something good to eat.", ch: ["Let's go get", "something good to eat"], scene: "会話", to: "友人", imp: "must" },
  { ja: "話すだけでも軽くなります。", en: "Just talking about it helps.", ch: ["Just talking about it", "helps"], scene: "会話", to: "友人", imp: "must" },
  { ja: "泣いてもいいんですよ。", en: "It's okay to cry.", ch: ["It's okay", "to cry"], scene: "会話", to: "友人", imp: "must" },
  { ja: "我慢しなくていいです。", en: "You don't have to hold it in.", ch: ["You don't have to", "hold it in"], scene: "会話", to: "友人", imp: "must" },
  { ja: "その人だけが全てではありません。", en: "That person isn't everything.", ch: ["That person", "isn't everything"], scene: "会話", to: "友人", imp: "often" },
  { ja: "あなたを大事に思う人は他にもいます。", en: "There are other people who care about you.", ch: ["There are other people", "who care about you"], scene: "会話", to: "友人", imp: "must" },
  { ja: "今はそう思えなくて当然です。", en: "It's natural not to feel that way right now.", ch: ["It's natural not to feel that way", "right now"], scene: "会話", to: "友人", imp: "often" },
  { ja: "焦らなくていいです。", en: "There's no rush.", ch: ["There's", "no rush"], scene: "会話", to: "友人", imp: "must" },
  { ja: "いつか笑って話せる日が来ます。", en: "Someday you'll be able to laugh about it.", ch: ["Someday you'll be able", "to laugh about it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "私はずっとここにいます。", en: "I'm not going anywhere.", ch: ["I'm not", "going anywhere"], scene: "会話", to: "友人", imp: "must" },
  { ja: "少し顔色がよくなりましたね。", en: "You look a little better.", ch: ["You look", "a little better"], scene: "会話", to: "友人", imp: "must" },
  { ja: "話してくれてありがとう。", en: "I appreciate you telling me.", ch: ["I appreciate you", "telling me"], scene: "会話", to: "友人", imp: "must" },
  { ja: "また明日、様子を聞かせてください。", en: "Let me know how you're doing tomorrow.", ch: ["Let me know how you're doing", "tomorrow"], scene: "会話", to: "友人", imp: "must" },
];
