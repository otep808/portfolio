<?php
// Leaderboards. GET ?game=X -> top 10. POST {game, player, score} -> save one score.
// No login is needed to submit a game score (as with the in-browser high scores
// the site already kept in localStorage); submissions are validated and capped.
declare(strict_types=1);
require __DIR__ . '/db.php';

try {
    $db = otep_db();
} catch (Throwable $e) {
    otep_json(['error' => 'Leaderboard unavailable. Run this site with PHP (see README-PHP.md).'], 500);
}

$games = otep_games();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $game = trim((string) ($_GET['game'] ?? ''));
    if (!in_array($game, $games, true)) {
        otep_json(['error' => 'Unknown game.'], 400);
    }
    $stmt = $db->prepare('SELECT player, score, created_at FROM scores WHERE game = :game ORDER BY score DESC, created_at ASC LIMIT 10');
    $stmt->execute([':game' => $game]);
    otep_json(['game' => $game, 'scores' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $in = json_decode($raw ?: '', true);
    if (!is_array($in)) {
        $in = $_POST;
    }
    $game = trim((string) ($in['game'] ?? ''));
    $player = trim((string) ($in['player'] ?? ''));
    $score = $in['score'] ?? null;
    if (!in_array($game, $games, true)) {
        otep_json(['error' => 'Unknown game.'], 400);
    }
    if ($player === '') {
        $player = 'Anonymous';
    }
    $player = mb_substr($player, 0, 30);
    if (mb_strlen($player) < 1 || !is_numeric($score)) {
        otep_json(['error' => 'Player name (1-30 chars) and a numeric score are required.'], 400);
    }
    $score = (int) $score;
    if ($score < 0 || $score > 1000000) {
        otep_json(['error' => 'Score out of range.'], 400);
    }
    $stmt = $db->prepare('INSERT INTO scores (game, player, score) VALUES (:game, :player, :score)');
    $stmt->execute([':game' => $game, ':player' => $player, ':score' => $score]);
    otep_json(['ok' => true]);
}

otep_json(['error' => 'Method not allowed.'], 405);
