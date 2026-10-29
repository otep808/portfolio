# Portfolio — PHP backend (optional, zero MySQL setup)

The site works as a plain static site, but the Admin area, the live project
list and the leaderboards need PHP. Everything is vanilla PHP + SQLite
(PDO) — no frameworks, no build step, no MySQL to configure.

## Run it locally

From this folder (the site root), run:

```
php -S localhost:8000
```

Then open http://localhost:8000/ — and http://localhost:8000/admin.php
for the Admin area. The database file `data/portfolio.db` is created
automatically on first use, and the 17 original projects are seeded from
`api/seed_data.php` (extracted from the original projects.html).

## Run it on XAMPP (Windows)

1. Copy this whole folder into `C:\xampp\htdocs\` (for example as
   `C:\xampp\htdocs\myportfolio\`).
2. Start Apache in the XAMPP Control Panel (MySQL is **not** needed).
3. Open http://localhost/myportfolio/ and http://localhost/myportfolio/admin.php

## Admin — first run

There is **no default password** in the code. The first time you open
`admin.php` with no admin account in the database, you will see a setup
form: choose a username and a password (min. 8 characters). The password
is stored only as a `password_hash`. After that, admin.php shows a login
form. Log out with the Log out button.

In Admin you can add, edit and delete projects (title, category, filter
keywords, description, tags, image path, link). The image field is a
path/text field only — no file uploads are accepted.

## What happens without PHP?

On purely static hosting (for example the original Cloudflare Workers
deployment, or opening pages with `file://`):

- All pages still load, and all 17 games still work.
- `projects.html` shows the original hard-coded project cards, because
  the API fetch fails and the page keeps its built-in cards.
- Leaderboard scores are stored in the browser's `localStorage`
  (top 10 per game) and shown from there instead of the server.
- `admin.php` will not run — it needs a PHP server (see above).

So nothing ever goes blank because PHP is missing.

## Endpoints

- `GET api/projects.php` — all projects as JSON (public, read-only).
- `GET api/scores.php?game=snake` — top 10 scores for one game.
- `POST api/scores.php` with JSON `{game, player, score}` — save a score.
  Game must be one of the 17 game keys, player 1–30 characters, score a
  number. Submissions are validated server-side with prepared statements.

## Security notes

- All database access uses PDO prepared statements; all Admin output is
  escaped with `htmlspecialchars`.
- `data/.htaccess` blocks direct web access to the database on Apache /
  XAMPP. On `php -S`, only serve on localhost (the default above) and do
  not expose that port publicly — the built-in server has no access
  controls of its own.
- Never commit or share `data/portfolio.db` if it contains an admin
  account you still use: it holds the (hashed) admin password.
