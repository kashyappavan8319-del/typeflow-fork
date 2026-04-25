export type WordStatus =
  | "pending"
  | "current"
  | "correct"
  | "incorrect"
  | "skipped";

export interface WordState {
  word: string;
  status: WordStatus;
  typed: string;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctWords: number;
  incorrectWords: number;
  totalWords: number;
  elapsedSeconds: number;
  mistakes: MistakeEntry[];
}

export interface MistakeEntry {
  expected: string;
  typed: string;
  wordIndex: number;
}

export type SessionPhase = "idle" | "typing" | "finished";

export interface TypingSession {
  phase: SessionPhase;
  words: WordState[];
  currentIndex: number;
  inputValue: string;
  stats: TypingStats;
  startTime: number | null;
}

export interface Passage {
  id: string;
  title: string;
  text: string;
  category: "general" | "tech" | "nature" | "philosophy";
  difficulty: "easy" | "medium" | "hard";
}

export interface Level {
  id: number;
  label: string;
  difficulty: "easy" | "medium" | "hard";
  minAccuracy: number;
  passageIds: string[];
}
