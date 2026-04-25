import { useCallback, useEffect, useRef, useState } from "react";
import { getRandomPassage } from "../data/passages";
import type { Passage, TypingSession, WordState } from "../types/typing";
import { buildStats, buildWordStates, evaluateWord } from "../utils/typing";

const initialStats = {
  wpm: 0,
  accuracy: 100,
  correctWords: 0,
  incorrectWords: 0,
  totalWords: 0,
  elapsedSeconds: 0,
  mistakes: [],
};

function makeSession(passage: Passage): TypingSession {
  return {
    phase: "idle",
    words: buildWordStates(passage.text),
    currentIndex: 0,
    inputValue: "",
    stats: initialStats,
    startTime: null,
  };
}

export function useTypingSession(initialPassage?: Passage) {
  const [passage, setPassage] = useState<Passage>(
    () => initialPassage ?? getRandomPassage(),
  );
  const [session, setSession] = useState<TypingSession>(() =>
    makeSession(initialPassage ?? getRandomPassage()),
  );
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live timer
  useEffect(() => {
    if (session.phase === "typing" && session.startTime !== null) {
      timerRef.current = setInterval(() => {
        setElapsed(
          Math.round((Date.now() - (session.startTime ?? Date.now())) / 1000),
        );
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.phase, session.startTime]);

  const liveWpm = useCallback(() => {
    if (elapsed < 1 || session.phase !== "typing") return 0;
    const correct = session.words.filter((w) => w.status === "correct").length;
    return Math.round((correct / elapsed) * 60);
  }, [elapsed, session.phase, session.words]);

  const handleInput = useCallback((value: string) => {
    setSession((prev) => {
      if (prev.phase === "finished") return prev;

      const endsWithSpace = value.endsWith(" ");
      const trimmed = value.trimEnd();

      // Start timer on first keystroke
      const startTime =
        prev.startTime ?? (prev.phase === "idle" ? Date.now() : prev.startTime);
      const phase = prev.phase === "idle" ? "typing" : prev.phase;

      const newWords: WordState[] = [...prev.words];
      const idx = prev.currentIndex;

      if (endsWithSpace && trimmed.length > 0) {
        // Commit current word
        const result = evaluateWord(trimmed, newWords[idx].word);
        newWords[idx] = { ...newWords[idx], status: result, typed: trimmed };

        const nextIndex = idx + 1;

        // Check if last word
        if (nextIndex >= newWords.length) {
          const stats = buildStats(
            newWords,
            startTime ?? Date.now(),
            Date.now(),
          );
          return {
            ...prev,
            phase: "finished",
            words: newWords,
            currentIndex: nextIndex,
            inputValue: "",
            stats,
            startTime,
          };
        }

        newWords[nextIndex] = { ...newWords[nextIndex], status: "current" };
        return {
          ...prev,
          phase,
          words: newWords,
          currentIndex: nextIndex,
          inputValue: "",
          stats: prev.stats,
          startTime,
        };
      }

      // Live update current word
      newWords[idx] = { ...newWords[idx], status: "current", typed: trimmed };
      return {
        ...prev,
        phase,
        words: newWords,
        currentIndex: idx,
        inputValue: value,
        stats: prev.stats,
        startTime,
      };
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter commits the current word; only finishes the session on the last word
      if (e.key === "Enter") {
        setSession((prev) => {
          if (prev.phase === "finished") return prev;
          const idx = prev.currentIndex;
          const newWords: WordState[] = [...prev.words];
          const typed = prev.inputValue.trimEnd();
          if (!typed) return prev;
          const result = evaluateWord(typed, newWords[idx].word);
          newWords[idx] = { ...newWords[idx], status: result, typed };
          const startTime = prev.startTime ?? Date.now();
          const phase = prev.phase === "idle" ? "typing" : prev.phase;

          // Last word — finish the session
          if (idx === newWords.length - 1) {
            const stats = buildStats(newWords, startTime, Date.now());
            return {
              ...prev,
              phase: "finished",
              words: newWords,
              inputValue: "",
              stats,
              startTime,
            };
          }

          // Not the last word — advance to the next word
          const nextIndex = idx + 1;
          newWords[nextIndex] = { ...newWords[nextIndex], status: "current" };
          return {
            ...prev,
            phase,
            words: newWords,
            currentIndex: nextIndex,
            inputValue: "",
            startTime,
          };
        });
      }
    },
    [],
  );

  const restart = useCallback(
    (newPassage?: Passage) => {
      const p = newPassage ?? getRandomPassage(passage.id);
      setPassage(p);
      setElapsed(0);
      const fresh = makeSession(p);
      // Mark first word as current
      fresh.words[0] = { ...fresh.words[0], status: "current" };
      fresh.phase = "idle";
      setSession(fresh);
    },
    [passage.id],
  );

  // Initialize first word as current
  useEffect(() => {
    setSession((prev) => {
      if (prev.words.length > 0 && prev.words[0].status === "pending") {
        const words = [...prev.words];
        words[0] = { ...words[0], status: "current" };
        return { ...prev, words };
      }
      return prev;
    });
  }, []);

  return {
    session,
    passage,
    elapsed,
    liveWpm,
    handleInput,
    handleKeyDown,
    restart,
  };
}
