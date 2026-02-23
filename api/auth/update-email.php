<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();
$input = json_input();
$email = strtolower(trim((string)($input['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Valid email is required'], 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT id FROM users WHERE email = :email AND id != :id LIMIT 1');
$exists->execute([
    'email' => $email,
    'id' => $user['id'],
]);
if ($exists->fetch()) {
    json_response(['error' => 'Email is already in use'], 409);
}

$update = $pdo->prepare('UPDATE users SET email = :email, updated_at = CURRENT_TIMESTAMP WHERE id = :id');
$update->execute([
    'email' => $email,
    'id' => $user['id'],
]);

json_response(['user' => current_user()]);

