import { useCallback, useState } from "react";
import { levels } from "../data/levels";
import type { Level } from "../types/typing";

interface LevelProgressData {
  currentLevel: number;
  unlockedLevels: number[];
}

const STORAGE_KEY = "typeflow-level-progress";

function loadProgress(): LevelProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LevelProgressData;
  } catch {
    // ignore
  }
  return { currentLevel: 1, unlockedLevels: [1] };
}

function saveProgress(data: LevelProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLevelProgress() {
  const [progress, setProgress] = useState<LevelProgressData>(loadProgress);
  const [selectedLevelId, setSelectedLevelId] = useState<number>(
    progress.currentLevel,
  );

  const selectedLevel: Level | undefined = levels.find(
    (l) => l.id === selectedLevelId,
  );

  const selectLevel = useCallback((id: number) => {
    setSelectedLevelId(id);
    setProgress((prev) => {
      const updated = { ...prev, currentLevel: id };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const completeLevel = useCallback((id: number, accuracy: number) => {
    const level = levels.find((l) => l.id === id);
    if (!level) return false;

    const passed = accuracy >= level.minAccuracy;

    setProgress((prev) => {
      const nextId = id + 1;
      const alreadyUnlocked = prev.unlockedLevels.includes(nextId);
      if (passed && nextId <= 10 && !alreadyUnlocked) {
        const updated: LevelProgressData = {
          currentLevel: id,
          unlockedLevels: [...prev.unlockedLevels, nextId],
        };
        saveProgress(updated);
        return updated;
      }
      return prev;
    });

    return passed;
  }, []);

  return {
    currentLevel: progress.currentLevel,
    unlockedLevels: progress.unlockedLevels,
    selectedLevel,
    selectLevel,
    completeLevel,
  };
}
