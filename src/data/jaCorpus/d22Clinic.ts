import type { JaSentenceInput } from "./types";

// 分野 22: 病院・薬局
export const D22_SELF: JaSentenceInput[] = [
  { ja: "今日はいつから具合が悪いんですか。", en: "How long have you been feeling unwell?", ch: ["How long have you been", "feeling unwell?"], scene: "病院", to: "家族", imp: "must" },
  { ja: "昨日から少し体調が悪いです。", en: "I've been feeling a little unwell since yesterday.", ch: ["I've been feeling", "a little unwell"], scene: "病院", to: "医師", imp: "must" },
  { ja: "熱はそれほど高くありません。", en: "My fever isn't that high.", ch: ["My fever", "isn't that high"], scene: "病院", to: "医師", imp: "must" },
  { ja: "でも、体がかなりだるいです。", en: "But my body feels really heavy.", ch: ["my body feels", "really heavy"], scene: "病院", to: "医師", imp: "must" },
  { ja: "食欲があまりありません。", en: "I don't have much of an appetite.", ch: ["I don't have much of", "an appetite"], scene: "病院", to: "医師", imp: "must" },
  { ja: "頭が少し重い感じがします。", en: "My head feels a little heavy.", ch: ["My head feels", "a little heavy"], scene: "病院", to: "医師", imp: "must" },
  { ja: "この症状は前にもありました。", en: "I've had these symptoms before.", ch: ["I've had these symptoms", "before"], scene: "病院", to: "医師", imp: "must" },
  { ja: "薬を飲むと少し楽になります。", en: "It gets a little better when I take medicine.", ch: ["It gets a little better", "when I take medicine"], scene: "病院", to: "医師", imp: "must" },
  { ja: "いつも飲んでいる薬があります。", en: "There's medicine I take regularly.", ch: ["There's medicine", "I take regularly"], scene: "病院", to: "医師", imp: "must" },
  { ja: "この薬と一緒に飲んでも大丈夫ですか。", en: "Is it okay to take it together with this medicine?", ch: ["Is it okay to take it", "together with ...?"], scene: "薬局", to: "薬剤師", imp: "must" },
  { ja: "何か気をつけることはありますか。", en: "Is there anything I should watch out for?", ch: ["Is there anything", "I should watch out for?"], scene: "薬局", to: "薬剤師", imp: "must" },
  { ja: "どのくらいで良くなると思いますか。", en: "How long do you think it will take to get better?", ch: ["How long do you think", "it will take?"], scene: "病院", to: "医師", imp: "must" },
  { ja: "明日も良くならなければ、また来た方がいいですか。", en: "If I'm not better tomorrow, should I come back?", ch: ["If I'm not better tomorrow,", "should I come back?"], scene: "病院", to: "医師", imp: "must" },
  { ja: "予約していないんですが、診てもらえますか。", en: "I don't have an appointment. Could I still be seen?", ch: ["I don't have an appointment.", "Could I still be seen?"], scene: "病院", to: "受付", imp: "must" },
  { ja: "どのくらい待ちそうですか。", en: "About how long is the wait?", ch: ["About how long", "is the wait?"], scene: "病院", to: "受付", imp: "must" },
  { ja: "保険証はこちらでいいですか。", en: "Is this the right insurance card?", ch: ["Is this the right", "insurance card?"], scene: "病院", to: "受付", imp: "must" },
  { ja: "処方箋はどこに持っていけばいいですか。", en: "Where should I take this prescription?", ch: ["Where should I take", "this prescription?"], scene: "病院", to: "受付", imp: "must" },
  { ja: "この薬は食後に飲めばいいんですよね。", en: "I take this after meals, right?", ch: ["I take this", "after meals, right?"], scene: "薬局", to: "薬剤師", imp: "must" },
  { ja: "眠くなることはありますか。", en: "Does it make you drowsy?", ch: ["Does it make you", "drowsy?"], scene: "薬局", to: "薬剤師", imp: "must" },
  { ja: "分かりました。しばらく様子を見ます。", en: "I understand. I'll see how it goes for a while.", ch: ["I understand.", "I'll see how it goes"], scene: "病院", to: "医師", imp: "must" },
];
