import type { JaSentenceInput } from "./types";

// 分野 16: バス・タクシー
export const D16_SELF: JaSentenceInput[] = [
  { ja: "このバスで駅まで行けますか。", en: "Does this bus go to the station?", ch: ["Does this bus go to", "the station?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "どこから乗ればいいんでしょうか。", en: "Where should I get on?", ch: ["Where should I", "get on?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "次のバスは何時に来ますか。", en: "What time does the next bus come?", ch: ["What time does", "the next bus come?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "思っていたより本数が少ないですね。", en: "There are fewer buses than I expected.", ch: ["fewer ... than", "I expected"], scene: "バス", to: "家族", imp: "must" },
  { ja: "しばらく待たないといけないようです。", en: "It looks like we'll have to wait a while.", ch: ["It looks like we'll have to", "wait a while"], scene: "バス", to: "家族", imp: "must" },
  { ja: "タクシーを使った方が早いかもしれません。", en: "It might be faster to take a taxi.", ch: ["It might be faster to", "take a taxi"], scene: "バス", to: "家族", imp: "must" },
  { ja: "でも、ここからならそれほど遠くないですよね。", en: "But it's not that far from here, right?", ch: ["it's not that far", "from here, right?"], scene: "バス", to: "家族", imp: "must" },
  { ja: "このバスは先払いですか。", en: "Do you pay when you get on this bus?", ch: ["Do you pay", "when you get on?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "交通系のカードは使えますか。", en: "Can I use a transit card?", ch: ["Can I use", "a transit card?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "降りるときにボタンを押せばいいんですよね。", en: "I just press the button when I want to get off, right?", ch: ["I just press the button", "when I want to get off"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "次の停留所で降ります。", en: "I'm getting off at the next stop.", ch: ["I'm getting off", "at the next stop"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "ここで降りても大丈夫ですか。", en: "Is it okay to get off here?", ch: ["Is it okay to", "get off here?"], scene: "バス", to: "運転手", imp: "must" },
  { ja: "駅までお願いします。", en: "To the station, please.", ch: ["To ..., please."], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "できれば、こちらの道を通ってください。", en: "If you can, please take this road.", ch: ["If you can,", "please take this road"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "どのくらい時間がかかりそうですか。", en: "About how long will it take?", ch: ["About how long", "will it take?"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "道が少し混んでいますね。", en: "The traffic is a little heavy.", ch: ["The traffic", "is a little heavy"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "急いではいないので、大丈夫ですよ。", en: "I'm not in a hurry, so it's fine.", ch: ["I'm not in a hurry,", "so it's fine"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "この辺りで停めてもらえますか。", en: "Could you stop around here?", ch: ["Could you stop", "around here?"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "支払いはカードでも大丈夫ですか。", en: "Can I pay by card?", ch: ["Can I pay", "by card?"], scene: "タクシー", to: "運転手", imp: "must" },
  { ja: "ありがとうございました。助かりました。", en: "Thank you. That was a big help.", ch: ["Thank you.", "That was a big help"], scene: "タクシー", to: "運転手", imp: "must" },
];
