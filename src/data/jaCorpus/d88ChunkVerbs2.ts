import type { JaSentenceInput } from "./types";

// 分野 88: 動詞チャンク (仕事とやりとり)
//
// 87 の続き。既存コーパスに無かった動詞のかたまりだけを入れている。
export const D88_SELF: JaSentenceInput[] = [];

export const D88_ADD: JaSentenceInput[] = [
  { ja: "何とかやってみます。", en: "I'll make it work somehow.", ch: ["I'll make it work", "somehow"], scene: "仕事", to: "相手", imp: "must", pat: "make it work" },
  { ja: "この条件でも何とかできると思います。", en: "I think we can make it work with this.", ch: ["we can make it work", "with this"], scene: "仕事", to: "相手", imp: "must", pat: "make it work" },
  { ja: "できるかぎりやってみます。", en: "I'll do my best.", scene: "仕事", to: "相手", imp: "must", pat: "do your best" },
  { ja: "無理はしないで、できる範囲でやってください。", en: "Just do your best, no pressure.", ch: ["Just do your best,", "no pressure"], scene: "仕事", to: "相手", imp: "often", pat: "do your best" },
  { ja: "一つお願いしてもいいですか。", en: "Could you do me a favor?", ch: ["Could you", "do me a favor?"], scene: "仕事", to: "相手", imp: "must", pat: "do me a favor" },
  { ja: "頼みごとをしてもいいですか。", en: "Can I ask you a favor?", ch: ["Can I ask you", "a favor?"], scene: "会話", to: "友人", imp: "must", pat: "do me a favor" },
  { ja: "それは一理あると思います。", en: "You have a point there.", ch: ["You have a point", "there"], scene: "議論", to: "参加者", imp: "must", pat: "have a point" },
  { ja: "そこは確かにその通りです。", en: "That's a fair point.", ch: ["That's", "a fair point"], scene: "議論", to: "参加者", imp: "must", pat: "have a point" },
  { ja: "そこで少し苦労しています。", en: "I'm having trouble with that part.", ch: ["I'm having trouble", "with that part"], scene: "仕事", to: "相手", imp: "must", pat: "have trouble" },
  { ja: "接続がうまくいきません。", en: "I'm having trouble connecting.", ch: ["I'm having trouble", "connecting"], scene: "コール", to: "参加者", imp: "must", pat: "have trouble" },
  { ja: "それについては全く分かりません。", en: "I have no idea about that.", ch: ["I have no idea", "about that"], scene: "会話", to: "相手", imp: "must", pat: "have no idea" },
  { ja: "どうしてそうなったのか分かりません。", en: "I have no idea why that happened.", ch: ["I have no idea", "why that happened"], scene: "仕事", to: "相手", imp: "must", pat: "have no idea" },
  { ja: "楽しい時間を過ごせました。", en: "I had a good time.", ch: ["I had", "a good time"], scene: "会話", to: "友人", imp: "must", pat: "have a good time" },
  { ja: "その件は少し先送りにしましょう。", en: "Let's put that off for now.", ch: ["Let's put that off", "for now"], scene: "仕事", to: "相手", imp: "must", pat: "put off" },
  { ja: "決めるのを先延ばしにしてしまいました。", en: "I put off deciding.", ch: ["I put off", "deciding"], scene: "仕事", to: "相手", imp: "often", pat: "put off" },
  { ja: "この暑さには我慢できません。", en: "I can't put up with this heat.", ch: ["I can't put up with", "this heat"], scene: "家", to: "家族", imp: "must", pat: "put up with" },
  { ja: "しばらくは我慢するしかなさそうです。", en: "We'll have to put up with it for a while.", ch: ["put up with it", "for a while"], scene: "会話", to: "家族", imp: "often", pat: "put up with" },
  { ja: "駅まで迎えに行きます。", en: "I'll pick you up at the station.", ch: ["I'll pick you up", "at the station"], scene: "外出", to: "家族", imp: "must", pat: "pick up" },
  { ja: "帰りに買ってきます。", en: "I'll pick some up on the way back.", ch: ["I'll pick some up", "on the way back"], scene: "買い物", to: "家族", imp: "must", pat: "pick up" },
  { ja: "あとで分かったことがあります。", en: "I found out something afterwards.", ch: ["I found out something", "afterwards"], scene: "会話", to: "相手", imp: "must", pat: "find out" },
  { ja: "調べてみて分かりました。", en: "I found out when I checked.", ch: ["I found out", "when I checked"], scene: "仕事", to: "相手", imp: "must", pat: "find out" },
  { ja: "一つ指摘してもいいですか。", en: "Can I point something out?", ch: ["Can I point", "something out?"], scene: "議論", to: "参加者", imp: "must", pat: "point out" },
  { ja: "指摘してくれてありがとうございます。", en: "Thanks for pointing that out.", ch: ["Thanks for", "pointing that out"], scene: "仕事", to: "相手", imp: "must", pat: "point out" },
  { ja: "そこはよく見ておいてください。", en: "Please pay attention to that part.", ch: ["Please pay attention to", "that part"], scene: "仕事", to: "相手", imp: "must", pat: "pay attention" },
  { ja: "きちんと聞いていませんでした。", en: "I wasn't paying attention.", ch: ["I wasn't", "paying attention"], scene: "会話", to: "相手", imp: "must", pat: "pay attention" },
  { ja: "時間を無駄にしたくありません。", en: "I don't want to waste time.", ch: ["I don't want to", "waste time"], scene: "仕事", to: "相手", imp: "must", pat: "waste time" },
  { ja: "待つだけで時間が過ぎてしまいました。", en: "I wasted a lot of time just waiting.", ch: ["I wasted a lot of time", "just waiting"], scene: "外出", to: "家族", imp: "often", pat: "waste time" },
  { ja: "また連絡を取り合いましょう。", en: "Let's keep in touch.", scene: "会話", to: "友人", imp: "must", pat: "keep in touch" },
  { ja: "あとで連絡します。", en: "I'll get in touch later.", ch: ["I'll get in touch", "later"], scene: "仕事", to: "相手", imp: "must", pat: "get in touch" },
  { ja: "誰に連絡すればいいですか。", en: "Who should I get in touch with?", ch: ["Who should I", "get in touch with?"], scene: "仕事", to: "相手", imp: "must", pat: "get in touch" },
  { ja: "少し休憩しませんか。", en: "Should we take a break?", ch: ["Should we", "take a break?"], scene: "仕事", to: "同僚", imp: "must", pat: "take a break" },
  { ja: "予約を取っておきます。", en: "I'll make a reservation.", scene: "レストラン", to: "家族", imp: "must", pat: "make a reservation" },
  { ja: "そこまではどうやって行けばいいですか。", en: "How do I get there?", ch: ["How do I", "get there?"], scene: "外出", to: "相手", imp: "must", pat: "get there" },
  { ja: "そこには何時に着けそうですか。", en: "What time can you get there?", ch: ["What time can you", "get there?"], scene: "外出", to: "家族", imp: "must", pat: "get there" },
  { ja: "そろそろ準備しましょう。", en: "Let's get ready.", scene: "家", to: "家族", imp: "must", pat: "get ready" },
  { ja: "彼はまだ来ていません。", en: "He hasn't shown up yet.", ch: ["He hasn't shown up", "yet"], scene: "外出", to: "相手", imp: "must", pat: "show up" },
  { ja: "誰も来ませんでした。", en: "Nobody showed up.", scene: "会話", to: "相手", imp: "often", pat: "show up" },
  { ja: "分からない言葉は調べておきます。", en: "I'll look up the words I don't know.", ch: ["I'll look up", "the words I don't know"], scene: "学習", to: "相手", imp: "must", pat: "look it up" },
  { ja: "電気を消してもらえますか。", en: "Could you turn off the light?", ch: ["Could you turn off", "the light?"], scene: "家", to: "家族", imp: "must", pat: "turn off" },
  { ja: "たまたま見つけました。", en: "I came across it by accident.", ch: ["I came across it", "by accident"], scene: "会話", to: "相手", imp: "must", pat: "come across" },
];
