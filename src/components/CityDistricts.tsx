import { useMemo } from "react";
import { JA_DOMAIN_GROUPS } from "../data/jaCorpus";
import { toJst } from "../utils/date";
import type { District } from "../utils/cityDistricts";

/** 時間帯。空の色・灯りの見え方が変わる。 */
export type CityPhase = "morning" | "day" | "evening" | "night";

interface Props {
  districts: District[];
  selectedId?: number;
  onSelect?: (district: District) => void;
  /** 指定するとそのグループだけを大きく描く。 */
  zoomGroup?: string | null;
  /** 通常は現在時刻から決める。テスト・プレビュー用に上書きできる。 */
  phase?: CityPhase;
}

export function cityPhaseAt(now: Date = new Date()): CityPhase {
  const h = toJst(now).getHours();
  if (h >= 5 && h < 10) return "morning";
  if (h >= 10 && h < 17) return "day";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

// 全体表示 / ズーム表示の寸法 (SVG 座標)。
const OVERVIEW = {
  slotW: 24,
  buildingW: 18,
  rowH: 52,
  groundY: 40,
  perRow: Infinity,
  labels: false,
};
const ZOOM = {
  slotW: 46,
  buildingW: 34,
  rowH: 96,
  groundY: 68,
  perRow: 7,
  labels: true,
};

const PAD_X = 8;

/** stage → 建物の高さ (全体表示の基準値。ズームでは倍率をかける)。 */
const STAGE_HEIGHT: Record<number, number> = { 0: 14, 1: 9, 2: 15, 3: 21, 4: 27 };

interface Row {
  group: string;
  items: District[];
  showLabel: boolean;
  key: string;
}

/** 街区を行に並べる。全体表示はグループごとに 1 行、ズームでは perRow で折り返す。 */
function buildRows(districts: District[], zoomGroup: string | null, perRow: number): Row[] {
  const groups = zoomGroup ? [zoomGroup] : JA_DOMAIN_GROUPS;
  return groups
    .map((group) => ({
      group,
      items: districts.filter((d) => d.domain.group === group),
    }))
    .filter((r) => r.items.length > 0)
    .flatMap((r) =>
      chunk(r.items, perRow).map((items, i) => ({
        group: r.group,
        items,
        showLabel: i === 0,
        key: `${r.group}-${i}`,
      })),
    );
}

/**
 * 選んだ街区が図の横幅の何 % の位置にあるかを返す。
 * 吹き出しのしっぽをその建物の下に合わせるために使う。見つからなければ null。
 */
export function plotCenterPercent(
  districts: District[],
  domainId: number | undefined,
  zoomGroup: string | null = null,
): number | null {
  if (domainId == null) return null;
  const cfg = zoomGroup ? ZOOM : OVERVIEW;
  const rows = buildRows(districts, zoomGroup, cfg.perRow);
  const maxCols = rows.reduce((m, r) => Math.max(m, r.items.length), 0);
  if (maxCols === 0) return null;
  const width = PAD_X * 2 + maxCols * cfg.slotW;
  for (const row of rows) {
    const i = row.items.findIndex((d) => d.domain.id === domainId);
    if (i < 0) continue;
    const center = PAD_X + i * cfg.slotW + cfg.slotW / 2;
    return Math.round((center / width) * 1000) / 10;
  }
  return null;
}

function chunk<T>(arr: T[], size: number): T[][] {
  if (!Number.isFinite(size)) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** 同じ分野なら毎回同じ見た目になる、簡単な擬似乱数。 */
function hashOf(n: number): number {
  return ((n * 2654435761) >>> 0) % 1000;
}

/**
 * 全分野 (現在 72) を「街区」として描く。
 * 画像ではなく SVG なので、定着状況と時間帯に応じて毎回姿が変わる。
 */
export function CityDistricts({
  districts,
  selectedId,
  onSelect,
  zoomGroup = null,
  phase,
}: Props) {
  const nowPhase = phase ?? cityPhaseAt();
  const cfg = zoomGroup ? ZOOM : OVERVIEW;
  const scale = zoomGroup ? 1.9 : 1;

  const rows = useMemo(
    () => buildRows(districts, zoomGroup, cfg.perRow),
    [cfg.perRow, districts, zoomGroup],
  );

  const maxCols = rows.reduce((m, r) => Math.max(m, r.items.length), 0);
  const width = PAD_X * 2 + maxCols * cfg.slotW;
  const height = rows.length * cfg.rowH + 10;
  const groupIndexOf = (group: string) => JA_DOMAIN_GROUPS.indexOf(group);

  return (
    <svg
      className="city-districts"
      data-phase={nowPhase}
      data-zoom={zoomGroup ? "1" : undefined}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={zoomGroup ? `${zoomGroup}の街区` : "分野ごとの街の育ち具合"}
    >
      <defs>
        <linearGradient id="cd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop className="cd-sky-top" offset="0%" />
          <stop className="cd-sky-bottom" offset="100%" />
        </linearGradient>
        <radialGradient id="cd-glow">
          <stop className="cd-glow-in" offset="0%" />
          <stop className="cd-glow-out" offset="100%" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill="url(#cd-sky)" rx="8" />

      {/* 空: 昼は太陽、夜は月と星。 */}
      {nowPhase === "night" ? (
        <g className="city-sky">
          <circle cx={width - 26} cy={20} r={6} className="city-moon" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              cx={14 + ((i * 53) % Math.max(1, width - 40))}
              cy={8 + ((i * 29) % 22)}
              r={0.8}
              className="city-star"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </g>
      ) : (
        <circle cx={width - 26} cy={20} r={7} className="city-sun" />
      )}

      {rows.map((row, rowIndex) => {
        const top = rowIndex * cfg.rowH;
        const ground = top + cfg.groundY;
        const gi = groupIndexOf(row.group);
        return (
          <g key={row.key} className={`city-row is-g${gi}`}>
            {/* 地面と道路 */}
            <rect
              x="3"
              y={ground - (zoomGroup ? 56 : 26)}
              width={width - 6}
              height={zoomGroup ? 56 : 26}
              className="city-land"
              rx="3"
            />
            <rect
              x="3"
              y={ground}
              width={width - 6}
              height={zoomGroup ? 12 : 7}
              className="city-road"
              rx="2"
            />
            <line
              x1={PAD_X}
              y1={ground + (zoomGroup ? 6 : 3.5)}
              x2={width - PAD_X}
              y2={ground + (zoomGroup ? 6 : 3.5)}
              className="city-road__center"
            />

            {row.items.map((d, i) => {
              const slotX = PAD_X + i * cfg.slotW;
              const w = cfg.buildingW;
              const x = slotX + (cfg.slotW - w) / 2;
              const h = STAGE_HEIGHT[d.stage] * (d.stage === 0 ? 1 : scale);
              const y = ground - h;
              const selected = selectedId === d.domain.id;
              const rnd = hashOf(d.domain.id);
              const pitched = rnd % 3 === 0; // 三角屋根
              const hasTree = d.stage === 0 && rnd % 4 === 0;
              const winCols = zoomGroup ? 3 : 2;
              const winRows = Math.max(1, Math.floor((h - 8 * scale) / (8 * scale)));

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
                  <rect
                    x={slotX}
                    y={top + 12}
                    width={cfg.slotW}
                    height={cfg.groundY - 10}
                    fill="transparent"
                  />

                  {/* 灯りのにじみ */}
                  {d.stage >= 3 && (
                    <circle
                      cx={x + w / 2}
                      cy={y + h / 2}
                      r={w * 1.1}
                      fill="url(#cd-glow)"
                      opacity={d.brightness * (nowPhase === "night" ? 0.9 : 0.35)}
                      pointerEvents="none"
                    />
                  )}

                  {d.stage === 0 ? (
                    <>
                      <rect
                        x={x}
                        y={ground - h}
                        width={w}
                        height={h}
                        className="city-districts__empty"
                        rx="1.5"
                      />
                      {hasTree && (
                        <g className="city-tree">
                          <rect x={x + w / 2 - 0.6} y={ground - 5} width={1.2} height={5} />
                          <circle cx={x + w / 2} cy={ground - 7} r={3} />
                        </g>
                      )}
                    </>
                  ) : (
                    <>
                      {pitched && (
                        <polygon
                          points={`${x - 1},${y} ${x + w / 2},${y - 4 * scale} ${x + w + 1},${y}`}
                          className="city-districts__roof"
                        />
                      )}
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        className="city-districts__building"
                        rx="1.5"
                      />
                      {d.stage >= 3 &&
                        Array.from({ length: winRows }).map((_, r) =>
                          Array.from({ length: winCols }).map((__, c) => (
                            <rect
                              key={`${r}-${c}`}
                              x={x + (w / (winCols + 1)) * (c + 1) - 2 * scale}
                              y={y + 4 * scale + r * 8 * scale}
                              width={4 * scale}
                              height={4 * scale}
                              className="city-districts__window"
                              opacity={d.brightness}
                              rx="0.6"
                            />
                          )),
                        )}
                      {d.stage === 4 && (
                        <>
                          <line
                            x1={x + w / 2}
                            y1={y - (pitched ? 4 * scale : 0)}
                            x2={x + w / 2}
                            y2={y - (pitched ? 4 * scale : 0) - 5 * scale}
                            className="city-districts__mast"
                          />
                          <circle
                            cx={x + w / 2}
                            cy={y - (pitched ? 4 * scale : 0) - 5 * scale}
                            r={1.8 * scale}
                            className="city-districts__beacon"
                            opacity={d.brightness}
                          />
                        </>
                      )}
                    </>
                  )}

                  {cfg.labels && (
                    <>
                      <text x={slotX + cfg.slotW / 2} y={ground + 22} className="city-plot__num">
                        {String(d.domain.id).padStart(2, "0")}
                      </text>
                      <text x={slotX + cfg.slotW / 2} y={ground + 29} className="city-plot__name">
                        {d.domain.title.length > 6
                          ? `${d.domain.title.slice(0, 6)}…`
                          : d.domain.title}
                      </text>
                    </>
                  )}

                  {selected && (
                    <rect
                      x={slotX + 1}
                      y={top + 13}
                      width={cfg.slotW - 2}
                      height={cfg.groundY - 11}
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

      {/* グループ名は建物と重なっても読めるよう、最後にまとめて描く。 */}
      {rows.map((row, rowIndex) =>
        row.showLabel ? (
          <g key={`label-${row.key}`} className="city-districts__label">
            <rect
              x={PAD_X - 3}
              y={rowIndex * cfg.rowH + 3}
              width={row.group.length * 7 + 8}
              height={10}
              rx="3"
              className="city-districts__group-bg"
            />
            <text
              x={PAD_X}
              y={rowIndex * cfg.rowH + 10}
              className="city-districts__group"
            >
              {row.group}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );
}
