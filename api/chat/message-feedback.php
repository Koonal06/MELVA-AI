<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$input = json_input();
$messageId = trim((string)($input['message_id'] ?? ''));
$helpful = isset($input['helpful']) ? (bool)$input['helpful'] : null;

if ($messageId === '' || $helpful === null) {
    json_response(['error' => 'message_id and helpful are required'], 422);
}

$pdo = db();
$stmt = $pdo->prepare(
    'UPDATE messages m
     INNER JOIN conversations c ON c.id = m.conversation_id
     SET m.helpful = :helpful
     WHERE m.id = :message_id AND c.user_id = :user_id'
);
$stmt->execute([
    'helpful' => $helpful ? 1 : 0,
    'message_id' => $messageId,
    'user_id' => $user['id'],
]);

json_response(['ok' => true]);

