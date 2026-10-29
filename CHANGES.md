# Portfolio upgrade — what changed (2026)

All original content is kept: `images/demoReel.mp4` and every original image,
the dark/light theme, blue/gold style, fonts, nav, Easter eggs, and all 14
original games still work. No new external dependencies, no build step,
no `node_modules`. Vanilla JS + PHP only.

## 1. PHP backend (optional)

- New `api/` folder, no frameworks:
  - `api/db.php` — SQLite via PDO. The database (`data/portfolio.db`) is
    created automatically on first use; no MySQL setup.
  - `api/projects.php` — `GET` returns all projects as JSON.
  - `api/scores.php` — `GET ?game=X` returns the top 10; `POST`
    `{game, player, score}` saves one score (game must be one of the 17,
    player 1–30 chars, score numeric, all via prepared statements).
  - `api/seed_data.php` — the 17 original projects, extracted from the
    original `projects.html` (titles, categories, descriptions, tags,
    images, both links). No projects were invented.
- New `admin.php` — see "Admin" below.
- New `README-PHP.md` — full run instructions.
- `data/.htaccess` + `data/index.php` block direct web access to the
  database on Apache/XAMPP (see "Limitations" for `php -S`).

## 2. Widgets (theme-matched: Space Mono, blue/gold, terminal style)

- **Live clock** — Manila time (Asia/Manila) + date, updating every second.
  It sits in the nav on desktop (hidden on small screens) on every page,
  and as a large card on the home page. No external API, no fake data.
- **Stats widget** (home) — projects count (live from the API when PHP
  runs, otherwise 17), games count (17), and your best saved score from
  this browser.
- **Game of the Day** — home page and games page. Deterministic by
  day-of-year, so everyone sees the same game on the same day. The home
  card links to `games.html#game-<key>`, which opens that tab.

## 3. Admin + leaderboards

### Admin (`admin.php`)

- **No default password is shipped.** First run (no admin in the DB)
  shows a setup form: choose a username + password (min. 8 chars).
  The password is stored only as `password_hash`. Afterwards admin.php
  shows a login form. Sessions, logout, and a CSRF token on every form.
- Logged-in admin can add / edit / delete projects: title, category,
  filter keywords, description, tags, image path, link (+ optional
  second link). The image field is a path/text field only — **no file
  uploads** are accepted.
- `projects.html` now fetches `api/projects.php` and renders the cards
  with the existing filter tabs and search working. If the API is
  unavailable (static hosting, `file://`), the fetch fails silently and
  the original hard-coded cards stay — the page never goes blank.

### Leaderboards (`games.html`)

- A "Player name" input at the top of the games page (default
  "Anonymous", saved to `localStorage`).
- A leaderboard section with a per-game selector showing the **top 10**
  (player, score, date). It follows the active game tab.
- On each game ending, the score is saved via `api/scores.php`. If the
  API fails, the score is saved to `localStorage` (top 10 per game) and
  shown from there instead. A failed save never breaks a game.
- Score meaning per game (higher is always better on the board):
  snake/mole/math/click/dice/ttt/rps = game score or wins; typer = WPM;
  quiz = correct answers; simon = level reached; reaction = `1000 − avg
  ms` (faster = higher); guess = `101 − attempts` (fewer = higher);
  memory = `1000 − moves×5 − seconds`; hangman = `(6 − wrong) × 100`.
  Word Scramble and Odd One Out have no natural end, so they have a
  "Save my score" button that saves the current HUD score.

## 4. Puns + 3 new games

- Every game panel now starts with a `<p class="game-pun">` line in the
  site's playful tone — all 14 originals + the 3 new ones (17 total).
- **Click Frenzy** — click the button as many times as you can in
  10 seconds. **Odd One Out** — find the one different emoji in a grid;
  grids grow from 3×3 to 6×6 as rounds advance. **Dice Duel** — roll
  against the AI, first to 5 round wins. All vanilla JS, mobile-friendly,
  with tabs, panels and leaderboard support.
- "14 games" text updated to **17 games** everywhere it appeared:
  games page header, footer strip (now also listing the 3 new games),
  games meta description, and the Portfolio Website card on
  projects.html ("5 mini games" → "17 mini games").

## 5. Typing bug — root cause + fix

**Root cause:** in `javascript/main.js`, the Snake keydown handler was
global and did `if (e.key === ' ') { e.preventDefault(); …start snake… }`
on *every* page and panel. So Space never reached the Type Sprint
`<textarea>` — typing a space started (or restarted) Snake instead.

**Fix:** that handler now (a) returns immediately when the event target
is an `INPUT`, `TEXTAREA` or contenteditable element, and (b) only runs
when the Snake panel is the active panel on games.html. The same guard
was added to the Konami handler (its `b`/`a` letters could fire while
typing) and strengthened on the `?` shortcut handler (which already
guarded inputs, now also contenteditable/event target).

## 6. Transitions / animations

- Game panels now fade + slide in on tab switch; project cards and game
  tabs lift slightly on hover; reveal cards stagger (`.rd1/.rd2/.rd3`).
- The existing page-cover transition and the View Transitions theme
  toggle are untouched.
- `prefers-reduced-motion` disables/limits all of this (the original
  reduced-motion block still applies, plus an explicit override after
  the new CSS so the new animations never win over it).

## 7. 2026 trends (tasteful, no rebrand)

- Bento-style widget cards on the home page; glassmorphism touches
  (translucent gradient + backdrop blur) on widgets and the nav, which
  already blurred.
- Improved `focus-visible` styles were already present and are kept;
  new widgets use real `<label>`s, `aria-label`s and a labelled
  leaderboard section.
- Better mobile spacing for widgets, puns and the new game grids.
- JSON-LD `Person` schema added to `index.html` (name, PLV affiliation,
  GitHub/LinkedIn/Facebook, email — all from the site's existing data;
  nothing new added), and meta descriptions updated.
- The site's identity is unchanged: same copy, same "Open to
  Internships" wording (left exactly as Joseph wrote it — not expanded
  into any job-seeking claim).

## 8. Clock

Included — it fits the terminal/mono theme. See task 2 above.

## How to run it

```
# From this folder:
php -S localhost:8000
# then open http://localhost:8000/ and http://localhost:8000/admin.php
```

XAMPP: copy this folder into `C:\xampp\htdocs\`, start Apache only
(MySQL is not needed), open `http://localhost/myportfolio/`.
Full details: `README-PHP.md`.

## How leaderboards fall back without PHP

Static hosting / `file://`: `api/scores.php` is unreachable, so every
save goes to `localStorage` (`otep_lb_<game>`, top 10 per game) and the
leaderboard section renders from there, with a note saying so.
`projects.html` keeps its hard-coded cards. `admin.php` does not run
without PHP — that is the one feature that genuinely needs a server.

## Limitations

- On `php -S`, `data/.htaccess` is **not** enforced (the built-in server
  ignores it). Only run `php -S` on localhost and do not expose that
  port publicly. On Apache/XAMPP the `.htaccess` denial applies.
- The delivered database state is clean: all test scores and the test
  admin account created during testing were removed by deleting
  `data/portfolio.db` after testing, so the DB is re-created and
  re-seeded with the 17 original projects on first run, and admin.php
  will show the first-run setup form.
- The demo reel video and all original images are untouched, so the
  delivered folder is still large because of `images/demoReel.mp4`
  (required by Joseph's professor) — that file was deliberately not
  compressed or removed.
