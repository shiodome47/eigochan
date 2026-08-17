import type { JaSentenceInput } from "./types";

// 分野 94: 食べ物の好き嫌いを話す
//
// 分野 03 (食事を決める) が「何を食べるか」なのに対して、
// ここは **好き嫌い・苦手・慣れ** を説明する分野。
// 納豆のように「説明しにくい食べ物」を人に話す場面を想定している。
export const D94_SELF: JaSentenceInput[] = [];

export const D94_ADD: JaSentenceInput[] = [
  { ja: "納豆は食べられますか。", en: "Can you eat natto?", ch: ["Can you eat", "natto?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "実は苦手です。", en: "Honestly, it's not for me.", ch: ["Honestly,", "it's not for me"], scene: "会話", to: "相手", imp: "must" },
  { ja: "においが少しきついです。", en: "The smell is a bit strong.", ch: ["The smell", "is a bit strong"], scene: "会話", to: "相手", imp: "must" },
  { ja: "慣れると平気になります。", en: "You get used to it.", ch: ["You get", "used to it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "子どもの頃から食べています。", en: "I've eaten it since I was a kid.", ch: ["I've eaten it", "since I was a kid"], scene: "会話", to: "相手", imp: "must" },
  { ja: "週に何回か食べます。", en: "I have it a few times a week.", ch: ["I have it", "a few times a week"], scene: "会話", to: "相手", imp: "must" },
  { ja: "朝はご飯とパン、どちら派ですか。", en: "Are you a rice person or a bread person in the morning?", ch: ["Are you a rice person or a bread person", "in the morning?"], scene: "会話", to: "相手", imp: "often" },
  { ja: "朝はあまり食べません。", en: "I don't eat much in the morning.", ch: ["I don't eat much", "in the morning"], scene: "会話", to: "相手", imp: "must" },
  { ja: "コーヒーだけで済ませることが多いです。", en: "I usually just have coffee.", ch: ["I usually", "just have coffee"], scene: "会話", to: "相手", imp: "must" },
  { ja: "しっかり食べた方が調子がいいです。", en: "I feel better when I eat properly.", ch: ["I feel better", "when I eat properly"], scene: "会話", to: "相手", imp: "must" },
  { ja: "味は好きなのですが、食感が苦手です。", en: "I like the taste, but not the texture.", ch: ["I like the taste,", "but not the texture"], scene: "会話", to: "相手", imp: "must" },
  { ja: "見た目で敬遠していました。", en: "I avoided it because of how it looks.", ch: ["I avoided it", "because of how it looks"], scene: "会話", to: "相手", imp: "often" },
  { ja: "一度食べたら好きになりました。", en: "I liked it once I actually tried it.", ch: ["I liked it", "once I actually tried it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "食べず嫌いでした。", en: "I disliked it without ever trying it.", ch: ["I disliked it", "without ever trying it"], scene: "会話", to: "相手", imp: "often" },
  { ja: "辛いものは大丈夫ですか。", en: "Are you okay with spicy food?", ch: ["Are you okay with", "spicy food?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "辛いのは得意です。", en: "I'm good with spicy food.", ch: ["I'm good with", "spicy food"], scene: "会話", to: "相手", imp: "must" },
  { ja: "辛さは控えめでお願いします。", en: "Mild, please.", ch: ["Mild,", "please"], scene: "外出", to: "店員", imp: "must" },
  { ja: "パクチーだけは無理です。", en: "Cilantro is the one thing I can't do.", ch: ["Cilantro is the one thing", "I can't do"], scene: "会話", to: "相手", imp: "often" },
  { ja: "好き嫌いは特にありません。", en: "I'm not picky.", ch: ["I'm", "not picky"], scene: "会話", to: "相手", imp: "must" },
  { ja: "出されたものは何でも食べます。", en: "I'll eat whatever's put in front of me.", ch: ["I'll eat whatever's", "put in front of me"], scene: "会話", to: "相手", imp: "often" },
  { ja: "生ものは少し苦手です。", en: "I'm not great with raw food.", ch: ["I'm not great", "with raw food"], scene: "会話", to: "相手", imp: "must" },
  { ja: "アレルギーはありますか。", en: "Do you have any allergies?", ch: ["Do you have", "any allergies?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "卵が少しだめです。", en: "I have a mild problem with eggs.", ch: ["I have a mild problem", "with eggs"], scene: "会話", to: "相手", imp: "must" },
  { ja: "少しなら大丈夫です。", en: "A little is fine.", ch: ["A little", "is fine"], scene: "会話", to: "相手", imp: "must" },
  { ja: "甘いものには目がありません。", en: "I have a serious sweet tooth.", ch: ["I have", "a serious sweet tooth"], scene: "会話", to: "相手", imp: "often" },
  { ja: "甘すぎるのは苦手です。", en: "I don't like things that are too sweet.", ch: ["I don't like things", "that are too sweet"], scene: "会話", to: "相手", imp: "must" },
  { ja: "これ、好きだと思いますよ。", en: "I think you'll like this.", ch: ["I think", "you'll like this"], scene: "会話", to: "相手", imp: "must" },
  { ja: "一口だけ試してみますか。", en: "Do you want to try just a bite?", ch: ["Do you want to try", "just a bite?"], scene: "会話", to: "相手", imp: "must" },
  { ja: "思ったよりおいしいです。", en: "It's better than I expected.", ch: ["It's better", "than I expected"], scene: "会話", to: "相手", imp: "must" },
  { ja: "好みが分かれる味ですね。", en: "It's the kind of taste people are divided on.", ch: ["It's the kind of taste", "people are divided on"], scene: "会話", to: "相手", imp: "often" },
  { ja: "うちでは定番です。", en: "It's a staple at our house.", ch: ["It's a staple", "at our house"], scene: "会話", to: "相手", imp: "often" },
  { ja: "母がよく作ってくれました。", en: "My mom used to make it a lot.", ch: ["My mom used to make it", "a lot"], scene: "会話", to: "相手", imp: "must" },
  { ja: "味付けは家によって違います。", en: "The seasoning is different in every home.", ch: ["The seasoning is different", "in every home"], scene: "会話", to: "相手", imp: "often" },
  { ja: "地元ではよく食べられています。", en: "People eat it a lot where I'm from.", ch: ["People eat it a lot", "where I'm from"], scene: "会話", to: "相手", imp: "often" },
  { ja: "外国の方には驚かれます。", en: "People from other countries are surprised by it.", ch: ["People from other countries", "are surprised by it"], scene: "会話", to: "相手", imp: "often" },
  { ja: "説明するのが難しい味です。", en: "It's a hard taste to describe.", ch: ["It's a hard taste", "to describe"], scene: "会話", to: "相手", imp: "must" },
  { ja: "食べてもらった方が早いです。", en: "It's faster to just have you try it.", ch: ["It's faster", "to just have you try it"], scene: "会話", to: "相手", imp: "often" },
  { ja: "苦手なら無理しないでください。", en: "Don't force yourself if you don't like it.", ch: ["Don't force yourself", "if you don't like it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "残しても大丈夫です。", en: "It's fine to leave it.", ch: ["It's fine", "to leave it"], scene: "会話", to: "相手", imp: "must" },
  { ja: "口に合ってよかったです。", en: "I'm glad it suits your taste.", ch: ["I'm glad", "it suits your taste"], scene: "会話", to: "相手", imp: "must" },
];
