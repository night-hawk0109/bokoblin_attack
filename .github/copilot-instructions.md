# Copilot / AI agent instructions — Bokoblin Attack

This repository is a tiny static browser game. The goal of these instructions is to help AI coding agents be immediately productive when making small feature, bugfix, or polish changes.

- **Big picture:** Single-page HTML/Canvas game. No build system. All runtime assets (GIFs) are expected in the project root and loaded directly by the browser.
  - Entry point: [index.html](index.html#L1) — loads `game.js` and a canvas with id `game`.
  - Game loop & logic: [game.js](game.js#L1-L400) — uses `requestAnimationFrame` for updates and draws to canvas.
  - Local dev server: start with `python3 -m http.server 5500` as shown in [README.md](README.md#L1).

- **Key files & examples**
  - Canvas and page: [index.html](index.html#L1-L40) — canvas size `400x500`, `#score` span exists but game draws score on canvas (no DOM update).
  - Game loop structure: see `loop()`, `update()`, `draw()` in [game.js](game.js#L1-L400).
  - Asset usage: `shipImg.src = "spaceship.gif"`, `monster.gif`, `background.gif`, `diamond.gif`, `bullet.gif` — expect these files at repository root (or update paths in `game.js`).

- **Project-specific conventions & patterns**
  - Input: WASD for movement and Space (`" "`) for shooting — handled via `keydown`/`keyup` listeners in `game.js`.
  - Entities: `bullets` and `monsters` are plain arrays. New monsters spawn via a `spawnTimer` that assumes ~60FPS.
  - Collision: simple AABB checks between bullets and monsters; bullet dimensions are treated as `4x10` in the collision math.

- **Developer workflow**
  - Run local server: `python3 -m http.server 5500` then open `http://localhost:5500`.
  - No build or test commands — edits are directly reloadable in the browser.
  - Commit pattern in README: use `git add .` and `git commit -m "Short summary: what changed (why)"` then `git push`.

- **Safe-to-change areas**
  - Visual assets and their paths — safe to move into `assets/` if you update `game.js` imports accordingly.
  - Tuning values: spawn rates (`spawnTimer`), speeds, and sizes—these are numeric constants in `game.js`.

- **What to watch for / discovered inconsistencies**
  - The HTML contains a `#score` span but `game.js` draws the score on the canvas and never updates the DOM element. If updating the DOM is desired, update `game.js` where `score` changes.
  - README's commit example has an unclosed quote in the commit message example; follow conventional commit messages when possible.

- **Examples of small tasks an agent can do immediately**
  - Add keyboard remapping UI and persist choice in `localStorage`.
  - Move GIF assets into an `assets/` folder and update `game.js` paths.
  - Update game to write `score` into `#score` in addition to drawing on canvas.

If anything in these notes is unclear or you want additional rules (e.g., preferred commit message format or testing expectations), tell me and I will iterate.
