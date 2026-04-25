import type { Passage } from "../types/typing";

export const passages: Passage[] = [
  {
    id: "p1",
    title: "The Art of Focus",
    text: "The ability to focus deeply on a single task is becoming increasingly rare in a world of constant distraction. Those who cultivate this skill gain a significant advantage in their work and creative pursuits. Deep focus is not just about productivity but about experiencing flow.",
    category: "general",
    difficulty: "medium",
  },
  {
    id: "p2",
    title: "Morning Routines",
    text: "A consistent morning routine can set the tone for the entire day. Starting with calm intentional actions rather than reactive ones builds momentum and mental clarity. Even small rituals like brewing tea or stretching can anchor your mindset before the day begins.",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "p3",
    title: "Code as Craft",
    text: "Writing clean code is an act of respect toward your future self and your collaborators. Clear naming, small functions, and thoughtful structure make software a pleasure to work with. Every line you write is a decision about how to communicate intent.",
    category: "tech",
    difficulty: "medium",
  },
  {
    id: "p4",
    title: "The Quiet Ocean",
    text: "At dawn the ocean breathes slowly, its surface a mirror for the pale sky. Seabirds trace arcs above the water, calling out to one another across the stillness. The rhythm of the waves is ancient, indifferent, and strangely comforting to those who stand at the shore.",
    category: "nature",
    difficulty: "medium",
  },
  {
    id: "p5",
    title: "Simplicity",
    text: "Simplicity is not the absence of complexity but the mastery of it. A well-designed tool does exactly what it needs to do and nothing more. In both craft and life, removing what is unnecessary reveals what truly matters.",
    category: "philosophy",
    difficulty: "easy",
  },
  {
    id: "p6",
    title: "Building Habits",
    text: "Habits are not built through motivation alone but through consistent repetition over time. Each small action reinforces a neural pathway until the behavior becomes automatic. The secret to lasting change is making the right choice the easy choice.",
    category: "general",
    difficulty: "medium",
  },
  {
    id: "p7",
    title: "Open Source",
    text: "Open source software represents one of the great collaborative achievements of the modern era. Thousands of developers across the world contribute their time and expertise to build tools that everyone can use freely. This culture of sharing accelerates innovation for all.",
    category: "tech",
    difficulty: "hard",
  },
  {
    id: "p8",
    title: "Forest Light",
    text: "Walking through a dense forest in the early morning light is a meditation in itself. The canopy filters sunlight into shifting patterns on the mossy ground. Each step on the soft earth feels deliberate, unhurried, a reminder to slow down and simply be present.",
    category: "nature",
    difficulty: "hard",
  },
];

export function getRandomPassage(exclude?: string): Passage {
  const pool = exclude ? passages.filter((p) => p.id !== exclude) : passages;
  return pool[Math.floor(Math.random() * pool.length)];
}
