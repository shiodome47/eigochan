import type { JaDomain } from "./types";

// 89 分野 / 9 グループ。target = その分野で目標とする文数。
// 平均 40 文 × 89 分野 = 約 3,560 文。
export const JA_DOMAINS: JaDomain[] = [
  // ── 日常生活 ─────────────────────────────
  { id: 1, group: "日常生活", title: "朝起きてから出かけるまで", target: 40 },
  { id: 2, group: "日常生活", title: "家族との日常会話", target: 40 },
  { id: 3, group: "日常生活", title: "食事を決める", target: 40 },
  { id: 4, group: "日常生活", title: "料理と片付け", target: 40 },
  { id: 5, group: "日常生活", title: "相手の体調を気遣う", target: 40 },
  { id: 6, group: "日常生活", title: "掃除・洗濯・家事", target: 40 },
  { id: 7, group: "日常生活", title: "お風呂と寝る前", target: 40 },
  { id: 8, group: "日常生活", title: "物を探す・場所を確認する", target: 40 },
  { id: 9, group: "日常生活", title: "天気と服装", target: 40 },
  { id: 10, group: "日常生活", title: "予定を決める", target: 40 },

  // ── 外出 ─────────────────────────────────
  { id: 11, group: "外出", title: "車の中", target: 40 },
  { id: 12, group: "外出", title: "駐車場・ガソリンスタンド", target: 40 },
  { id: 13, group: "外出", title: "道を確認する", target: 40 },
  { id: 14, group: "外出", title: "駅のホーム", target: 40 },
  { id: 15, group: "外出", title: "電車の中", target: 40 },
  { id: 16, group: "外出", title: "バス・タクシー", target: 40 },
  { id: 17, group: "外出", title: "カフェ", target: 40 },
  { id: 18, group: "外出", title: "レストラン", target: 40 },
  { id: 19, group: "外出", title: "コンビニ", target: 40 },
  { id: 20, group: "外出", title: "スーパー", target: 40 },
  { id: 21, group: "外出", title: "洋服や日用品の買い物", target: 40 },
  { id: 22, group: "外出", title: "病院・薬局", target: 40 },
  { id: 23, group: "外出", title: "ホテル", target: 40 },
  { id: 24, group: "外出", title: "観光・旅行", target: 40 },

  // ── 人との会話 ───────────────────────────
  { id: 25, group: "人との会話", title: "初対面の人との会話", target: 40 },
  { id: 26, group: "人との会話", title: "友人との雑談", target: 40 },
  { id: 27, group: "人との会話", title: "相手に質問する", target: 40 },
  { id: 28, group: "人との会話", title: "自分の経験を話す", target: 40 },
  { id: 29, group: "人との会話", title: "相手に共感する", target: 40 },
  { id: 30, group: "人との会話", title: "驚く・喜ぶ・困る", target: 40 },
  { id: 31, group: "人との会話", title: "誘う・提案する", target: 40 },
  { id: 32, group: "人との会話", title: "断る・予定を変更する", target: 40 },
  { id: 33, group: "人との会話", title: "頼む・助けを求める", target: 40 },
  { id: 34, group: "人との会話", title: "謝る・感謝する", target: 40 },
  { id: 35, group: "人との会話", title: "意見が違うとき", target: 40 },
  { id: 36, group: "人との会話", title: "電話・メッセージ", target: 40 },

  // ── 学習・仕事 ───────────────────────────
  { id: 37, group: "学習・仕事", title: "英語学習について話す", target: 40 },
  { id: 38, group: "学習・仕事", title: "英語が分からないと伝える", target: 40 },
  { id: 39, group: "学習・仕事", title: "パソコン作業", target: 40 },
  { id: 40, group: "学習・仕事", title: "AI に依頼する", target: 40 },
  { id: 41, group: "学習・仕事", title: "オンライン会議", target: 40 },
  { id: 42, group: "学習・仕事", title: "進捗を説明する", target: 40 },
  { id: 43, group: "学習・仕事", title: "問題を報告する", target: 40 },
  { id: 44, group: "学習・仕事", title: "相手に確認する", target: 40 },
  { id: 45, group: "学習・仕事", title: "意見や提案を述べる", target: 40 },
  { id: 46, group: "学習・仕事", title: "技術を分かりやすく説明する", target: 40 },

  // ── 固有分野 (Cardano / SPO) ─────────────
  { id: 47, group: "固有分野", title: "Cardano の基本を説明する", target: 40 },
  { id: 48, group: "固有分野", title: "ステーキングを説明する", target: 40 },
  { id: 49, group: "固有分野", title: "SPO として話す", target: 40 },
  { id: 50, group: "固有分野", title: "ガバナンスについて話す", target: 40 },
  { id: 51, group: "固有分野", title: "暗号資産のリスクを話す", target: 40 },
  { id: 52, group: "固有分野", title: "RealFi について話す", target: 40 },
  { id: 53, group: "固有分野", title: "コミュニティ活動", target: 40 },
  { id: 54, group: "固有分野", title: "SNS 投稿について相談する", target: 40 },
  { id: 55, group: "固有分野", title: "技術的な問題を相談する", target: 40 },
  { id: 56, group: "固有分野", title: "将来の可能性を議論する", target: 40 },

  // ── 思考と言葉の癖 ───────────────────────
  { id: 57, group: "思考と言葉の癖", title: "理解を確認する", target: 40 },
  { id: 58, group: "思考と言葉の癖", title: "内容を言い換える", target: 40 },
  { id: 59, group: "思考と言葉の癖", title: "違和感を伝える", target: 40 },
  { id: 60, group: "思考と言葉の癖", title: "問題点を探す", target: 40 },
  { id: 61, group: "思考と言葉の癖", title: "前提を疑う", target: 40 },
  { id: 62, group: "思考と言葉の癖", title: "比較する", target: 40 },
  { id: 63, group: "思考と言葉の癖", title: "可能性を考える", target: 40 },
  { id: 64, group: "思考と言葉の癖", title: "慎重に意見を述べる", target: 40 },
  { id: 65, group: "思考と言葉の癖", title: "考えを修正する", target: 40 },
  { id: 66, group: "思考と言葉の癖", title: "もう少し詳しく聞く", target: 40 },

  // ── RealFi (週一回のコールで実際に使う言い方) ─────────
  // 固有分野 47〜56 が「Cardano を説明する」側なのに対して、
  // ここは **コールに出て話す** ための分野。今日の練習で範囲を絞れる。
  { id: 67, group: "RealFi", title: "コールに入る・近況を話す", target: 40 },
  { id: 68, group: "RealFi", title: "自分の進捗を報告する", target: 40 },
  { id: 69, group: "RealFi", title: "相手の報告に反応する", target: 40 },
  { id: 70, group: "RealFi", title: "現場と数字の話", target: 40 },
  { id: 71, group: "RealFi", title: "資金・提案・パートナー", target: 40 },
  { id: 72, group: "RealFi", title: "決めごとと次の一歩", target: 40 },

  // ── RealFi (Office Hours の中身の話) ─────────
  // 67〜72 が「コールの進行」なのに対して、ここは **実際に出た話題**。
  // 週一回の文字起こしを読んで足していく。
  { id: 73, group: "RealFi", title: "テストネットの数字を読む", target: 40 },
  { id: 74, group: "RealFi", title: "SPO 加速プログラムと委任", target: 40 },
  { id: 75, group: "RealFi", title: "ステーブルコインと利回り", target: 40 },
  { id: 76, group: "RealFi", title: "流動性と DeFi 連携", target: 40 },
  { id: 77, group: "RealFi", title: "開発ロードマップと監査", target: 40 },
  { id: 78, group: "RealFi", title: "不具合を報告する・質問する", target: 40 },

  // ── 英会話の型 ───────────────────────────
  // 型 (枠) を覚えて中身を差し替えるための分野。各文が pat に型を持つ。
  { id: 79, group: "英会話の型", title: "相手に確認する型", target: 40 },
  { id: 80, group: "英会話の型", title: "考えと確信を言う型", target: 40 },
  { id: 81, group: "英会話の型", title: "意志と予定を言う型", target: 40 },
  { id: 82, group: "英会話の型", title: "気持ちと好みを言う型", target: 40 },
  { id: 83, group: "英会話の型", title: "状況を説明する型", target: 40 },
  { id: 84, group: "英会話の型", title: "詳しく尋ねる型", target: 40 },
  { id: 85, group: "英会話の型", title: "頼む・すすめる・止める型", target: 40 },
  { id: 86, group: "英会話の型", title: "経験・好み・伝える型", target: 40 },

  // ── チャンク (組み合わせの部品) ─────────────
  // 言い出し × 動詞 × 補足 を組み合わせて文を作れるようにするための分野。
  // 既存の分野に無かったチャンクだけを入れてある。
  { id: 87, group: "チャンク", title: "動詞チャンク (日常の動き)", target: 40 },
  { id: 88, group: "チャンク", title: "動詞チャンク (仕事とやりとり)", target: 40 },
  { id: 89, group: "チャンク", title: "言い出しと補足のチャンク", target: 40 },
];

export const JA_DOMAIN_GROUPS: string[] = Array.from(
  new Set(JA_DOMAINS.map((d) => d.group)),
);
