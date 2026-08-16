// 組み合わせ練習の部品。
//
// **言い出し × 動詞 × 補足** を 1 つずつ引いて、その 3 つで文を作る練習に使う。
// 決まった文を思い出す「今日の練習」とは頭の使い方が違い、
// 部品から自分で組み立てる方の練習。正解の英文は持たない
// (組み合わせ次第でいくらでも作れるので、答え合わせは自分でする)。

export interface Chunk {
  /** 英語の部品。 */
  en: string;
  /** 日本語の意味。 */
  ja: string;
}

/** 文のあたま。「誰が / どうしたい」を決める。 */
export const OPENERS: Chunk[] = [
  { en: "I wanna", ja: "〜したい" },
  { en: "I'd like to", ja: "〜したいのですが (丁寧)" },
  { en: "I'm gonna", ja: "〜するつもり" },
  { en: "I have to", ja: "〜しないといけない" },
  { en: "I'm trying to", ja: "〜しようとしている" },
  { en: "I'm thinking about", ja: "〜しようか考えている" },
  { en: "I'm planning to", ja: "〜する予定" },
  { en: "I used to", ja: "昔は〜していた" },
  { en: "I need to", ja: "〜する必要がある" },
  { en: "I'm looking for", ja: "〜を探している" },
  { en: "You seem to", ja: "〜のように見える" },
  { en: "I'm about to", ja: "今まさに〜するところ" },
  { en: "Can I", ja: "〜してもいい?" },
  { en: "Will you", ja: "〜してくれる?" },
  { en: "Could you", ja: "〜していただけますか" },
  { en: "Do you want to", ja: "〜したい?" },
  { en: "Do you have to", ja: "〜しないといけないの?" },
  { en: "Do you know how to", ja: "〜のやり方、分かる?" },
  { en: "Do you need to", ja: "〜する必要ある?" },
  { en: "Is it fine if I", ja: "〜しても大丈夫?" },
  { en: "Are you gonna", ja: "〜する予定?" },
  { en: "Are you trying to", ja: "〜しようとしてる?" },
  { en: "Let me", ja: "〜させてください" },
  { en: "Why don't we", ja: "一緒に〜しない?" },
  { en: "Why don't you", ja: "〜したらどう?" },
  { en: "How about", ja: "〜はどう?" },
  { en: "What about", ja: "〜はどう? (別案)" },
  { en: "We might as well", ja: "どうせなら〜しよう" },
  { en: "Sorry to", ja: "〜してすみません" },
  { en: "It might be better to", ja: "〜した方がよさそう" },
  { en: "I feel like", ja: "〜な気がする / 〜したい気分" },
  { en: "I'm sure", ja: "きっと〜" },
  { en: "I'm not sure", ja: "〜かどうか分からない" },
  { en: "What do you", ja: "何を〜する?" },
  { en: "What can I", ja: "私は何が〜できる?" },
  { en: "How can I", ja: "どうすれば〜できる?" },
  { en: "Where can I", ja: "どこで〜できる?" },
  { en: "Should I", ja: "〜すべき?" },
  { en: "What should I", ja: "何を〜すべき?" },
  { en: "How come", ja: "どうして〜?" },
];

/** 真ん中。「どうする」を決める。 */
export const VERBS: Chunk[] = [
  { en: "get up", ja: "起きる" },
  { en: "go to bed", ja: "寝る" },
  { en: "take a shower", ja: "シャワーを浴びる" },
  { en: "get dressed", ja: "着替える" },
  { en: "have breakfast", ja: "朝ごはんを食べる" },
  { en: "leave home", ja: "家を出る" },
  { en: "get home", ja: "家に着く" },
  { en: "take a break", ja: "休憩する" },
  { en: "spend time with", ja: "〜と過ごす" },
  { en: "have fun", ja: "楽しむ" },
  { en: "hang out with", ja: "〜と遊ぶ" },
  { en: "make a reservation", ja: "予約する" },
  { en: "get there", ja: "そこに着く" },
  { en: "make sense", ja: "筋が通る / 腑に落ちる" },
  { en: "figure it out", ja: "分かる / 解決する" },
  { en: "run out of", ja: "〜が足りなくなる" },
  { en: "look after", ja: "面倒を見る" },
  { en: "get ready", ja: "準備する" },
  { en: "hold on", ja: "ちょっと待つ" },
  { en: "show up", ja: "現れる / 来る" },
  { en: "turn on", ja: "つける" },
  { en: "turn off", ja: "消す" },
  { en: "look it up", ja: "調べる" },
  { en: "look forward to", ja: "楽しみにする" },
  { en: "come over", ja: "家に来る" },
  { en: "come across", ja: "偶然見つける" },
  { en: "come up with", ja: "思いつく" },
  { en: "get over", ja: "乗り越える / 治る" },
  { en: "get used to", ja: "慣れる" },
  { en: "get in touch", ja: "連絡を取る" },
  { en: "get the point", ja: "言いたいことが分かる" },
  { en: "take notes", ja: "メモを取る" },
  { en: "take turns", ja: "交代でやる" },
  { en: "take place", ja: "行われる" },
  { en: "take advantage of", ja: "うまく使う" },
  { en: "take it easy", ja: "気楽にやる" },
  { en: "make a decision", ja: "決める" },
  { en: "make a difference", ja: "違いを生む" },
  { en: "make it work", ja: "何とかうまくやる" },
  { en: "do my best", ja: "できるかぎりやる" },
  { en: "do me a favor", ja: "お願いを聞く" },
  { en: "have a point", ja: "一理ある" },
  { en: "have trouble", ja: "苦労する" },
  { en: "have no idea", ja: "全く分からない" },
  { en: "have a good time", ja: "楽しい時間を過ごす" },
  { en: "keep in touch", ja: "連絡を取り続ける" },
  { en: "put off", ja: "先延ばしにする" },
  { en: "put up with", ja: "我慢する" },
  { en: "pick up", ja: "拾う / 迎えに行く" },
  { en: "find out", ja: "分かる / 判明する" },
  { en: "point out", ja: "指摘する" },
  { en: "pay attention", ja: "注意を向ける" },
  { en: "waste time", ja: "時間を無駄にする" },
  { en: "call it a day", ja: "切り上げる" },
  { en: "check in", ja: "チェックインする" },
  { en: "drop by", ja: "立ち寄る" },
  { en: "keep at it", ja: "続ける" },
  { en: "head out", ja: "出かける" },
  { en: "give it a try", ja: "試してみる" },
  { en: "sort it out", ja: "片づける / 解決する" },
];

/** うしろに足す一言。「いつ / どこで / どんなふうに」。 */
export const EXTRAS: Chunk[] = [
  { en: "right now", ja: "今すぐ" },
  { en: "these days", ja: "最近" },
  { en: "at that time", ja: "その時" },
  { en: "the other day", ja: "この前" },
  { en: "last night", ja: "昨夜" },
  { en: "tomorrow morning", ja: "明日の朝" },
  { en: "next week", ja: "来週" },
  { en: "in the morning", ja: "朝に" },
  { en: "around noon", ja: "お昼ごろ" },
  { en: "on my way", ja: "向かう途中で" },
  { en: "at home", ja: "家で" },
  { en: "at work", ja: "職場で" },
  { en: "around here", ja: "この辺で" },
  { en: "over there", ja: "あそこで" },
  { en: "right here", ja: "ちょうどここで" },
  { en: "next to me", ja: "私の隣に" },
  { en: "by myself", ja: "一人で" },
  { en: "with my family", ja: "家族と" },
  { en: "without me", ja: "私抜きで" },
  { en: "in a hurry", ja: "急いで" },
  { en: "in trouble", ja: "困った状態で" },
  { en: "in public", ja: "人前で" },
  { en: "in private", ja: "二人だけで" },
  { en: "by accident", ja: "うっかり / 偶然" },
  { en: "for some reason", ja: "なぜか" },
  { en: "thanks to you", ja: "あなたのおかげで" },
  { en: "in this situation", ja: "この状況では" },
  { en: "before it gets dark", ja: "暗くなる前に" },
  { en: "after the call", ja: "コールのあとで" },
  { en: "just in case", ja: "念のため" },
];

export interface ChunkSet {
  opener: Chunk;
  verb: Chunk;
  extra: Chunk;
}

/** 組み合わせの総数。「これだけ作れる」を画面に出すため。 */
export const COMBINATION_COUNT = OPENERS.length * VERBS.length * EXTRAS.length;

function pick<T>(list: T[], exclude?: T): T {
  if (list.length <= 1) return list[0];
  let next = list[Math.floor(Math.random() * list.length)];
  // 続けて同じ部品が出ると練習にならないので引き直す。
  if (exclude !== undefined && next === exclude) {
    next = list[(list.indexOf(next) + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length];
  }
  return next;
}

/** 3 つの部品を引く。前回と同じ部品はなるべく避ける。 */
export function drawChunks(prev?: ChunkSet): ChunkSet {
  return {
    opener: pick(OPENERS, prev?.opener),
    verb: pick(VERBS, prev?.verb),
    extra: pick(EXTRAS, prev?.extra),
  };
}
