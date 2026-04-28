import type { XpBreakdownItem } from "../utils/progress";

interface XpBreakdownProps {
  items: XpBreakdownItem[];
  total: number;
}

export function XpBreakdown({ items, total }: XpBreakdownProps) {
  if (items.length === 0) {
    return (
      <p className="xp-breakdown__empty">
        声に出せたことが、何より大事。今日もここまでで十分です。
      </p>
    );
  }
  return (
    <div className="xp-breakdown" role="table" aria-label="XPの内訳">
      {items.map((item) => (
        <div className="xp-breakdown__row" key={item.key} role="row">
          <span className="xp-breakdown__label" role="cell">
            {item.label}
            {item.count > 1 && (
              <span className="xp-breakdown__count"> × {item.count}</span>
            )}
          </span>
          <span className="xp-breakdown__sub" role="cell">
            +{item.subtotal} XP
          </span>
        </div>
      ))}
      <div className="xp-breakdown__row xp-breakdown__row--total" role="row">
        <span className="xp-breakdown__label" role="cell">
          合計
        </span>
        <span className="xp-breakdown__sub" role="cell">
          +{total} XP
        </span>
      </div>
    </div>
  );
}
