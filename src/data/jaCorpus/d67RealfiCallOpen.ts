import type { JaSentenceInput } from "./types";

// 分野 67: RealFi コールに入る・近況を話す
//
// SELF は文字起こしから起こす本人の文を入れる場所。まだ空。
// **ID がずれるので、あとから SELF を足すときは _LATE (末尾) に足すこと。**
export const D67_SELF: JaSentenceInput[] = [];

export const D67_ADD: JaSentenceInput[] = [
  { ja: "今日のコール、参加できます。", en: "I can make today's call.", ch: ["I can make", "today's call"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "少し遅れて入るかもしれません。", en: "I might join a few minutes late.", ch: ["I might join", "a few minutes late"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "私の声は聞こえていますか。", en: "Am I coming through clearly?", ch: ["Am I coming through", "clearly?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "音が途切れていたら教えてください。", en: "Let me know if my audio cuts out.", ch: ["Let me know if", "my audio cuts out"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "日本は今、夜の十一時です。", en: "It's eleven at night here in Japan.", ch: ["It's eleven at night", "here in Japan"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "時差が大きいので、こちらはこの時間になります。", en: "The time difference is big, so this is what works on my side.", ch: ["The time difference is big,", "so this is what works"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "久しぶりですね。元気にしていましたか。", en: "It's been a while. How have you been?", ch: ["It's been a while.", "How have you been?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "先週は参加できずすみませんでした。", en: "Sorry I couldn't make it last week.", ch: ["Sorry I couldn't", "make it last week"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "議事録は後から読んでおきました。", en: "I read through the notes afterwards.", ch: ["I read through", "the notes afterwards"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "今日はどこから始めますか。", en: "Where should we start today?", ch: ["Where should we", "start today?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "私の方から先に話しましょうか。", en: "Would you like me to go first?", ch: ["Would you like me", "to go first?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "短めに話します。", en: "I'll keep it short.", ch: ["I'll keep", "it short"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "今日は聞くだけになるかもしれません。", en: "I might just listen today.", ch: ["I might just", "listen today"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "途中で抜けるかもしれません。", en: "I may have to drop off partway through.", ch: ["I may have to drop off", "partway through"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "画面を共有してもいいですか。", en: "Can I share my screen?", ch: ["Can I share", "my screen?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "今、私の画面は見えていますか。", en: "Can you see my screen now?", ch: ["Can you see", "my screen now?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "チャットにリンクを貼っておきます。", en: "I'll drop the link in the chat.", ch: ["I'll drop the link", "in the chat"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "今週はこちらで大きな動きはありませんでした。", en: "Nothing major happened on my side this week.", ch: ["Nothing major happened", "on my side this week"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "前回の続きから話したいです。", en: "I'd like to pick up where we left off.", ch: ["pick up", "where we left off"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "今日は参加できてよかったです。", en: "I'm glad I could join today.", ch: ["I'm glad", "I could join today"], scene: "コール", to: "参加者", imp: "often" },
];
