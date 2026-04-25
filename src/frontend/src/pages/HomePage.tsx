import { useNavigate } from "@tanstack/react-router";
import { Lock, X } from "lucide-react";
import { useState } from "react";
import { levels } from "../data/levels";
import { passages } from "../data/passages";
import { useLevelProgress } from "../hooks/useLevelProgress";

const difficultyColor: Record<string, string> = {
  easy: "text-emerald-500",
  medium: "text-amber-500",
  hard: "text-rose-500",
};

const difficultyBg: Record<string, string> = {
  easy: "bg-emerald-500/10 border-emerald-500/30",
  medium: "bg-amber-500/10 border-amber-500/30",
  hard: "bg-rose-500/10 border-rose-500/30",
};

export function HomePage() {
  const navigate = useNavigate();
  const { unlockedLevels, selectedLevel, selectLevel } = useLevelProgress();
  const [showLevels, setShowLevels] = useState(false);
  const [tempSelectedId, setTempSelectedId] = useState<number>(
    selectedLevel?.id ?? 1,
  );

  function openLevelSelector() {
    setTempSelectedId(selectedLevel?.id ?? 1);
    setShowLevels(true);
  }

  function handleStart() {
    selectLevel(tempSelectedId);
    const level = levels.find((l) => l.id === tempSelectedId);
    const passageId = level?.passageIds[0] ?? passages[0].id;
    navigate({
      to: "/practice",
      search: { levelId: tempSelectedId, passageId },
    });
  }

  return (
    <section
      className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-16"
      data-ocid="home.page"
    >
      <div className="w-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-heading font-display text-foreground">
            Type <span className="text-primary">Naturally</span>
          </h1>
          <p className="text-body max-w-lg mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
            A calm, premium typing practice experience. Real words, real rhythm
            — no rigid drills, just you and your keyboard.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Real-time WPM",
            "Accuracy tracking",
            "10 Levels",
            "Daily Streak",
            "Dark mode",
          ].map((feat) => (
            <span
              key={feat}
              className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold border border-border"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div>
          <button
            type="button"
            data-ocid="home.start_button"
            onClick={openLevelSelector}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-semibold text-base px-8 py-4 rounded-lg shadow-elevated hover:opacity-90 active:scale-[0.98] transition-smooth min-h-[44px] min-w-[200px]"
          >
            Start Typing
          </button>
        </div>

        {/* Preview card */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6 sm:p-8 shadow-subtle text-left">
          <p className="font-mono text-sm sm:text-base leading-loose text-foreground/80 select-none pointer-events-none">
            <span className="text-primary font-semibold">The ability</span>{" "}
            <span className="bg-primary/15 text-primary rounded px-0.5">
              to focus
            </span>{" "}
            <span className="text-muted-foreground">
              deeply on a single task is becoming
            </span>{" "}
            <span className="bg-destructive/15 text-destructive rounded px-0.5">
              incresingly
            </span>{" "}
            <span className="text-muted-foreground">
              rare in a world of constant distraction…
            </span>
          </p>
          <p className="mt-4 text-xs text-muted-foreground text-label">
            ✦ live word highlighting preview
          </p>
        </div>
      </div>

      {/* Level Selector Overlay */}
      {showLevels && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          data-ocid="home.level_selector_overlay"
        >
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-elevated p-6 sm:p-8 relative animate-fade-in">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowLevels(false)}
              aria-label="Close level selector"
              className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-ocid="home.level_selector_close_button"
            >
              <X size={18} />
            </button>

            <div className="mb-6 text-center">
              <h2 className="font-display font-bold text-xl text-foreground">
                Choose Your Level
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select a level to begin your typing session
              </p>
            </div>

            {/* Level grid */}
            <div
              className="grid grid-cols-5 gap-2 sm:gap-3"
              data-ocid="home.level_grid"
            >
              {levels.map((level) => {
                const unlocked = unlockedLevels.includes(level.id);
                const isSelected = tempSelectedId === level.id;

                return (
                  <button
                    key={level.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && setTempSelectedId(level.id)}
                    aria-label={`Level ${level.id}: ${level.label}`}
                    data-ocid={`home.level_box.${level.id}`}
                    className={[
                      "relative flex flex-col items-center justify-center rounded-xl border-2 p-3 sm:p-4 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      unlocked
                        ? isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : `border-border ${difficultyBg[level.difficulty]} hover:border-primary/50 cursor-pointer`
                        : "border-border bg-muted/40 cursor-not-allowed opacity-50",
                    ].join(" ")}
                  >
                    <span
                      className={`font-display font-bold text-2xl sm:text-3xl leading-none ${unlocked ? difficultyColor[level.difficulty] : "text-muted-foreground"}`}
                    >
                      {level.id}
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium mt-1 text-muted-foreground capitalize truncate max-w-full">
                      {level.label}
                    </span>
                    {!unlocked && (
                      <Lock
                        size={10}
                        className="absolute top-1.5 right-1.5 text-muted-foreground"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Difficulty legend */}
            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Easy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Hard
              </span>
            </div>

            {/* Start button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleStart}
                data-ocid="home.level_start_button"
                className="px-8 py-3 bg-primary text-primary-foreground font-display font-semibold rounded-lg shadow-elevated hover:opacity-90 active:scale-[0.98] transition-smooth min-h-[44px] min-w-[160px]"
              >
                Start Level {tempSelectedId}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
