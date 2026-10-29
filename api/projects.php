<?php
// Public read-only project list. GET api/projects.php -> [{id, title, ...}]
declare(strict_types=1);
require __DIR__ . '/db.php';

try {
    $db = otep_db();
    $rows = $db->query('SELECT id, title, category, filter, description, tags, image, link, link_label, link2, link2_label FROM projects ORDER BY id ASC')->fetchAll(PDO::FETCH_ASSOC);
    otep_json(['projects' => $rows]);
} catch (Throwable $e) {
    otep_json(['error' => 'Projects unavailable. Run this site with PHP (see README-PHP.md).'], 500);
}
