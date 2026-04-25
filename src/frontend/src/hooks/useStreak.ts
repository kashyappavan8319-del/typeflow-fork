import { useCallback, useState } from "react";

interface StreakData {
  count: number;
  lastCompletedDate: string;
}

const STORAGE_KEY = "typeflow-streak";

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
    // ignore
  }
  return { count: 0, lastCompletedDate: "" };
}

function saveStreak(data: StreakData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round(Math.abs(a - b) / (1000 * 60 * 60 * 24));
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  const recordCompletion = useCallback(() => {
    const today = todayISO();
    setStreak((prev) => {
      if (prev.lastCompletedDate === today) return prev;

      let newCount: number;
      if (!prev.lastCompletedDate) {
        newCount = 1;
      } else {
        const diff = diffDays(prev.lastCompletedDate, today);
        newCount = diff === 1 ? prev.count + 1 : 1;
      }

      const updated: StreakData = { count: newCount, lastCompletedDate: today };
      saveStreak(updated);
      return updated;
    });
  }, []);

  return { streakCount: streak.count, recordCompletion };
}
