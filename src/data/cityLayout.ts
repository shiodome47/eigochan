// 街の見た目は背景画像 (public/city/city-map-base.png) に任せる。
// このモジュールは「画像のどこに何の施設があるか」だけを管理する。
// 座標はすべて画像幅・高さに対するパーセント (0〜100)。
// あとから微調整しやすいよう、施設の overlay 定義は1か所にまとめている。

import type { PhraseCategory, PhraseMood } from "../types";

export type FacilityId =
  | "house"
  | "lamp"
  | "tree"
  | "cafe"
  | "bench"
  | "park"
  | "library"
  | "station"
  | "balloon"
  | "stars";

export interface FacilityOverlay {
  id: FacilityId;
  label: string;
  unlockLevel: number;
  /** 画像幅に対する % (0〜100、施設の中心)。 */
  x: number;
  /** 画像高さに対する % (0〜100、施設の中心)。 */
  y: number;
  /** タップ判定の幅 (% of image width)。デフォルト 18。 */
  hitWidth?: number;
  /** タップ判定の高さ (% of image height)。デフォルト 18。 */
  hitHeight?: number;
  /** ラベル・吹き出しの出現方向。 */
  bubbleDirection?: "top" | "bottom";
  /** 背景画像にこの施設が描かれていないので、装飾オーバーレイで足す。 */
  decorative?: boolean;
}

export const CITY_MAP_IMAGE = "/city/city-map-base.png";
/** WebP 版(対応ブラウザでは優先して読み込まれる)。 */
export const CITY_MAP_IMAGE_WEBP = "/city/city-map-base.webp";

// 背景画像のアスペクト比 (= 元画像の width / height)
export const CITY_IMAGE_ASPECT = "1448 / 1086";

/**
 * 画像内の施設位置(目視で配置)。
 * 値はあくまで初期値で、実機で違和感があれば 1 か所のここだけ調整すれば OK。
 *
 * tree と bench は背景画像にすでに無数に描かれているので
 * overlay の対象にせず、内部データのみ(unlockedFacilities では引き続き返る)。
 */
export const FACILITY_OVERLAYS: FacilityOverlay[] = [
  {
    id: "house",
    label: "家",
    unlockLevel: 1,
    x: 16,
    y: 73,
    hitWidth: 22,
    hitHeight: 24,
    bubbleDirection: "top",
  },
  {
    id: "lamp",
    label: "街灯",
    unlockLevel: 2,
    x: 33,
    y: 53,
    hitWidth: 8,
    hitHeight: 16,
    bubbleDirection: "top",
  },
  {
    id: "cafe",
    label: "カフェ",
    unlockLevel: 3,
    x: 18,
    y: 48,
    hitWidth: 22,
    hitHeight: 24,
    bubbleDirection: "top",
  },
  {
    id: "park",
    label: "公園",
    unlockLevel: 4,
    x: 60,
    y: 75,
    hitWidth: 22,
    hitHeight: 20,
    bubbleDirection: "top",
  },
  {
    id: "library",
    label: "図書館",
    unlockLevel: 5,
    x: 50,
    y: 22,
    hitWidth: 24,
    hitHeight: 24,
    bubbleDirection: "bottom",
  },
  {
    id: "station",
    label: "駅",
    unlockLevel: 6,
    x: 76,
    y: 28,
    hitWidth: 24,
    hitHeight: 22,
    bubbleDirection: "bottom",
  },
  {
    id: "balloon",
    label: "気球",
    unlockLevel: 7,
    x: 90,
    y: 13,
    hitWidth: 14,
    hitHeight: 20,
    bubbleDirection: "bottom",
    decorative: true,
  },
  {
    id: "stars",
    label: "夜空のあかり",
    unlockLevel: 7,
    x: 12,
    y: 11,
    hitWidth: 16,
    hitHeight: 12,
    bubbleDirection: "bottom",
    decorative: true,
  },
];

export function findFacilityOverlay(id: string): FacilityOverlay | undefined {
  return FACILITY_OVERLAYS.find((o) => o.id === id);
}

/**
 * 施設タップ時の英語フレーズ抽選で「優先したい雰囲気」を表す。
 * カテゴリかムードのいずれかにマッチすれば候補(OR 条件)。
 * 一致候補が0件のときは全フレーズからフォールバック。
 */
export interface FacilityPhrasePreferences {
  categories?: PhraseCategory[];
  moods?: PhraseMood[];
}

export const FACILITY_PHRASE_PREFERENCES: Partial<Record<FacilityId, FacilityPhrasePreferences>> = {
  house: { categories: ["daily", "feeling"] },
  cafe: { categories: ["daily", "conversation"] },
  park: { categories: ["feeling"], moods: ["casual", "warm"] },
  library: { categories: ["learning"] },
  station: { categories: ["travel"] },
  balloon: { categories: ["conversation", "feeling"] },
  stars: { categories: ["learning", "feeling"] },
  lamp: { categories: ["daily"] },
  // tree / bench は overlay 対象外なのでここでは未指定
};
