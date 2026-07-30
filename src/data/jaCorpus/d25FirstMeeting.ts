import type { JaSentenceInput } from "./types";

// 分野 25: 初対面の人との会話
export const D25_SELF: JaSentenceInput[] = [
  { ja: "はじめまして。中塚と申します。", en: "Nice to meet you. My name is Nakatsuka.", ch: ["Nice to meet you.", "My name is ..."], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "今日はお会いできてうれしいです。", en: "I'm glad we got to meet today.", ch: ["I'm glad we got to", "meet today"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "こちらにはよく来られるんですか。", en: "Do you come here often?", ch: ["Do you come here", "often?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "私は今回が初めてです。", en: "This is my first time.", ch: ["This is", "my first time"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "どちらから来られたんですか。", en: "Where did you come from?", ch: ["Where did you", "come from?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "ここまでは遠くなかったですか。", en: "Was it a long trip to get here?", ch: ["Was it a long trip", "to get here?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "お仕事は何をされているんですか。", en: "What kind of work do you do?", ch: ["What kind of work", "do you do?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "私はCardanoのステークプールを運営しています。", en: "I run a Cardano stake pool.", ch: ["I run", "a Cardano stake pool"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "説明すると少し長くなるんですが、ブロックチェーンに関係する仕事です。", en: "It takes a while to explain, but it's work related to blockchain.", ch: ["It takes a while to explain,", "but it's related to ..."], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "こういうイベントにはよく参加されるんですか。", en: "Do you go to events like this often?", ch: ["Do you go to events like this", "often?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "私はあまり慣れていないので、少し緊張しています。", en: "I'm not used to this, so I'm a little nervous.", ch: ["I'm not used to this,", "so I'm a little nervous"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "どなたか知っている方はいらっしゃいますか。", en: "Is there anyone here you know?", ch: ["Is there anyone here", "you know?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "もしよければ、あとで少しお話ししませんか。", en: "If you don't mind, could we talk a bit later?", ch: ["If you don't mind,", "could we talk a bit later?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "その話はとても興味があります。", en: "I'm very interested in that.", ch: ["I'm very interested", "in that"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "私も似たようなことを考えていました。", en: "I've been thinking about something similar.", ch: ["I've been thinking about", "something similar"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "まだ十分に理解できていないので、もう少し教えてもらえますか。", en: "I don't fully understand it yet, so could you tell me a bit more?", ch: ["I don't fully understand it yet,", "could you tell me more?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "お話しできてよかったです。", en: "It was good to talk with you.", ch: ["It was good to", "talk with you"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "また機会があれば、ぜひお話ししたいです。", en: "If we get the chance, I'd love to talk again.", ch: ["If we get the chance,", "I'd love to talk again"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "今日はありがとうございました。", en: "Thank you for today.", ch: ["Thank you for", "today"], scene: "イベント", to: "初対面", imp: "must" },
];

export const D25_ADD: JaSentenceInput[] = [
  // 本人の文にあった「思っていたより人が多いですね。」は分野 14 と重複していたため、
  // 初対面側はこの文に差し替え。
  { ja: "お名前をもう一度うかがってもいいですか。", en: "Could I get your name again?", ch: ["Could I get", "your name again?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "お名前は何とお読みするのでしょうか。", en: "How do you pronounce your name?", ch: ["How do you pronounce", "your name?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "名刺をお渡ししてもいいですか。", en: "May I give you my card?", ch: ["May I give you", "my card?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "こちらこそ、よろしくお願いします。", en: "The pleasure is mine.", ch: ["The pleasure", "is mine"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "どのような経緯で参加されたんですか。", en: "What brought you here?", ch: ["What brought you", "here?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "その分野には長く関わっているんですか。", en: "Have you been in that field long?", ch: ["Have you been in", "that field long?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "私はまだ勉強中です。", en: "I'm still learning.", ch: ["I'm still", "learning"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "英語はあまり得意ではありません。", en: "I'm not very good at English.", ch: ["I'm not very good", "at English"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "ゆっくり話していただけると助かります。", en: "It helps if you speak slowly.", ch: ["It helps if you", "speak slowly"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "その話、もう少し聞かせてください。", en: "Please tell me more about that.", ch: ["Please tell me more", "about that"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "それは知りませんでした。", en: "I didn't know that.", ch: ["I didn't", "know that"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "日本ではあまり知られていません。", en: "It isn't very well known in Japan.", ch: ["It isn't very well known", "in Japan"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "日本の状況も少しお話ししましょうか。", en: "Shall I tell you a bit about the situation in Japan?", ch: ["Shall I tell you a bit about", "the situation in Japan?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "同じような課題があると思います。", en: "I think we have similar challenges.", ch: ["I think we have", "similar challenges"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "連絡先を交換してもいいですか。", en: "Could we exchange contact details?", ch: ["Could we exchange", "contact details?"], scene: "イベント", to: "初対面", imp: "must" },
  { ja: "SNSはやっていますか。", en: "Are you on social media?", ch: ["Are you on", "social media?"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "あとでメッセージを送ります。", en: "I'll send you a message later.", ch: ["I'll send you", "a message later"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "長く引き止めてしまいました。", en: "I've kept you a long time.", ch: ["I've kept you", "a long time"], scene: "イベント", to: "初対面", imp: "sub" },
  { ja: "楽しい時間でした。", en: "I really enjoyed it.", ch: ["I really", "enjoyed it"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "またどこかでお会いしましょう。", en: "Let's meet again somewhere.", ch: ["Let's meet again", "somewhere"], scene: "イベント", to: "初対面", imp: "often" },
  { ja: "今日はよろしくお願いします。", en: "I'm looking forward to today.", ch: ["I'm looking forward to", "today"], scene: "イベント", to: "初対面", imp: "must" },
];
