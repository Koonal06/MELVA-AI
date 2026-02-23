<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$input = json_input();
$email = strtolower(trim((string)($input['email'] ?? '')));
$password = (string)($input['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Valid email is required'], 422);
}
if (strlen($password) < 6) {
    json_response(['error' => 'Password must be at least 6 characters'], 422);
}

$pdo = db();
$existing = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
$existing->execute(['email' => $email]);
if ($existing->fetch()) {
    json_response(['error' => 'User already registered'], 409);
}

$userId = uuid_v4();
$hash = password_hash($password, PASSWORD_DEFAULT);

$pdo->beginTransaction();
try {
    $insertUser = $pdo->prepare(
        'INSERT INTO users (id, email, password_hash) VALUES (:id, :email, :password_hash)'
    );
    $insertUser->execute([
        'id' => $userId,
        'email' => $email,
        'password_hash' => $hash,
    ]);

    $insertSubscription = $pdo->prepare(
        'INSERT INTO user_subscriptions (id, user_id, plan, status, current_period_end)
         VALUES (:id, :user_id, :plan, :status, :current_period_end)'
    );
    $insertSubscription->execute([
        'id' => uuid_v4(),
        'user_id' => $userId,
        'plan' => 'free',
        'status' => 'active',
        'current_period_end' => date('Y-m-d H:i:s', strtotime('+30 days')),
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    json_response(['error' => 'Failed to create account'], 500);
}

$_SESSION['user_id'] = $userId;
$user = current_user();
json_response(['user' => $user], 201);

