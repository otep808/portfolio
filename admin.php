<?php
// Admin area: first-run setup creates the admin account (no default password
// is shipped in this code). Afterwards, login is required for all project edits.
// Sessions + CSRF token on every form. Image is a path/text field only —
// no file uploads are accepted here.
declare(strict_types=1);
require __DIR__ . '/api/db.php';

session_start();
try {
    $db = otep_db();
} catch (Throwable $e) {
    http_response_code(500);
    echo '<h1>PHP backend unavailable</h1><p>Run this site with PHP (see README-PHP.md) and enable the PDO SQLite driver.</p>';
    exit;
}
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
$csrf = $_SESSION['csrf'];
$errors = [];
$notice = '';

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function csrf_ok() { return hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($_POST['csrf'] ?? '')); }

$adminCount = (int) $db->query('SELECT COUNT(*) FROM admins')->fetchColumn();
$loggedIn = !empty($_SESSION['admin_id']);

// --- Logout ---
if ($loggedIn && ($_POST['action'] ?? '') === 'logout' && csrf_ok()) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// --- First-run setup ---
if ($adminCount === 0 && ($_POST['action'] ?? '') === 'setup' && csrf_ok()) {
    $u = trim((string) ($_POST['username'] ?? ''));
    $p = (string) ($_POST['password'] ?? '');
    $p2 = (string) ($_POST['password2'] ?? '');
    if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $u)) { $errors[] = 'Username: 3-30 letters, numbers or underscores.'; }
    if (mb_strlen($p) < 8) { $errors[] = 'Password must be at least 8 characters.'; }
    if ($p !== $p2) { $errors[] = 'Passwords do not match.'; }
    if (!$errors) {
        $stmt = $db->prepare('INSERT INTO admins (username, password_hash) VALUES (:u, :h)');
        $stmt->execute([':u' => $u, ':h' => password_hash($p, PASSWORD_DEFAULT)]);
        $_SESSION['admin_id'] = (int) $db->lastInsertId();
        $_SESSION['admin_user'] = $u;
        header('Location: admin.php');
        exit;
    }
}

// --- Login ---
if ($adminCount > 0 && !$loggedIn && ($_POST['action'] ?? '') === 'login' && csrf_ok()) {
    $u = trim((string) ($_POST['username'] ?? ''));
    $p = (string) ($_POST['password'] ?? '');
    $stmt = $db->prepare('SELECT id, username, password_hash FROM admins WHERE username = :u');
    $stmt->execute([':u' => $u]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && password_verify($p, $row['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $row['id'];
        $_SESSION['admin_user'] = $row['username'];
        header('Location: admin.php');
        exit;
    }
    $errors[] = 'Invalid username or password.';
}
$loggedIn = !empty($_SESSION['admin_id']);

// --- Project CRUD (logged in only) ---
$fields = ['title','category','filter','description','tags','image','link','link_label','link2','link2_label'];
if ($loggedIn && isset($_POST['action']) && csrf_ok()) {
    $action = $_POST['action'];
    if ($action === 'save') {
        $data = [];
        foreach ($fields as $f) {
            $data[$f] = trim((string) ($_POST[$f] ?? ''));
        }
        $data['link'] = otep_clean_link($data['link']);
        $data['link2'] = otep_clean_link($data['link2']);
        if ($data['title'] === '') { $errors[] = 'Title is required.'; }
        if (mb_strlen($data['title']) > 200 || mb_strlen($data['description']) > 2000) { $errors[] = 'Title/description too long.'; }
        if (!$errors) {
            $id = (int) ($_POST['id'] ?? 0);
            if ($id > 0) {
                $set = implode(', ', array_map(fn($f) => "$f = :$f", $fields));
                $data['id'] = $id;
                $db->prepare("UPDATE projects SET $set WHERE id = :id")->execute($data);
                $notice = 'Project updated.';
            } else {
                $cols = implode(', ', $fields);
                $ph = implode(', ', array_map(fn($f) => ":$f", $fields));
                $db->prepare("INSERT INTO projects ($cols) VALUES ($ph)")->execute($data);
                $notice = 'Project added.';
            }
        }
    } elseif ($action === 'delete') {
        $db->prepare('DELETE FROM projects WHERE id = :id')->execute([':id' => (int) ($_POST['id'] ?? 0)]);
        $notice = 'Project deleted.';
    }
}

$edit = null;
if ($loggedIn && isset($_GET['edit'])) {
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = :id');
    $stmt->execute([':id' => (int) $_GET['edit']]);
    $edit = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}
$projects = $loggedIn ? $db->query('SELECT * FROM projects ORDER BY id ASC')->fetchAll(PDO::FETCH_ASSOC) : [];
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Admin — Joseph S. Callos</title>
<meta name="description" content="Admin area for managing portfolio projects."/>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Space+Mono&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="css/styles.css"/>
<style>
.admin-wrap{max-width:960px;margin:0 auto;padding:calc(var(--nav-h) + 2rem) var(--pad-x) 4rem}
.admin-card{background:var(--bg-card);border:1px solid var(--border);padding:1.5rem;margin-bottom:1.5rem}
.admin-card h2{font-family:var(--f-display);font-weight:300;margin-bottom:1rem}
.admin-field{margin-bottom:.8rem}.admin-field label{display:block;font-family:var(--f-mono);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text-faint);margin-bottom:.3rem}
.admin-field input,.admin-field textarea,.admin-field select{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.6rem;font:inherit;font-size:.9rem}
.admin-table{width:100%;border-collapse:collapse;font-size:.85rem}
.admin-table th,.admin-table td{border-bottom:1px solid var(--border-2);padding:.5rem;text-align:left;vertical-align:top}
.admin-msg{border:1px solid var(--gold);color:var(--gold-lt);padding:.7rem 1rem;margin-bottom:1rem}
.admin-err{border:1px solid var(--red);color:var(--red);padding:.7rem 1rem;margin-bottom:1rem}
.admin-row{display:flex;gap:.6rem;flex-wrap:wrap}
</style>
</head>
<body>
<nav id="nav" aria-label="Primary navigation">
  <a href="index.html" style="text-decoration:none;font-family:var(--f-mono);letter-spacing:.2em;">OTEP&nbsp;CODES</a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li><li><a href="projects.html">Projects</a></li><li><a href="games.html">Games</a></li>
  </ul>
</nav>
<main class="admin-wrap">
  <h1 style="font-family:var(--f-display);font-weight:300;margin-bottom:.5rem;">Portfolio <em style="color:var(--blue-lt)">Admin</em></h1>
  <p style="color:var(--text-dim);margin-bottom:1.5rem;">Manage the projects shown on projects.html. Changes take effect immediately. No file uploads — the image field is a path such as <code>images/my-project.png</code>.</p>
  <?php if ($notice): ?><p class="admin-msg"><?= h($notice) ?></p><?php endif; ?>
  <?php foreach ($errors as $e): ?><p class="admin-err"><?= h($e) ?></p><?php endforeach; ?>

  <?php if ($adminCount === 0): ?>
    <section class="admin-card">
      <h2>First-run setup</h2>
      <p style="color:var(--text-dim);margin-bottom:1rem;">No admin account exists yet. Create one now — this password is hashed, never stored in plain text, and there is no default password to guess.</p>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>"/>
        <input type="hidden" name="action" value="setup"/>
        <div class="admin-field"><label for="su">Username</label><input id="su" name="username" required autocomplete="username"/></div>
        <div class="admin-field"><label for="sp">Password (min. 8 characters)</label><input id="sp" type="password" name="password" required autocomplete="new-password"/></div>
        <div class="admin-field"><label for="sp2">Confirm password</label><input id="sp2" type="password" name="password2" required autocomplete="new-password"/></div>
        <button class="btn btn-primary" type="submit"><span>Create admin account →</span></button>
      </form>
    </section>
  <?php elseif (!$loggedIn): ?>
    <section class="admin-card">
      <h2>Log in</h2>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>"/>
        <input type="hidden" name="action" value="login"/>
        <div class="admin-field"><label for="lu">Username</label><input id="lu" name="username" required autocomplete="username"/></div>
        <div class="admin-field"><label for="lp">Password</label><input id="lp" type="password" name="password" required autocomplete="current-password"/></div>
        <button class="btn btn-primary" type="submit"><span>Log in →</span></button>
      </form>
    </section>
  <?php else: ?>
    <div class="admin-row" style="margin-bottom:1.5rem;">
      <span style="font-family:var(--f-mono);font-size:.7rem;color:var(--text-dim);">Signed in as <strong><?= h($_SESSION['admin_user'] ?? '') ?></strong> · <?= count($projects) ?> projects</span>
      <form method="post" style="margin-left:auto;"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"/><input type="hidden" name="action" value="logout"/><button class="btn btn-outline" type="submit">Log out</button></form>
    </div>
    <section class="admin-card">
      <h2><?= $edit ? 'Edit project' : 'Add project' ?></h2>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>"/>
        <input type="hidden" name="action" value="save"/>
        <input type="hidden" name="id" value="<?= $edit ? (int) $edit['id'] : 0 ?>"/>
        <div class="admin-field"><label for="f-title">Title *</label><input id="f-title" name="title" required value="<?= h($edit['title'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-category">Category (shown on the card, e.g. “Python · Desktop App”)</label><input id="f-category" name="category" value="<?= h($edit['category'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-filter">Filter keywords (space-separated: python / web / figma / research / design / media / group)</label><input id="f-filter" name="filter" value="<?= h($edit['filter'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-desc">Description</label><textarea id="f-desc" name="description" rows="3"><?= h($edit['description'] ?? '') ?></textarea></div>
        <div class="admin-field"><label for="f-tags">Tags (comma-separated)</label><input id="f-tags" name="tags" value="<?= h($edit['tags'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-image">Image path (text only, e.g. images/my-project.png)</label><input id="f-image" name="image" value="<?= h($edit['image'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-link">Link</label><input id="f-link" name="link" value="<?= h($edit['link'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-linklabel">Link label</label><input id="f-linklabel" name="link_label" value="<?= h($edit['link_label'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-link2">Second link (optional)</label><input id="f-link2" name="link2" value="<?= h($edit['link2'] ?? '') ?>"/></div>
        <div class="admin-field"><label for="f-link2label">Second link label</label><input id="f-link2label" name="link2_label" value="<?= h($edit['link2_label'] ?? '') ?>"/></div>
        <div class="admin-row"><button class="btn btn-primary" type="submit"><span><?= $edit ? 'Save changes →' : 'Add project →' ?></span></button>
        <?php if ($edit): ?><a class="btn btn-outline" href="admin.php">Cancel</a><?php endif; ?></div>
      </form>
    </section>
    <section class="admin-card">
      <h2>Existing projects</h2>
      <table class="admin-table">
        <thead><tr><th>Title</th><th>Category</th><th>Filter</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($projects as $p): ?>
          <tr>
            <td><?= h($p['title']) ?></td><td><?= h($p['category']) ?></td><td><?= h($p['filter']) ?></td>
            <td><div class="admin-row">
              <a class="btn btn-outline" href="admin.php?edit=<?= (int) $p['id'] ?>">Edit</a>
              <form method="post" onsubmit="return confirm('Delete this project?');"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"/><input type="hidden" name="action" value="delete"/><input type="hidden" name="id" value="<?= (int) $p['id'] ?>"/><button class="btn btn-outline" type="submit">Delete</button></form>
            </div></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </section>
  <?php endif; ?>
</main>
</body>
</html>
