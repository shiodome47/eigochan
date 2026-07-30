import type { JaSentenceInput } from "./types";

// 分野 21: 洋服や日用品の買い物
export const D21_SELF: JaSentenceInput[] = [
  { ja: "何か探しているものはありますか。", en: "Are you looking for anything in particular?", ch: ["Are you looking for", "anything in particular?"], scene: "店", to: "家族", imp: "must" },
  { ja: "とりあえず、見てみるだけです。", en: "I'm just looking for now.", ch: ["I'm just looking", "for now"], scene: "店", to: "店員", imp: "must" },
  { ja: "これは少し派手すぎる気がします。", en: "This feels a little too flashy.", ch: ["This feels", "a little too flashy"], scene: "店", to: "家族", imp: "must" },
  { ja: "こちらの方が合わせやすそうです。", en: "This one looks easier to match.", ch: ["This one looks", "easier to match"], scene: "店", to: "家族", imp: "must" },
  { ja: "思っていたより色が明るいですね。", en: "The color is brighter than I expected.", ch: ["brighter than", "I expected"], scene: "店", to: "家族", imp: "must" },
  { ja: "別の色もありますか。", en: "Do you have it in other colors?", ch: ["Do you have it", "in other colors?"], scene: "店", to: "店員", imp: "must" },
  { ja: "もう少し大きいサイズはありますか。", en: "Do you have this in a bigger size?", ch: ["Do you have this", "in a bigger size?"], scene: "店", to: "店員", imp: "must" },
  { ja: "試着しても大丈夫ですか。", en: "May I try it on?", ch: ["May I", "try it on?"], scene: "店", to: "店員", imp: "must" },
  { ja: "着てみると、少し印象が違いますね。", en: "It looks a bit different once you put it on.", ch: ["It looks a bit different", "once you put it on"], scene: "店", to: "家族", imp: "must" },
  { ja: "サイズはちょうどよさそうです。", en: "The size seems just right.", ch: ["The size seems", "just right"], scene: "店", to: "家族", imp: "must" },
  { ja: "でも、少し動きにくい気がします。", en: "But it feels a little hard to move in.", ch: ["it feels a little", "hard to move in"], scene: "店", to: "家族", imp: "must" },
  { ja: "この値段なら、悪くないんじゃないですか。", en: "At this price, it's not bad, is it?", ch: ["At this price,", "it's not bad, is it?"], scene: "店", to: "家族", imp: "must" },
  { ja: "もう少し考えてから決めます。", en: "I'll think about it a little more before deciding.", ch: ["I'll think about it", "a little more"], scene: "店", to: "店員", imp: "must" },
  { ja: "今すぐ必要というわけではないですよね。", en: "It's not like we need it right now, is it?", ch: ["It's not like we need it", "right now"], scene: "店", to: "家族", imp: "must" },
  { ja: "家に似たようなものがあった気がします。", en: "I feel like we have something similar at home.", ch: ["I feel like we have", "something similar"], scene: "店", to: "家族", imp: "must" },
  { ja: "本当に使うかどうか考えた方がいいですね。", en: "We should think about whether we'd actually use it.", ch: ["think about whether", "we'd actually use it"], scene: "店", to: "家族", imp: "must" },
  { ja: "これなら長く使えそうです。", en: "This looks like it would last a long time.", ch: ["This looks like it would", "last a long time"], scene: "店", to: "家族", imp: "must" },
  { ja: "せっかくなので、こちらにしましょう。", en: "Since we're here, let's go with this one.", ch: ["Since we're here,", "let's go with this one"], scene: "店", to: "家族", imp: "must" },
  { ja: "袋はなくても大丈夫です。", en: "I don't need a bag.", ch: ["I don't need", "a bag"], scene: "店", to: "店員", imp: "must" },
  { ja: "良いものが見つかってよかったですね。", en: "I'm glad we found something good.", ch: ["I'm glad we found", "something good"], scene: "店", to: "家族", imp: "must" },
];
