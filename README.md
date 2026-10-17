# udit-portfolio

Personal portfolio, served from GitHub Pages at <https://gitudit.github.io/udit-portfolio/>.

Built with Vite + React 18. The production HTML is pre-rendered at build time, so the page paints
before any JavaScript runs; React then hydrates it.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (client-rendered, no pre-render). |
| `npm run build` | Client build, SSR build, pre-render into `build/index.html`. |
| `npm run preview` | Serve the production `build/` locally. |
| `npm run deploy` | Build and push `build/` to the `gh-pages` branch. |
| `npm run fonts:subset` | Regenerate the WOFF2 fonts in `src/assets/fonts` from `tools/fonts-src`. |

Environment variables live in `.env` and must be prefixed with `VITE_`:
`VITE_serviceId`, `VITE_templateId`, `VITE_userId` (EmailJS, used by the contact form) and
optionally `VITE_GITHUB_TOKEN` (GitHub section, disabled by default in `src/portfolio.js`).

The full write-up of the performance revamp (audit, every change, verification method, results and an
interview preparation guide) is in `docs/portfolio-revamp-frontend-bible.pdf`.

## Where things are

- `src/portfolio.js` — all content. Images are imported at the top of the file.
- `src/components/reveal/Reveal.jsx` — scroll-reveal animation (`Fade` / `Slide`), a 1:1 behavioural
  replacement for react-reveal. `appear` makes an element animate from first paint (used for the hero).
- `src/components/displayLottie/DisplayLottie.jsx` — Lottie box. The player and the JSON load only
  when the box is near the viewport; the animation pauses while off-screen.
- `src/styles/icons.css` — the Font Awesome / font-mfizz rules for the icons in use, backed by subset
  fonts. To add an icon: add its rule here, add the codepoint in `scripts/subset-fonts.mjs`, run
  `npm run fonts:subset`.
- `workExperiences[].bannerColor` in `portfolio.js` — dominant logo colour, pre-computed with
  ColorThief. Leave it out for a new logo and the card computes it in the browser.

## Notes for the UI/UX revamp

Two visual quirks of the original site were deliberately preserved for pixel parity:

1. `src/containers/Main.jsx` renders a literal `"//"` text node above the Contact section (the original
   had a stray `//<Twitter />` in JSX).
2. `src/components/ToggleSwitch/ToggleSwitch.css` has a global `input { transform: scale(0.5) }` rule,
   imported from `Header.jsx`, which shrinks the contact form inputs.

Both are a one-line delete when the redesign lands.

Two behaviours were intentionally corrected because they were timing bugs rather than design:

- The sticky header's spacer is now always the header's real height (90px on desktop). The old site
  measured it before the logo font had loaded, so the header overlapped the hero by 12px until the
  window was resized. `Header.jsx` re-measures after `document.fonts.ready`.
- The contact form always prevents the native submit. Previously an invalid email reloaded the page
  with the form values in the URL before the "Invalid Email!" state could be seen.
