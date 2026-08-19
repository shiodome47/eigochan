import type { JaSentenceInput } from "./types";

// 分野 93: お金の使い方と貯金の計画
//
// 「旅行のために貯める」のような、**お金の話を人とする** ときの言い方。
// 既存コーパスには金額・予算・節約の語彙がほとんど無かったので新設した。
export const D93_SELF: JaSentenceInput[] = [];

export const D93_ADD: JaSentenceInput[] = [
  { ja: "旅行のために貯金を始めました。", en: "I started saving up for a trip.", ch: ["I started saving up", "for a trip"], scene: "会話", to: "友人", imp: "must" },
  { ja: "毎月いくらずつ貯めていますか。", en: "How much do you put aside each month?", ch: ["How much do you put aside", "each month?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "給料が入ったらすぐに分けています。", en: "I set it aside as soon as I get paid.", ch: ["I set it aside", "as soon as I get paid"], scene: "会話", to: "友人", imp: "must" },
  { ja: "目標は来年の夏までです。", en: "My goal is by next summer.", ch: ["My goal is", "by next summer"], scene: "会話", to: "友人", imp: "must" },
  { ja: "あといくら必要ですか。", en: "How much more do you need?", ch: ["How much more", "do you need?"], scene: "会話", to: "友人", imp: "must" },
  { ja: "半分くらいは貯まりました。", en: "I've saved about half of it.", ch: ["I've saved", "about half of it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "思ったより貯まりません。", en: "It's not adding up as fast as I hoped.", ch: ["It's not adding up", "as fast as I hoped"], scene: "会話", to: "友人", imp: "must" },
  { ja: "何にお金が消えているのか分かりません。", en: "I don't know where the money is going.", ch: ["I don't know", "where the money is going"], scene: "会話", to: "友人", imp: "must" },
  { ja: "一度、使ったお金を書き出してみます。", en: "I'll write down what I've been spending.", ch: ["I'll write down", "what I've been spending"], scene: "会話", to: "友人", imp: "often" },
  { ja: "外食を減らせば、だいぶ変わりそうです。", en: "Eating out less would make a big difference.", ch: ["Eating out less", "would make a big difference"], scene: "会話", to: "友人", imp: "must" },
  { ja: "コーヒー代だけでも意外と大きいです。", en: "Even just coffee adds up more than you'd think.", ch: ["Even just coffee adds up", "more than you'd think"], scene: "会話", to: "友人", imp: "often" },
  { ja: "固定費を見直した方が早いです。", en: "It's faster to look at the fixed costs.", ch: ["It's faster to look at", "the fixed costs"], scene: "会話", to: "友人", imp: "often" },
  { ja: "使っていないサービスを解約しました。", en: "I canceled the subscriptions I wasn't using.", ch: ["I canceled the subscriptions", "I wasn't using"], scene: "会話", to: "友人", imp: "must" },
  { ja: "それだけで月に数千円浮きました。", en: "That alone freed up a few thousand yen a month.", ch: ["That alone freed up", "a few thousand yen a month"], scene: "会話", to: "友人", imp: "often" },
  { ja: "航空券は早く取る方が安いです。", en: "Flights are cheaper if you book early.", ch: ["Flights are cheaper", "if you book early"], scene: "会話", to: "友人", imp: "must" },
  { ja: "時期をずらせばかなり違います。", en: "It's a lot cheaper if you shift the dates.", ch: ["It's a lot cheaper", "if you shift the dates"], scene: "会話", to: "友人", imp: "often" },
  { ja: "現地での予算も考えておかないといけません。", en: "We need to budget for spending there too.", ch: ["We need to budget", "for spending there too"], scene: "会話", to: "家族", imp: "must" },
  { ja: "一日いくらくらいで考えていますか。", en: "About how much a day are you thinking?", ch: ["About how much a day", "are you thinking?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "食事代は多めに見ておきます。", en: "I'll allow extra for food.", ch: ["I'll allow extra", "for food"], scene: "会話", to: "家族", imp: "often" },
  { ja: "お土産の分も残しておきたいです。", en: "I want to leave some for souvenirs.", ch: ["I want to leave some", "for souvenirs"], scene: "会話", to: "家族", imp: "often" },
  { ja: "予備のお金は必ず持っていきます。", en: "I always bring backup money.", ch: ["I always bring", "backup money"], scene: "会話", to: "家族", imp: "must" },
  { ja: "カードが使えないところもあります。", en: "There are places that don't take cards.", ch: ["There are places", "that don't take cards"], scene: "会話", to: "家族", imp: "must" },
  { ja: "少しは現金を用意しておきます。", en: "I'll have some cash on hand.", ch: ["I'll have some cash", "on hand"], scene: "会話", to: "家族", imp: "must" },
  { ja: "為替が動くと変わってきます。", en: "It changes with the exchange rate.", ch: ["It changes with", "the exchange rate"], scene: "会話", to: "相手", imp: "must" },
  { ja: "今は円が安いので厳しいです。", en: "The yen is weak right now, so it's tough.", ch: ["The yen is weak right now,", "so it's tough"], scene: "会話", to: "相手", imp: "often" },
  { ja: "もう少し待った方がいいかもしれません。", en: "It might be better to wait a little.", ch: ["It might be better to", "wait a little"], scene: "会話", to: "相手", imp: "must" },
  { ja: "無理のない範囲でやります。", en: "I'll keep it to what I can manage.", ch: ["I'll keep it to", "what I can manage"], scene: "会話", to: "友人", imp: "must" },
  { ja: "我慢しすぎると続きません。", en: "If you deprive yourself too much, it doesn't last.", ch: ["If you deprive yourself too much,", "it doesn't last"], scene: "会話", to: "友人", imp: "often" },
  { ja: "たまには使ってもいいと思います。", en: "I think it's fine to spend sometimes.", ch: ["I think it's fine", "to spend sometimes"], scene: "会話", to: "友人", imp: "must" },
  { ja: "自分へのご褒美は必要です。", en: "You need to treat yourself now and then.", ch: ["You need to treat yourself", "now and then"], scene: "会話", to: "友人", imp: "often" },
  { ja: "貯めるだけだとつまらないです。", en: "Just saving and never spending is no fun.", ch: ["Just saving and never spending", "is no fun"], scene: "会話", to: "友人", imp: "often" },
  { ja: "何のために貯めているのか忘れそうになります。", en: "I almost forget what I'm saving for.", ch: ["I almost forget", "what I'm saving for"], scene: "会話", to: "友人", imp: "often" },
  { ja: "目標があると続けやすいです。", en: "It's easier to keep going when you have a goal.", ch: ["It's easier to keep going", "when you have a goal"], scene: "会話", to: "友人", imp: "must" },
  { ja: "写真を見て気持ちを保っています。", en: "I look at photos to stay motivated.", ch: ["I look at photos", "to stay motivated"], scene: "会話", to: "友人", imp: "often" },
  { ja: "貯まっていくのを見るのが楽しいです。", en: "It's fun watching it add up.", ch: ["It's fun", "watching it add up"], scene: "会話", to: "友人", imp: "often" },
  { ja: "自動で積み立てるようにしました。", en: "I set it to save automatically.", ch: ["I set it to save", "automatically"], scene: "会話", to: "友人", imp: "often" },
  { ja: "手をつけないように別の口座に入れています。", en: "I keep it in a separate account so I don't touch it.", ch: ["I keep it in a separate account", "so I don't touch it"], scene: "会話", to: "友人", imp: "often" },
  { ja: "今月は少し使いすぎました。", en: "I spent a bit too much this month.", ch: ["I spent a bit too much", "this month"], scene: "会話", to: "家族", imp: "must" },
  { ja: "来月で取り返します。", en: "I'll make up for it next month.", ch: ["I'll make up for it", "next month"], scene: "会話", to: "家族", imp: "must" },
  { ja: "焦らずやっていきます。", en: "I'll take it slow.", ch: ["I'll take it", "slow"], scene: "会話", to: "友人", imp: "must" },
];
