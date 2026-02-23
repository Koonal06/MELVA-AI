<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

$input = json_input();
$email = strtolower(trim((string)($input['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Valid email is required'], 422);
}

// Local XAMPP mode: no mailer configured by default.
// We intentionally return success to avoid leaking whether an account exists.
json_response([
    'ok' => true,
    'message' => 'If the account exists, reset instructions were sent.',
]);

