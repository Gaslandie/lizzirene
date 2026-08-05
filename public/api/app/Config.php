<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use RuntimeException;

final class Config
{
    private array $values;

    private function __construct(array $values)
    {
        $this->values = $values;
    }

    public static function load(): self
    {
        $paths = [];
        $environmentPath = getenv('LIZZIRENE_CONFIG_PATH');
        if (is_string($environmentPath) && $environmentPath !== '') {
            $paths[] = $environmentPath;
        }

        $paths[] = '/home2/fnksrwmy/lizzirene-private/config.php';
        $paths[] = dirname(__DIR__) . '/config.local.php';

        foreach ($paths as $path) {
            if (!is_file($path)) {
                continue;
            }

            $values = require $path;
            if (!is_array($values)) {
                throw new RuntimeException('La configuration de l’application est invalide.');
            }

            $values['configuration_errors'] = self::collectValidationErrors($values);
            $values['configured'] = $values['configuration_errors'] === [];
            $values['config_path'] = $path;

            return new self($values);
        }

        return new self([
            'configured' => false,
            'environment' => 'production',
            'app_url' => 'https://lizzirenedeco.com',
            'app_key' => '',
            'setup_token' => '',
            'migration_token' => '',
            'whatsapp_number' => '',
            'shop_email' => '',
            'mail' => [],
            'database' => [],
            'session' => [],
            'uploads' => [],
        ]);
    }

    public function configured(): bool
    {
        return (bool) ($this->values['configured'] ?? false);
    }

    public function environment(): string
    {
        return (string) ($this->values['environment'] ?? 'production');
    }

    public function isProduction(): bool
    {
        return $this->environment() === 'production';
    }

    public function get(string $path, mixed $default = null): mixed
    {
        $value = $this->values;
        foreach (explode('.', $path) as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }

    public function requireString(string $path): string
    {
        $value = $this->get($path);
        if (!is_string($value) || trim($value) === '') {
            throw new RuntimeException("Configuration manquante : {$path}");
        }

        return trim($value);
    }

    public function publicConfiguration(): array
    {
        return [
            'configured' => $this->configured(),
            'environment' => $this->environment(),
            'appUrl' => (string) $this->get('app_url', 'https://lizzirenedeco.com'),
        ];
    }

    public function validationErrors(): array
    {
        $errors = $this->get('configuration_errors', []);
        return is_array($errors) ? $errors : ['invalid_configuration'];
    }

    private static function collectValidationErrors(array $values): array
    {
        $errors = [];
        $environment = (string) ($values['environment'] ?? 'production');
        $appUrl = rtrim((string) ($values['app_url'] ?? ''), '/');
        $appKey = (string) ($values['app_key'] ?? '');
        $setupEnabled = ($values['setup_enabled'] ?? true) === true;
        $setupToken = (string) ($values['setup_token'] ?? '');
        $migrationToken = (string) ($values['migration_token'] ?? '');
        $database = is_array($values['database'] ?? null) ? $values['database'] : [];

        if (!in_array($environment, ['production', 'development'], true)) {
            $errors[] = 'invalid_environment';
        }

        if ($environment === 'production' && $appUrl !== 'https://lizzirenedeco.com') {
            $errors[] = 'invalid_app_url';
        } elseif ($appUrl === '' || filter_var($appUrl, FILTER_VALIDATE_URL) === false) {
            $errors[] = 'invalid_app_url';
        }

        if (!self::strongSecret($appKey)) {
            $errors[] = 'invalid_app_key';
        }
        if ($setupEnabled && !self::strongSecret($setupToken)) {
            $errors[] = 'invalid_setup_token';
        }
        if (!self::strongSecret($migrationToken)) {
            $errors[] = 'invalid_migration_token';
        }
        if ($setupEnabled && $appKey !== '' && $setupToken !== '' && hash_equals($appKey, $setupToken)) {
            $errors[] = 'shared_private_keys';
        }
        if ($appKey !== '' && $migrationToken !== '' && hash_equals($appKey, $migrationToken)) {
            $errors[] = 'shared_private_keys';
        }
        if ($setupToken !== '' && $migrationToken !== '' && hash_equals($setupToken, $migrationToken)) {
            $errors[] = 'shared_private_keys';
        }

        $dsn = (string) ($database['dsn'] ?? '');
        $username = (string) ($database['username'] ?? '');
        $password = (string) ($database['password'] ?? '');
        if (!str_starts_with($dsn, 'mysql:') || !str_contains($dsn, 'dbname=') || self::placeholder($dsn)) {
            $errors[] = 'invalid_database_dsn';
        }
        if ($username === '' || self::placeholder($username)) {
            $errors[] = 'invalid_database_username';
        }
        if ($password === '' || self::placeholder($password)) {
            $errors[] = 'invalid_database_password';
        }

        // Le numéro WhatsApp n'est volontairement PAS une erreur bloquante.
        // Une erreur de configuration met `configured()` à false, ce qui fait
        // répondre 503 à toute la base : un numéro mal saisi empêchait alors
        // d'enregistrer la moindre commande, en silence. Un mauvais numéro
        // doit dégrader le lien WhatsApp, pas la prise de commande.

        return array_values(array_unique($errors));
    }

    private static function strongSecret(string $value): bool
    {
        return strlen($value) >= 64 && !self::placeholder($value);
    }

    private static function placeholder(string $value): bool
    {
        return stripos($value, 'CHANGE_ME') !== false;
    }
}
