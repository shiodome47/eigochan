// 背景画像の上に、施設ラベル・透明タップボタン・ロックタグ・吹き出しを重ねる。
// 街そのものの見た目は背景画像に任せ、コードは状態とインタラクションだけ担当する。

import { Fragment, useState } from "react";
import {
  CITY_MAP_IMAGE,
  CITY_MAP_IMAGE_WEBP,
  FACILITY_OVERLAYS,
  type FacilityId,
  type FacilityOverlay,
} from "../data/cityLayout";

interface CityMapProps {
  level: number;
  variant: "preview" | "full";
  onBuildingTap?: (id: FacilityId) => void;
  activeBuildingId?: FacilityId | null;
}

/** 背景画像にない装飾(気球・夜空のあかり)。CSSのみで描画。 */
function SkyDecoration({ id, x, y }: { id: FacilityId; x: number; y: number }) {
  if (id === "balloon") {
    return (
      <div
        className="city-deco city-deco--balloon"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 50 70" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="25" cy="22" rx="16" ry="20" fill="#e98a6a" />
          <path d="M 9 22 A 16 16 0 0 1 41 22" fill="#f5a382" opacity="0.7" />
          <path d="M 25 4 Q 22 22 23 38" stroke="#fcefcf" strokeWidth="0.7" fill="none" opacity="0.7" />
          <path d="M 25 4 Q 28 22 27 38" stroke="#fcefcf" strokeWidth="0.7" fill="none" opacity="0.7" />
          <line x1="9" y1="38" x2="20" y2="50" stroke="#7a5a3a" strokeWidth="0.9" />
          <line x1="41" y1="38" x2="30" y2="50" stroke="#7a5a3a" strokeWidth="0.9" />
          <rect x="20" y="50" width="10" height="7" fill="#7a5a3a" />
          <rect x="20" y="50" width="10" height="2.5" fill="#5e453a" />
        </svg>
      </div>
    );
  }
  if (id === "stars") {
    return (
      <div
        className="city-deco city-deco--stars"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid meet">
          <circle cx="30" cy="18" r="9" fill="#fcefcf" opacity="0.18" />
          <circle cx="30" cy="18" r="2.4" fill="#fcefcf" opacity="0.95" />
          <circle cx="14" cy="26" r="1.8" fill="#fcefcf" opacity="0.85" />
          <circle cx="46" cy="10" r="2.1" fill="#fcefcf" opacity="0.95" />
          <circle cx="20" cy="6" r="1.4" fill="#fcefcf" opacity="0.8" />
          <circle cx="48" cy="28" r="1.6" fill="#fcefcf" opacity="0.85" />
          <circle cx="38" cy="30" r="1.2" fill="#fcefcf" opacity="0.8" />
        </svg>
      </div>
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

export function CityMap({ level, variant, onBuildingTap, activeBuildingId }: CityMapProps) {
  const isFull = variant === "full";
  const interactive = isFull && !!onBuildingTap;
  const showLabels = isFull;
  const showLocked = isFull;
  const showDecorative = isFull;

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="city-image-stage">
      <picture>
        <source srcSet={CITY_MAP_IMAGE_WEBP} type="image/webp" />
        <img
          src={CITY_MAP_IMAGE}
          className={`city-image-stage__img${imageLoaded ? " is-loaded" : ""}`}
          alt="あなたの街の地図"
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />
      </picture>
      <div className="city-image-stage__overlay">
        {FACILITY_OVERLAYS.map((overlay) => {
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
  );
}
