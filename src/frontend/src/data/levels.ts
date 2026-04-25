import type { Level } from "../types/typing";

export const levels: Level[] = [
  {
    id: 1,
    label: "Beginner",
    difficulty: "easy",
    minAccuracy: 70,
    passageIds: ["p2", "p5"],
  },
  {
    id: 2,
    label: "Starter",
    difficulty: "easy",
    minAccuracy: 70,
    passageIds: ["p5", "p2"],
  },
  {
    id: 3,
    label: "Basic",
    difficulty: "easy",
    minAccuracy: 70,
    passageIds: ["p2", "p5"],
  },
  {
    id: 4,
    label: "Moderate",
    difficulty: "medium",
    minAccuracy: 75,
    passageIds: ["p1", "p3"],
  },
  {
    id: 5,
    label: "Steady",
    difficulty: "medium",
    minAccuracy: 75,
    passageIds: ["p4", "p6"],
  },
  {
    id: 6,
    label: "Capable",
    difficulty: "medium",
    minAccuracy: 75,
    passageIds: ["p3", "p1"],
  },
  {
    id: 7,
    label: "Advanced",
    difficulty: "hard",
    minAccuracy: 80,
    passageIds: ["p7", "p8"],
  },
  {
    id: 8,
    label: "Expert",
    difficulty: "hard",
    minAccuracy: 80,
    passageIds: ["p8", "p7"],
  },
  {
    id: 9,
    label: "Master",
    difficulty: "hard",
    minAccuracy: 80,
    passageIds: ["p7", "p8"],
  },
  {
    id: 10,
    label: "Legend",
    difficulty: "hard",
    minAccuracy: 80,
    passageIds: ["p8", "p7"],
  },
];

export function getLevelById(id: number): Level | undefined {
  return levels.find((l) => l.id === id);
}
