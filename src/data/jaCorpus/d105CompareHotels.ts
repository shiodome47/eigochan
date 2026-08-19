import type { JaSentenceInput } from "./types";

// 分野 105: 泊まる宿を比べて決める
//
// 分野 23 (ホテル) が現地でのやりとりなのに対して、
// ここは **泊まる前に二人で比べて決める** 分野。
// 口コミを読む、条件を並べる、取り消しの条件を確かめる、押さえる。
export const D105_SELF: JaSentenceInput[] = [];

export const D105_ADD: JaSentenceInput[] = [
  { ja: "写真では素敵に見えます。", en: "It looks lovely in the photos.", ch: ["It looks lovely", "in the photos"], scene: "会話", to: "家族", imp: "must" },
  { ja: "実際はどうなのでしょう。", en: "I wonder what it's actually like.", ch: ["I wonder", "what it's actually like"], scene: "会話", to: "家族", imp: "must" },
  { ja: "口コミを見てみましょう。", en: "Let's look at the reviews.", ch: ["Let's look at", "the reviews"], scene: "会話", to: "家族", imp: "must" },
  { ja: "対応がいいと書いてあります。", en: "People say the staff are helpful.", ch: ["People say", "the staff are helpful"], scene: "会話", to: "家族", imp: "must" },
  { ja: "駅から近いのも便利です。", en: "Being close to the station is convenient too.", ch: ["Being close to the station", "is convenient too"], scene: "会話", to: "家族", imp: "must" },
  { ja: "歩いて何分ですか。", en: "How many minutes is it on foot?", ch: ["How many minutes", "is it on foot?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "この辺りの相場としては妥当です。", en: "The price is fair for this area.", ch: ["The price is fair", "for this area"], scene: "会話", to: "家族", imp: "must" },
  { ja: "朝食の評判がいいです。", en: "The breakfast gets good comments.", ch: ["The breakfast gets", "good comments"], scene: "会話", to: "家族", imp: "must" },
  { ja: "朝食込みの値段ですか。", en: "Is that price with breakfast?", ch: ["Is that price", "with breakfast?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "これを第一候補にしましょうか。", en: "Should we make this our first choice?", ch: ["Should we make this", "our first choice?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "他に気になる宿はありますか。", en: "Are there any others you're curious about?", ch: ["Are there any others", "you're curious about?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "もう少し比べてみましょう。", en: "Let's compare a few more.", ch: ["Let's compare", "a few more"], scene: "会話", to: "家族", imp: "must" },
  { ja: "もう一軒ありますが、少し古そうです。", en: "There's one more, but it looks a bit old.", ch: ["There's one more,", "but it looks a bit old"], scene: "会話", to: "家族", imp: "must" },
  { ja: "新しい方が快適かもしれません。", en: "The newer one might be more comfortable.", ch: ["The newer one might be", "more comfortable"], scene: "会話", to: "家族", imp: "must" },
  { ja: "清潔さは大事です。", en: "Cleanliness matters.", scene: "会話", to: "家族", imp: "must" },
  { ja: "写真は古いことがあります。", en: "The photos can be out of date.", ch: ["The photos can be", "out of date"], scene: "会話", to: "家族", imp: "often" },
  { ja: "最近の口コミを見た方がいいです。", en: "It's better to read the recent reviews.", ch: ["It's better to read", "the recent reviews"], scene: "会話", to: "家族", imp: "must" },
  { ja: "低い評価の理由も読んでみます。", en: "I'll read why people gave it low ratings.", ch: ["I'll read why people", "gave it low ratings"], scene: "会話", to: "家族", imp: "often" },
  { ja: "音がうるさいと書いてあります。", en: "Someone wrote that it's noisy.", ch: ["Someone wrote", "that it's noisy"], scene: "会話", to: "家族", imp: "must" },
  { ja: "上の階なら静かかもしれません。", en: "A higher floor might be quieter.", ch: ["A higher floor", "might be quieter"], scene: "会話", to: "家族", imp: "often" },
  { ja: "部屋の広さはどのくらいですか。", en: "How big is the room?", ch: ["How big", "is the room?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "二人なら十分です。", en: "It's plenty for two.", ch: ["It's plenty", "for two"], scene: "会話", to: "家族", imp: "must" },
  { ja: "荷物を置く場所はありますか。", en: "Is there space for our luggage?", ch: ["Is there space", "for our luggage?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "洗濯機はありますか。", en: "Is there a washing machine?", ch: ["Is there", "a washing machine?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "長く泊まるなら助かります。", en: "That helps if we're staying a while.", ch: ["That helps", "if we're staying a while"], scene: "会話", to: "家族", imp: "often" },
  { ja: "何泊しますか。", en: "How many nights are we staying?", ch: ["How many nights", "are we staying?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "三泊で考えています。", en: "I'm thinking three nights.", ch: ["I'm thinking", "three nights"], scene: "会話", to: "家族", imp: "must" },
  { ja: "連泊すると安くなります。", en: "It gets cheaper if you stay multiple nights.", ch: ["It gets cheaper", "if you stay multiple nights"], scene: "会話", to: "家族", imp: "often" },
  { ja: "早めに予約すると割引があります。", en: "There's a discount if you book early.", ch: ["There's a discount", "if you book early"], scene: "会話", to: "家族", imp: "must" },
  { ja: "直前だと高くなります。", en: "It gets expensive last minute.", ch: ["It gets expensive", "last minute"], scene: "会話", to: "家族", imp: "must" },
  { ja: "取り消しはできますか。", en: "Can we cancel?", scene: "会話", to: "家族", imp: "must" },
  { ja: "無料で取り消せる期限を確認します。", en: "I'll check the free cancellation deadline.", ch: ["I'll check", "the free cancellation deadline"], scene: "会話", to: "家族", imp: "must" },
  { ja: "支払いは今ですか、現地ですか。", en: "Do we pay now or at the hotel?", ch: ["Do we pay now", "or at the hotel?"], scene: "会話", to: "家族", imp: "must" },
  { ja: "税金は含まれていますか。", en: "Is tax included?", scene: "会話", to: "家族", imp: "must" },
  { ja: "合計でいくらになりますか。", en: "What's the total?", scene: "会話", to: "家族", imp: "must" },
  { ja: "これで決めましょう。", en: "Let's go with this one.", ch: ["Let's go with", "this one"], scene: "会話", to: "家族", imp: "must" },
  { ja: "今すぐ予約します。", en: "I'll book it right now.", ch: ["I'll book it", "right now"], scene: "会話", to: "家族", imp: "must" },
  { ja: "部屋が残っているうちに押さえます。", en: "I'll lock it in while there are rooms left.", ch: ["I'll lock it in", "while there are rooms left"], scene: "会話", to: "家族", imp: "often" },
  { ja: "予約が取れました。", en: "We're booked.", scene: "会話", to: "家族", imp: "must" },
  { ja: "いい旅にしましょう。", en: "Let's make it a great trip.", ch: ["Let's make it", "a great trip"], scene: "会話", to: "家族", imp: "must" },
];
