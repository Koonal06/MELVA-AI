<?php
declare(strict_types=1);

session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = false;
if ($origin !== '') {
    $allowedOrigin = preg_match(
        '/^https?:\/\/((localhost|127\.0\.0\.1)(:\d+)?|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?|(192\.168\.\d{1,3}\.\d{1,3})(:\d+)?|(172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?)$/',
        $origin
    ) === 1;
}

if ($allowedOrigin) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function env_value(string $name, string $default): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env_value('MELVA_DB_HOST', '127.0.0.1');
    $port = env_value('MELVA_DB_PORT', '3306');
    $name = env_value('MELVA_DB_NAME', 'melva');
    $user = env_value('MELVA_DB_USER', 'root');
    $pass = env_value('MELVA_DB_PASS', '');

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    $hex = bin2hex($data);
    return sprintf(
        '%s-%s-%s-%s-%s',
        substr($hex, 0, 8),
        substr($hex, 8, 4),
        substr($hex, 12, 4),
        substr($hex, 16, 4),
        substr($hex, 20, 12)
    );
}

function current_user(): ?array
{
    $userId = $_SESSION['user_id'] ?? null;
    if (!is_string($userId) || $userId === '') {
        return null;
    }

    $stmt = db()->prepare('SELECT id, email, created_at FROM users WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function require_user(): array
{
    $user = current_user();
    if ($user === null) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    return $user;
}
