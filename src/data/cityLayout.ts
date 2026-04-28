// 街の見た目は背景画像 (public/city/city-map-base.png) に任せる。
// このモジュールは「画像のどこに何の施設があるか」だけを管理する。
// 座標はすべて画像幅・高さに対するパーセント (0〜100)。
// あとから微調整しやすいよう、施設の overlay 定義は1か所にまとめている。

import type { PhraseCategory, PhraseMood } from "../types";
import type { CityStage } from "./cityAssets";

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

/**
 * stage 別に施設座標を上書きするための部分プロパティ。
 * id / label / unlockLevel / decorative は意味的に固定なので上書き不可。
 * x / y / hitWidth / hitHeight / bubbleDirection だけを stage 別に微調整できる。
 */
export type StageOverlayOverride = Partial<
  Pick<FacilityOverlay, "x" | "y" | "hitWidth" | "hitHeight" | "bubbleDirection">
>;

export type StageOverlayOverrides = Partial<Record<FacilityId, StageOverlayOverride>>;

/**
 * stage ごとの座標上書き。base = FACILITY_OVERLAYS(画像C / stage4 を想定して調整済み)。
 * 必要な施設だけ部分上書きできる(全施設を再列挙する必要はない)。
 *
 * 現状はすべて空 = 全 stage で base 値をそのまま使う。
 * 実機スクショを見て「明らかにズレる」と感じた施設だけここに足していく。
 *
 * --- 調整するときの目安 ---
 *
 * 1) base の値は画像C(stage4)前提でチューン済みなので、
 *    画像A(stage1)/画像B(stage2 & stage3)では建物の位置が違う
 *    施設だけ補正が必要。
 *
 * 2) 主に調整対象になりそうな施設(画像によって位置が動くもの):
 *    - house    : 画像A/Bで少し左上にいる傾向
 *    - cafe     : 画像Bでテラス込みの位置がやや上
 *    - park     : 遊具(滑り台)の位置が画像B/Cで微妙に違う
 *    - library  : 画像A/Bには建物が無い → 看板を空き地中央に
 *    - station  : 同上、画像A/B では空き地+将来の駅予定地
 *    - lamp     : 画像によって街灯ポストの位置が散らばる
 *
 * 3) 上書きできるのは座標系プロパティのみ。
 *    label / unlockLevel / decorative などの意味は固定。
 *
 * 例(現状はコメントアウト。実機を見ながら値を入れていく):
 *
 *   stage1: {
 *     library: { x: 50, y: 30 },     // 画像Aでは未来の図書館予定地に近づける
 *     station: { x: 74, y: 33 },     // 画像Aでは駅予定地が少し下
 *     cafe:    { x: 20, y: 42 },     // 画像Aではカフェ未建設、未来位置に寄せる
 *   },
 *   stage2: {
 *     cafe:    { x: 18, y: 40 },     // 画像Bのカフェ屋根は base よりやや上
 *     park:    { x: 58, y: 70 },     // 遊具の中心に寄せる
 *   },
 *   stage3: {
 *     library: { x: 50, y: 28 },     // stage3 は画像B再利用なので空き地に寄せる
 *   },
 *   stage4: {
 *     // 画像C は base のチューン対象。基本そのままで良い。
 *   },
 */
export const STAGE_OVERLAY_OVERRIDES: Partial<Record<CityStage, StageOverlayOverrides>> = {
  // stage1: { ... },
  // stage2: { ... },
  // stage3: { ... },
  // stage4: { ... },
};

/** stage に応じて base + override をマージした overlay 配列を返す。 */
export function getFacilityOverlays(stage: CityStage): FacilityOverlay[] {
  const overrides = STAGE_OVERLAY_OVERRIDES[stage];
  if (!overrides) return FACILITY_OVERLAYS;
  return FACILITY_OVERLAYS.map((o) => {
    const ov = overrides[o.id];
    return ov ? { ...o, ...ov } : o;
  });
}

/**
 * id から overlay を引く。stage を指定するとその stage 用の値で返す。
 * stage 未指定なら base(FACILITY_OVERLAYS)から検索。
 */
export function findFacilityOverlay(
  id: string,
  stage?: CityStage,
): FacilityOverlay | undefined {
  const list = stage ? getFacilityOverlays(stage) : FACILITY_OVERLAYS;
  return list.find((o) => o.id === id);
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
