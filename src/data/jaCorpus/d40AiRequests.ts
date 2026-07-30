import type { JaSentenceInput } from "./types";

// 分野 40: AI に依頼する
export const D40_SELF: JaSentenceInput[] = [
  { ja: "以下の内容を、分かりやすい日本語にしてください。", en: "Please put the following into clear Japanese.", ch: ["Please put the following", "into clear Japanese"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "できるだけ原文の意味を変えずに訳してください。", en: "Please translate it without changing the original meaning as much as possible.", ch: ["without changing", "the original meaning"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "日本語の部分だけを抜き出してください。", en: "Please pull out only the Japanese parts.", ch: ["Please pull out", "only the Japanese parts"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "読みやすい形に整えて、このチャット欄に表示してください。", en: "Please format it to be readable and show it here in the chat.", ch: ["format it to be readable", "and show it here"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "専門用語を減らして、初心者にも分かるように説明してください。", en: "Please cut down the jargon and explain it so a beginner can follow.", ch: ["cut down the jargon", "so a beginner can follow"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "まず結論を短く教えてください。", en: "Please give me the conclusion briefly first.", ch: ["give me the conclusion", "briefly first"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "そのあとに、理由を詳しく説明してください。", en: "After that, please explain the reasons in detail.", ch: ["After that,", "explain the reasons in detail"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "この文章を、英語学習者向けに分解して解説してください。", en: "Please break this text down and explain it for an English learner.", ch: ["break this down", "for an English learner"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "特に後半の部分を詳しくお願いします。", en: "Please go into detail on the second half in particular.", ch: ["go into detail on", "the second half"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "文を短いチャンクに区切ってください。", en: "Please split the sentence into short chunks.", ch: ["split the sentence", "into short chunks"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "重要な表現だけを取り出してください。", en: "Please extract just the important expressions.", ch: ["extract just", "the important expressions"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "この表現がよく使われるものなのか教えてください。", en: "Please tell me whether this expression is commonly used.", ch: ["tell me whether", "this is commonly used"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "私がそのまま使える例文も作ってください。", en: "Please also make example sentences I can use as they are.", ch: ["example sentences", "I can use as they are"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "もう少し私が普段使う言葉に近づけてください。", en: "Please bring it closer to the words I normally use.", ch: ["bring it closer to", "the words I normally use"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "違う人が書いたような文章にしてください。", en: "Please make it read as if a different person wrote it.", ch: ["make it read as if", "a different person wrote it"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "少し短くしてもらえますか。", en: "Could you make it a bit shorter?", ch: ["Could you make it", "a bit shorter?"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "文字を少なめにして、図解向けにしてください。", en: "Please use fewer words and make it suitable for a diagram.", ch: ["use fewer words", "suitable for a diagram"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "明るくて分かりやすい印象にしてください。", en: "Please give it a bright, easy-to-understand feel.", ch: ["give it a bright,", "easy-to-understand feel"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "私の理解が間違っていないか確認してください。", en: "Please check whether my understanding is wrong anywhere.", ch: ["check whether", "my understanding is wrong"], scene: "仕事", to: "AI", imp: "must" },
  { ja: "できれば、問題になりそうな点も補足してください。", en: "If you can, please add any points that could become problems.", ch: ["please add any points", "that could become problems"], scene: "仕事", to: "AI", imp: "must" },
];
