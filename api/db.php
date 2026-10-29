<?php
// Shared SQLite backend for the portfolio. No frameworks, no MySQL setup.
// The database file is created automatically on first use.
declare(strict_types=1);

function otep_db_path(): string {
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    return $dir . '/portfolio.db';
}

function otep_games(): array {
    // Must match the 17 game keys used on games.html (data-game values).
    return ['snake','memory','typer','mole','guess','quiz','ttt','rps','hang','simon','pong','math','scramble','reaction','click','odd','dice'];
}

function otep_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        throw new RuntimeException('PDO SQLite driver is not available. Enable php-sqlite3 / pdo_sqlite.');
    }
    $pdo = new PDO('sqlite:' . otep_db_path());
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, category TEXT NOT NULL DEFAULT '',
        filter TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '',
        link TEXT NOT NULL DEFAULT '', link_label TEXT NOT NULL DEFAULT '',
        link2 TEXT NOT NULL DEFAULT '', link2_label TEXT NOT NULL DEFAULT ''
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game TEXT NOT NULL, player TEXT NOT NULL, score INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores (game, score DESC)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");
    // Seed projects once, from the original projects.html (see api/seed_data.php).
    $count = (int) $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();
    if ($count === 0) {
        $seed = require __DIR__ . '/seed_data.php';
        $stmt = $pdo->prepare('INSERT INTO projects
            (title, category, filter, description, tags, image, link, link_label, link2, link2_label)
            VALUES (:title, :category, :filter, :description, :tags, :image, :link, :link_label, :link2, :link2_label)');
        foreach ($seed as $row) {
            $stmt->execute([
                ':title' => $row['title'], ':category' => $row['category'],
                ':filter' => $row['filter'], ':description' => $row['description'],
                ':tags' => $row['tags'], ':image' => $row['image'],
                ':link' => $row['link'], ':link_label' => $row['link_label'],
                ':link2' => $row['link2'], ':link2_label' => $row['link2_label'],
            ]);
        }
    }
    return $pdo;
}

function otep_json($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function otep_clean_link(string $url): string {
    $url = trim($url);
    if ($url === '') {
        return '';
    }
    // Allow site-relative paths and http(s) URLs only. Blocks javascript:/data: URLs.
    if (preg_match('#^(https?://|images/|mailto:)#i', $url)) {
        return $url;
    }
    if (strpos($url, '/') === 0 || strpos($url, '#') === 0) {
        return $url;
    }
    // Bare relative file (e.g. "projects.html") is fine; anything with a scheme is not.
    if (preg_match('#^[a-zA-Z][a-zA-Z0-9+.-]*:#', $url)) {
        return '';
    }
    return $url;
}
