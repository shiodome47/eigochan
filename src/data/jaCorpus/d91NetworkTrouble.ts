import type { JaSentenceInput } from "./types";

// 分野 91: ネットと機器の調子が悪い
//
// 自宅の Wi-Fi が遅い・切れる、というときの会話。
// 分野 39 (パソコン作業) や 41 (オンライン会議) が仕事の場面なのに対して、
// ここは **家のネットを二人で直そうとする** ときの言い方。
export const D91_SELF: JaSentenceInput[] = [];

export const D91_ADD: JaSentenceInput[] = [
  { ja: "ネットが遅い気がします。", en: "The internet feels slow.", ch: ["The internet", "feels slow"], scene: "家", to: "家族", imp: "must" },
  { ja: "さっきから何回も切れます。", en: "It keeps disconnecting.", scene: "家", to: "家族", imp: "must" },
  { ja: "動画が途中で止まります。", en: "The video keeps buffering.", ch: ["The video", "keeps buffering"], scene: "家", to: "家族", imp: "must" },
  { ja: "電波はちゃんと立っていますか。", en: "Are you getting a good signal?", ch: ["Are you getting", "a good signal?"], scene: "家", to: "家族", imp: "must" },
  { ja: "一度、ルーターを再起動してみましょう。", en: "Let's try restarting the router.", ch: ["Let's try", "restarting the router"], scene: "家", to: "家族", imp: "must" },
  { ja: "電源を抜いて、少し待ってから挿します。", en: "Unplug it, wait a bit, then plug it back in.", ch: ["Unplug it, wait a bit,", "then plug it back in"], scene: "家", to: "家族", imp: "must" },
  { ja: "直りました。", en: "That fixed it.", scene: "家", to: "家族", imp: "must" },
  { ja: "まだ変わりませんね。", en: "It's still the same.", ch: ["It's still", "the same"], scene: "家", to: "家族", imp: "must" },
  { ja: "私の端末だけかもしれません。", en: "It might just be my device.", ch: ["It might just be", "my device"], scene: "家", to: "家族", imp: "must" },
  { ja: "そちらは普通につながっていますか。", en: "Is it working fine on your end?", ch: ["Is it working fine", "on your end?"], scene: "家", to: "家族", imp: "must" },
  { ja: "パスワードをもう一度教えてもらえますか。", en: "Could you tell me the password again?", ch: ["Could you tell me", "the password again?"], scene: "家", to: "家族", imp: "must" },
  { ja: "つながってはいますが、ネットに出られません。", en: "It's connected, but there's no internet.", ch: ["It's connected,", "but there's no internet"], scene: "家", to: "家族", imp: "must" },
  { ja: "一度つなぎ直してみます。", en: "Let me reconnect.", scene: "家", to: "家族", imp: "must" },
  { ja: "機内モードを入れて切ると直ることがあります。", en: "Turning airplane mode on and off sometimes fixes it.", ch: ["Turning airplane mode on and off", "sometimes fixes it"], scene: "家", to: "家族", imp: "often" },
  { ja: "二階だと電波が弱いです。", en: "The signal is weak upstairs.", ch: ["The signal is weak", "upstairs"], scene: "家", to: "家族", imp: "must" },
  { ja: "ルーターの置き場所を変えてみましょうか。", en: "Should we try moving the router?", ch: ["Should we try", "moving the router?"], scene: "家", to: "家族", imp: "often" },
  { ja: "壁が厚いので届きにくいのかもしれません。", en: "The walls are thick, so it might not reach.", ch: ["The walls are thick,", "so it might not reach"], scene: "家", to: "家族", imp: "often" },
  { ja: "中継機を買った方がいいかもしれません。", en: "Maybe we should get a range extender.", ch: ["Maybe we should get", "a range extender"], scene: "家", to: "家族", imp: "often" },
  { ja: "契約している回線が古いのかもしれません。", en: "Our plan might just be outdated.", ch: ["Our plan", "might just be outdated"], scene: "家", to: "家族", imp: "often" },
  { ja: "夜になると遅くなります。", en: "It gets slower in the evening.", ch: ["It gets slower", "in the evening"], scene: "家", to: "家族", imp: "must" },
  { ja: "回線の会社に問い合わせてみます。", en: "I'll contact the provider.", ch: ["I'll contact", "the provider"], scene: "家", to: "家族", imp: "must" },
  { ja: "工事が必要だと言われました。", en: "They said it needs installation work.", ch: ["They said", "it needs installation work"], scene: "家", to: "家族", imp: "often" },
  { ja: "来週、業者が来ます。", en: "A technician is coming next week.", ch: ["A technician is coming", "next week"], scene: "家", to: "家族", imp: "must" },
  { ja: "それまではスマホでしのぎます。", en: "I'll get by on my phone until then.", ch: ["I'll get by on my phone", "until then"], scene: "家", to: "家族", imp: "often" },
  { ja: "データを使いすぎて速度が落ちました。", en: "I used too much data, so it got throttled.", ch: ["I used too much data,", "so it got throttled"], scene: "家", to: "家族", imp: "often" },
  { ja: "今月はもう残りが少ないです。", en: "I don't have much data left this month.", ch: ["I don't have much data left", "this month"], scene: "家", to: "家族", imp: "must" },
  { ja: "会議中に切れたら困ります。", en: "It'd be a problem if it cut out during a meeting.", ch: ["It'd be a problem", "if it cut out during a meeting"], scene: "家", to: "家族", imp: "must" },
  { ja: "大事な通話の前に確認しておきます。", en: "I'll check it before the important call.", ch: ["I'll check it", "before the important call"], scene: "家", to: "家族", imp: "must" },
  { ja: "有線でつないだ方が安定します。", en: "A wired connection is more stable.", ch: ["A wired connection", "is more stable"], scene: "家", to: "家族", imp: "must" },
  { ja: "ケーブルはどこにしまいましたか。", en: "Where did we put the cable?", ch: ["Where did we put", "the cable?"], scene: "家", to: "家族", imp: "must" },
  { ja: "音声だけにしましょうか。", en: "Should we switch to audio only?", ch: ["Should we switch to", "audio only?"], scene: "家", to: "家族", imp: "often" },
  { ja: "一度、入り直します。", en: "I'll rejoin.", scene: "家", to: "家族", imp: "must" },
  { ja: "画面共有が重いみたいです。", en: "Screen sharing seems to be slowing it down.", ch: ["Screen sharing", "seems to be slowing it down"], scene: "家", to: "家族", imp: "often" },
  { ja: "他の機器をつなぎすぎかもしれません。", en: "We might have too many devices connected.", ch: ["We might have", "too many devices connected"], scene: "家", to: "家族", imp: "often" },
  { ja: "使っていないものは切っておきます。", en: "I'll disconnect the ones we're not using.", ch: ["I'll disconnect", "the ones we're not using"], scene: "家", to: "家族", imp: "often" },
  { ja: "速度を測ってみます。", en: "Let me run a speed test.", ch: ["Let me run", "a speed test"], scene: "家", to: "家族", imp: "must" },
  { ja: "思ったより出ていますね。", en: "It's actually faster than I thought.", ch: ["It's actually faster", "than I thought"], scene: "家", to: "家族", imp: "often" },
  { ja: "これなら問題なさそうです。", en: "This should be fine.", ch: ["This should", "be fine"], scene: "家", to: "家族", imp: "must" },
  { ja: "とりあえず様子を見ます。", en: "I'll keep an eye on it for now.", ch: ["I'll keep an eye on it", "for now"], scene: "家", to: "家族", imp: "must" },
  { ja: "毎回これをやるのは面倒です。", en: "Doing this every time is a hassle.", ch: ["Doing this every time", "is a hassle"], scene: "家", to: "家族", imp: "often" },
];
