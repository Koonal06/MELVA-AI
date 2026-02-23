<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = db();

if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT id, user_id, plan, status, current_period_end, created_at, updated_at
         FROM user_subscriptions
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $user['id']]);
    $subscription = $stmt->fetch() ?: null;
    json_response(['subscription' => $subscription]);
}

if ($method === 'POST') {
    $input = json_input();
    $plan = (string)($input['plan'] ?? 'free');
    $status = (string)($input['status'] ?? 'active');
    $periodEnd = (string)($input['current_period_end'] ?? date('Y-m-d H:i:s', strtotime('+30 days')));

    $allowedPlans = ['free', 'pro', 'premium'];
    $allowedStatus = ['active', 'cancelled', 'expired'];
    if (!in_array($plan, $allowedPlans, true)) {
        json_response(['error' => 'Invalid plan'], 422);
    }
    if (!in_array($status, $allowedStatus, true)) {
        json_response(['error' => 'Invalid status'], 422);
    }

    $existing = $pdo->prepare('SELECT id FROM user_subscriptions WHERE user_id = :user_id LIMIT 1');
    $existing->execute(['user_id' => $user['id']]);
    $row = $existing->fetch();

    if ($row) {
        $update = $pdo->prepare(
            'UPDATE user_subscriptions
             SET plan = :plan, status = :status, current_period_end = :current_period_end, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = :user_id'
        );
        $update->execute([
            'plan' => $plan,
            'status' => $status,
            'current_period_end' => $periodEnd,
            'user_id' => $user['id'],
        ]);
    } else {
        $insert = $pdo->prepare(
            'INSERT INTO user_subscriptions (id, user_id, plan, status, current_period_end)
             VALUES (:id, :user_id, :plan, :status, :current_period_end)'
        );
        $insert->execute([
            'id' => uuid_v4(),
            'user_id' => $user['id'],
            'plan' => $plan,
            'status' => $status,
            'current_period_end' => $periodEnd,
        ]);
    }

    $stmt = $pdo->prepare(
        'SELECT id, user_id, plan, status, current_period_end, created_at, updated_at
         FROM user_subscriptions
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $user['id']]);
    json_response(['subscription' => $stmt->fetch()]);
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare('DELETE FROM user_subscriptions WHERE user_id = :user_id');
    $stmt->execute(['user_id' => $user['id']]);
    json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);

