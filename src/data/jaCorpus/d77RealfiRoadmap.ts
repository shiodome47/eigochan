import type { JaSentenceInput } from "./types";

// 分野 77: 開発ロードマップと監査
//
// 2026-07-24 の Office Hours (Engineering) で出た話題から起こした文。
// 進捗、公開時期、ブリッジ、記録をどこに残すか、監査、報奨金、SDK、ガバナンスなど。
export const D77_SELF: JaSentenceInput[] = [];

export const D77_ADD: JaSentenceInput[] = [
  { ja: "今はどこまでできているのですか。", en: "How far along are you right now?", ch: ["How far along", "are you right now?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "次に取りかかるのはどの部分ですか。", en: "Which part are you taking on next?", ch: ["Which part are you", "taking on next?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "公開の日程はもう決まっていますか。", en: "Has the launch date been set yet?", ch: ["Has the launch date", "been set yet?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "外に出せる段階になったら教えてください。", en: "Let me know once it's at a stage you can share.", ch: ["once it's at a stage", "you can share"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "その橋渡しの仕組みは、何のために作っているのですか。", en: "What are you building that bridge for?", ch: ["What are you building", "that bridge for?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "他のチェーンの利用者も、そのまま使えるのですね。", en: "So users on other chains can use it as it is.", ch: ["users on other chains", "can use it as it is"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "記録はこちら側に残る、という理解でいいですか。", en: "Am I right that the record stays on this side?", ch: ["Am I right that the record", "stays on this side?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "一回の署名でまとめて進むのは便利ですね。", en: "Getting it all through with one signature is handy.", ch: ["Getting it all through", "with one signature"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "監査はこれまでに何回受けているのですか。", en: "How many rounds of audits have you been through?", ch: ["How many rounds of audits", "have you been through?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "公開が近いほど慎重になっているのですね。", en: "So the closer it gets to launch, the more careful you're being.", ch: ["the closer it gets to launch,", "the more careful you're being"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "急がずに確認する姿勢は、聞いていて安心します。", en: "It's reassuring to hear you're checking rather than rushing.", ch: ["you're checking", "rather than rushing"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "見落としがないか、外の人にも見てもらうのですね。", en: "So you have people outside look for anything missed.", ch: ["people outside look for", "anything missed"], scene: "議論", to: "参加者", imp: "often" },
  { ja: "不具合を見つけた人に報いる仕組みは考えていますか。", en: "Are you thinking about a way to reward people who find bugs?", ch: ["a way to reward people", "who find bugs"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "良い事例を集めてくることなら、私にもできます。", en: "Gathering good examples is something I can do.", ch: ["Gathering good examples", "is something I can do"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "ソースコードは公開する予定ですか。", en: "Are you planning to open the source code?", ch: ["Are you planning to", "open the source code?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "開発者向けの道具が出たら試してみたいです。", en: "Once the developer tools are out, I'd like to try them.", ch: ["Once the developer tools are out,", "I'd like to try them"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "開発者が集まる場所はどこになりますか。", en: "Where will developers gather?", ch: ["Where will", "developers gather?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "投票の仕組みは、いつ頃の予定ですか。", en: "Roughly when is the voting side planned for?", ch: ["Roughly when is", "the voting side planned for?"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "決め方は、これから話し合っていくのですね。", en: "So how it gets decided is still to be discussed.", ch: ["how it gets decided", "is still to be discussed"], scene: "議論", to: "参加者", imp: "must" },
  { ja: "意見があれば送ってもいいですか。", en: "Is it okay to send you my thoughts on that?", ch: ["Is it okay to send you", "my thoughts on that?"], scene: "議論", to: "参加者", imp: "must" },
];
