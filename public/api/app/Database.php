<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;
use PDOException;
use Throwable;

final class Database
{
    private Config $config;
    private ?PDO $pdo = null;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function pdo(): PDO
    {
        if ($this->pdo instanceof PDO) {
            return $this->pdo;
        }

        if (!$this->config->configured()) {
            throw new ApiException(
                503,
                'configuration_required',
                'Le service de comptes et de commandes est en cours de configuration.'
            );
        }

        try {
            $this->pdo = new PDO(
                $this->config->requireString('database.dsn'),
                $this->config->requireString('database.username'),
                $this->config->requireString('database.password'),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_STRINGIFY_FETCHES => false,
                ]
            );
            $this->pdo->exec("SET SESSION time_zone = '+00:00'");
            $this->pdo->exec(
                "SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
            );
        } catch (PDOException $exception) {
            error_log('[lizzirene-api] database connection: ' . $exception->getMessage());
            throw new ApiException(
                503,
                'database_unavailable',
                'Le service est momentanément indisponible.'
            );
        }

        return $this->pdo;
    }

    public function transaction(callable $callback): mixed
    {
        $pdo = $this->pdo();
        $outermost = !$pdo->inTransaction();
        if ($outermost) {
            $pdo->beginTransaction();
        }

        try {
            $result = $callback($pdo);
            if ($outermost) {
                $pdo->commit();
            }
            return $result;
        } catch (Throwable $exception) {
            if ($outermost && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $exception;
        }
    }
}
