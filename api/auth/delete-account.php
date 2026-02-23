<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();

$pdo = db();
$pdo->beginTransaction();
try {
    $delete = $pdo->prepare('DELETE FROM users WHERE id = :id');
    $delete->execute(['id' => $user['id']]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    json_response(['error' => 'Failed to delete account'], 500);
}

$_SESSION = [];
session_destroy();
json_response(['ok' => true]);

