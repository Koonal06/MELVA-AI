<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = db();

if ($method === 'POST') {
    $conversationId = uuid_v4();
    $stmt = $pdo->prepare('INSERT INTO conversations (id, user_id) VALUES (:id, :user_id)');
    $stmt->execute([
        'id' => $conversationId,
        'user_id' => $user['id'],
    ]);
    json_response(['conversation' => ['id' => $conversationId]], 201);
}

json_response(['error' => 'Method not allowed'], 405);

