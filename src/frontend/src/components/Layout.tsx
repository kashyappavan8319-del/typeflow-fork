import { Flame, Moon, Sun } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useStreak } from "../hooks/useStreak";

interface LayoutProps {
  children: ReactNode;
}

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("typeflow-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("typeflow-theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

export function Layout({ children }: LayoutProps) {
  const { dark, toggle } = useDarkMode();
  const { streakCount } = useStreak();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-display font-bold text-lg text-foreground hover:text-primary transition-smooth"
            data-ocid="nav.home_link"
          >
            TypeFlow
          </a>
          <div className="flex items-center gap-3">
            <span className="text-label text-muted-foreground hidden sm:block">
              Calm · Focused · Natural
            </span>

            {/* Streak badge */}
            {streakCount > 0 && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-sm font-semibold select-none"
                title={`${streakCount}-day streak`}
                data-ocid="nav.streak_badge"
              >
                <Flame size={14} className="shrink-0" />
                <span className="tabular-nums">{streakCount}</span>
              </div>
            )}

            <button
              type="button"
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-ocid="nav.dark_mode_toggle"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="bg-muted/40 border-t border-border py-5 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-smooth"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
