import type { JaSentenceInput } from "./types";

// 分野 90: 買うものを選んで決める
//
// ソファ・腕時計・パソコンなど、**その場で比べて決める** ときの会話。
// 分野 21 (洋服や日用品の買い物) が「買う」側なのに対して、
// ここは **迷う・比べる・条件を伝える・決める** の流れを言えるようにする分野。
export const D90_SELF: JaSentenceInput[] = [];

export const D90_ADD: JaSentenceInput[] = [
  { ja: "もう少し落ち着いた色がいいです。", en: "I'd like something in a calmer color.", ch: ["I'd like something", "in a calmer color"], scene: "外出", to: "店員", imp: "must" },
  { ja: "座り心地はどうですか。", en: "How does it feel to sit on?", ch: ["How does it feel", "to sit on?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "実際に座ってみてもいいですか。", en: "Can I try sitting on it?", ch: ["Can I try", "sitting on it?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "うちの部屋に入るか心配です。", en: "I'm worried it won't fit in our room.", ch: ["I'm worried", "it won't fit in our room"], scene: "外出", to: "家族", imp: "must" },
  { ja: "寸法を測ってから決めます。", en: "I'll measure the space before I decide.", ch: ["I'll measure the space", "before I decide"], scene: "外出", to: "家族", imp: "must" },
  { ja: "幅はどのくらいありますか。", en: "How wide is it?", ch: ["How wide", "is it?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "もう一軒見てから決めませんか。", en: "Why don't we look at one more store before deciding?", ch: ["Why don't we look at one more store", "before deciding?"], scene: "外出", to: "家族", imp: "must" },
  { ja: "これとこれで迷っています。", en: "I'm torn between these two.", ch: ["I'm torn", "between these two"], scene: "外出", to: "店員", imp: "must" },
  { ja: "決め手は何でしたか。", en: "What made you go with that one?", ch: ["What made you", "go with that one?"], scene: "会話", to: "友人", imp: "often" },
  { ja: "予算はこのくらいで考えています。", en: "This is about the budget I have in mind.", ch: ["This is about the budget", "I have in mind"], scene: "外出", to: "店員", imp: "must" },
  { ja: "少し予算を超えてしまいます。", en: "That's a little over my budget.", ch: ["That's a little", "over my budget"], scene: "外出", to: "店員", imp: "must" },
  { ja: "同じくらいの値段で他にありますか。", en: "Do you have anything else around the same price?", ch: ["Do you have anything else", "around the same price?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "色違いはありますか。", en: "Do you have it in a different color?", ch: ["Do you have it", "in a different color?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "配送はいつになりますか。", en: "When would it be delivered?", ch: ["When would it", "be delivered?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "組み立ては自分でやるのですか。", en: "Do I have to assemble it myself?", ch: ["Do I have to", "assemble it myself?"], scene: "外出", to: "店員", imp: "often" },
  { ja: "保証は何年つきますか。", en: "How many years of warranty does it come with?", ch: ["How many years of warranty", "does it come with?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "合わなかったら返品できますか。", en: "Can I return it if it doesn't work out?", ch: ["Can I return it", "if it doesn't work out?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "少し考えさせてもらえますか。", en: "Could I have a moment to think about it?", ch: ["Could I have a moment", "to think about it?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "今日は見るだけにしておきます。", en: "I'm just looking today.", ch: ["I'm just looking", "today"], scene: "外出", to: "店員", imp: "must" },
  { ja: "これは長く使えそうですね。", en: "This looks like it'll last a long time.", ch: ["This looks like", "it'll last a long time"], scene: "外出", to: "家族", imp: "often" },
  { ja: "見た目より軽いですね。", en: "It's lighter than it looks.", ch: ["It's lighter", "than it looks"], scene: "外出", to: "家族", imp: "often" },
  { ja: "思っていたより大きいですね。", en: "It's bigger than I expected.", ch: ["It's bigger", "than I expected"], scene: "外出", to: "家族", imp: "must" },
  { ja: "手触りがいいです。", en: "It feels nice to the touch.", ch: ["It feels nice", "to the touch"], scene: "外出", to: "家族", imp: "often" },
  { ja: "毎日使うものなので、少しいいものにします。", en: "I use it every day, so I'll go with a nicer one.", ch: ["I use it every day,", "so I'll go with a nicer one"], scene: "外出", to: "家族", imp: "must" },
  { ja: "安い方で十分だと思います。", en: "I think the cheaper one is good enough.", ch: ["I think the cheaper one", "is good enough"], scene: "外出", to: "家族", imp: "must" },
  { ja: "性能はどのくらい違いますか。", en: "How much difference is there in performance?", ch: ["How much difference is there", "in performance?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "そこまでの性能は要りません。", en: "I don't need that much power.", ch: ["I don't need", "that much power"], scene: "外出", to: "店員", imp: "must" },
  { ja: "動画を編集するので、少し余裕がほしいです。", en: "I edit videos, so I want a little extra power.", ch: ["I edit videos,", "so I want a little extra power"], scene: "外出", to: "店員", imp: "often" },
  { ja: "電池はどのくらい持ちますか。", en: "How long does the battery last?", ch: ["How long does", "the battery last?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "重さはどのくらいですか。", en: "How much does it weigh?", ch: ["How much", "does it weigh?"], scene: "外出", to: "店員", imp: "must" },
  { ja: "持ち歩くので、軽い方がいいです。", en: "I carry it around, so lighter is better.", ch: ["I carry it around,", "so lighter is better"], scene: "外出", to: "店員", imp: "must" },
  { ja: "画面はもう少し大きい方がいいかもしれません。", en: "I might want a slightly bigger screen.", ch: ["I might want", "a slightly bigger screen"], scene: "外出", to: "家族", imp: "often" },
  { ja: "今使っているものが古くなってきました。", en: "The one I'm using is getting old.", ch: ["The one I'm using", "is getting old"], scene: "会話", to: "友人", imp: "must" },
  { ja: "五年くらい使いました。", en: "I've used it for about five years.", ch: ["I've used it", "for about five years"], scene: "会話", to: "友人", imp: "must" },
  { ja: "そろそろ買い替えどきかもしれません。", en: "It might be about time to replace it.", ch: ["It might be about time", "to replace it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "これに決めます。", en: "I'll go with this one.", ch: ["I'll go with", "this one"], scene: "外出", to: "店員", imp: "must" },
  { ja: "やっぱりさっきの方がよかったかもしれません。", en: "Maybe the other one was better after all.", ch: ["Maybe the other one was better", "after all"], scene: "外出", to: "家族", imp: "often" },
  { ja: "買ってよかったです。", en: "I'm glad I got it.", ch: ["I'm glad", "I got it"], scene: "会話", to: "友人", imp: "must" },
  { ja: "迷いましたが、これにしてよかったです。", en: "I went back and forth, but I'm happy with this one.", ch: ["I went back and forth,", "but I'm happy with this one"], scene: "会話", to: "友人", imp: "often" },
  { ja: "使ってみないと分からない部分もあります。", en: "There are things you can't tell until you use it.", ch: ["There are things you can't tell", "until you use it"], scene: "会話", to: "友人", imp: "often" },
];
