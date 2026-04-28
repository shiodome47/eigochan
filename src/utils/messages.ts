// やさしい応援メッセージ群。
// AI を使わずに「mistake-friendly」な雰囲気を出すための文言ライブラリ。

const CITY_GROWTH_MESSAGES: readonly string[] = [
  "街に新しい灯りがともりました",
  "小さな道が、少しにぎやかになりました",
  "今日の声が、街のエネルギーになりました",
  "Your city is growing!",
  "あたらしい風が、街に吹きました",
  "今日も街が、あなたの声を覚えました",
  "街角のカフェで、誰かが英語を聞いていました",
];

const HOME_TAGLINES: readonly string[] = [
  "今日も1フレーズだけ声に出そう",
  "3分だけでOK",
  "完璧より、続けること",
  "今日の声が、街を育てます",
  "短くても、声に出せたら勝ち",
];

interface StreakBucket {
  min: number;
  text: string;
}

const STREAK_MESSAGES: readonly StreakBucket[] = [
  { min: 30, text: "30日以上の習慣。あなたの英語の土台になっています。" },
  { min: 14, text: "2週間以上、続いています。すごいことです。" },
  { min: 7, text: "1週間以上、続けられています。" },
  { min: 3, text: "ここまで続いています。少しずつでOK。" },
  { min: 2, text: "昨日から続いています。今日もここで会えてうれしい。" },
  { min: 1, text: "今日も声に出せましたね。" },
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function pickCityGrowthMessage(seed: string): string {
  const h = hashSeed(seed);
  return CITY_GROWTH_MESSAGES[h % CITY_GROWTH_MESSAGES.length];
}

export function pickHomeTagline(seed: string): string {
  const h = hashSeed(seed);
  return HOME_TAGLINES[h % HOME_TAGLINES.length];
}

export function getStreakEncouragement(streak: number): string {
  for (const bucket of STREAK_MESSAGES) {
    if (streak >= bucket.min) return bucket.text;
  }
  return "今日が、最初の一歩です。";
}

export function getCompletionHeadline(streak: number): string {
  if (streak >= 7) return "今日も、続いています。";
  if (streak >= 2) return "今日も、声に出せました。";
  return "今日の練習、完了！";
}
