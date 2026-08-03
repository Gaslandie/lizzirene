<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;
use PDOException;

final class Setup
{
    private Config $config;
    private Database $database;
    private ?Security $security;

    public function __construct(Config $config, Database $database, ?Security $security = null)
    {
        $this->config = $config;
        $this->database = $database;
        $this->security = $security;
    }

    private function security(): Security
    {
        return $this->security ??= new Security($this->config, $this->database);
    }

    public function health(): array
    {
        $result = [
            'service' => 'lizzirene-api',
            'version' => '1.0.0',
            'configured' => $this->config->configured(),
            'database' => false,
            'installed' => false,
            'migrations' => [
                'appliedVersions' => [],
                'pendingVersions' => [],
                'changedVersions' => [],
                'unknownVersions' => [],
            ],
            'time' => gmdate(DATE_ATOM),
        ];

        if (!$this->config->configured()) {
            return $result;
        }

        try {
            $pdo = $this->database->pdo();
            $pdo->query('SELECT 1')->fetchColumn();
            $result['database'] = true;
        } catch (\Throwable $exception) {
            error_log('[lizzirene-api] health database: ' . $exception->getMessage());
            return $result;
        }

        try {
            $result['installed'] = $this->installationStatus($pdo);
            $result['migrations'] = $this->migrationStatus($pdo);
        } catch (\Throwable $exception) {
            error_log('[lizzirene-api] health metadata: ' . $exception->getMessage());
        }

        return $result;
    }

    public function migrate(Request $request): array
    {
        if (!$this->config->configured()) {
            throw new ApiException(503, 'configuration_required', 'La configuration privée Bluehost est absente ou incomplète.');
        }

        $this->security()->requireOrigin($request);
        $provided = $request->header('X-Migration-Token');
        $expected = (string) $this->config->get('migration_token', '');
        if (
            $provided === null ||
            strlen($expected) < 64 ||
            !hash_equals($expected, $provided)
        ) {
            throw new ApiException(404, 'not_found', 'Ressource introuvable.');
        }

        $pdo = $this->database->pdo();
        $applied = $this->applyPendingMigrations($pdo);
        $status = $this->migrationStatus($pdo);

        return [
            'migrated' => true,
            'applied' => $applied,
            'appliedVersions' => $status['appliedVersions'],
            'pendingVersions' => $status['pendingVersions'],
            'changedVersions' => $status['changedVersions'],
            'unknownVersions' => $status['unknownVersions'],
            'installed' => $this->isInstalled(),
        ];
    }

    public function initialize(Request $request): array
    {
        if (!$this->config->configured()) {
            throw new ApiException(503, 'configuration_required', 'La configuration privée Bluehost est absente ou incomplète.');
        }

        if ($this->config->get('setup_enabled', true) !== true) {
            throw new ApiException(404, 'not_found', 'Ressource introuvable.');
        }

        $missingExtensions = array_values(array_filter(
            ['pdo_mysql', 'mbstring', 'fileinfo', 'gd'],
            static fn (string $extension): bool => !extension_loaded($extension)
        ));
        if (PHP_VERSION_ID < 80100 || $missingExtensions !== []) {
            throw new ApiException(
                503,
                'runtime_requirements',
                'PHP 8.1+ avec PDO MySQL, mbstring, fileinfo et GD est nécessaire.'
            );
        }

        $security = $this->security();
        $security->requireOrigin($request);
        $provided = $request->header('X-Setup-Token');
        $expected = (string) $this->config->get('setup_token', '');
        if (
            $provided === null ||
            strlen($expected) < 64 ||
            !hash_equals($expected, $provided)
        ) {
            throw new ApiException(404, 'not_found', 'Ressource introuvable.');
        }

        if (strlen((string) $this->config->get('app_key', '')) < 64) {
            throw new ApiException(503, 'invalid_configuration', 'La clé privée APP_KEY doit contenir au moins 64 caractères.');
        }

        $data = $request->json();
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data, 'email', true);
        $password = Validation::password($data);

        $pdo = $this->database->pdo();
        $lock = $pdo->query("SELECT GET_LOCK('lizzirene_initial_setup', 10)")->fetchColumn();
        if ((int) $lock !== 1) {
            throw new ApiException(409, 'setup_busy', 'Une installation est déjà en cours. Réessayez dans un instant.');
        }

        try {
            $this->applyPendingMigrations($pdo);

            if ($this->isInstalled()) {
                throw new ApiException(409, 'already_installed', 'L’administration est déjà installée.');
            }

            $user = $this->database->transaction(function (PDO $pdo) use ($name, $phone, $email, $password): array {
                $statement = $pdo->prepare(
                    'INSERT INTO users
                     (public_id, role, status, name, phone_e164, email, password_hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?)'
                );
                $statement->execute([
                    Security::uuid(),
                    'admin',
                    'active',
                    $name,
                    $phone,
                    $email,
                    Security::passwordHash($password),
                ]);
                $adminId = (int) $pdo->lastInsertId();
                $this->seedCatalog($pdo);

                $select = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
                $select->execute([$adminId]);
                return $select->fetch() ?: throw new ApiException(500, 'setup_error', 'Création administratrice impossible.');
            });
        } finally {
            $pdo->query("SELECT RELEASE_LOCK('lizzirene_initial_setup')");
        }

        $loggedIn = $security->login($user);
        $security->audit('setup.completed', 'user', (string) $user['public_id']);

        return [
            'user' => $loggedIn,
            'csrfToken' => $security->csrfToken(),
            'catalogImported' => true,
        ];
    }

    public function isInstalled(): bool
    {
        try {
            return $this->installationStatus($this->database->pdo());
        } catch (PDOException) {
            return false;
        }
    }

    private function installationStatus(PDO $pdo): bool
    {
        $table = $pdo->prepare(
            'SELECT COUNT(*) FROM information_schema.tables
             WHERE table_schema = DATABASE() AND table_name = ?'
        );
        $table->execute(['users']);
        if ((int) $table->fetchColumn() === 0) {
            return false;
        }

        $statement = $pdo->query(
            "SELECT COUNT(*) FROM users WHERE role = 'admin' AND status = 'active'"
        );
        return (int) $statement->fetchColumn() > 0;
    }

    private function applyPendingMigrations(PDO $pdo): array
    {
        $definitions = $this->migrationDefinitions();
        $lock = $pdo->query("SELECT GET_LOCK('lizzirene_schema_migrations', 10)")->fetchColumn();
        if ((int) $lock !== 1) {
            throw new ApiException(409, 'migration_busy', 'Une mise à jour de la base est déjà en cours.');
        }

        try {
            $pdo->exec(
                'CREATE TABLE IF NOT EXISTS schema_migrations (
                   version VARCHAR(64) NOT NULL PRIMARY KEY,
                   checksum CHAR(64) NOT NULL,
                   applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
            );

            $existing = $pdo->prepare(
                'SELECT checksum FROM schema_migrations WHERE version = ? LIMIT 1'
            );
            $record = $pdo->prepare(
                'INSERT INTO schema_migrations (version, checksum) VALUES (?, ?)'
            );
            $applied = [];

            foreach ($definitions as $version => $definition) {
                $existing->execute([$version]);
                $existingChecksum = $existing->fetchColumn();
                if (is_string($existingChecksum)) {
                    if (!hash_equals($existingChecksum, $definition['checksum'])) {
                        throw new ApiException(
                            500,
                            'migration_changed',
                            "La migration {$version} déjà appliquée a été modifiée."
                        );
                    }
                    continue;
                }

                foreach ($this->splitSqlStatements($definition['sql'], $version) as $statement) {
                    $pdo->exec($statement);
                }
                $record->execute([$version, $definition['checksum']]);
                $applied[] = $version;
            }

            return $applied;
        } finally {
            try {
                $pdo->query("SELECT RELEASE_LOCK('lizzirene_schema_migrations')");
            } catch (\Throwable $exception) {
                error_log('[lizzirene-api] migration lock release: ' . $exception->getMessage());
            }
        }
    }

    private function migrationStatus(PDO $pdo): array
    {
        $definitions = $this->migrationDefinitions();
        $appliedChecksums = [];

        $table = $pdo->prepare(
            'SELECT COUNT(*) FROM information_schema.tables
             WHERE table_schema = DATABASE() AND table_name = ?'
        );
        $table->execute(['schema_migrations']);
        if ((int) $table->fetchColumn() > 0) {
            $rows = $pdo->query(
                'SELECT version, checksum FROM schema_migrations ORDER BY version'
            )->fetchAll();
            foreach ($rows as $row) {
                $appliedChecksums[(string) $row['version']] = (string) $row['checksum'];
            }
        }

        $pending = [];
        $changed = [];
        foreach ($definitions as $version => $definition) {
            if (!array_key_exists($version, $appliedChecksums)) {
                $pending[] = $version;
                continue;
            }
            if (!hash_equals($appliedChecksums[$version], $definition['checksum'])) {
                $changed[] = $version;
            }
        }
        $unknown = array_values(array_diff(
            array_keys($appliedChecksums),
            array_keys($definitions)
        ));

        return [
            'appliedVersions' => array_keys($appliedChecksums),
            'pendingVersions' => $pending,
            'changedVersions' => $changed,
            'unknownVersions' => $unknown,
        ];
    }

    private function migrationDefinitions(): array
    {
        $paths = glob(dirname(__DIR__) . '/database/[0-9][0-9][0-9]_*.sql');
        if (!is_array($paths) || $paths === []) {
            throw new ApiException(500, 'migration_missing', 'Aucune migration de base de données n’est disponible.');
        }
        sort($paths, SORT_STRING);

        $definitions = [];
        foreach ($paths as $path) {
            $version = pathinfo($path, PATHINFO_FILENAME);
            $sql = file_get_contents($path);
            if (
                $version === '' ||
                strlen($version) > 64 ||
                !is_string($sql) ||
                trim($sql) === '' ||
                array_key_exists($version, $definitions)
            ) {
                throw new ApiException(500, 'migration_invalid', "Migration invalide : {$version}.");
            }
            $definitions[$version] = [
                'sql' => $sql,
                'checksum' => hash('sha256', $sql),
            ];
        }

        return $definitions;
    }

    private function splitSqlStatements(string $sql, string $version): array
    {
        if (preg_match('/^\s*DELIMITER\b/im', $sql)) {
            throw new ApiException(
                500,
                'migration_unsupported',
                "La migration {$version} utilise DELIMITER, qui n’est pas pris en charge."
            );
        }

        $statements = [];
        $buffer = '';
        $state = 'normal';
        $length = strlen($sql);

        for ($index = 0; $index < $length; $index++) {
            $character = $sql[$index];
            $next = $index + 1 < $length ? $sql[$index + 1] : null;

            if ($state === 'line_comment') {
                if ($character === "\n" || $character === "\r") {
                    $state = 'normal';
                    $buffer .= $character;
                }
                continue;
            }

            if ($state === 'block_comment') {
                if ($character === '*' && $next === '/') {
                    $state = 'normal';
                    $buffer .= ' ';
                    $index++;
                }
                continue;
            }

            if (in_array($state, ['single_quote', 'double_quote', 'backtick'], true)) {
                $buffer .= $character;
                if ($character === '\\' && $next !== null) {
                    $buffer .= $next;
                    $index++;
                    continue;
                }

                $delimiter = match ($state) {
                    'single_quote' => "'",
                    'double_quote' => '"',
                    default => '`',
                };
                if ($character === $delimiter) {
                    if ($next === $delimiter) {
                        $buffer .= $next;
                        $index++;
                    } else {
                        $state = 'normal';
                    }
                }
                continue;
            }

            if ($character === "'") {
                $state = 'single_quote';
                $buffer .= $character;
                continue;
            }
            if ($character === '"') {
                $state = 'double_quote';
                $buffer .= $character;
                continue;
            }
            if ($character === '`') {
                $state = 'backtick';
                $buffer .= $character;
                continue;
            }
            if ($character === '#') {
                $state = 'line_comment';
                $buffer .= ' ';
                continue;
            }
            if (
                $character === '-' &&
                $next === '-' &&
                ($index + 2 >= $length || ord($sql[$index + 2]) <= 32)
            ) {
                $state = 'line_comment';
                $buffer .= ' ';
                $index++;
                continue;
            }
            if ($character === '/' && $next === '*') {
                $marker = $index + 2 < $length ? $sql[$index + 2] : null;
                if ($marker === '!' || $marker === '+') {
                    throw new ApiException(
                        500,
                        'migration_unsupported',
                        "La migration {$version} contient un commentaire MySQL exécutable non pris en charge."
                    );
                }
                $state = 'block_comment';
                $buffer .= ' ';
                $index++;
                continue;
            }
            if ($character === ';') {
                $statement = trim($buffer);
                if ($statement !== '') {
                    $statements[] = $statement;
                }
                $buffer = '';
                continue;
            }

            $buffer .= $character;
        }

        if (in_array($state, ['single_quote', 'double_quote', 'backtick', 'block_comment'], true)) {
            throw new ApiException(500, 'migration_invalid', "Migration SQL incomplète : {$version}.");
        }

        $remainder = trim($buffer);
        if ($remainder !== '') {
            $statements[] = $remainder;
        }
        if ($statements === []) {
            throw new ApiException(500, 'migration_invalid', "Migration vide : {$version}.");
        }

        return $statements;
    }

    private function seedCatalog(PDO $pdo): void
    {
        $path = dirname(__DIR__) . '/database/catalogue-initial.json';
        $raw = file_get_contents($path);
        $products = is_string($raw) ? json_decode($raw, true) : null;
        if (!is_array($products)) {
            throw new ApiException(500, 'catalog_seed_missing', 'Catalogue initial introuvable.');
        }

        $insert = $pdo->prepare(
            'INSERT INTO products
             (slug, name, category, description, price_gnf, price_mode,
              price_label, price_prefix, tag, image_url, image_srcset,
              image_sizes, image_alt, image_width, image_height, image_position,
              visual_variant, care_json, status, availability, featured_home, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               name = VALUES(name),
               category = VALUES(category),
               description = VALUES(description),
               price_gnf = VALUES(price_gnf),
               price_mode = VALUES(price_mode),
               price_label = VALUES(price_label),
               price_prefix = VALUES(price_prefix),
               tag = VALUES(tag),
               image_url = VALUES(image_url),
               image_srcset = VALUES(image_srcset),
               image_sizes = VALUES(image_sizes),
               image_alt = VALUES(image_alt),
               image_width = VALUES(image_width),
               image_height = VALUES(image_height),
               image_position = VALUES(image_position),
               visual_variant = VALUES(visual_variant),
               care_json = VALUES(care_json),
               status = VALUES(status),
               availability = VALUES(availability),
               featured_home = VALUES(featured_home),
               sort_order = VALUES(sort_order)'
        );

        foreach ($products as $product) {
            if (!is_array($product)) {
                continue;
            }
            $insert->execute([
                $product['slug'],
                $product['name'],
                $product['category'],
                $product['description'],
                $product['priceGnf'],
                $product['priceMode'],
                $product['priceLabel'],
                $product['pricePrefix'],
                $product['tag'],
                $product['imageUrl'],
                $product['imageSrcSet'],
                $product['imageSizes'],
                $product['imageAlt'],
                $product['imageWidth'],
                $product['imageHeight'],
                $product['imagePosition'],
                $product['visualVariant'],
                $product['care'] !== null
                    ? json_encode($product['care'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                    : null,
                $product['status'],
                $product['availability'],
                $product['featuredHome'] ? 1 : 0,
                $product['sortOrder'],
            ]);
        }
    }
}
