import type { JaSentenceInput } from "./types";

// 分野 103: 同僚の仕事を手伝う
//
// 分野 33 (頼む・助けを求める) が頼む側なのに対して、
// ここは **手伝いを申し出て、二人で分けて終わらせる** 側の分野。
// 「私も同じです」「入力だけお願いできますか」「一度手を止めましょう」など、
// 締め切り前のやりとりで実際に交わす言い方を集めている。
export const D103_SELF: JaSentenceInput[] = [];

export const D103_ADD: JaSentenceInput[] = [
  { ja: "もうこんな時間ですか。", en: "Is it already this late?", ch: ["Is it already", "this late?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "今日の分が終わっていません。", en: "I haven't finished today's work.", ch: ["I haven't finished", "today's work"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "私も同じ状況です。", en: "I'm in the same boat.", ch: ["I'm in", "the same boat"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "この資料に手間取っています。", en: "This document is eating up my time.", ch: ["This document", "is eating up my time"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "締め切りは明日です。", en: "It's due tomorrow.", ch: ["It's due", "tomorrow"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "まだ半分も終わっていません。", en: "I'm not even halfway through.", ch: ["I'm not even", "halfway through"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "正直、焦っています。", en: "Honestly, I'm getting anxious about it.", ch: ["Honestly, I'm getting", "anxious about it"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "何か引き取りましょうか。", en: "Can I take something off your plate?", ch: ["Can I take something", "off your plate?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "今の作業が終わったら声をかけます。", en: "I'll let you know when I finish what I'm on.", ch: ["I'll let you know", "when I finish what I'm on"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "入力だけお願いできますか。", en: "Could you just handle the data entry?", ch: ["Could you just handle", "the data entry?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "それだけでもかなり助かります。", en: "Even that would help a lot.", ch: ["Even that", "would help a lot"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "すぐ終わらせます。", en: "I'll knock it out quickly.", ch: ["I'll knock it out", "quickly"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "どこまで進んでいますか。", en: "How far along are you?", ch: ["How far along", "are you?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "残りはどのくらいですか。", en: "How much is left?", ch: ["How much", "is left?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "優先順位をつけましょう。", en: "Let's set priorities.", ch: ["Let's set", "priorities"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "今日中に要るのはどれですか。", en: "Which parts are actually needed today?", ch: ["Which parts are actually", "needed today?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "明日でいいものは後に回します。", en: "I'll push back anything that can wait.", ch: ["I'll push back", "anything that can wait"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "分けてやりましょう。", en: "Let's split it up.", ch: ["Let's split", "it up"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "前半は私が見ます。", en: "I'll take the first half.", ch: ["I'll take", "the first half"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "後半をお願いできますか。", en: "Could you take the second half?", ch: ["Could you take", "the second half?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "書き方は合わせておきます。", en: "I'll keep the format consistent.", ch: ["I'll keep the format", "consistent"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "あとで一度突き合わせましょう。", en: "Let's merge them later.", ch: ["Let's merge them", "later"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "少し休んだ方がいいですよ。", en: "You should take a short break.", ch: ["You should take", "a short break"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "一度手を止めましょう。", en: "Let's step away for a minute.", ch: ["Let's step away", "for a minute"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "コーヒーを入れてきます。", en: "I'm going to go make some coffee.", ch: ["I'm going to go", "make some coffee"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "私の分もお願いできますか。", en: "Could you make one for me too?", ch: ["Could you make one", "for me too?"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "少し気分が変わりました。", en: "That cleared my head a bit.", ch: ["That cleared my head", "a bit"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "これなら終わりそうです。", en: "I think I can finish now.", ch: ["I think", "I can finish now"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "あなたのおかげで間に合いました。", en: "I made it thanks to you.", ch: ["I made it", "thanks to you"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "お互いさまです。", en: "We look out for each other.", ch: ["We look out", "for each other"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "一緒にやれば何とかなります。", en: "We'll get through it together.", ch: ["We'll get through it", "together"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "一人だと心が折れます。", en: "It's demoralizing on your own.", ch: ["It's demoralizing", "on your own"], scene: "仕事", to: "同僚", imp: "often" },
  { ja: "誰かがいると違いますね。", en: "It makes a difference having someone here.", ch: ["It makes a difference", "having someone here"], scene: "仕事", to: "同僚", imp: "often" },
  { ja: "無理そうなら早めに言ってください。", en: "Tell me early if it looks impossible.", ch: ["Tell me early", "if it looks impossible"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "抱え込まないでください。", en: "Don't take it all on yourself.", ch: ["Don't take it all", "on yourself"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "期限を延ばせないか聞いてみます。", en: "I'll ask if we can push the deadline.", ch: ["I'll ask if we can", "push the deadline"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "断る勇気も要ります。", en: "Sometimes you have to say no.", ch: ["Sometimes you have to", "say no"], scene: "仕事", to: "同僚", imp: "often" },
  { ja: "今日はここで切り上げましょう。", en: "Let's wrap up here for today.", ch: ["Let's wrap up here", "for today"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "続きは明日にします。", en: "I'll pick it up tomorrow.", ch: ["I'll pick it up", "tomorrow"], scene: "仕事", to: "同僚", imp: "must" },
  { ja: "今日はよく進みました。", en: "We got a lot done today.", ch: ["We got a lot done", "today"], scene: "仕事", to: "同僚", imp: "must" },
];
