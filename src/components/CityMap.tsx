// 背景画像 + 環境アニメ + 施設オーバーレイ + 吹き出し対象。
// 街そのものの見た目は背景画像に任せ、コードは状態とインタラクションだけ担当する。
//
// レイヤー構造:
//   .city-image-stage
//     .city-image-stage__bg        - <picture> 背景(stage 切替で fade)
//     .city-image-stage__env       - 雲 / 川シマー / 街灯グロー(軽アニメ)
//     .city-image-stage__overlay   - 施設ラベル・ロックタグ・タップ判定・吹き出し対象
//     .city-image-stage__transform - bg/env/overlay をまとめる単一トランスフォーム単位
//                                    (将来 transform: scale(...) で拡縮可能)

import { Fragment, useState } from "react";
import {
  getFacilityOverlays,
  type FacilityId,
  type FacilityOverlay,
} from "../data/cityLayout";
import {
  getCityStageAssets,
  type CityStage,
} from "../data/cityAssets";

interface CityMapProps {
  level: number;
  stage: CityStage;
  variant: "preview" | "full";
  onBuildingTap?: (id: FacilityId) => void;
  activeBuildingId?: FacilityId | null;
}

/** 背景画像にない装飾(気球・夜空のあかり)。CSS で描画。 */
function SkyDecoration({ id, x, y }: { id: FacilityId; x: number; y: number }) {
  if (id === "balloon") {
    return (
      <div
        className="city-deco city-deco--balloon-css"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden="true"
      />
    );
  }
  if (id === "stars") {
    return (
      <div
        className="city-deco city-deco--stars-css"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden="true"
      />
    );
  }
  return null;
}

interface OverlaySetProps {
  overlay: FacilityOverlay;
  unlocked: boolean;
  showLabels: boolean;
  showLocked: boolean;
  showDecorative: boolean;
  interactive: boolean;
  isActive: boolean;
  onTap?: (id: FacilityId) => void;
}

function FacilityOverlayItem({
  overlay,
  unlocked,
  showLabels,
  showLocked,
  showDecorative,
  interactive,
  isActive,
  onTap,
}: OverlaySetProps) {
  const dir = overlay.bubbleDirection ?? "top";
  const hitW = overlay.hitWidth ?? 18;
  const hitH = overlay.hitHeight ?? 18;

  if (unlocked) {
    return (
      <Fragment>
        {overlay.decorative && showDecorative && (
          <SkyDecoration id={overlay.id} x={overlay.x} y={overlay.y} />
        )}
        {interactive && onTap && (
          <button
            type="button"
            className={`city-tap${isActive ? " is-active" : ""}`}
            style={{
              left: `${overlay.x}%`,
              top: `${overlay.y}%`,
              width: `${hitW}%`,
              height: `${hitH}%`,
            }}
            onClick={() => onTap(overlay.id)}
            aria-label={`${overlay.label}をタップして英語を聞く`}
          />
        )}
        {showLabels && (
          <div
            className={`city-label city-label--${dir}`}
            style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
          >
            {overlay.label}
          </div>
        )}
      </Fragment>
    );
  }

  if (showLocked) {
    return (
      <div
        className={`city-locked city-locked--${dir}`}
        style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
        aria-hidden="true"
      >
        <span className="city-locked__lv">Lv {overlay.unlockLevel}</span>
        <span className="city-locked__name">{overlay.label}</span>
      </div>
    );
  }
  return null;
}

/** 環境アニメーションレイヤー(雲・川シマー・街灯グロー)。 */
function CityEnvLayer({ level, variant }: { level: number; variant: "preview" | "full" }) {
  const lampOn = level >= 2;
  const detailed = variant === "full";

  return (
    <div className="city-env" aria-hidden="true">
      {/* 雲(常時) */}
      <span className="city-env__cloud city-env__cloud--a" />
      <span className="city-env__cloud city-env__cloud--b" />
      {detailed && <span className="city-env__cloud city-env__cloud--c" />}

      {/* 川のきらめき(右下〜中央右) */}
      <span className="city-env__river" />

      {/* 街灯グロー(level 2 以上、full のみ) */}
      {lampOn && detailed && (
        <>
          <span className="city-env__lamp city-env__lamp--a" />
          <span className="city-env__lamp city-env__lamp--b" />
          <span className="city-env__lamp city-env__lamp--c" />
        </>
      )}
    </div>
  );
}

export function CityMap({ level, stage, variant, onBuildingTap, activeBuildingId }: CityMapProps) {
  const isFull = variant === "full";
  const interactive = isFull && !!onBuildingTap;
  const showLabels = isFull;
  const showLocked = isFull;
  const showDecorative = isFull;

  // stage 変更で <img> を再マウント → onLoad → fade-in が再走する。
  // 同じ画像ファイル(stage2 と stage3)では多くのブラウザがキャッシュから即座に load イベントを返す。
  const [imageLoadedKey, setImageLoadedKey] = useState<string | null>(null);
  const stageAssets = getCityStageAssets(stage);
  const isLoaded = imageLoadedKey === stage;

  return (
    <div className="city-image-stage">
      <div className="city-image-stage__transform">
        {/* 1. 背景画像レイヤー */}
        <div className="city-image-stage__bg">
          <picture key={stage}>
            <source srcSet={stageAssets.webp} type="image/webp" />
            <img
              src={stageAssets.png}
              className={`city-image-stage__img${isLoaded ? " is-loaded" : ""}`}
              alt="あなたの街の地図"
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={() => setImageLoadedKey(stage)}
              data-stage={stage}
            />
          </picture>
        </div>

        {/* 2. 環境アニメーションレイヤー */}
        <CityEnvLayer level={level} variant={variant} />

        {/* 3. 施設オーバーレイ + 吹き出し対象 (stage 別座標を反映) */}
        <div className="city-image-stage__overlay">
          {getFacilityOverlays(stage).map((overlay) => {
            const unlocked = level >= overlay.unlockLevel;
            return (
              <FacilityOverlayItem
                key={overlay.id}
                overlay={overlay}
                unlocked={unlocked}
                showLabels={showLabels}
                showLocked={showLocked}
                showDecorative={showDecorative}
                interactive={interactive}
                isActive={activeBuildingId === overlay.id}
                onTap={onBuildingTap}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
