<?php
// Public read-only certificate list. GET api/certificates.php -> [{id, label, title, ...}]
declare(strict_types=1);
require __DIR__ . '/db.php';

try {
    $db = otep_db();
    $rows = $db->query('SELECT id, label, title, description, icon, file FROM certificates ORDER BY id ASC')->fetchAll(PDO::FETCH_ASSOC);
    otep_json(['certificates' => $rows]);
} catch (Throwable $e) {
    otep_json(['error' => 'Certificates unavailable. Run this site with PHP (see README-PHP.md).'], 500);
}
