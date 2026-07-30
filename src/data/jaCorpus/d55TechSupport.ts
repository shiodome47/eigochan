import type { JaSentenceInput } from "./types";

// 分野 55: 技術的な問題を相談する
export const D55_SELF: JaSentenceInput[] = [
  { ja: "まず、現在の状況を説明します。", en: "First, let me explain the current situation.", ch: ["First, let me explain", "the current situation"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "昨日までは、正常に動いていました。", en: "It was working normally up until yesterday.", ch: ["It was working normally", "up until yesterday"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "今日確認したところ、同期が止まっていました。", en: "When I checked today, syncing had stopped.", ch: ["When I checked today,", "syncing had stopped"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "ノード自体は起動しています。", en: "The node itself is running.", ch: ["The node itself", "is running"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "ただ、ブロックの高さが更新されていません。", en: "However, the block height isn't updating.", ch: ["the block height", "isn't updating"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "ログには、このようなエラーが出ています。", en: "This is the error showing in the logs.", ch: ["This is the error", "showing in the logs"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "このエラーが原因かどうかは、まだ分かりません。", en: "I don't know yet whether this error is the cause.", ch: ["I don't know yet whether", "this error is the cause"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "最近変更したのは、バージョンだけです。", en: "The only recent change was the version.", ch: ["The only recent change", "was the version"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "設定ファイルは変更していません。", en: "I haven't changed the config files.", ch: ["I haven't changed", "the config files"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "まず、どこを確認するべきでしょうか。", en: "Where should I look first?", ch: ["Where should I", "look first?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "再起動だけで直る可能性はありますか。", en: "Is there a chance a restart alone would fix it?", ch: ["Is there a chance", "a restart alone would fix it?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "データベースを削除する前に、ほかに試せることはありますか。", en: "Before I delete the database, is there anything else I can try?", ch: ["Before I delete the database,", "is there anything else to try?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "できれば、最初から同期し直すのは避けたいです。", en: "If possible, I'd like to avoid resyncing from scratch.", ch: ["I'd like to avoid", "resyncing from scratch"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "この状態でノードを動かし続けても大丈夫でしょうか。", en: "Is it okay to keep the node running in this state?", ch: ["Is it okay to keep the node", "running in this state?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "ブロック生成に影響する可能性はありますか。", en: "Could this affect block production?", ch: ["Could this affect", "block production?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "リレー側も同じ設定にする必要がありますか。", en: "Do the relays need the same configuration?", ch: ["Do the relays need", "the same configuration?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "このコマンドの結果は、正常に見えますか。", en: "Does the output of this command look normal to you?", ch: ["Does this output", "look normal to you?"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "私の理解では、接続自体はできています。", en: "As I understand it, the connection itself is fine.", ch: ["As I understand it,", "the connection itself is fine"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "ただ、なぜ処理が進まないのかが分かりません。", en: "I just don't understand why it isn't making progress.", ch: ["I don't understand why", "it isn't making progress"], scene: "相談", to: "SPO仲間", imp: "must" },
  { ja: "安全に確認できる手順を、一つずつ教えてください。", en: "Please walk me through safe steps to check, one at a time.", ch: ["walk me through safe steps", "one at a time"], scene: "相談", to: "SPO仲間", imp: "must" },
];
