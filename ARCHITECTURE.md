# Architecture Overview

This document summarizes the structure of the Timebox application after flattening the previous nested `time-boxing-app/` directory into the repository root.

## Layers

1. UI Components (`src/components`)
   - Feature-specific folders (e.g. `TimeBox`, `TimeBoxEditor`, `TimerDisplay`).
   - Shared primitives under `components/shared`.
2. Pages (`src/pages`)
   - Route-level containers (Home, History, Settings).
3. Routing (`src/routes`)
   - Central route definitions consumed by `App.tsx`.
4. State
   - React Contexts in `src/context` (`TimerContext`, `TimeBlockContext`).
   - MobX store in `src/store/SettingsStore.ts` (UI/behavior settings like drag enable/lock).
5. Hooks (`src/hooks`)
   - Encapsulate domain logic (e.g. timer lifecycle, time block management, feature detection like emoji support).
6. Utilities (`src/utils`)
   - Non-React helpers (time formatting, audio, global timer abstraction).
7. Types (`src/types`)
   - Domain model (`TimeBlock`) and ambient typings (CSS Modules).
8. Styling
   - CSS Modules co-located with components.
   - Global tokens in `src/styles/variables.css`.
9. Tests
   - Unit tests in `src/__tests__` and asset mocks under `test/__mocks__`.

## Build & Tooling

- Vite (`vite.config.ts`) handles dev + build.
- TypeScript project references split: `tsconfig.app.json` for application source; `tsconfig.node.json` for build tooling.
- Jest + `ts-jest` for unit tests (`jest.config.js`).
- ESLint flat config (`eslint.config.js`).
- Vercel deployment (`vercel.json`) with SPA rewrite to `index.html`.

## Deployment

`npm run build` outputs to `dist/`. Vercel configuration expects this directory at root.

## Future Enhancements

- Consider adding persistence (localStorage or IndexedDB) for time blocks and settings.
- Add integration tests for timer flow and drag/reorder interactions.
- Optionally introduce lazy-loaded page chunks for non-home routes.

## Migration Notes

All files previously under `time-boxing-app/` have been relocated. That directory can now be safely removed once any lingering references (e.g. in CI configs or external docs) are updated.
