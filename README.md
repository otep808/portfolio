# Joseph Callos — Portfolio (pv1)

Personal portfolio website for **Joseph "Otep" Callos**, 3rd-year BSIT student at
Pamantasan ng Lungsod ng Valenzuela (PLV) — Game Development, Software Development,
App Development. SHS strand: STEM.

Live demo of the classic version: https://otep808.github.io/portfolio/

## Overview

A multi-page portfolio built from scratch — no Bootstrap, no templates, no frameworks
on the front end. Dark/light mode with circular reveal, particle canvas, scroll
animations, a command-line terminal version of the whole site, a plain-HTML retro
mode, a 20-game arcade with per-game leaderboards, and an admin panel for managing
projects and certificates.

**Tech stack**

- Front end: HTML5, CSS3, vanilla JavaScript
- Back end: PHP 8 + SQLite (PDO) — no MySQL setup needed. The database file
  `data/portfolio.db` is created and seeded automatically on first use; this package
  already ships a freshly seeded one (17 projects, 11 certificates, 0 scores,
  0 admin accounts).
- Data: projects, certificates, game scores, and admin accounts all live in SQLite.

## Pages

| Page | What it is |
|---|---|
| `index.html` | Home — hero, widgets, clock, best scores |
| `about.html` | About, timeline, and the terminal (right column) |
| `projects.html` | 17 projects, filterable; data loads live from `api/projects.php` |
| `games.html` | 20 mini-games with top-10 leaderboards per game |
| `skills.html` | Skills, tools, and 11 certificates (live from `api/certificates.php`) |
| `contact.html` | Contact links and form |
| `terminal.html` | The whole site as a command line — type `help`, Tab to autocomplete |
| `retro.html` | Plain single-scroll HTML 4.01 version; one exit button back to the site |
| `admin.php` | Admin panel — add/edit/delete projects and certificates |

## The arcade (20 games)

Snake, Memory, Type Sprint, Whack-a-Mole, Guesser, Dev Trivia, Hangman, Simon, Pong,
Math Sprint, Word Scramble, Tic-Tac-Toe, Rock Paper Scissors, Reaction Time,
Click Frenzy, Dice Duel, Odd One Out, Aim Trainer, Dodge Dash, Fruit Catcher.

13 of them have three pun-named difficulties — **Chill Pill** (easy), **Middle Child**
(normal), **Boss Level** (hard). Tic-Tac-Toe's Boss Level is full minimax (a draw is
your trophy); Rock Paper Scissors' Boss Level "peeks". Every loss shows a playful
taunt, never the same one twice in a row. Scores save to the top-10 leaderboard
per game.

## Contents

```
index.html  about.html  projects.html  games.html  skills.html
contact.html  terminal.html  retro.html  admin.php  README.md
README-PHP.md
api/
  db.php            # shared SQLite backend (creates + seeds the DB)
  projects.php      # JSON API for projects
  certificates.php  # JSON API for certificates
  scores.php        # JSON API for leaderboards (read + submit)
  seed_data.php         # 17 projects seed
  seed_certificates.php # 11 certificates seed
data/
  portfolio.db  # seeded database (17 projects, 11 certs, no admins yet)
  .htaccess     # blocks direct web access to the database (Apache)
  index.php     # blocks directory listing of data/
images/
  certs/     # 11 certificate images
  projects/  # 20 project thumbnails
  skills/    # skill + certificate icons
  photos/    # photos
  icons/     # UI icons (line-style SVG set)
  demoReel.mp4, resume.pdf, logo files, social icons
css/  javascript/  # styles, main.js, terminal.js, certificates.js
```

## Deploy on InfinityFree (recommended path for this package)

1. **Create an account** at https://infinityfree.com and create a hosting account
   (free subdomain like `yourname.infinityfreeapp.com`, or connect your own domain).
2. **Upload the files into `htdocs/`** — that folder is the web root for your domain.
   The zip is ~18 MB and the web file manager caps single uploads at 10 MB, so use
   **FTP (FileZilla)** with the FTP details from the control panel: upload the zip,
   then extract it inside `htdocs/` using the file manager's Extract option — or
   extract the zip on your PC first and upload the extracted files by FTP.
   (`demoReel.mp4` alone is ~9.9 MB, so FTP is the safe route for it too.)
3. **Visit your domain.** The home page loads; projects and certificates come from
   the included database, already seeded.
4. **Visit `yourdomain/admin.php`.** There is no default password: with an empty
   admins table you get the **first-run setup** form. Create your admin username and
   password, then log in. From there you can add, edit, and delete projects and
   certificates — changes save into `data/portfolio.db`.
5. **Done.** If you ever wipe `data/portfolio.db`, it rebuilds itself from the seed
   files on the next visit (your admin account and scores would be lost, so back
   the file up after you create the admin account).

**Hosting notes**

- No MySQL database to create — everything runs on the SQLite file.
- Needs **PHP 8 with the `pdo_sqlite` extension**. InfinityFree includes it; if a
  page ever shows "PDO SQLite driver is not available", check the PHP version and
  extensions in the control panel.
- `data/` must stay writable by PHP (it is by default). If saving scores or admin
  edits fails, set `data/` to 755 in the file manager.
- `data/.htaccess` blocks direct download of `portfolio.db` on Apache. Never share
  the file publicly — once you create an admin account it holds the password hash.
- Free SSL is available in the control panel (Let's Encrypt / GoGetSSL). Enable it
  and the site works over `https://`.

## Run it locally (XAMPP)

Copy this folder into `C:\xampp\htdocs\portfolio`, start Apache, and open
`http://localhost/portfolio`. Admin is at `http://localhost/portfolio/admin.php`.
Same first-run setup applies. If you delete `data/portfolio.db`, it recreates and
re-seeds itself on the next visit.

## Admin

- First visit to `admin.php` with no admin accounts shows the setup form — pick a
  username and a strong password. There is no default login.
- After setup, `admin.php` is the login page. It manages **projects** and
  **certificates** (add / edit / delete). Edits live in `data/portfolio.db`, not in
  the seed files — the seeds only run when a table is empty.
- Back up `data/portfolio.db` regularly: it holds your edits, the leaderboard
  scores, and the admin account.

## Notes

- `demoReel.mp4` is professor-required and kept untouched.
- `retro.html` is intentionally plain: no stylesheet, no script, one "Back to the
  actual website" button at the bottom.
- `.gitignore` excludes `admin.php` and `data/portfolio.db` from git — they are
  local-only files. Do not commit the database to a public repo.

## Update — 2026-11-11 (Featured Today + card frames + live background)
- Home page: the old 3-card "Featured Work" is now **Featured Today** — one project, one game and one certificate, picked fresh every day (Manila date). Cards flip on tap/click; project and certificate come from the live database via `api/projects.php` / `api/certificates.php`, so anything you change in admin.php shows up automatically.
- Every card on the site now has gold corner brackets (role cards, Currently Active, widgets, project cards, tool cards, certificate cards). Clicking a card gives a small press + gold ripple.
- A living aurora + starfield background now runs behind every page (light and dark mode); the hero keeps its own interactive particle canvas.
- Icons unified to the flat filled style of your own icons: the UI icons (nav, Currently cards, widgets, view/paper buttons) were redrawn to match, and the footer socials are now icons instead of "GH / in / fb" text.
- Consistency: branding is **OtepCodes** everywhere (titles, footers, share previews), the motto is now "Every second spent on something should bring value — to yourself or to others. Choose your infinite loops wisely." (no more "Time is Gold" — also fixed in the terminal, the trivia and Retro Mode), and the hero stat reads **3 Years Studying** to match Year 3.
- The old "Game of the Day" widget was removed from the home page because the trio carries it now; the games page still has its own.
- The games page icons were left as the thin line set on purpose (they are one consistent set on their own page) — say the word if you want those redrawn flat too.

## Deploying this update on InfinityFree
Extract over your existing `htdocs/` — **do NOT overwrite `data/portfolio.db`**. This package does not include it, so your live scores and admin account are safe. No database changes, no re-setup.
