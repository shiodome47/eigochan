import type { JaSentenceInput } from "./types";

// 分野 78: 不具合を報告する・コールで質問する
//
// 2026-07-24 / 07-31 の Office Hours で出た話題から起こした文。
// 手を挙げて質問する、聞き取れなかったと言う、テストネットの不具合、
// 誤って止められたウォレット、日本のコミュニティからの報告など。
export const D78_SELF: JaSentenceInput[] = [];

export const D78_ADD: JaSentenceInput[] = [
  { ja: "一つ質問してもいいですか。", en: "Can I ask one question?", ch: ["Can I ask", "one question?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "短く一つだけ聞かせてください。", en: "Let me ask just one quick thing.", ch: ["Let me ask", "just one quick thing"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "聞き取れなかったので、もう一度お願いできますか。", en: "I didn't catch that, could you say it again?", ch: ["I didn't catch that,", "could you say it again?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "こちらの音が途切れてしまいました。", en: "My audio dropped out on this end.", ch: ["My audio dropped out", "on this end"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "パソコンに切り替えました。今は聞こえていますか。", en: "I switched to my laptop. Can you hear me now?", ch: ["I switched to my laptop.", "Can you hear me now?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "手を挙げていたのですが、気づいてもらえましたか。", en: "I had my hand up — did that come through?", ch: ["I had my hand up", "did that come through?"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "テストネットで問題が起きました。", en: "I ran into a problem on the testnet.", ch: ["I ran into a problem", "on the testnet"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "預けたらトークンが表示されなくなりました。", en: "After I staked, the tokens stopped showing up.", ch: ["After I staked,", "the tokens stopped showing up"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "解除しても戻ってきません。", en: "They don't come back even after I unstake.", ch: ["They don't come back", "even after I unstake"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "報告はしたのですが、まだ返事がありません。", en: "I did report it, but I haven't heard back yet.", ch: ["I did report it,", "but I haven't heard back yet"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "急ぎではないので、順番で大丈夫です。", en: "It's not urgent, so whenever you get to it is fine.", ch: ["It's not urgent,", "whenever you get to it is fine"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "私のウォレットが止められているのかもしれません。", en: "It might be that my wallet has been blocked.", ch: ["It might be that", "my wallet has been blocked"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "一度確認してもらえますか。", en: "Could you take a look at it?", ch: ["Could you take", "a look at it?"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "誤って止められた例もあると聞きました。", en: "I heard some were blocked by mistake.", ch: ["I heard some were", "blocked by mistake"], scene: "報告", to: "参加者", imp: "often" },
  { ja: "こういうときは、どこに報告すればいいですか。", en: "Where should I report something like this?", ch: ["Where should I report", "something like this?"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "同じことが起きている人が他にもいます。", en: "There are others running into the same thing.", ch: ["There are others running into", "the same thing"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "日本のコミュニティからも報告が来ています。", en: "Reports are coming in from the Japanese community too.", ch: ["Reports are coming in", "from the Japanese community"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "使ってみて気づいたことを、まとめておきます。", en: "I'll write up what I noticed while using it.", ch: ["I'll write up what I noticed", "while using it"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "感想のようなものでも役に立ちますか。", en: "Is it useful even if it's just impressions?", ch: ["Is it useful even if", "it's just impressions?"], scene: "報告", to: "参加者", imp: "must" },
  { ja: "続けて使って、また報告します。", en: "I'll keep using it and report back again.", ch: ["I'll keep using it", "and report back again"], scene: "報告", to: "参加者", imp: "must" },
];
