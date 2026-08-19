import type { JaSentenceInput } from "./types";

// 分野 97: 犬や猫を飼う相談
//
// 「保護施設に見に行く」から「迎える」までの相談。
// 既存コーパスにペットの語彙が無かったので新設した。
// 誰が世話をするか、費用は、留守のときは —— 家族と詰める会話が中心。
export const D97_SELF: JaSentenceInput[] = [];

export const D97_ADD: JaSentenceInput[] = [
  { ja: "犬を飼いたいと思っています。", en: "I've been thinking about getting a dog.", ch: ["I've been thinking about", "getting a dog"], scene: "家", to: "家族", imp: "must" },
  { ja: "前から考えていました。", en: "I've been considering it for a while.", ch: ["I've been considering it", "for a while"], scene: "家", to: "家族", imp: "must" },
  { ja: "保護施設を見に行きませんか。", en: "Want to go take a look at a shelter?", ch: ["Want to go take a look", "at a shelter?"], scene: "家", to: "家族", imp: "must" },
  { ja: "見るだけでもいいそうです。", en: "They said it's fine to just look.", ch: ["They said it's fine", "to just look"], scene: "家", to: "家族", imp: "often" },
  { ja: "会ってみないと分かりません。", en: "You won't know until you meet them.", ch: ["You won't know", "until you meet them"], scene: "家", to: "家族", imp: "must" },
  { ja: "相性が大事だと思います。", en: "I think the match really matters.", ch: ["I think the match", "really matters"], scene: "家", to: "家族", imp: "must" },
  { ja: "世話は誰がしますか。", en: "Who's going to take care of it?", ch: ["Who's going to", "take care of it?"], scene: "家", to: "家族", imp: "must" },
  { ja: "散歩は毎日必要です。", en: "It needs a walk every day.", ch: ["It needs a walk", "every day"], scene: "家", to: "家族", imp: "must" },
  { ja: "朝と夕方、二回行きます。", en: "Twice a day, morning and evening.", ch: ["Twice a day,", "morning and evening"], scene: "家", to: "家族", imp: "must" },
  { ja: "雨の日も行かないといけません。", en: "You have to go even on rainy days.", ch: ["You have to go", "even on rainy days"], scene: "家", to: "家族", imp: "must" },
  { ja: "旅行のときはどうしますか。", en: "What do we do when we travel?", ch: ["What do we do", "when we travel?"], scene: "家", to: "家族", imp: "must" },
  { ja: "預ける場所を探しておきます。", en: "I'll look into places to board it.", ch: ["I'll look into places", "to board it"], scene: "家", to: "家族", imp: "often" },
  { ja: "費用はどのくらいかかりますか。", en: "How much does it cost to keep one?", ch: ["How much does it cost", "to keep one?"], scene: "家", to: "家族", imp: "must" },
  { ja: "餌代だけではありません。", en: "It's not just the food.", ch: ["It's not", "just the food"], scene: "家", to: "家族", imp: "must" },
  { ja: "病院代も考えておかないといけません。", en: "We need to account for vet bills too.", ch: ["We need to account for", "vet bills too"], scene: "家", to: "家族", imp: "must" },
  { ja: "十年以上の付き合いになります。", en: "It'll be a relationship of over ten years.", ch: ["It'll be a relationship", "of over ten years"], scene: "家", to: "家族", imp: "often" },
  { ja: "最後まで責任を持てますか。", en: "Can we take responsibility all the way through?", ch: ["Can we take responsibility", "all the way through?"], scene: "家", to: "家族", imp: "must" },
  { ja: "そこが一番大事だと思います。", en: "I think that's the most important part.", ch: ["I think that's", "the most important part"], scene: "家", to: "家族", imp: "must" },
  { ja: "家族全員が賛成していますか。", en: "Is everyone in the family on board?", ch: ["Is everyone in the family", "on board?"], scene: "家", to: "家族", imp: "must" },
  { ja: "一人でも反対なら難しいです。", en: "If even one person is against it, it's tough.", ch: ["If even one person is against it,", "it's tough"], scene: "家", to: "家族", imp: "must" },
  { ja: "アレルギーの人はいませんか。", en: "Is anyone allergic?", scene: "家", to: "家族", imp: "must" },
  { ja: "うちの建物は飼えますか。", en: "Does our building allow pets?", ch: ["Does our building", "allow pets?"], scene: "家", to: "家族", imp: "must" },
  { ja: "規約を確認しておきます。", en: "I'll check the rules.", ch: ["I'll check", "the rules"], scene: "家", to: "家族", imp: "must" },
  { ja: "大きさに制限があるようです。", en: "There seems to be a size limit.", ch: ["There seems to be", "a size limit"], scene: "家", to: "家族", imp: "often" },
  { ja: "小型犬なら大丈夫だそうです。", en: "They said small dogs are fine.", ch: ["They said", "small dogs are fine"], scene: "家", to: "家族", imp: "often" },
  { ja: "猫の方が飼いやすいかもしれません。", en: "A cat might be easier to keep.", ch: ["A cat might be", "easier to keep"], scene: "家", to: "家族", imp: "must" },
  { ja: "留守が多いので気になります。", en: "We're out a lot, so that worries me.", ch: ["We're out a lot,", "so that worries me"], scene: "家", to: "家族", imp: "must" },
  { ja: "一匹だと寂しがるかもしれません。", en: "It might get lonely on its own.", ch: ["It might get lonely", "on its own"], scene: "家", to: "家族", imp: "often" },
  { ja: "保護された経緯を聞きました。", en: "I asked how it ended up in the shelter.", ch: ["I asked how it ended up", "in the shelter"], scene: "外出", to: "相手", imp: "often" },
  { ja: "少し人見知りだそうです。", en: "They said it's a bit shy around people.", ch: ["They said it's a bit shy", "around people"], scene: "外出", to: "相手", imp: "often" },
  { ja: "時間をかければ慣れるそうです。", en: "They said it'll warm up given time.", ch: ["They said it'll warm up", "given time"], scene: "外出", to: "相手", imp: "often" },
  { ja: "急がずに決めたいです。", en: "I want to take my time deciding.", ch: ["I want to take my time", "deciding"], scene: "家", to: "家族", imp: "must" },
  { ja: "何度か会いに行ってみます。", en: "I'll go visit a few times.", ch: ["I'll go visit", "a few times"], scene: "家", to: "家族", imp: "must" },
  { ja: "家に来る前に準備が要ります。", en: "We need to get ready before it comes home.", ch: ["We need to get ready", "before it comes home"], scene: "家", to: "家族", imp: "must" },
  { ja: "ケージと餌は先に買っておきます。", en: "I'll buy the crate and food ahead of time.", ch: ["I'll buy the crate and food", "ahead of time"], scene: "家", to: "家族", imp: "often" },
  { ja: "名前はもう決めましたか。", en: "Have you decided on a name yet?", ch: ["Have you decided on a name", "yet?"], scene: "家", to: "家族", imp: "must" },
  { ja: "会ってから決めます。", en: "I'll decide after we meet.", ch: ["I'll decide", "after we meet"], scene: "家", to: "家族", imp: "must" },
  { ja: "少し緊張します。", en: "I'm a little nervous.", ch: ["I'm", "a little nervous"], scene: "家", to: "家族", imp: "must" },
  { ja: "うまくやっていけるといいですね。", en: "I hope it works out.", ch: ["I hope", "it works out"], scene: "家", to: "家族", imp: "must" },
  { ja: "迎えられて本当によかったです。", en: "I'm really glad we took them in.", ch: ["I'm really glad", "we took them in"], scene: "家", to: "家族", imp: "must" },
];

// あとから足したぶん (犬種の話)。`late` に入れるので既存の ID はずれない。
export const D97_LATE: JaSentenceInput[] = [
  { ja: "どんな犬を考えていますか。", en: "What kind of dog are you thinking about?", ch: ["What kind of dog", "are you thinking about?"], scene: "家", to: "家族", imp: "must" },
  { ja: "散歩で横を歩けるくらいの小さい子がいいです。", en: "Something small enough to walk right beside me.", ch: ["Something small enough", "to walk right beside me"], scene: "家", to: "家族", imp: "often" },
  { ja: "柴犬かトイプードルが合うかもしれません。", en: "A Shiba or a toy poodle might be a good match.", ch: ["A Shiba or a toy poodle", "might be a good match"], scene: "家", to: "家族", imp: "must" },
  { ja: "柴犬は日本でとても人気があります。", en: "Shibas are very popular in Japan.", ch: ["Shibas are very popular", "in Japan"], scene: "会話", to: "相手", imp: "must" },
  { ja: "柴犬は少し頑固だと聞きます。", en: "I hear Shibas can be a little stubborn.", ch: ["I hear Shibas", "can be a little stubborn"], scene: "家", to: "家族", imp: "often" },
  { ja: "毛が抜けるので掃除が増えます。", en: "They shed, so there's more cleaning.", ch: ["They shed,", "so there's more cleaning"], scene: "家", to: "家族", imp: "often" },
  { ja: "想像しただけで胸がいっぱいになります。", en: "Just imagining it makes my chest tighten.", ch: ["Just imagining it", "makes my chest tighten"], scene: "家", to: "家族", imp: "often" },
  { ja: "落ち着いてください。まず会ってからです。", en: "Easy — let's meet them first.", ch: ["Easy —", "let's meet them first"], scene: "家", to: "家族", imp: "must" },
];
