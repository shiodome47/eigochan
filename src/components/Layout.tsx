import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  streakDays: number;
  children: ReactNode;
}

export function Layout({ streakDays, children }: LayoutProps) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <strong>eigochan</strong>
          <span>声に出すほど、街が育つ。</span>
        </div>
        <div className="app-header__streak" aria-label={`連続 ${streakDays} 日`}>
          🔥 {streakDays}日
        </div>
      </header>
      <main className="app-main">{children}</main>
      <BottomNav />
    </div>
  );
}
