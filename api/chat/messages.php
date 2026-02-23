<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = db();

if ($method === 'GET') {
    $conversationId = trim((string)($_GET['conversation_id'] ?? ''));
    if ($conversationId === '') {
        json_response(['error' => 'conversation_id is required'], 422);
    }

    $ownership = $pdo->prepare(
        'SELECT id FROM conversations WHERE id = :id AND user_id = :user_id LIMIT 1'
    );
    $ownership->execute([
        'id' => $conversationId,
        'user_id' => $user['id'],
    ]);
    if (!$ownership->fetch()) {
        json_response(['error' => 'Conversation not found'], 404);
    }

    $stmt = $pdo->prepare(
        'SELECT id, conversation_id, role, content, created_at, helpful, feedback, topic, confidence_score
         FROM messages
         WHERE conversation_id = :conversation_id
         ORDER BY created_at ASC'
    );
    $stmt->execute(['conversation_id' => $conversationId]);
    json_response(['messages' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = json_input();
    $conversationId = trim((string)($input['conversation_id'] ?? ''));
    $role = (string)($input['role'] ?? '');
    $content = trim((string)($input['content'] ?? ''));
    $topic = isset($input['topic']) ? (string)$input['topic'] : null;
    $confidence = isset($input['confidence_score']) ? (float)$input['confidence_score'] : null;

    if ($conversationId === '' || $content === '') {
        json_response(['error' => 'conversation_id and content are required'], 422);
    }
    if (!in_array($role, ['user', 'assistant'], true)) {
        json_response(['error' => 'Invalid role'], 422);
    }

    $ownership = $pdo->prepare(
        'SELECT id FROM conversations WHERE id = :id AND user_id = :user_id LIMIT 1'
    );
    $ownership->execute([
        'id' => $conversationId,
        'user_id' => $user['id'],
    ]);
    if (!$ownership->fetch()) {
        json_response(['error' => 'Conversation not found'], 404);
    }

    $messageId = uuid_v4();
    $insert = $pdo->prepare(
        'INSERT INTO messages (id, conversation_id, role, content, topic, confidence_score)
         VALUES (:id, :conversation_id, :role, :content, :topic, :confidence_score)'
    );
    $insert->execute([
        'id' => $messageId,
        'conversation_id' => $conversationId,
        'role' => $role,
        'content' => $content,
        'topic' => $topic,
        'confidence_score' => $confidence,
    ]);

    $stmt = $pdo->prepare(
        'SELECT id, conversation_id, role, content, created_at, helpful, feedback, topic, confidence_score
         FROM messages
         WHERE id = :id
         LIMIT 1'
    );
    $stmt->execute(['id' => $messageId]);
    json_response(['message' => $stmt->fetch()], 201);
}

json_response(['error' => 'Method not allowed'], 405);

