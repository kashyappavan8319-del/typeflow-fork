import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { levels } from "../data/levels";
import { passages } from "../data/passages";
import { useLevelProgress } from "../hooks/useLevelProgress";
import { useStreak } from "../hooks/useStreak";
import { useTypingSession } from "../hooks/useTypingSession";
import type { Passage, WordState } from "../types/typing";
import { formatTime } from "../utils/typing";

// ─── character-level inline rendering ───────────────────────────────────────
function renderInlineTyped(typed: string, expected: string) {
  return expected.split("").map((ch, charIdx) => {
    const typedCh = typed[charIdx];
    const key = `char-${charIdx}`;
    if (typedCh === undefined)
      return (
        <span key={key} className="text-foreground/40">
          {ch}
        </span>
      );
    if (typedCh === ch)
      return (
        <span key={key} className="text-foreground">
          {ch}
        </span>
      );
    return (
      <span key={key} className="text-destructive underline">
        {ch}
      </span>
    );
  });
}

function WordToken({
  word,
  wordKey,
  isCurrent,
}: { word: WordState; wordKey: string; isCurrent: boolean }) {
  const baseClass =
    "inline-block mr-[0.35em] mb-1 rounded px-0.5 transition-smooth text-base sm:text-lg font-mono leading-relaxed";
  let colorClass = "text-foreground/70";
  if (word.status === "correct") colorClass = "text-foreground";
  if (word.status === "incorrect")
    colorClass = "bg-destructive/15 text-destructive";
  if (word.status === "current")
    colorClass = "bg-primary/20 text-foreground ring-1 ring-primary/40";

  return (
    <span className={`${baseClass} ${colorClass}`} data-word-key={wordKey}>
      {word.status === "current" && word.typed
        ? renderInlineTyped(word.typed, word.word)
        : word.word}
      {isCurrent && word.status === "current" && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

// ─── Level Completion Popup ──────────────────────────────────────────────────
interface CompletionPopupProps {
  levelId: number;
  wpm: number;
  accuracy: number;
  passed: boolean;
  isLastLevel: boolean;
  onTryAgain: () => void;
  onNextLevel: () => void;
}

function CompletionPopup({
  levelId,
  wpm,
  accuracy,
  passed,
  isLastLevel,
  onTryAgain,
  onNextLevel,
}: CompletionPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      data-ocid="practice.completion_dialog"
    >
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-elevated p-8 text-center animate-fade-in">
        {/* Status emoji */}
        <div className="text-5xl mb-4">{passed ? "🎉" : "💪"}</div>

        <h2 className="font-display font-bold text-2xl text-foreground mb-1">
          {passed
            ? isLastLevel
              ? "All Levels Complete!"
              : `Level ${levelId} Complete!`
            : `Level ${levelId} Failed`}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {passed
            ? isLastLevel
              ? "You've mastered all 10 levels!"
              : "Great job! Keep going."
            : "Keep practising — you've got this."}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary tabular-nums">
              {wpm}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">WPM</p>
          </div>
          <div className="text-center">
            <p
              className={`text-3xl font-display font-bold tabular-nums ${passed ? "text-emerald-500" : "text-rose-500"}`}
            >
              {accuracy}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Accuracy</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isLastLevel && passed ? (
            <button
              type="button"
              onClick={onTryAgain}
              data-ocid="practice.play_again_button"
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-smooth min-h-[44px]"
            >
              Play Again
            </button>
          ) : (
            <>
              {passed && (
                <button
                  type="button"
                  onClick={onNextLevel}
                  data-ocid="practice.next_level_button"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-smooth min-h-[44px]"
                >
                  Next Level →
                </button>
              )}
              <button
                type="button"
                onClick={onTryAgain}
                data-ocid="practice.try_again_button"
                className="w-full px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-smooth min-h-[44px] border border-border"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PracticePage ─────────────────────────────────────────────────────────────
export function PracticePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    levelId?: number;
    passageId?: string;
  };

  const levelId = Number(search.levelId ?? 1);
  const passageId = search.passageId as string | undefined;

  // Resolve the passage from search params
  const initialPassage: Passage =
    passages.find((p) => p.id === passageId) ?? passages[0];

  const { completeLevel } = useLevelProgress();
  const { recordCompletion } = useStreak();

  const {
    session,
    passage,
    elapsed,
    liveWpm,
    handleInput,
    handleKeyDown,
    restart,
  } = useTypingSession(initialPassage);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [completionHandled, setCompletionHandled] = useState(false);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle session finish
  useEffect(() => {
    if (session.phase === "finished" && !completionHandled) {
      setCompletionHandled(true);
      completeLevel(levelId, session.stats.accuracy);
      recordCompletion();
      setShowPopup(true);
    }
  }, [
    session.phase,
    session.stats.accuracy,
    levelId,
    completeLevel,
    recordCompletion,
    completionHandled,
  ]);

  // Scroll current word into view
  useEffect(() => {
    if (!wordsContainerRef.current) return;
    const currentEl = wordsContainerRef.current.querySelector(
      `[data-word-key="word-${session.currentIndex}"]`,
    );
    if (currentEl) {
      currentEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [session.currentIndex]);

  const wpm = liveWpm();

  const passed =
    session.stats.accuracy >=
    ([1, 2, 3].includes(levelId) ? 70 : [4, 5, 6].includes(levelId) ? 75 : 80);
  const isLastLevel = levelId === 10;

  function handleTryAgain() {
    setShowPopup(false);
    setCompletionHandled(false);
    restart(initialPassage);
  }

  function handleNextLevel() {
    const nextId = levelId + 1;
    if (nextId > 10) return;
    const nextLevel = levels.find((l) => l.id === nextId);
    const nextPassageId = nextLevel?.passageIds[0] ?? passages[0].id;
    navigate({
      to: "/practice",
      search: { levelId: nextId, passageId: nextPassageId },
    });
  }

  return (
    <section
      className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12"
      data-ocid="practice.page"
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Level {levelId}
              </span>
              <h2 className="font-display font-semibold text-lg text-foreground truncate">
                {passage.title}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              {passage.category} · {passage.difficulty}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {session.phase === "typing" && (
              <>
                <div className="text-center" data-ocid="practice.wpm_display">
                  <p className="text-label text-muted-foreground">WPM</p>
                  <p className="font-display font-bold text-xl text-primary tabular-nums">
                    {wpm}
                  </p>
                </div>
                <div className="text-center" data-ocid="practice.timer_display">
                  <p className="text-label text-muted-foreground">Time</p>
                  <p className="font-display font-bold text-xl text-foreground tabular-nums">
                    {formatTime(elapsed)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Text display */}
        <div
          className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-subtle cursor-text"
          data-ocid="practice.text_area"
        >
          <div
            ref={wordsContainerRef}
            className="max-h-48 overflow-y-auto leading-loose"
          >
            {session.words.map((word, i) => (
              <WordToken
                key={`word-${i}-${word.word}`}
                word={word}
                wordKey={`word-${i}`}
                isCurrent={i === session.currentIndex}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${session.words.length > 0 ? (session.currentIndex / session.words.length) * 100 : 0}%`,
              }}
              data-ocid="practice.progress_bar"
            />
          </div>
        </div>

        {/* Visible input */}
        <div className="bg-card border-2 border-primary/30 focus-within:border-primary rounded-xl px-5 py-4 transition-smooth shadow-subtle">
          <p className="text-label text-muted-foreground mb-2">Current word</p>
          <input
            ref={inputRef}
            type="text"
            value={session.inputValue}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={session.phase === "finished"}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            placeholder={
              session.phase === "idle" ? "Start typing to begin…" : ""
            }
            aria-label="Type current word"
            className="w-full bg-transparent text-foreground text-base sm:text-lg font-mono outline-none placeholder:text-muted-foreground min-h-[44px]"
            data-ocid="practice.word_input"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            type="button"
            data-ocid="practice.restart_button"
            onClick={handleTryAgain}
            className="flex-1 sm:flex-none px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-smooth min-h-[44px] border border-border"
          >
            Restart
          </button>
          <button
            type="button"
            data-ocid="practice.home_button"
            onClick={() => navigate({ to: "/" })}
            className="flex-1 sm:flex-none px-6 py-3 bg-transparent text-muted-foreground font-semibold rounded-lg hover:bg-muted transition-smooth min-h-[44px] border border-border"
          >
            ← Home
          </button>
        </div>

        {session.phase === "idle" && (
          <p
            className="text-center text-sm text-muted-foreground animate-fade-in"
            data-ocid="practice.hint"
          >
            Click the input above and start typing — the timer starts
            automatically.
          </p>
        )}
      </div>

      {/* Level completion popup */}
      {showPopup && (
        <CompletionPopup
          levelId={levelId}
          wpm={session.stats.wpm}
          accuracy={session.stats.accuracy}
          passed={passed}
          isLastLevel={isLastLevel}
          onTryAgain={handleTryAgain}
          onNextLevel={handleNextLevel}
        />
      )}
    </section>
  );
}
