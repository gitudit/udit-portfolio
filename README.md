# The Ride — udit-portfolio

Personal portfolio, served from GitHub Pages at <https://gitudit.github.io/udit-portfolio/>.

A theme park with four lands. The ride runs through the first three: Campus Grounds, the Training
Track (internships, "junior coasters") and, after a height check, the Thrill Zone (full-time
"hypercoasters"). Each land has its own sky, an entrance gate with pennants and string lights, and a
station per stop with a ride card, a thrill meter and an interactive attraction. The Midway is where
you get off and play: a 3D carousel of skills and a row of open-source side attractions. A park map
(mini-map in the corner, full map on `M`) shows where you are; a sticky ticket gets stamped at every
station and collected at the exit. Day/night themes, opt-in synthesised sounds, a command palette, a
terminal, achievements and an express pass round it off.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19.3 with the React Compiler (Oxc port via `@vitejs/plugin-react`) |
| Language | TypeScript 6, `strict` plus `noImplicitOverride`, `noUnusedLocals`, `verbatimModuleSyntax` |
| Build | Vite 8 on Rolldown and Oxc, Lightning CSS |
| Pre-render | `react-dom/static` `prerender()` at build time, stylesheet inlined |
| Lint | ESLint 10 flat config, `typescript-eslint`, `eslint-plugin-react-hooks` 7 |
| Node | 26 (`.nvmrc`), engines `>=22.12` |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Fast Refresh (client-rendered, no pre-render). |
| `npm run build` | Type-check → client build → SSR build → pre-render into `build/index.html`. |
| `npm run preview` | Serve the production `build/` locally. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint over the repo. |
| `npm run format` | Prettier. |
| `npm run deploy` | Build and push `build/` to the `gh-pages` branch. |
| `node scripts/subset-fonts.mjs` | Regenerate the subset variable fonts in `src/assets/fonts` from `tools/fonts-src`. |

Use Node 26: `nvm use` (nvm-windows: `nvm use 26.12.0`).

Environment variables live in `.env` and must be prefixed with `VITE_`: `VITE_serviceId`,
`VITE_templateId`, `VITE_userId` (EmailJS public ids, used by the contact form).

## Where things are

- `src/content/ride.ts` — all content and its types: `person`, `lands`, `stations`, `skills`,
  `specialities`, `projects`, `caseStudies`, `achievements`. Edit copy here.
- `src/lib/store.ts` — the shared UI store (stamps, achievements, overlays, zone, sound, calm ride) and
  its actions. Persisted keys are `ride:*` in `localStorage`, applied after hydration.
- `src/lib/theme.ts` — day/night switch with the View Transitions wipe; the attribute itself is set
  before paint by the inline script in `index.html`.
- `src/lib/sound.ts` — Web Audio synthesised sounds, zero bytes downloaded, off until the visitor opts in.
- `src/components/Line.tsx`, `LandGate.tsx`, `FastPass.tsx`, `Station.tsx` — the ride: lands, gates, the
  height check and the stations. The rail lights up with a CSS scroll-driven animation
  (`animation-timeline`), with an IntersectionObserver fallback.
- `src/components/Sky.tsx` — one fixed layer per land, cross-faded by each land's view timeline
  (`data-land` attribute fallback).
- `src/components/mapData.ts`, `MapGraphic.tsx`, `ParkMap.tsx` — the park map: one SVG path, pins and
  the "you are here" car on CSS motion paths.
- `src/components/Midway.tsx` — the skills carousel and the project posters.
- `src/components/attractions/*` — one lazy vignette per station, each generic by design.
- `src/styles/tokens.css` → `app.css` → `details.css` → `park.css` — design tokens, components, details,
  the park, all in cascade layers.
- `scripts/prerender.mjs` — injects the pre-rendered markup and inlines the CSS.

## Accessibility and motion

- Every overlay is a `role="dialog"` with `aria-modal`, initial focus, Escape to close, and focus
  returned to the element that opened it. The page behind is `inert`.
- `prefers-reduced-motion` and the in-page "calm ride" toggle disable the shader, the marquee, the
  carousel spin (it becomes a flat grid), scroll effects, confetti and view transitions.
- The pre-rendered HTML carries the full content, so the park reads top to bottom without JavaScript.
