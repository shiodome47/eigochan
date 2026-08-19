import type { JaSentenceInput } from "./types";

// 分野 36: 電話・メッセージ
export const D36_SELF: JaSentenceInput[] = [
  { ja: "今、少し話しても大丈夫ですか。", en: "Is now an okay time to talk for a bit?", ch: ["Is now an okay time", "to talk?"], scene: "電話", to: "相手", imp: "must" },
  { ja: "急ぎではないので、あとでも大丈夫です。", en: "It's not urgent, so later is fine.", ch: ["It's not urgent,", "so later is fine"], scene: "電話", to: "相手", imp: "must" },
  { ja: "手が空いたときに連絡してください。", en: "Get in touch when you're free.", ch: ["Get in touch", "when you're free"], scene: "電話", to: "相手", imp: "must" },
  { ja: "先ほど電話をいただきましたか。", en: "Did you call me a little while ago?", ch: ["Did you call me", "a little while ago?"], scene: "電話", to: "相手", imp: "must" },
  { ja: "出られなくて、すみませんでした。", en: "Sorry I couldn't pick up.", ch: ["Sorry I couldn't", "pick up"], scene: "電話", to: "相手", imp: "must" },
  { ja: "今、折り返しても大丈夫ですか。", en: "Is it okay if I call you back now?", ch: ["Is it okay if I", "call you back now?"], scene: "電話", to: "相手", imp: "must" },
  { ja: "電話だとうまく説明できないので、メッセージで送ります。", en: "It's hard to explain over the phone, so I'll send it in a message.", scene: "電話", to: "相手", imp: "must" },
  { ja: "詳しい内容は、あとでまとめて送ります。", en: "I'll send the details all together later.", ch: ["I'll send the details", "all together later"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "先ほど送った内容を確認してもらえましたか。", en: "Did you get a chance to look at what I sent?", ch: ["Did you get a chance to look at", "what I sent?"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "少し分かりにくかったかもしれません。", en: "It may have been a little hard to follow.", ch: ["It may have been", "hard to follow"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "言いたかったのは、こういうことです。", en: "What I meant was this.", ch: ["What I meant", "was this"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "念のため、もう一度送っておきます。", en: "Just in case, I'll send it again.", ch: ["Just in case,", "I'll send it again"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "写真も一緒に送っておきます。", en: "I'll send a photo along with it.", ch: ["I'll send a photo", "along with it"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "リンクはこちらです。", en: "Here's the link.", scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "返事は急がなくても大丈夫です。", en: "No rush on the reply.", ch: ["No rush", "on the reply"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "分かった時点で教えてください。", en: "Let me know once you find out.", ch: ["Let me know", "once you find out"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "予定が決まったら、また連絡します。", en: "Once the schedule is set, I'll contact you again.", ch: ["Once the schedule is set,", "I'll contact you"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "また何かあれば連絡してください。", en: "Get in touch again if anything comes up.", ch: ["Get in touch again", "if anything comes up"], scene: "電話", to: "相手", imp: "must" },
  { ja: "では、失礼します。", en: "All right, I'll let you go.", ch: ["All right,", "I'll let you go"], scene: "電話", to: "相手", imp: "must" },
];

export const D36_ADD: JaSentenceInput[] = [
  // 本人の文にあった「今日はありがとうございました。」は分野 25 と重複していたため、
  // 電話・メッセージ側はこの文に差し替え。
  { ja: "わざわざ連絡をいただき、ありがとうございます。", en: "Thank you for taking the trouble to get in touch.", ch: ["Thank you for taking the trouble", "to get in touch"], scene: "電話", to: "相手", imp: "must" },
  { ja: "もしもし、山田です。", en: "Hello, this is Yamada.", ch: ["Hello,", "this is Yamada"], scene: "電話", to: "相手", imp: "must" },
  { ja: "声が遠いようです。", en: "You sound far away.", ch: ["You sound", "far away"], scene: "電話", to: "相手", imp: "often" },
  { ja: "電波の良いところに移動します。", en: "I'll move somewhere with better reception.", ch: ["I'll move somewhere", "with better reception"], scene: "電話", to: "相手", imp: "often" },
  { ja: "少し電話を切ってかけ直します。", en: "I'll hang up and call you back.", ch: ["I'll hang up", "and call you back"], scene: "電話", to: "相手", imp: "often" },
  { ja: "今、外にいるので後で連絡します。", en: "I'm out right now, so I'll contact you later.", ch: ["I'm out right now,", "so I'll contact you later"], scene: "電話", to: "相手", imp: "must" },
  { ja: "会議中なので、あとで折り返します。", en: "I'm in a meeting, so I'll call you back.", ch: ["I'm in a meeting,", "so I'll call you back"], scene: "電話", to: "相手", imp: "must" },
  { ja: "留守番電話にメッセージを残しておきます。", en: "I'll leave a message on your voicemail.", ch: ["I'll leave a message", "on your voicemail"], scene: "電話", to: "相手", imp: "sub" },
  { ja: "着信に気づきませんでした。", en: "I didn't notice your call.", ch: ["I didn't notice", "your call"], scene: "電話", to: "相手", imp: "often" },
  { ja: "メッセージを読みました。", en: "I read your message.", ch: ["I read", "your message"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "文字だと伝わりにくいかもしれません。", en: "It may be hard to convey in text.", ch: ["It may be hard to convey", "in text"], scene: "メッセージ", to: "相手", imp: "often" },
  { ja: "一度、電話で話しませんか。", en: "Should we talk on the phone instead?", ch: ["Should we talk", "on the phone instead?"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "画面の写真を送ります。", en: "I'll send a screenshot.", ch: ["I'll send", "a screenshot"], scene: "メッセージ", to: "相手", imp: "often" },
  { ja: "ファイルは開けましたか。", en: "Were you able to open the file?", ch: ["Were you able to", "open the file?"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "見られない場合は教えてください。", en: "Let me know if you can't view it.", ch: ["Let me know if", "you can't view it"], scene: "メッセージ", to: "相手", imp: "often" },
  { ja: "既読になっていないようです。", en: "It doesn't look like it's been read.", ch: ["It doesn't look like", "it's been read"], scene: "メッセージ", to: "相手", imp: "sub" },
  { ja: "急ぎでしたら、電話をください。", en: "If it's urgent, please call me.", ch: ["If it's urgent,", "please call me"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "明日の朝に確認します。", en: "I'll check it tomorrow morning.", ch: ["I'll check it", "tomorrow morning"], scene: "メッセージ", to: "相手", imp: "must" },
  { ja: "遅い時間にすみません。", en: "Sorry for messaging so late.", ch: ["Sorry for", "messaging so late"], scene: "メッセージ", to: "相手", imp: "often" },
  { ja: "お休みのところ失礼しました。", en: "Sorry to bother you on your day off.", ch: ["Sorry to bother you", "on your day off"], scene: "メッセージ", to: "相手", imp: "often" },
  { ja: "返信は明日で構いません。", en: "Replying tomorrow is fine.", ch: ["Replying tomorrow", "is fine"], scene: "メッセージ", to: "相手", imp: "often" },
];
