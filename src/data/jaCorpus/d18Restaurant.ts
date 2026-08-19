import type { JaSentenceInput } from "./types";

// 分野 18: レストラン
export const D18_SELF: JaSentenceInput[] = [
  { ja: "予約はしていないんですが、入れますか。", en: "We don't have a reservation. Can we still get a table?", ch: ["We don't have a reservation.", "Can we still get a table?"], scene: "店", to: "店員", imp: "must" },
  { ja: "二人ですが、席は空いていますか。", en: "There are two of us. Do you have a table?", ch: ["There are two of us.", "Do you have a table?"], scene: "店", to: "店員", imp: "must" },
  { ja: "できれば、静かな席がいいです。", en: "If possible, we'd like a quiet table.", ch: ["If possible,", "we'd like a quiet table"], scene: "店", to: "店員", imp: "must" },
  { ja: "窓側の席は空いていますか。", en: "Is there a table by the window?", ch: ["Is there a table", "by the window?"], scene: "店", to: "店員", imp: "must" },
  { ja: "メニューを見ても、なかなか決まりませんね。", en: "Even looking at the menu, it's hard to decide.", ch: ["Even looking at the menu,", "it's hard to decide"], scene: "店", to: "家族", imp: "must" },
  { ja: "何かおすすめはありますか。", en: "Do you have any recommendations?", ch: ["Do you have", "any recommendations?"], scene: "店", to: "店員", imp: "must" },
  { ja: "これはどのくらいの量ですか。", en: "How big is this portion?", ch: ["How big is", "this portion?"], scene: "店", to: "店員", imp: "must" },
  { ja: "二人で分けても大丈夫ですか。", en: "Is it okay if we share it?", ch: ["Is it okay if", "we share it?"], scene: "店", to: "店員", imp: "must" },
  { ja: "私はこれにしようと思います。", en: "I think I'll have this.", ch: ["I think I'll", "have this"], scene: "店", to: "家族", imp: "must" },
  { ja: "そちらは何にしますか。", en: "What are you going to have?", ch: ["What are you going to", "have?"], scene: "店", to: "家族", imp: "must" },
  { ja: "同じものを頼んでもいいんじゃないですか。", en: "We could just order the same thing.", ch: ["We could just order", "the same thing"], scene: "店", to: "家族", imp: "must" },
  { ja: "今日はあまり重たいものは食べたくありません。", en: "I don't want anything too heavy today.", ch: ["I don't want", "anything too heavy"], scene: "店", to: "家族", imp: "must" },
  { ja: "少し辛さを控えめにできますか。", en: "Could you make it a little less spicy?", ch: ["Could you make it", "a little less spicy?"], scene: "店", to: "店員", imp: "must" },
  { ja: "これには何が入っていますか。", en: "What's in this?", scene: "店", to: "店員", imp: "must" },
  { ja: "注文したものが一つまだ来ていません。", en: "One of our orders hasn't come yet.", ch: ["One of our orders", "hasn't come yet"], scene: "店", to: "店員", imp: "must" },
  { ja: "少し味が濃い気もします。", en: "It's a bit strongly flavored.", ch: ["It's a bit", "strongly flavored"], scene: "店", to: "家族", imp: "must" },
  { ja: "この量なら、一つで十分でしたね。", en: "With portions this big, one would have been enough.", ch: ["one would have been", "enough"], scene: "店", to: "家族", imp: "must" },
  { ja: "残ったものを持ち帰ることはできますか。", en: "Could we take the rest home?", ch: ["Could we take", "the rest home?"], scene: "店", to: "店員", imp: "must" },
  { ja: "では、お会計をお願いします。", en: "Could we get the check, please?", ch: ["Could we get", "the check, please?"], scene: "店", to: "店員", imp: "must" },
];

export const D18_ADD: JaSentenceInput[] = [
  // 本人の文にあった「これ、思っていたよりおいしいですね。」は分野 04 と重複していたため、
  // レストラン側はこの文に差し替え。
  { ja: "思っていたより雰囲気がいいですね。", en: "The atmosphere is nicer than I expected.", ch: ["The atmosphere is nicer", "than I expected"], scene: "店", to: "家族", imp: "often" },
  { ja: "何時まで開いていますか。", en: "How late are you open?", ch: ["How late", "are you open?"], scene: "店", to: "店員", imp: "must" },
  { ja: "どのくらい待ちますか。", en: "How long is the wait?", ch: ["How long is", "the wait?"], scene: "店", to: "店員", imp: "must" },
  { ja: "名前を書いておきましょうか。", en: "Should I put our name down?", ch: ["Should I put", "our name down?"], scene: "店", to: "家族", imp: "often" },
  { ja: "禁煙席でお願いします。", en: "Non-smoking, please.", scene: "店", to: "店員", imp: "often" },
  { ja: "先に飲み物を頼みましょうか。", en: "Should we order drinks first?", ch: ["Should we order", "drinks first?"], scene: "店", to: "家族", imp: "often" },
  { ja: "お水をもらえますか。", en: "Could we get some water?", ch: ["Could we get", "some water?"], scene: "店", to: "店員", imp: "must" },
  { ja: "取り皿をもらえますか。", en: "Could we get some small plates?", ch: ["Could we get", "some small plates?"], scene: "店", to: "店員", imp: "often" },
  { ja: "これはどうやって食べるんですか。", en: "How do you eat this?", ch: ["How do you", "eat this?"], scene: "店", to: "店員", imp: "often" },
  { ja: "アレルギーがあるので確認したいです。", en: "I'd like to check because I have an allergy.", ch: ["I'd like to check because", "I have an allergy"], scene: "店", to: "店員", imp: "must" },
  { ja: "卵は入っていますか。", en: "Does this contain egg?", ch: ["Does this contain", "egg?"], scene: "店", to: "店員", imp: "often" },
  { ja: "少し時間がかかりますか。", en: "Will it take a while?", ch: ["Will it take", "a while?"], scene: "店", to: "店員", imp: "often" },
  { ja: "追加で注文してもいいですか。", en: "Could we order some more?", ch: ["Could we order", "some more?"], scene: "店", to: "店員", imp: "often" },
  { ja: "デザートはどうしますか。", en: "What about dessert?", scene: "店", to: "家族", imp: "often" },
  { ja: "お腹いっぱいになりました。", en: "I'm completely full.", scene: "店", to: "家族", imp: "must" },
  { ja: "とてもおいしかったです。", en: "It was really good.", ch: ["It was", "really good"], scene: "店", to: "店員", imp: "must" },
  { ja: "ここは私が払いますよ。", en: "Let me get this one.", ch: ["Let me get", "this one"], scene: "店", to: "友人", imp: "often" },
  { ja: "別々に払えますか。", en: "Can we pay separately?", ch: ["Can we pay", "separately?"], scene: "店", to: "店員", imp: "often" },
  { ja: "カードは使えますか。", en: "Do you take cards?", ch: ["Do you take", "cards?"], scene: "店", to: "店員", imp: "must" },
  { ja: "また来たいと思います。", en: "I'd like to come again.", ch: ["I'd like to", "come again"], scene: "店", to: "店員", imp: "often" },
  { ja: "予約をしておけばよかったですね。", en: "We should have made a reservation.", ch: ["We should have made", "a reservation"], scene: "店", to: "家族", imp: "often" },
];
