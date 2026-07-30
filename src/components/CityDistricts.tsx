import { useMemo } from "react";
import { JA_DOMAIN_GROUPS } from "../data/jaCorpus";
import type { District } from "../utils/cityDistricts";

interface Props {
  districts: District[];
  selectedId?: number;
  onSelect?: (district: District) => void;
}

// 1 街区ぶんの寸法 (SVG 座標)。
const SLOT_W = 24;
const BUILDING_W = 18;
const ROW_H = 46;
const GROUND_Y = 36; // 行の中での地面の位置
const LABEL_Y = 8;
const PAD_X = 6;

const STAGE_HEIGHT: Record<number, number> = { 0: 4, 1: 9, 2: 15, 3: 20, 4: 25 };

/**
 * 66 分野を「街区」として描く。
 * 画像ではなく SVG で描いているので、定着状況に応じて毎回姿が変わる。
 */
export function CityDistricts({ districts, selectedId, onSelect }: Props) {
  const rows = useMemo(
    () =>
      JA_DOMAIN_GROUPS.map((group) => ({
        group,
        items: districts.filter((d) => d.domain.group === group),
      })).filter((r) => r.items.length > 0),
    [districts],
  );

  const maxCols = rows.reduce((m, r) => Math.max(m, r.items.length), 0);
  const width = PAD_X * 2 + maxCols * SLOT_W;
  const height = rows.length * ROW_H + 8;

  return (
    <svg
      className="city-districts"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="分野ごとの街の育ち具合"
    >
      <defs>
        <linearGradient id="cd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg-blue)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#cd-sky)" rx="6" />

      {rows.map((row, rowIndex) => {
        const top = rowIndex * ROW_H;
        const ground = top + GROUND_Y;
        return (
          <g key={row.group}>
            {rowIndex % 2 === 1 && (
              <rect
                x="2"
                y={top + 2}
                width={width - 4}
                height={ROW_H - 4}
                className="city-districts__band"
                rx="4"
              />
            )}
            <text x={PAD_X} y={top + LABEL_Y} className="city-districts__group">
              {row.group}
            </text>
            <line
              x1={PAD_X}
              y1={ground + 0.5}
              x2={width - PAD_X}
              y2={ground + 0.5}
              className="city-districts__ground"
            />
            {row.items.map((d, i) => {
              const x = PAD_X + i * SLOT_W + (SLOT_W - BUILDING_W) / 2;
              const h = STAGE_HEIGHT[d.stage];
              const y = ground - h;
              const selected = selectedId === d.domain.id;
              return (
                <g
                  key={d.domain.id}
                  className={`city-districts__plot is-stage${d.stage}${selected ? " is-selected" : ""}`}
                  onClick={() => onSelect?.(d)}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelect(d);
                    }
                  }}
                >
                  <title>{`${d.domain.title} — ${d.seen}/${d.total} 文`}</title>
                  {/* タップ範囲 */}
                  <rect
                    x={PAD_X + i * SLOT_W}
                    y={top + 10}
                    width={SLOT_W}
                    height={GROUND_Y - 8}
                    fill="transparent"
                  />
                  {d.stage === 0 ? (
                    <rect
                      x={x}
                      y={ground - 14}
                      width={BUILDING_W}
                      height={14}
                      className="city-districts__empty"
                      rx="1.5"
                    />
                  ) : (
                    <>
                      <rect
                        x={x}
                        y={y}
                        width={BUILDING_W}
                        height={h}
                        className="city-districts__building"
                        rx="1.5"
                      />
                      {/* 窓。灯りの明るさは復習の溜まり具合で変わる。 */}
                      {d.stage >= 3 &&
                        Array.from({ length: Math.max(1, Math.floor((h - 8) / 8)) }).map(
                          (_, r) =>
                            [0, 1].map((c) => (
                              <rect
                                key={`${r}-${c}`}
                                x={x + 3.5 + c * 7.5}
                                y={y + 5 + r * 8}
                                width={4}
                                height={4}
                                className="city-districts__window"
                                opacity={d.brightness}
                                rx="0.6"
                              />
                            )),
                        )}
                      {d.stage === 4 && (
                        <circle
                          cx={x + BUILDING_W / 2}
                          cy={y - 3.5}
                          r={2}
                          className="city-districts__beacon"
                          opacity={d.brightness}
                        />
                      )}
                    </>
                  )}
                  {selected && (
                    <rect
                      x={PAD_X + i * SLOT_W + 1}
                      y={top + 11}
                      width={SLOT_W - 2}
                      height={GROUND_Y - 9}
                      className="city-districts__focus"
                      rx="3"
                    />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
