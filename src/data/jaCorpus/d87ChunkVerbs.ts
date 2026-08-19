import type { JaSentenceInput } from "./types";

// 分野 87: 動詞チャンク (日常の動き)
//
// 「どうする」を表す動詞のかたまり。既存コーパスに **無かったもの** だけを入れている
// (get up / take a shower などは分野 01 などに既にあるので重複させない)。
// pat には動詞チャンクそのものを入れて、型として横断で拾えるようにしている。
export const D87_SELF: JaSentenceInput[] = [];

export const D87_ADD: JaSentenceInput[] = [
  { ja: "着替えたらすぐ出ます。", en: "I'll head out as soon as I get dressed.", ch: ["as soon as", "I get dressed"], scene: "家", to: "家族", imp: "must", pat: "get dressed" },
  { ja: "着替えるのに時間がかかりました。", en: "It took me a while to get dressed.", ch: ["It took me a while", "to get dressed"], scene: "家", to: "家族", imp: "often", pat: "get dressed" },
  { ja: "朝ごはんは食べましたか。", en: "Did you have breakfast?", ch: ["Did you", "have breakfast?"], scene: "家", to: "家族", imp: "must", pat: "have breakfast" },
  { ja: "今日は朝ごはんを抜きました。", en: "I skipped breakfast today.", ch: ["I skipped", "breakfast today"], scene: "家", to: "家族", imp: "often", pat: "have breakfast" },
  { ja: "何時に家を出ますか。", en: "What time are you leaving home?", ch: ["What time are you", "leaving home?"], scene: "家", to: "家族", imp: "must", pat: "leave home" },
  { ja: "いつもより早く家を出ました。", en: "I left home earlier than usual.", ch: ["I left home", "earlier than usual"], scene: "外出", to: "家族", imp: "must", pat: "leave home" },
  { ja: "家族と過ごす時間を大事にしたいです。", en: "I want to spend more time with my family.", ch: ["spend more time", "with my family"], scene: "会話", to: "相手", imp: "must", pat: "spend time with ~" },
  { ja: "週末は子どもと過ごします。", en: "I spend the weekend with my kids.", ch: ["I spend the weekend", "with my kids"], scene: "会話", to: "相手", imp: "often", pat: "spend time with ~" },
  { ja: "今日はしっかり楽しんでください。", en: "Have fun today.", scene: "家", to: "家族", imp: "must", pat: "have fun" },
  { ja: "思っていたより楽しめました。", en: "I had more fun than I expected.", ch: ["I had more fun", "than I expected"], scene: "会話", to: "友人", imp: "often", pat: "have fun" },
  { ja: "今度、友達と会う予定です。", en: "I'm going to hang out with a friend.", ch: ["hang out with", "a friend"], scene: "会話", to: "家族", imp: "must", pat: "hang out with ~" },
  { ja: "たまには一緒に出かけませんか。", en: "Want to hang out sometime?", ch: ["Want to hang out", "sometime?"], scene: "会話", to: "友人", imp: "often", pat: "hang out with ~" },
  { ja: "その説明で腑に落ちました。", en: "That makes sense now.", ch: ["That makes sense", "now"], scene: "仕事", to: "相手", imp: "must", pat: "make sense" },
  { ja: "そこだけ、どうも腑に落ちません。", en: "That part doesn't make sense to me.", ch: ["That part doesn't", "make sense to me"], scene: "仕事", to: "相手", imp: "must", pat: "make sense" },
  { ja: "自分で何とか解決しました。", en: "I figured it out on my own.", ch: ["I figured it out", "on my own"], scene: "仕事", to: "相手", imp: "must", pat: "figure it out" },
  { ja: "やり方はこれから調べます。", en: "I'll figure it out as I go.", ch: ["I'll figure it out", "as I go"], scene: "仕事", to: "相手", imp: "must", pat: "figure it out" },
  { ja: "時間が足りなくなりそうです。", en: "We're going to run out of time.", ch: ["run out of", "time"], scene: "仕事", to: "相手", imp: "must", pat: "run out of ~" },
  { ja: "お湯が出なくなりました。", en: "We ran out of hot water.", ch: ["We ran out of", "hot water"], scene: "家", to: "家族", imp: "often", pat: "run out of ~" },
  { ja: "留守のあいだ、猫を見てもらえますか。", en: "Could you look after the cat while I'm away?", ch: ["Could you look after the cat", "while I'm away?"], scene: "家", to: "家族", imp: "must", pat: "look after ~" },
  { ja: "そこは私が見ておきます。", en: "I'll look after that part.", ch: ["I'll look after", "that part"], scene: "仕事", to: "相手", imp: "must", pat: "look after ~" },
  { ja: "ちょっと待ってください。", en: "Hold on a second.", ch: ["Hold on", "a second"], scene: "会話", to: "相手", imp: "must", pat: "hold on" },
  { ja: "そのまま切らずにお待ちください。", en: "Hold on, please don't hang up.", ch: ["Hold on,", "please don't hang up"], scene: "電話", to: "相手", imp: "must", pat: "hold on" },
  { ja: "明かりをつけてもらえますか。", en: "Could you turn on the light?", ch: ["Could you turn on", "the light?"], scene: "家", to: "家族", imp: "must", pat: "turn on" },
  { ja: "音を出してもいいですか。", en: "Can I turn on the sound?", ch: ["Can I turn on", "the sound?"], scene: "家", to: "家族", imp: "often", pat: "turn on" },
  { ja: "今度うちに来ませんか。", en: "Do you want to come over sometime?", ch: ["Do you want to", "come over sometime?"], scene: "会話", to: "友人", imp: "must", pat: "come over" },
  { ja: "近くまで来たら寄ってください。", en: "Come over if you're in the area.", ch: ["Come over if", "you're in the area"], scene: "会話", to: "友人", imp: "often", pat: "come over" },
  { ja: "あれは何とか乗り越えました。", en: "I got over it eventually.", ch: ["I got over it", "eventually"], scene: "会話", to: "相手", imp: "must", pat: "get over ~" },
  { ja: "風邪はもう治りましたか。", en: "Have you gotten over your cold?", ch: ["Have you gotten over", "your cold?"], scene: "会話", to: "相手", imp: "must", pat: "get over ~" },
  { ja: "そのうち慣れると思います。", en: "You'll get used to it.", ch: ["You'll get used to", "it"], scene: "会話", to: "相手", imp: "must", pat: "get used to ~" },
  { ja: "この時間にはまだ慣れません。", en: "I haven't gotten used to this hour yet.", ch: ["I haven't gotten used to", "this hour yet"], scene: "コール", to: "参加者", imp: "must", pat: "get used to ~" },
  { ja: "言いたいことは分かりました。", en: "I get the point.", scene: "仕事", to: "相手", imp: "must", pat: "get the point" },
  { ja: "要点だけ先に教えてください。", en: "Could you get to the point first?", ch: ["get to the point", "first"], scene: "仕事", to: "相手", imp: "often", pat: "get the point" },
  { ja: "メモを取っておきます。", en: "I'll take notes.", scene: "コール", to: "参加者", imp: "must", pat: "take notes" },
  { ja: "交代でやりましょう。", en: "Let's take turns.", scene: "家", to: "家族", imp: "must", pat: "take turns" },
  { ja: "それはどこで行われますか。", en: "Where will it take place?", ch: ["Where will it", "take place?"], scene: "仕事", to: "相手", imp: "must", pat: "take place" },
  { ja: "その会議は毎週行われています。", en: "The meeting takes place every week.", ch: ["The meeting takes place", "every week"], scene: "コール", to: "参加者", imp: "often", pat: "take place" },
  { ja: "この機会をうまく使いたいです。", en: "I want to take advantage of this chance.", ch: ["take advantage of", "this chance"], scene: "仕事", to: "相手", imp: "must", pat: "take advantage of ~" },
  { ja: "無理せず、ゆっくりいきましょう。", en: "Let's take it easy.", scene: "会話", to: "相手", imp: "must", pat: "take it easy" },
  { ja: "そろそろ決めないといけません。", en: "We need to make a decision soon.", ch: ["make a decision", "soon"], scene: "仕事", to: "相手", imp: "must", pat: "make a decision" },
  { ja: "小さくても違いは出ると思います。", en: "Even a small step makes a difference.", ch: ["Even a small step", "makes a difference"], scene: "会話", to: "相手", imp: "must", pat: "make a difference" },
];
