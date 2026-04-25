import type {
  MistakeEntry,
  TypingStats,
  WordState,
  WordStatus,
} from "../types/typing";

export function buildWordStates(text: string): WordState[] {
  return text.split(" ").map((word) => ({
    word,
    status: "pending" as WordStatus,
    typed: "",
  }));
}

export function calculateWPM(
  correctWords: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds < 1) return 0;
  return Math.round((correctWords / elapsedSeconds) * 60);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function evaluateWord(
  typed: string,
  expected: string,
): "correct" | "incorrect" {
  return typed.trim() === expected ? "correct" : "incorrect";
}

export function buildStats(
  words: WordState[],
  startTime: number,
  endTime: number,
): TypingStats {
  const elapsedSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));
  const attempted = words.filter(
    (w) => w.status !== "pending" && w.status !== "current",
  );
  const correctWords = attempted.filter((w) => w.status === "correct").length;
  const incorrectWords = attempted.filter(
    (w) => w.status === "incorrect",
  ).length;
  const totalWords = attempted.length;

  const mistakes: MistakeEntry[] = words
    .map((w, i) => ({ ...w, index: i }))
    .filter((w) => w.status === "incorrect")
    .map((w) => ({ expected: w.word, typed: w.typed, wordIndex: w.index }));

  return {
    wpm: calculateWPM(correctWords, elapsedSeconds),
    accuracy: calculateAccuracy(correctWords, totalWords),
    correctWords,
    incorrectWords,
    totalWords,
    elapsedSeconds,
    mistakes,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}
