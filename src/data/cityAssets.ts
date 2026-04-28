// 街の段階的背景アセットの管理。
// 街そのものの見た目は背景画像に任せ、コードはステージ判定とパス管理に集中する。
//
// 画像置き場(public 配下):
//   public/city/city-stage1.{png,webp}  - 育ち始め(画像A)
//   public/city/city-stage2.{png,webp}  - 中盤・遊具初登場(画像B)
//   public/city/city-stage4.{png,webp}  - ほぼ完成(画像C)
//   stage3 は stage2 の画像をそのまま再利用(まだ移行期のため)
//
// 将来 totalVoiceEnergy / totalXp ベースで切り替えたい時は、
// getCityStage の中身だけ差し替えれば良いように引数を緩めにしてある。

export type CityStage = "stage1" | "stage2" | "stage3" | "stage4";

const VALID_CITY_STAGES: readonly CityStage[] = [
  "stage1",
  "stage2",
  "stage3",
  "stage4",
];

/** 任意の値が CityStage か判定する型ガード(URL パラメータの検証などに)。 */
export function isCityStage(value: unknown): value is CityStage {
  return (
    typeof value === "string" &&
    (VALID_CITY_STAGES as readonly string[]).includes(value)
  );
}

export interface CityStageAssets {
  /** WebP 優先で読み込む。 */
  webp: string;
  /** WebP 非対応ブラウザ向け PNG フォールバック。 */
  png: string;
  /** 元画像の natural width/height(全 stage で揃えてある)。 */
  width: number;
  height: number;
}

const COMMON_DIMENSIONS = { width: 1448, height: 1086 } as const;

const STAGE1: CityStageAssets = {
  webp: "/city/city-stage1.webp",
  png: "/city/city-stage1.png",
  ...COMMON_DIMENSIONS,
};
const STAGE2: CityStageAssets = {
  webp: "/city/city-stage2.webp",
  png: "/city/city-stage2.png",
  ...COMMON_DIMENSIONS,
};
const STAGE4: CityStageAssets = {
  webp: "/city/city-stage4.webp",
  png: "/city/city-stage4.png",
  ...COMMON_DIMENSIONS,
};

/** 各 stage の背景アセット。stage3 は当面 stage2 と同じファイルを参照する。 */
export const STAGE_BACKGROUNDS: Record<CityStage, CityStageAssets> = {
  stage1: STAGE1,
  stage2: STAGE2,
  stage3: STAGE2,
  stage4: STAGE4,
};

export const CITY_IMAGE_ASPECT = `${COMMON_DIMENSIONS.width} / ${COMMON_DIMENSIONS.height}`;

export interface CityStageInput {
  level: number;
  /** 将来差し替え予定。今回は未使用。 */
  totalXp?: number;
  totalVoiceEnergy?: number;
}

/**
 * 進捗から現在の街ステージを返す。
 * 現バージョンは level だけで判定。
 *   1〜2 → stage1
 *   3〜4 → stage2
 *   5〜6 → stage3
 *   7+   → stage4
 *
 * 将来は totalVoiceEnergy 等で切り替えたいので、引数は緩めの object で受ける。
 */
export function getCityStage(input: CityStageInput): CityStage {
  const lv = Math.max(1, Math.floor(input.level));
  if (lv <= 2) return "stage1";
  if (lv <= 4) return "stage2";
  if (lv <= 6) return "stage3";
  return "stage4";
}

/** ヘルパ。CityMap で `key` を切り替えてフェードを起こすのに使う。 */
export function getCityStageAssets(stage: CityStage): CityStageAssets {
  return STAGE_BACKGROUNDS[stage];
}
