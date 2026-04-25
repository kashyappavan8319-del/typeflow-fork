import { useLocation, useNavigate } from "@tanstack/react-router";
import type { TypingStats } from "../types/typing";
import { formatTime } from "../utils/typing";

interface ResultsState {
  stats?: TypingStats;
  passageTitle?: string;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-card border rounded-xl p-5 sm:p-6 text-center shadow-subtle transition-smooth ${
        accent ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      }`}
    >
      <p className="text-label text-muted-foreground mb-2">{label}</p>
      <p
        className={`font-display font-bold text-3xl sm:text-4xl tabular-nums ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ResultsState) ?? {};
  const stats: TypingStats = state.stats ?? {
    wpm: 0,
    accuracy: 0,
    correctWords: 0,
    incorrectWords: 0,
    totalWords: 0,
    elapsedSeconds: 0,
    mistakes: [],
  };
  const passageTitle = state.passageTitle ?? "Typing Session";

  const grade =
    stats.accuracy >= 98 && stats.wpm >= 50
      ? "Excellent"
      : stats.accuracy >= 90
        ? "Good"
        : "Keep practicing";

  return (
    <section
      className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14 animate-fade-in"
      data-ocid="results.page"
    >
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <p className="text-label text-muted-foreground">Results</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
            {passageTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {grade} — {formatTime(stats.elapsedSeconds)} total time
          </p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4" data-ocid="results.stats_grid">
          <StatCard
            label="WPM"
            value={String(stats.wpm)}
            sub="words per minute"
            accent
          />
          <StatCard
            label="Accuracy"
            value={`${stats.accuracy}%`}
            sub="correct words"
          />
          <StatCard
            label="Correct"
            value={String(stats.correctWords)}
            sub="words"
          />
          <StatCard
            label="Mistakes"
            value={String(stats.incorrectWords)}
            sub="words"
          />
        </div>

        {/* Mistake review */}
        {stats.mistakes.length > 0 && (
          <div
            className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-subtle"
            data-ocid="results.mistakes_section"
          >
            <h3 className="font-display font-semibold text-base mb-4 text-foreground">
              Mistakes
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.mistakes.map((m, i) => (
                <div
                  key={`mistake-${m.wordIndex}-${m.expected}`}
                  className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0"
                  data-ocid={`results.mistake.${i + 1}`}
                >
                  <span className="text-muted-foreground font-mono">
                    Expected:
                  </span>
                  <span className="font-mono text-foreground font-semibold">
                    {m.expected}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    Typed:
                  </span>
                  <span className="font-mono text-destructive">
                    {m.typed || "(empty)"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            data-ocid="results.try_again_button"
            onClick={() =>
              navigate({
                to: "/practice",
                search: { levelId: 1, passageId: undefined },
              })
            }
            className="flex-1 bg-primary text-primary-foreground font-display font-semibold text-base px-8 py-4 rounded-lg shadow-elevated hover:opacity-90 active:scale-[0.98] transition-smooth min-h-[44px]"
          >
            Try Again
          </button>
          <button
            type="button"
            data-ocid="results.home_button"
            onClick={() => navigate({ to: "/" })}
            className="flex-1 bg-secondary text-secondary-foreground font-semibold text-base px-8 py-4 rounded-lg border border-border hover:bg-secondary/80 transition-smooth min-h-[44px]"
          >
            ← Home
          </button>
        </div>
      </div>
    </section>
  );
}
