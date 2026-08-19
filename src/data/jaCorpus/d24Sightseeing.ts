import type { JaSentenceInput } from "./types";

// 分野 24: 観光・旅行
export const D24_SELF: JaSentenceInput[] = [
  { ja: "ここに来るのは初めてです。", en: "This is my first time here.", ch: ["This is my first time", "here"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "思っていたより静かな場所ですね。", en: "It's a quieter place than I expected.", ch: ["It's a quieter place than", "I expected."], scene: "観光地", to: "家族", imp: "must" },
  { ja: "写真で見るより、実際の方がきれいですね。", en: "It's more beautiful in person than in photos.", ch: ["more beautiful in person", "than in photos"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "今日はそれほど混んでいなくてよかったです。", en: "I'm glad it isn't too crowded today.", ch: ["I'm glad it isn't", "too crowded"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "まず、どこから見て回りましょうか。", en: "Where should we start looking around?", ch: ["Where should we start", "looking around?"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "全部見るのは少し難しそうですね。", en: "Seeing everything looks a bit difficult.", ch: ["Seeing everything", "looks a bit difficult."], scene: "観光地", to: "家族", imp: "must" },
  { ja: "一番見たいところから行った方がよさそうです。", en: "We should start with what we most want to see.", ch: ["start with", "what we most want to see"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "少し休憩してから行きませんか。", en: "Why don't we rest a bit before we go?", ch: ["Why don't we rest a bit", "before we go?"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "思っていたより坂が多いですね。", en: "There are more hills than I expected.", ch: ["more hills than", "I expected"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "この景色を見ると、来たかいがありましたね。", en: "Seeing this view, it was worth coming.", ch: ["Seeing this view,", "it was worth coming"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "ここで写真を撮ってもらえますか。", en: "Could you take a picture of us here?", ch: ["Could you take", "a picture of us?"], scene: "観光地", to: "通行人", imp: "must" },
  { ja: "もう一枚撮ってもいいですか。", en: "Could you take one more?", ch: ["Could you take", "one more?"], scene: "観光地", to: "通行人", imp: "must" },
  { ja: "少し離れた方が全体が入りそうです。", en: "If you step back a bit, you'll get the whole thing in.", ch: ["If you step back a bit", ", you'll get the whole thing in."], scene: "観光地", to: "通行人", imp: "must" },
  { ja: "お土産は何を買いましょうか。", en: "What should we get for souvenirs?", ch: ["What should we get", "for souvenirs?"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "あまり荷物を増やしたくないんですよね。", en: "I'd rather not add to what we're carrying.", ch: ["I'd rather not", "add to what we're carrying"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "ここでしか買えないものがいいですね。", en: "Something you can only get here would be nice.", ch: ["Something you can", "only get here"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "帰りの時間も考えておいた方がよさそうです。", en: "We should keep the return time in mind.", ch: ["We should keep", "the return time in mind"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "予定より少し遅くなりましたね。", en: "We're running a little later than planned.", ch: ["a little later", "than planned"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "でも、今日は十分楽しめたと思います。", en: "Still, I think we enjoyed today plenty.", ch: ["I think we enjoyed", "today plenty"], scene: "観光地", to: "家族", imp: "must" },
];

export const D24_ADD: JaSentenceInput[] = [
  // 本人の文にあった「ここから歩いて行けますか。」は分野 13 と重複していたため、
  // 観光側はこの文に差し替え。
  { ja: "見学にはどのくらい時間がかかりますか。", en: "How long does it take to look around?", ch: ["How long does it take", "to look around?"], scene: "観光地", to: "係の人", imp: "must" },
  { ja: "入場料はいくらですか。", en: "How much is admission?", ch: ["How much is", "admission?"], scene: "観光地", to: "係の人", imp: "must" },
  { ja: "最終入場は何時ですか。", en: "What time is the last entry?", ch: ["What time is", "the last entry?"], scene: "観光地", to: "係の人", imp: "must" },
  { ja: "中の写真は撮ってもいいですか。", en: "Is it okay to take photos inside?", ch: ["Is it okay to take photos", "inside?"], scene: "観光地", to: "係の人", imp: "must" },
  { ja: "パンフレットをもらえますか。", en: "Could I get a brochure?", ch: ["Could I get", "a brochure?"], scene: "観光地", to: "係の人", imp: "often" },
  { ja: "日本語の案内はありますか。", en: "Is there a guide in Japanese?", ch: ["Is there a guide", "in Japanese?"], scene: "観光地", to: "係の人", imp: "often" },
  { ja: "ガイドツアーはありますか。", en: "Do you have guided tours?", ch: ["Do you have", "guided tours?"], scene: "観光地", to: "係の人", imp: "often" },
  { ja: "荷物を預ける場所はありますか。", en: "Is there somewhere to leave our bags?", ch: ["Is there somewhere", "to leave our bags?"], scene: "観光地", to: "係の人", imp: "often" },
  { ja: "座れる場所はありますか。", en: "Is there somewhere to sit?", ch: ["Is there somewhere", "to sit?"], scene: "観光地", to: "係の人", imp: "often" },
  { ja: "少し飲み物を買いましょう。", en: "Let's get something to drink.", ch: ["Let's get something", "to drink"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "日差しが強いので気をつけましょう。", en: "The sun is strong, so let's be careful.", ch: ["The sun is strong,", "so let's be careful"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "歩きやすい靴にしてよかったですね。", en: "I'm glad we wore comfortable shoes.", ch: ["I'm glad we wore", "comfortable shoes"], scene: "観光地", to: "家族", imp: "sub" },
  { ja: "今日はここまでにしましょうか。", en: "Should we call it a day here?", ch: ["Should we call it a day", "here?"], scene: "観光地", to: "家族", imp: "must" },
  { ja: "地図をもう一度見てみましょう。", en: "Let's take another look at the map.", ch: ["Let's take another look", "at the map"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "電車の時間を調べておきます。", en: "I'll check the train times.", ch: ["I'll check", "the train times"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "混む前に移動しましょうか。", en: "Should we move on before it gets crowded?", ch: ["Should we move on", "before it gets crowded?"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "ここで少し座って休みましょう。", en: "Let's sit here and rest for a bit.", ch: ["Let's sit here", "and rest for a bit"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "またいつか来たいですね。", en: "I'd like to come back someday.", ch: ["I'd like to come back", "someday"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "写真をあとで送りますね。", en: "I'll send you the photos later.", ch: ["I'll send you", "the photos later"], scene: "観光地", to: "友人", imp: "often" },
  { ja: "気をつけて帰りましょう。", en: "Let's get home safely.", ch: ["Let's get home", "safely"], scene: "観光地", to: "家族", imp: "often" },
  { ja: "お土産はここで買っておきましょう。", en: "Let's buy the souvenirs here.", ch: ["Let's buy the souvenirs", "here"], scene: "観光地", to: "家族", imp: "often" },
];
