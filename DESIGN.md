# Design Brief

## Direction

Cool Slate Blue Minimalism — A calm, focused typing practice platform designed around serene interactions with a unified Slate Blue tonal palette.

## Tone

Refined restraint anchored in cool undertones; every UI element descends from the same Slate Blue hue family, eliminating visual noise while maintaining depth through lightness shifts.

## Differentiation

Slate Blue tonal unity across all UI surfaces (background, cards, buttons, accents) with smooth 300ms transitions creating a meditative, distraction-free typing experience.

## Color Palette

| Token       | OKLCH         | Role                              |
| ----------- | ------------- | --------------------------------- |
| background  | 0.98 0.008 230 | Off-white, cool undertone         |
| foreground  | 0.18 0.015 230 | Deep slate text                   |
| card        | 1.0 0.004 230 | Pristine white for content zones  |
| primary     | 0.42 0.14 240 | Deep ocean blue (Slate Blue core) |
| secondary   | 0.95 0.01 230 | Pale slate tint                   |
| muted       | 0.94 0.01 230 | Light neutral                     |
| accent      | 0.6 0.15 170 | Cool teal (rare highlights)      |

## Typography

- **Display:** Space Grotesk — bold, geometric headings & hero text
- **Body:** Figtree — modern, readable body text & UI labels
- **Mono:** Geist Mono — for stats/performance indicators
- **Scale:** Hero `text-4xl md:text-5xl font-bold`, h2 `text-xl md:text-2xl font-semibold`, label `text-xs font-semibold uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Minimal shadow hierarchy: subtle 2px shadows on cards (elevation), elevated 4px shadows on interactive overlays; no shadows on flat content zones.

## Structural Zones

| Zone    | Background        | Border              | Notes                    |
| ------- | ----------------- | ------------------- | ------------------------ |
| Header  | secondary (pale)  | border (subtle)     | Nav bar with logo/title  |
| Content | background (cool) | —                   | Spacious padding (2-4rem)|
| Card    | card (pristine)   | border (very faint) | Rounded 8px shadows      |
| Footer  | muted (pale)      | border (top only)   | Secondary info, centered |

## Spacing & Rhythm

Spacious 2–4rem section gaps; content zones grouped in cards with 8px internal padding; microspacing 4–8px between UI elements; breathing room prioritized over density.

## Component Patterns

- **Buttons:** Slate Blue background, white text, 8px radius, 44px min height (mobile), 300ms hover transition, subtle shadow on elevation
- **Cards:** White background, faint border, 8px radius, subtle shadow, 16–24px padding
- **Input fields:** Light slate background, 8px radius, focus ring in primary blue
- **Badges:** Muted background with foreground text, 4px radius, no shadow

## Motion

- **Entrance:** 300ms fade-in on page load, staggered 100ms per section
- **Hover:** 300ms color/shadow transition on buttons & links; cursor feedback immediate
- **Highlight:** Real-time word highlighting with smooth transition between correct/incorrect states

## Constraints

- No decorative gradients; tonal shifts only
- Avoid clutter; whitespace is content
- Minimum 44px tap targets on all interactive elements
- Max 2-column layout on desktop; 1-column mobile-first
- All colors from Slate Blue family (hue ~240°) except rare accent teal

## Signature Detail

Slate Blue as a unifying design constraint — every surface derives from the same hue, creating visual cohesion that feels premium and intentional rather than generic.

