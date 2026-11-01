#!/usr/bin/env python3
"""Wire the 2026 UX + games upgrade into your HTML pages.

Run from the site root (the folder with index.html):
    python tools/apply_upgrade.py

It only ADDS <link>/<script> tags (once, safe to re-run) and keeps a .bak copy
of every page it changes. It never touches javascript/main.js or css/styles.css.
"""
import pathlib
import shutil
import sys

ROOT = pathlib.Path.cwd()
PAGES = ["index", "about", "projects", "skills", "contact", "games"]

UX_CSS = '  <link rel="stylesheet" href="css/ux-plus.css"/>\n'
GAMES_CSS = '  <link rel="stylesheet" href="css/games-plus.css"/>\n'
UX_JS = '<script src="javascript/ux-plus.js"></script>\n'
GAMES_JS = '<script src="javascript/games-plus.js"></script>\n'


def patch(path: pathlib.Path, adds_head, adds_body):
    text = path.read_text(encoding="utf-8")
    new = text
    for tag in adds_head:
        key = tag.split('href="')[1].split('"')[0]
        if key not in new:
            if "</head>" not in new:
                print(f"  ! {path.name}: no </head>, skipped {key}")
                continue
            new = new.replace("</head>", tag + "</head>", 1)
    for tag in adds_body:
        key = tag.split('src="')[1].split('"')[0]
        if key not in new:
            if "</body>" not in new:
                print(f"  ! {path.name}: no </body>, skipped {key}")
                continue
            idx = new.rfind("</body>")
            new = new[:idx] + tag + new[idx:]
    if new != text:
        shutil.copyfile(path, path.with_suffix(path.suffix + ".bak"))
        path.write_text(new, encoding="utf-8")
        print(f"  ✓ updated {path.name}")
    else:
        print(f"  = {path.name} already up to date")


def main():
    if not (ROOT / "index.html").exists():
        sys.exit("Run this from the site root (the folder that contains index.html).")
    for name in PAGES:
        p = ROOT / f"{name}.html"
        if not p.exists():
            print(f"  - {name}.html not found, skipped")
            continue
        head = [UX_CSS] + ([GAMES_CSS] if name == "games" else [])
        body = ([GAMES_JS] if name == "games" else []) + [UX_JS]
        patch(p, head, body)
    if (ROOT / "terminal.html").exists():
        print("  ! terminal.html is no longer used (the terminal now lives on about.html#terminal). You can delete it.")
    print("Done. Backups end in .bak — delete them once you've checked the site.")


if __name__ == "__main__":
    main()
