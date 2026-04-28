import { useEffect, useMemo, useRef, useState } from "react";
import { CityMap } from "./CityMap";
import { unlockedFacilities } from "../utils/progress";
import {
  FACILITY_OVERLAYS,
  findFacilityOverlay,
  type FacilityId,
} from "../data/cityLayout";
import { pickPhraseForFacility } from "../utils/cityPhrases";
import { speakText } from "../utils/speech";

interface CityViewProps {
  level: number;
  /** "stage" は City画面用(大きく表示+ラベル+ロック表示+タップ可)、
   *  "preview" は Home用(小さく表示、ラベル/ロック/タップなし)。 */
  variant?: "stage" | "preview";
  /** stage 時に施設をタップ可能にする(吹き出し+TTS)。 */
  interactive?: boolean;
}

interface ActiveBubble {
  facilityId: FacilityId;
  text: string;
}

const BUBBLE_DURATION_MS = 1600;

export function CityView({ level, variant = "stage", interactive = false }: CityViewProps) {
  const mapVariant: "preview" | "full" = variant === "preview" ? "preview" : "full";
  const tapEnabled = mapVariant === "full" && interactive;

  const [bubble, setBubble] = useState<ActiveBubble | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleTap = (id: FacilityId) => {
    const phrase = pickPhraseForFacility(id);
    if (!phrase) return;
    setBubble({ facilityId: id, text: phrase.english });
    void speakText(phrase.english, { rate: 0.95 });
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setBubble(null);
      timerRef.current = null;
    }, BUBBLE_DURATION_MS);
  };

  const isEmpty = useMemo(() => {
    // 「街にまだ何もない」状態(Lv 0 など)では空表示にしたいが、
    // House は Lv 1 で必ず解放されるため通常はここに来ない。
    // 念のため、unlockedFacilities が0件、かつ overlay 対象も0件なら空扱い。
    if (level >= 1) return false;
    return unlockedFacilities(level).length === 0 && FACILITY_OVERLAYS.length === 0;
  }, [level]);

  // 吹き出しの位置(画像幅・高さに対する % 指定)
  const bubbleOverlay = bubble ? findFacilityOverlay(bubble.facilityId) : null;
  const bubbleDir = bubbleOverlay?.bubbleDirection ?? "top";
  const bubbleStyle = bubbleOverlay
    ? {
        left: `${bubbleOverlay.x}%`,
        top: `${bubbleOverlay.y}%`,
      }
    : null;

  return (
    <div className={`city-stage city-stage--${mapVariant}${isEmpty ? " city-stage--empty" : ""}`}>
      <div className="city-stage__inner">
        {isEmpty ? (
          <p className="city-stage__empty">練習を始めると、ここに小さな街が現れます。</p>
        ) : (
          <CityMap
            level={level}
            variant={mapVariant}
            onBuildingTap={tapEnabled ? handleTap : undefined}
            activeBuildingId={bubble?.facilityId ?? null}
          />
        )}
        {bubble && bubbleStyle && (
          <div
            className={`city-bubble city-bubble--${bubbleDir === "top" ? "above" : "below"}`}
            style={bubbleStyle}
            role="status"
            aria-live="polite"
          >
            {bubble.text}
          </div>
        )}
      </div>
      {tapEnabled && (
        <p className="city-stage__hint">💡 タップすると英語が聞けます</p>
      )}
    </div>
  );
}
