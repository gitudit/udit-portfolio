# The Ride — udit-portfolio

Personal portfolio, served from GitHub Pages at <https://gitudit.github.io/udit-portfolio/>.

A seven-stop "theme park ride" through my career: a scroll-driven line with a car pinned near the eye
line, a sticky ticket that gets stamped at every station, an interactive attraction per stop, a command
palette, a terminal, a live Core Web Vitals panel, day/night themes with a circular wipe, and
synthesised interface sounds (off by default).

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | **React 19.3** + **React Compiler** (Oxc port via `@vitejs/plugin-react`) | Automatic memoisation; no hand-written `useMemo`/`useCallback`. |
| Language | **TypeScript 6**, `strict` plus `noImplicitOverride`, `noUnusedLocals`, `verbatimModuleSyntax` | Whole classes of regressions do not compile. `npm run build` type-checks first. |
| Build | **Vite 8** on Rolldown + Oxc, Lightning CSS | One fast toolchain for dev, build, SSR bundle and minification. |
| Pre-render | `react-dom/static` `prerender()` at build time | The HTML paints before any JavaScript; React hydrates. |
| Lint | ESLint 10 flat config, `typescript-eslint`, `eslint-plugin-react-hooks` 7 (compiler rules) | Rules of React enforced in CI-style, including `set-state-in-effect`. |
| Node | **26** (`.nvmrc`), engines `>=22.12` | Required by Vite 8. |

### React 19 APIs in use, and where

| API | Where | What it buys |
|---|---|---|
| `useActionState` + `useFormStatus` | `components/ContactForm.tsx` | The contact form is a form action: pending state, validation and typed values round-tripped, no page reload. |
| `use(promise)` + `Suspense` | `components/HoodPanel.tsx` | `hood.json` (what shipped) is fetched once and suspended on. |
| `<Activity mode="hidden">` | `App.tsx` → `Terminal` | The terminal keeps its history between openings and pre-renders at low priority. |
| `useEffectEvent` | `App.tsx` | Global keyboard handler always sees current overlay state without re-subscribing. |
| `<ViewTransition>` + `addTransitionType` | `attractions/SlideDeck.tsx` | Slide direction picks the enter/exit animation through the native View Transitions API. |
| `useSyncExternalStore` (+ `with-selector` shim) | `lib/store.ts`, `lib/hooks.ts` | Shared UI store with memoised selectors; browser-only values with a server snapshot (no hydration mismatch). |
| `inert` as a prop-level concept | `App.tsx` | Page behind a modal is inert; focus returns to the opener on close. |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Fast Refresh (client-rendered, no pre-render). |
| `npm run build` | Type-check → client build → SSR build → pre-render into `build/index.html` and write `build/hood.json`. |
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

- `src/content/ride.ts` — all content and the content types: `person`, `stations`, `caseStudies`,
  `achievements`, `hoodStory`. Edit copy here.
- `src/lib/store.ts` — the shared UI store (stamps, achievements, overlays, sound, calm ride) and its
  actions. Persisted keys are `ride:*` in `localStorage`, applied after hydration.
- `src/lib/theme.ts` — day/night switch with the View Transitions wipe; the attribute itself is set
  before paint by the inline script in `index.html`.
- `src/lib/sound.ts` — Web Audio synthesised sounds, zero bytes downloaded, off until the visitor opts in.
- `src/components/Line.tsx` + `Station.tsx` — the ride. The rail lights up with a CSS scroll-driven
  animation (`animation-timeline`), with an IntersectionObserver fallback (`.no-sda`).
- `src/components/attractions/*` — one lazy vignette per station, each generic by design.
- `src/styles/tokens.css` → `app.css` → `details.css` — design tokens, components, theme-park details,
  all in cascade layers.
- `scripts/prerender.mjs` — injects the pre-rendered markup and writes `build/hood.json`.
- `public/frontend-bible.pdf` and `docs/portfolio-revamp-frontend-bible.pdf` — the 108-page write-up
  of the performance rebuild (audit, changes, verification, interview preparation).

## Accessibility and motion

- Every overlay is a `role="dialog"` with `aria-modal`, initial focus, Escape to close, and focus
  returned to the element that opened it. The page behind is `inert`.
- `prefers-reduced-motion` and the in-page "calm ride" toggle disable the shader, the marquee, scroll
  effects, confetti and view transitions. Attractions jump to their final state instead of animating.
- The pre-rendered HTML carries the full content, so the ride reads top to bottom without JavaScript.

## Verification

Headless Chrome scripts (kept outside the repo) check hydration and console cleanliness, the scroll
ride and stamps, the palette, terminal, hood, drawer, contact validation, theme switch and reduced
motion at desktop and phone sizes, and run Lighthouse against a local gzip server.
