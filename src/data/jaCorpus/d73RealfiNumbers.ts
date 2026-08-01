import type { JaSentenceInput } from "./types";

// 分野 73: テストネットの数字を読む
//
// 2026-07-31 の Office Hours (Data & Insights) で出た話題から起こした文。
// アクティブウォレット、ファーミング除外、エポック、累計、TVL、出典の確認など。
export const D73_SELF: JaSentenceInput[] = [];

export const D73_ADD: JaSentenceInput[] = [
  { ja: "それはテストネットのウォレットの数ですか。", en: "Is that the number of testnet wallets?", ch: ["Is that the number of", "testnet wallets?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "メインネットのウォレットとは分けて考えた方がいいですね。", en: "We should keep those separate from mainnet wallets.", ch: ["We should keep those separate", "from mainnet wallets"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "七つに一つというのは、かなり大きい数字だと思います。", en: "One in seven sounds like a big share to me.", ch: ["One in seven", "sounds like a big share"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "その割合はどうやって出したのですか。", en: "How did you work out that ratio?", ch: ["How did you work out", "that ratio?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "計算の方法をあとで共有してもらえますか。", en: "Could you share the methodology afterwards?", ch: ["Could you share", "the methodology afterwards?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "数字を稼ぐためだけのウォレットは除いてありますか。", en: "Are farming wallets excluded from this?", ch: ["Are farming wallets", "excluded from this?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "除いたあとの数字だと聞いて安心しました。", en: "It's reassuring to hear that's after excluding them.", ch: ["It's reassuring to hear", "that's after excluding them"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "これは累計の数字ですか、その期間だけの数字ですか。", en: "Is this cumulative, or just for that period?", ch: ["Is this cumulative,", "or just for that period?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "直近のエポックだけで見るとどうなりますか。", en: "What does it look like for the latest epoch alone?", ch: ["What does it look like", "for the latest epoch alone?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "まだ伸びが止まっていないのが良いですね。", en: "It's good that the growth hasn't flattened out yet.", ch: ["the growth hasn't", "flattened out yet"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "増えた時期がプログラムの開始と重なっていますね。", en: "The increase lines up with the launch of the program.", ch: ["The increase lines up with", "the launch of the program"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "そこに因果関係があるかどうかは、まだ分かりませんね。", en: "We can't tell yet whether one actually caused the other.", ch: ["whether one actually", "caused the other"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "この数字は外に出しても大丈夫ですか。", en: "Is this number okay to take outside?", ch: ["Is this number okay", "to take outside?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "日本語で紹介したいので、元の資料をいただけますか。", en: "I'd like to write it up in Japanese, so could I have the source?", ch: ["I'd like to write it up in Japanese,", "could I have the source?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "見出しになりそうな数字ですね。", en: "That number could make a good headline.", ch: ["That number could make", "a good headline"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "数字だけが独り歩きしないように書きたいです。", en: "I want to write it so the number isn't taken out of context.", ch: ["so the number isn't", "taken out of context"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "私たちはどの数字を追いかけるべきだと思いますか。", en: "Which numbers do you think we should be watching?", ch: ["Which numbers do you think", "we should be watching?"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "ウォレットの数より、使い続けている人の数を知りたいです。", en: "More than the number of wallets, I want to know how many keep using it.", ch: ["More than the number of wallets,", "how many keep using it"], scene: "コール", to: "参加者", imp: "must" },
  { ja: "次はどの数字を出す予定ですか。", en: "Which numbers are you planning to show next time?", ch: ["Which numbers are you planning", "to show next time?"], scene: "コール", to: "参加者", imp: "often" },
  { ja: "数字が出ると、話がぐっと具体的になりますね。", en: "Once there are numbers, the conversation gets much more concrete.", ch: ["Once there are numbers,", "the conversation gets concrete"], scene: "コール", to: "参加者", imp: "often" },
];
