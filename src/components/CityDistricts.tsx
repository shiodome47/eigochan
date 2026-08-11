import { useMemo, type CSSProperties } from "react";
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

const OVERVIEW = { perRow: Infinity, labels: false };
const ZOOM = { perRow: 4, labels: true };

/** stage → 建物の高さ (px)。 */
const STAGE_HEIGHT: Record<number, number> = { 0: 18, 1: 28, 2: 44, 3: 58, 4: 72 };

interface Row {
  group: string;
  items: District[];
  showLabel: boolean;
  key: string;
}

function chunk<T>(arr: T[], size: number): T[][] {
  if (!Number.isFinite(size)) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

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
 * 選んだ街区が行内の何列目かから、吹き出しのしっぽ位置 (%) を返す。
 */
export function plotCenterPercent(
  districts: District[],
  domainId: number | undefined,
  zoomGroup: string | null = null,
): number | null {
  if (domainId == null) return null;
  const cfg = zoomGroup ? ZOOM : OVERVIEW;
  const rows = buildRows(districts, zoomGroup, cfg.perRow);
  for (const row of rows) {
    const i = row.items.findIndex((d) => d.domain.id === domainId);
    if (i < 0) continue;
    const cols = row.items.length;
    return Math.round(((i + 0.5) / cols) * 1000) / 10;
  }
  return null;
}

function hashOf(n: number): number {
  return ((n * 2654435761) >>> 0) % 1000;
}

function BuildingPlot({
  district: d,
  selected,
  showLabels,
  zoomed,
  onSelect,
}: {
  district: District;
  selected: boolean;
  showLabels: boolean;
  zoomed: boolean;
  onSelect?: (district: District) => void;
}) {
  const h = STAGE_HEIGHT[d.stage] * (zoomed && d.stage > 0 ? 1.15 : 1);
  const rnd = hashOf(d.domain.id);
  const pitched = rnd % 3 === 0;
  const hasTree = d.stage === 0 && rnd % 4 === 0;
  const windowCount = d.stage >= 3 ? (zoomed ? 6 : 4) : 0;

  return (
    <button
      type="button"
      className={`city-building is-stage${d.stage}${selected ? " is-selected" : ""}`}
      style={
        {
          "--building-h": `${h}px`,
          "--glow": String(d.brightness),
        } as CSSProperties
      }
      onClick={() => onSelect?.(d)}
      aria-pressed={selected}
      aria-label={`${d.domain.title}、${d.seen}/${d.total} 文`}
    >
      <div className="city-building__ground" aria-hidden="true" />
      <div className="city-building__slot">
        {d.stage >= 3 && <div className="city-building__glow" aria-hidden="true" />}
        {d.stage === 0 ? (
          <div className={`city-building__lot${hasTree ? " has-tree" : ""}`} aria-hidden="true" />
        ) : (
          <div
            className={`city-building__tower${pitched ? " is-pitched" : ""}${d.stage === 4 ? " is-mature" : ""}`}
            aria-hidden="true"
          >
            {pitched && <div className="city-building__roof" />}
            <div className="city-building__body">
              {windowCount > 0 &&
                Array.from({ length: windowCount }).map((_, i) => (
                  <span key={i} className="city-building__window" />
                ))}
            </div>
            {d.stage === 4 && <div className="city-building__beacon" />}
          </div>
        )}
      </div>
      {showLabels && (
        <div className="city-building__meta">
          <span className="city-building__num">{String(d.domain.id).padStart(2, "0")}</span>
          <span className="city-building__name">
            {d.domain.title.length > 8 ? `${d.domain.title.slice(0, 8)}…` : d.domain.title}
          </span>
        </div>
      )}
    </button>
  );
}

/**
 * 全分野を「街区」として描く。
 * HTML + CSS のスカイライン。定着状況と時間帯で見た目が変わる。
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
  const zoomed = Boolean(zoomGroup);

  const rows = useMemo(
    () => buildRows(districts, zoomGroup, cfg.perRow),
    [cfg.perRow, districts, zoomGroup],
  );

  const groupIndexOf = (group: string) => JA_DOMAIN_GROUPS.indexOf(group);

  return (
    <div
      className={`city-skyline${zoomed ? " city-skyline--zoom" : ""}`}
      data-phase={nowPhase}
      role="img"
      aria-label={zoomGroup ? `${zoomGroup}の街区` : "分野ごとの街の育ち具合"}
    >
      <div className="city-skyline__sky" aria-hidden="true">
        {nowPhase === "night" ? (
          <>
            <span className="city-skyline__moon" />
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="city-skyline__star" style={{ animationDelay: `${i * 0.7}s` }} />
            ))}
          </>
        ) : (
          <span className="city-skyline__sun" />
        )}
      </div>

      <div className="city-skyline__rows">
        {rows.map((row) => {
          const gi = groupIndexOf(row.group);
          return (
            <section key={row.key} className={`city-skyline__row is-g${gi}`}>
              {row.showLabel && <h3 className="city-skyline__group">{row.group}</h3>}
              <div className="city-skyline__plots">
                {row.items.map((d) => (
                  <BuildingPlot
                    key={d.domain.id}
                    district={d}
                    selected={selectedId === d.domain.id}
                    showLabels={cfg.labels}
                    zoomed={zoomed}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
