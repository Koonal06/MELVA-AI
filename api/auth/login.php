<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$input = json_input();
$email = strtolower(trim((string)($input['email'] ?? '')));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['error' => 'Email and password are required'], 422);
}

$stmt = db()->prepare('SELECT id, password_hash FROM users WHERE email = :email LIMIT 1');
$stmt->execute(['email' => $email]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, (string)$row['password_hash'])) {
    json_response(['error' => 'Invalid login credentials'], 401);
}

$_SESSION['user_id'] = (string)$row['id'];
$user = current_user();
json_response(['user' => $user]);

