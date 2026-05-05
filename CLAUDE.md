# SHIFT - A Glitch Memory Game

## Project Overview

A browser-based brain training game where the interface itself is unreliable. Players must recognize and repeat patterns while the UI "glitches" — colors shift, symbols flicker, and the grid distorts. The core challenge: distinguish real patterns from visual noise.

## Tech Stack

- **Frontend**: SvelteKit (Svelte 5)
- **Styling**: CSS (glitch effects, CRT aesthetic, animations)
- **Canvas**: HTML5 Canvas for advanced visual effects
- **Deployment**: Vercel (free tier)
- **Language**: TypeScript (strict mode)

## Architecture

```
src/
├── lib/
│   ├── game/         # Game engine (state, logic, scoring)
│   ├── glitch/       # Glitch effect system
│   ├── components/   # Svelte UI components
│   └── utils/        # Shared utilities
├── routes/           # SvelteKit pages
└── tests/            # Unit + integration tests
```

## Design Principles

- **Simplicity**: Rules must be explainable in one sentence
- **Glitch-as-gameplay**: Visual distortion is the mechanic, not decoration
- **Progressive difficulty**: Each level adds more unreliable UI elements
- **Performance**: 60fps even with glitch effects active

## Visual Style

- Monochrome base (dark background, light elements)
- CRT scanlines and phosphor glow
- Color shifts (RGB channel separation)
- Elements that subtly "drift" or "tremble"
- Occasional full-screen glitch bursts between levels

## Game Rules

1. A grid shows a pattern of symbols briefly
2. The pattern disappears; player must recreate it
3. Glitch effects distort the grid during memorization
4. Higher levels = more glitches, shorter display time, larger grids
5. Score based on accuracy + speed

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests (vitest)
npm run test:ui      # Tests with UI
npm run lint         # Lint check
npm run check        # Svelte + TS type check

# Deployment
npx vercel           # Deploy to Vercel
```

## Conventions

- Immutable state updates (never mutate game state directly)
- Small, focused files (< 400 lines)
- All game logic must be testable without DOM
- Glitch effects are a separate layer from game logic
- Use Svelte 5 runes ($state, $derived, $effect)

## Testing

- Framework: Vitest
- Game logic: 80%+ coverage required
- Glitch effects: Visual regression tests not required, but logic must be tested
- TDD workflow: write test first, then implement
