# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Drukspil** is a free Danish drinking-game web app for the owner and their friends, built to replace paid apps (40–70 kr/month). One phone is passed around the table. Games: Imposter, Bombe, Jeg har aldrig, Mest sandsynlig, Hvem drikker?. See `README.md` for rules, structure and how to run it.

## Tech

Vanilla HTML/CSS/JS, no build step, no framework, no backend. Serve the folder statically (`start.bat`, port 3002). Installable PWA (`manifest.webmanifest`, `sw.js`), works offline after first load.

## Architecture

- `app.js`: core (`App`). Navigation, player list, settings, `localStorage`, Web Audio sounds, vibration, wake lock, UI building blocks (`App.ui.shell/toggle/seg/stepper/range`).
- `games/*.js`: one file per game. Each calls `App.register({ id, navn, kort, farve, render, onEnter, onLeave })` and registers button handlers with `App.on('name', fn)`. Buttons in HTML use `data-action="name"`; toggles use `data-change`, sliders `data-input`, forms `data-form`. Per-game settings persist via `App.gameSettings(id, defaults)`.
- `data/*.js`: all content. Imposter word pairs (`[ord, lignende ord]`) per category, Bombe categories and letters, card decks and penalties. Adult content lives in separate `*_ADULT` arrays / `adult: true` categories and is only shown when the "Frækt indhold" toggle is on.
- `style.css`: dark, large, mobile-first. Accent colour per game via `--accent` on `.screen`.

Load order in `index.html`: data files, `app.js`, then `games/*.js`, then `App.init()`.

## Conventions

- All user-facing text is Danish. Tone: playful party language, direct, short sentences. No em-dashes (use comma, colon or full stop). No emojis; use CSS or SVG for visuals.
- Keep play screens to one glance: big text, one primary button at the bottom, no scrolling mid-game.
- Drinks are phrased as "slurke" (sips) or "bunder"; keep penalties light and optional in spirit.
- When adding a game: new file in `games/`, register it, add it to `index.html` and to the precache list in `sw.js`.
- After editing JS/CSS: bump `?v=N` on every script/style tag in `index.html` and `CACHE`/`V` in `sw.js`, otherwise phones keep the old version.

## Testing

No test framework. Sanity-check with `node --check` on every JS file and click through the games in a mobile-sized browser (Playwright/Chromium works headless: add players, run a full Imposter round, let a Bombe round explode, flip through a deck, spin Hvem drikker).
