import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/", label: "Home", icon: "🏡", end: true },
  { to: "/practice", label: "Practice", icon: "🗣️", end: false },
  { to: "/city", label: "City", icon: "🌆", end: false },
  { to: "/phrases", label: "Phrases", icon: "📖", end: false },
  { to: "/log", label: "Log", icon: "📊", end: false },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      <div className="bottom-nav__inner">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? " is-active" : ""}`
            }
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
