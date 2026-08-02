<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use DateTimeImmutable;
use PDO;

final class Security
{
    private Config $config;
    private Database $database;
    private bool $userLoaded = false;
    private ?array $user = null;

    public function __construct(Config $config, Database $database)
    {
        $this->config = $config;
        $this->database = $database;
        $this->startSession();
    }

    private function startSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'Lax');

        $absoluteHours = max(1, (int) $this->config->get('session.absolute_hours', 12));
        ini_set('session.gc_maxlifetime', (string) ($absoluteHours * 3600));
        $savePath = (string) $this->config->get('session.save_path', '');
        if ($savePath !== '' && is_dir($savePath) && is_writable($savePath)) {
            session_save_path($savePath);
        }

        $configuredName = (string) $this->config->get('session.name', '__Host-lizzirene_session');
        $secure = $this->config->isProduction();
        $name = $secure ? $configuredName : 'lizzirene_session';
        session_name($name);
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();

        $now = time();
        $started = (int) ($_SESSION['started_at'] ?? $now);
        $lastSeen = (int) ($_SESSION['last_seen_at'] ?? $now);
        $role = (string) ($_SESSION['role'] ?? 'customer');
        $idleMinutes = (int) $this->config->get(
            $role === 'admin' ? 'session.admin_idle_minutes' : 'session.idle_minutes',
            $role === 'admin' ? 30 : 120
        );
        if (
            isset($_SESSION['user_id']) &&
            ($now - $lastSeen > $idleMinutes * 60 || $now - $started > $absoluteHours * 3600)
        ) {
            $this->clearSession();
            session_regenerate_id(true);
        }

        $_SESSION['started_at'] ??= $now;
        $_SESSION['last_seen_at'] = $now;
        $_SESSION['csrf_token'] ??= self::randomToken(32);
    }

    public function csrfToken(): string
    {
        $token = $_SESSION['csrf_token'] ?? null;
        if (!is_string($token) || strlen($token) < 32) {
            $token = self::randomToken(32);
            $_SESSION['csrf_token'] = $token;
        }
        return $token;
    }

    public function requireMutation(Request $request): void
    {
        $this->requireOrigin($request);
        $token = $request->header('X-CSRF-Token');
        if ($token === null || !hash_equals($this->csrfToken(), $token)) {
            throw new ApiException(419, 'csrf_mismatch', 'La session a expiré. Rechargez la page.');
        }
    }

    public function requireOrigin(Request $request): void
    {
        $origin = $request->header('Origin');
        $expected = rtrim((string) $this->config->get('app_url', 'https://lizzirenedeco.com'), '/');
        if ($origin === null || rtrim($origin, '/') !== $expected) {
            throw new ApiException(403, 'invalid_origin', 'Origine de la requête refusée.');
        }
    }

    public function currentUser(): ?array
    {
        if ($this->userLoaded) {
            return $this->user;
        }
        $this->userLoaded = true;

        $id = filter_var($_SESSION['user_id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id || !$this->config->configured()) {
            return null;
        }

        $statement = $this->database->pdo()->prepare(
            'SELECT id, public_id, role, status, name, phone_e164, email, commune, quartier,
             address_landmark, auth_version, created_at
             FROM users WHERE id = ? LIMIT 1'
        );
        $statement->execute([(int) $id]);
        $user = $statement->fetch();
        if (
            !$user ||
            $user['status'] !== 'active' ||
            (int) $user['auth_version'] !== (int) ($_SESSION['auth_version'] ?? 0)
        ) {
            $this->clearSession();
            session_regenerate_id(true);
            $_SESSION['started_at'] = time();
            $_SESSION['last_seen_at'] = time();
            $_SESSION['csrf_token'] = self::randomToken(32);
            return null;
        }

        $this->user = $this->publicUser($user);
        return $this->user;
    }

    public function refreshUser(): ?array
    {
        $this->userLoaded = false;
        $this->user = null;
        return $this->currentUser();
    }

    public function requireUser(): array
    {
        $user = $this->currentUser();
        if ($user === null) {
            throw new ApiException(401, 'authentication_required', 'Connectez-vous pour continuer.');
        }
        return $user;
    }

    public function requireAdmin(): array
    {
        $user = $this->requireUser();
        if ($user['role'] !== 'admin') {
            throw new ApiException(403, 'admin_required', 'Accès réservé à l’administration.');
        }
        return $user;
    }

    public function login(array $user): array
    {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['role'] = (string) $user['role'];
        $_SESSION['auth_version'] = (int) ($user['auth_version'] ?? 1);
        $_SESSION['started_at'] = time();
        $_SESSION['last_seen_at'] = time();
        $_SESSION['csrf_token'] = self::randomToken(32);
        $this->userLoaded = false;
        $this->user = null;

        return $this->currentUser() ?? throw new ApiException(500, 'session_error', 'Connexion impossible.');
    }

    public function logout(): void
    {
        $this->clearSession();
        session_regenerate_id(true);
        $_SESSION['started_at'] = time();
        $_SESSION['last_seen_at'] = time();
        $_SESSION['csrf_token'] = self::randomToken(32);
    }

    private function clearSession(): void
    {
        $_SESSION = [];
        $this->userLoaded = true;
        $this->user = null;
    }

    public function publicUser(array $user): array
    {
        return [
            'id' => (string) $user['public_id'],
            'role' => (string) $user['role'],
            'name' => (string) $user['name'],
            'phone' => (string) $user['phone_e164'],
            'email' => $user['email'] !== null ? (string) $user['email'] : null,
            'commune' => $user['commune'] !== null ? (string) $user['commune'] : null,
            'quartier' => $user['quartier'] !== null ? (string) $user['quartier'] : null,
            'addressLandmark' => $user['address_landmark'] !== null
                ? (string) $user['address_landmark']
                : null,
            'createdAt' => (string) $user['created_at'],
        ];
    }

    public function rateLimit(string $action, string $subject, int $limit, int $windowSeconds): void
    {
        $hash = $this->hashSubject($subject);
        $this->database->transaction(function (PDO $pdo) use ($action, $hash, $limit, $windowSeconds): void {
            $statement = $pdo->prepare(
                'SELECT hits, UNIX_TIMESTAMP(window_started_at) AS started
                 FROM rate_limits WHERE action_name = ? AND subject_hash = ? FOR UPDATE'
            );
            $statement->execute([$action, $hash]);
            $row = $statement->fetch();
            $now = time();

            if (!$row || $now - (int) $row['started'] >= $windowSeconds) {
                $upsert = $pdo->prepare(
                    'INSERT INTO rate_limits (action_name, subject_hash, window_started_at, hits)
                     VALUES (?, ?, UTC_TIMESTAMP(), 1)
                     ON DUPLICATE KEY UPDATE window_started_at = UTC_TIMESTAMP(), hits = 1'
                );
                $upsert->execute([$action, $hash]);
                return;
            }

            if ((int) $row['hits'] >= $limit) {
                $retryAfter = max(1, $windowSeconds - ($now - (int) $row['started']));
                header('Retry-After: ' . $retryAfter);
                throw new ApiException(429, 'rate_limited', 'Trop de tentatives. Réessayez un peu plus tard.');
            }

            $update = $pdo->prepare(
                'UPDATE rate_limits SET hits = hits + 1 WHERE action_name = ? AND subject_hash = ?'
            );
            $update->execute([$action, $hash]);
        });
    }

    public function audit(
        string $action,
        ?string $entityType = null,
        ?string $entityId = null,
        array $metadata = []
    ): void {
        try {
            $user = $this->currentUser();
            $statement = $this->database->pdo()->prepare(
                'INSERT INTO audit_logs
                 (actor_user_id, action_name, entity_type, entity_id, ip_hash, metadata_json)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $statement->execute([
                $user !== null ? $this->sessionUserId() : null,
                $action,
                $entityType,
                $entityId,
                $this->hashSubject($this->clientIp()),
                $metadata !== [] ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : null,
            ]);
        } catch (\Throwable $exception) {
            error_log('[lizzirene-api] audit: ' . $exception->getMessage());
        }
    }

    public function sessionUserId(): ?int
    {
        $id = filter_var($_SESSION['user_id'] ?? null, FILTER_VALIDATE_INT);
        return $id ? (int) $id : null;
    }

    public function clientIp(): string
    {
        return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    }

    public function hashSubject(string $value): string
    {
        $key = (string) $this->config->get('app_key', 'unconfigured');
        return hash_hmac('sha256', $value, $key);
    }

    public static function passwordHash(string $password): string
    {
        $algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
        $hash = password_hash($password, $algorithm);
        if (!is_string($hash)) {
            throw new ApiException(500, 'password_error', 'Impossible de sécuriser le mot de passe.');
        }
        return $hash;
    }

    public static function randomToken(int $bytes = 32): string
    {
        return rtrim(strtr(base64_encode(random_bytes($bytes)), '+/', '-_'), '=');
    }

    public static function uuid(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
        $hex = bin2hex($bytes);
        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($hex, 0, 8),
            substr($hex, 8, 4),
            substr($hex, 12, 4),
            substr($hex, 16, 4),
            substr($hex, 20)
        );
    }
}
