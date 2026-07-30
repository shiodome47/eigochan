import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { UserProgress } from "../types";
import { CityView } from "../components/CityView";
import { CityDistricts, cityPhaseAt, type CityPhase } from "../components/CityDistricts";
import { JA_DOMAIN_GROUPS } from "../data/jaCorpus";
import { lockedFacilities, unlockedFacilities } from "../utils/progress";
import { buildDistricts, summarizeCity, STAGE_LABELS, type District } from "../utils/cityDistricts";
import { loadSrs } from "../utils/srs";
import { isCityStage } from "../data/cityAssets";

interface CityPageProps {
  progress: UserProgress;
}

export function CityPage({ progress }: CityPageProps) {
  const [searchParams] = useSearchParams();
  const unlocked = unlockedFacilities(progress.level);
  const locked = lockedFacilities(progress.level);

  // 66 分野の街区。日→英モードの定着状況で姿が変わる。
  const districts = useMemo(() => buildDistricts(loadSrs()), []);
  const city = useMemo(() => summarizeCity(districts), [districts]);
  const [selected, setSelected] = useState<District | null>(null);
  // null = 全体表示、グループ名 = その街区だけ大きく見る。
  const [zoomGroup, setZoomGroup] = useState<string | null>(null);
  // 開発用: ?phase=morning|day|evening|night で時間帯を強制できる (UI には出さない)。
  const phaseParam = searchParams.get("phase");
  const forcedPhase = (["morning", "day", "evening", "night"] as const).includes(
    phaseParam as CityPhase,
  )
    ? (phaseParam as CityPhase)
    : undefined;
  const phase = forcedPhase ?? cityPhaseAt();
  const PHASE_LABEL: Record<string, string> = {
    morning: "朝",
    day: "昼",
    evening: "夕方",
    night: "夜",
  };

  // 開発用:?stage=stage1 などで街ステージを強制表示できる。
  // 不正な値は無視して通常の level 判定に戻す。UI 上には出さない。
  const stageParam = searchParams.get("stage");
  const forcedStage = isCityStage(stageParam) ? stageParam : undefined;

  return (
    <>
      <section className="card">
        <h2 className="card__title">分野の街</h2>
        <p className="card__heading">
          66 分野が 66 の街区です。思い出せる文が増えると建物が育ち、灯りがつきます。
        </p>
        <div className="city-zoom-tabs">
          <button
            type="button"
            className={`filter-chip${zoomGroup === null ? " is-active" : ""}`}
            onClick={() => setZoomGroup(null)}
          >
            全体
          </button>
          {JA_DOMAIN_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              className={`filter-chip${zoomGroup === g ? " is-active" : ""}`}
              onClick={() => setZoomGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <CityDistricts
          districts={districts}
          selectedId={selected?.domain.id}
          onSelect={(d) => setSelected(d)}
          zoomGroup={zoomGroup}
          phase={phase}
        />
        <p className="district-hint">
          いまの空は「{PHASE_LABEL[phase]}」です。時間帯で街の色が変わります。
        </p>
        <div className="progress-row">
          <div className="progress-cell">
            <div className="progress-cell__label">街の育ち</div>
            <div className="progress-cell__value">
              {city.percent}
              <span className="progress-cell__unit">%</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">建った街区</div>
            <div className="progress-cell__value">
              {city.built}
              <span className="progress-cell__unit">/ {districts.length}</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">灯り</div>
            <div className="progress-cell__value">
              {city.lit}
              <span className="progress-cell__unit">区</span>
            </div>
          </div>
        </div>

        {selected ? (
          <div className="district-detail">
            <h3 className="district-detail__title">
              {String(selected.domain.id).padStart(2, "0")}. {selected.domain.title}
            </h3>
            <p className="district-detail__meta">
              {STAGE_LABELS[selected.stage]} ・ 触れた文 {selected.seen}/{selected.total}
              {selected.mature > 0 ? ` ・ 定着 ${selected.mature}` : ""}
              {selected.due > 0 ? ` ・ 期日が来ている文 ${selected.due}` : ""}
            </p>
            {selected.due > 0 && (
              <p className="district-detail__dim">
                復習が溜まっているので、この街区の灯りが少し暗くなっています。
              </p>
            )}
            <div className="btn-row">
              <Link to={`/ja-en?domain=${selected.domain.id}`} className="btn btn--small">
                この分野の文を見る →
              </Link>
              <Link to="/ja-en/today" className="btn btn--ghost btn--small">
                今日の練習へ
              </Link>
            </div>
          </div>
        ) : (
          <p className="district-hint">街区をタップすると、その分野の状態が見られます。</p>
        )}

        {city.dim.length > 0 && (
          <p className="district-hint">
            灯りが暗くなっている街区: {city.dim.slice(0, 3).map((d) => d.domain.title).join(" / ")}
            {city.dim.length > 3 ? ` ほか ${city.dim.length - 3}` : ""}
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="card__title">あなたの街</h2>
        <p className="card__heading">Your city is growing!</p>
        <CityView
          level={progress.level}
          variant="stage"
          interactive
          forcedStage={forcedStage}
        />

        <div className="progress-row">
          <div className="progress-cell">
            <div className="progress-cell__label">レベル</div>
            <div className="progress-cell__value">
              {progress.level}
              <span className="progress-cell__unit">Lv</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">そうXP</div>
            <div className="progress-cell__value">
              {progress.totalXp}
              <span className="progress-cell__unit">XP</span>
            </div>
          </div>
          <div className="progress-cell">
            <div className="progress-cell__label">れんしゅう</div>
            <div className="progress-cell__value">
              {progress.totalPracticeCount}
              <span className="progress-cell__unit">回</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">解放された施設</h2>
        {unlocked.length === 0 ? (
          <p className="empty">最初の練習で「家」が建ちます。</p>
        ) : (
          <div className="facility-list">
            {unlocked.map((f) => (
              <div className="facility-chip" key={f.id}>
                <span className="facility-chip__emoji">{f.emoji}</span>
                {f.name}
              </div>
            ))}
          </div>
        )}
      </section>

      {locked.length > 0 && (
        <section className="card">
          <h2 className="card__title">これから解放される施設</h2>
          <div className="facility-list">
            {locked.map((f) => (
              <div className="facility-chip is-locked" key={f.id}>
                <span className="facility-chip__emoji">{f.emoji}</span>
                Lv {f.level} で {f.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
