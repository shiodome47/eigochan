import type { JaSentenceInput } from "./types";

// 分野 82: 気持ちと好みを言う型
//
// I feel / I prefer / I'm okay with / I wish など、感じ方と好みを外に出す型。
export const D82_SELF: JaSentenceInput[] = [];

export const D82_ADD: JaSentenceInput[] = [
  { ja: "さっきより良くなってきました。", en: "I feel better than I did earlier.", ch: ["I feel better", "than I did earlier"], scene: "会話", to: "家族", imp: "must", pat: "I feel [adj]" },
  { ja: "少しふらふらします。", en: "I feel a little dizzy.", ch: ["I feel", "a little dizzy"], scene: "病院", to: "医師", imp: "must", pat: "I feel [adj]" },
  { ja: "何か変な感じがします。", en: "I feel like something's off.", ch: ["I feel like", "something's off"], scene: "会話", to: "相手", imp: "must", pat: "I feel [adj]" },
  { ja: "ここは居心地がいいです。", en: "I feel comfortable here.", ch: ["I feel comfortable", "here"], scene: "カフェ", to: "家族", imp: "often", pat: "I feel [adj]" },
  { ja: "その人は気の毒だと思います。", en: "I feel sorry for them.", ch: ["I feel sorry", "for them"], scene: "会話", to: "相手", imp: "must", pat: "I feel sorry for ~" },
  { ja: "待たされている人たちが気の毒です。", en: "I feel sorry for the people waiting.", ch: ["I feel sorry for", "the people waiting"], scene: "外出", to: "家族", imp: "often", pat: "I feel sorry for ~" },
  { ja: "現場の人が気の毒です。", en: "I feel sorry for the staff.", ch: ["I feel sorry for", "the staff"], scene: "仕事", to: "相手", imp: "often", pat: "I feel sorry for ~" },
  { ja: "その時間で大丈夫です。", en: "I'm okay with that time.", ch: ["I'm okay with", "that time"], scene: "仕事", to: "相手", imp: "must", pat: "I'm okay with ~" },
  { ja: "その進め方で大丈夫です。", en: "I'm okay with that plan.", ch: ["I'm okay with", "that plan"], scene: "仕事", to: "相手", imp: "must", pat: "I'm okay with ~" },
  { ja: "席はどこでも大丈夫です。", en: "I'm okay with any seat.", ch: ["I'm okay with", "any seat"], scene: "レストラン", to: "店員", imp: "must", pat: "I'm okay with ~" },
  { ja: "現金で大丈夫です。", en: "I'm okay with cash.", ch: ["I'm okay with", "cash"], scene: "買い物", to: "店員", imp: "must", pat: "I'm okay with ~" },
  { ja: "どちらかというと電車の方が好きです。", en: "I prefer taking the train.", ch: ["I prefer", "taking the train"], scene: "外出", to: "友人", imp: "must", pat: "I prefer ~" },
  { ja: "どちらかというと静かな席の方が好きです。", en: "I prefer a quieter table.", ch: ["I prefer", "a quieter table"], scene: "レストラン", to: "店員", imp: "must", pat: "I prefer ~" },
  { ja: "どちらかというと地元の料理の方が好きです。", en: "I prefer local food.", ch: ["I prefer", "local food"], scene: "レストラン", to: "友人", imp: "often", pat: "I prefer ~" },
  { ja: "どちらかというと朝に片づける方が好きです。", en: "I prefer getting it done in the morning.", ch: ["I prefer getting it done", "in the morning"], scene: "仕事", to: "相手", imp: "often", pat: "I prefer ~" },
  { ja: "もっと辛抱強かったらいいのに。", en: "I wish I were more patient.", ch: ["I wish I were", "more patient"], scene: "会話", to: "相手", imp: "must", pat: "I wish I were ~" },
  { ja: "もっと英語が話せたらいいのに。", en: "I wish I could speak better English.", ch: ["I wish I could", "speak better English"], scene: "会話", to: "相手", imp: "must", pat: "I wish I were ~" },
  { ja: "もう少し時間があったらいいのに。", en: "I wish I had a bit more time.", ch: ["I wish I had", "a bit more time"], scene: "仕事", to: "相手", imp: "must", pat: "I wish I were ~" },
  { ja: "早く座りたくてたまりません。", en: "I'm dying to sit down.", ch: ["I'm dying to", "sit down"], scene: "外出", to: "家族", imp: "often", pat: "I'm dying to ~" },
  { ja: "結果が知りたくてたまりません。", en: "I'm dying to know how it went.", ch: ["I'm dying to know", "how it went"], scene: "会話", to: "友人", imp: "often", pat: "I'm dying to ~" },
  { ja: "早く家に帰りたくてたまりません。", en: "I'm dying to get home.", ch: ["I'm dying to", "get home"], scene: "外出", to: "家族", imp: "often", pat: "I'm dying to ~" },
  { ja: "次にお会いするのを楽しみにしています。", en: "I look forward to seeing you again.", ch: ["I look forward to", "seeing you again"], scene: "仕事", to: "相手", imp: "must", pat: "I look forward to ~" },
  { ja: "結果を楽しみにしています。", en: "I look forward to the results.", ch: ["I look forward to", "the results"], scene: "仕事", to: "相手", imp: "must", pat: "I look forward to ~" },
  { ja: "週末を楽しみにしています。", en: "I look forward to the weekend.", ch: ["I look forward to", "the weekend"], scene: "会話", to: "同僚", imp: "often", pat: "I look forward to ~" },
  { ja: "どこで食べるかは気にしません。", en: "I don't care where we eat.", ch: ["I don't care", "where we eat"], scene: "レストラン", to: "家族", imp: "must", pat: "I don't care ~" },
  { ja: "何時に出るかは気にしません。", en: "I don't care what time we leave.", ch: ["I don't care", "what time we leave"], scene: "外出", to: "家族", imp: "must", pat: "I don't care ~" },
  { ja: "どちらを選んでも気にしません。", en: "I don't care which one you pick.", ch: ["I don't care", "which one you pick"], scene: "買い物", to: "家族", imp: "often", pat: "I don't care ~" },
  { ja: "誤解があったこと、すみませんでした。", en: "I'm sorry for the misunderstanding.", ch: ["I'm sorry for", "the misunderstanding"], scene: "仕事", to: "相手", imp: "must", pat: "I'm sorry for ~" },
  { ja: "ご迷惑をおかけしてすみません。", en: "I'm sorry for the trouble.", ch: ["I'm sorry for", "the trouble"], scene: "仕事", to: "相手", imp: "must", pat: "I'm sorry for ~" },
  { ja: "お待たせしてすみません。", en: "I'm sorry for the wait.", ch: ["I'm sorry for", "the wait"], scene: "仕事", to: "相手", imp: "must", pat: "I'm sorry for ~" },
  { ja: "ただ聞いてみたかっただけです。", en: "I just wanted to ask.", ch: ["I just wanted", "to ask"], scene: "会話", to: "相手", imp: "must", pat: "I just want to ~" },
  { ja: "ただ確認したいだけです。", en: "I just want to make sure.", ch: ["I just want to", "make sure"], scene: "仕事", to: "相手", imp: "must", pat: "I just want to ~" },
  { ja: "ただ手伝いたいだけです。", en: "I just want to help.", ch: ["I just want to", "help"], scene: "会話", to: "相手", imp: "must", pat: "I just want to ~" },
  { ja: "少しだけ一人になりたいです。", en: "I just want some time alone.", ch: ["I just want", "some time alone"], scene: "家", to: "家族", imp: "often", pat: "I just want to ~" },
  { ja: "どうしても名前が覚えられません。", en: "I can never remember names.", ch: ["I can never", "remember names"], scene: "会話", to: "相手", imp: "must", pat: "I can never ~" },
  { ja: "どうしても鍵が見つかりません。", en: "I can never find my keys.", ch: ["I can never", "find my keys"], scene: "家", to: "家族", imp: "often", pat: "I can never ~" },
  { ja: "一人では終わりそうにありません。", en: "I can never finish this on my own.", ch: ["I can never finish this", "on my own"], scene: "仕事", to: "相手", imp: "often", pat: "I can never ~" },
  { ja: "長くはいられません。", en: "I can't stay long.", ch: ["I can't", "stay long"], scene: "会話", to: "友人", imp: "must", pat: "I can't ~" },
  { ja: "声がよく聞こえません。", en: "I can't hear you very well.", ch: ["I can't hear you", "very well"], scene: "コール", to: "参加者", imp: "must", pat: "I can't ~" },
  { ja: "そこは思い出せません。", en: "I can't remember that part.", ch: ["I can't remember", "that part"], scene: "会話", to: "相手", imp: "must", pat: "I can't ~" },
];
