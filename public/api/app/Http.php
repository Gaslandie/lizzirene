<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use JsonException;
use RuntimeException;
use Throwable;

final class ApiException extends RuntimeException
{
    public int $status;
    public string $errorCode;
    public array $fields;

    public function __construct(
        int $status,
        string $errorCode,
        string $message,
        array $fields = []
    ) {
        parent::__construct($message);
        $this->status = $status;
        $this->errorCode = $errorCode;
        $this->fields = $fields;
    }
}

final class Request
{
    private ?array $jsonBody = null;
    private bool $jsonParsed = false;

    public readonly string $method;
    public readonly string $path;

    public function __construct()
    {
        $this->method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        $requestPath = (string) parse_url(
            (string) ($_SERVER['REQUEST_URI'] ?? '/api'),
            PHP_URL_PATH
        );

        if ($requestPath === '/api') {
            $requestPath = '';
        } elseif (str_starts_with($requestPath, '/api/')) {
            $requestPath = substr($requestPath, 4);
        }

        $requestPath = '/' . ltrim($requestPath, '/');
        $this->path = $requestPath === '/' ? '/' : rtrim($requestPath, '/');
    }

    public function json(): array
    {
        if ($this->jsonParsed) {
            return $this->jsonBody ?? [];
        }

        $this->jsonParsed = true;
        $maximumBytes = 1024 * 1024;
        $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($length > $maximumBytes) {
            throw new ApiException(413, 'payload_too_large', 'La requête est trop volumineuse.');
        }

        // La limite CONTENT_LENGTH ne suffit pas pour un transfert HTTP
        // « chunked ». Lire au plus un octet au-delà de la limite permet de
        // refuser aussi ce cas sans charger un corps arbitraire en mémoire.
        $raw = file_get_contents('php://input', false, null, 0, $maximumBytes + 1);
        if (is_string($raw) && strlen($raw) > $maximumBytes) {
            throw new ApiException(413, 'payload_too_large', 'La requête est trop volumineuse.');
        }
        if ($raw === false || trim($raw) === '') {
            $this->jsonBody = [];
            return [];
        }

        try {
            $decoded = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new ApiException(400, 'invalid_json', 'Le contenu envoyé est invalide.');
        }

        if (!is_array($decoded) || array_is_list($decoded)) {
            throw new ApiException(400, 'invalid_json', 'Un objet JSON est attendu.');
        }

        $this->jsonBody = $decoded;
        return $decoded;
    }

    public function header(string $name): ?string
    {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
        $value = $_SERVER[$key] ?? null;
        if (!is_string($value) || trim($value) === '') {
            return null;
        }

        return trim($value);
    }

    public function query(string $name, mixed $default = null): mixed
    {
        return $_GET[$name] ?? $default;
    }

    public function file(string $name): ?array
    {
        $file = $_FILES[$name] ?? null;
        return is_array($file) ? $file : null;
    }
}

final class Response
{
    public static function json(array $payload, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, private');
        echo json_encode(
            $payload,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
        );
        exit;
    }

    public static function data(mixed $data, int $status = 200, array $meta = []): never
    {
        $payload = ['data' => $data];
        if ($meta !== []) {
            $payload['meta'] = $meta;
        }
        self::json($payload, $status);
    }

    public static function error(ApiException $exception): never
    {
        $error = [
            'code' => $exception->errorCode,
            'message' => $exception->getMessage(),
        ];
        if ($exception->fields !== []) {
            $error['fields'] = $exception->fields;
        }
        self::json(['error' => $error], $exception->status);
    }

    public static function xml(string $xml, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=900');
        echo $xml;
        exit;
    }
}

final class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = [strtoupper($method), $pattern, $handler];
    }

    public function dispatch(Request $request): never
    {
        $allowed = [];
        foreach ($this->routes as [$method, $pattern, $handler]) {
            $regex = $this->compile($pattern);
            if (!preg_match($regex, $request->path, $matches)) {
                continue;
            }

            if ($method !== $request->method && !($request->method === 'HEAD' && $method === 'GET')) {
                $allowed[] = $method;
                continue;
            }

            $params = [];
            foreach ($matches as $key => $value) {
                if (is_string($key)) {
                    $params[$key] = rawurldecode($value);
                }
            }

            $result = $handler($request, $params);
            if (is_array($result) && array_key_exists('__response', $result)) {
                Response::data($result['__response'], (int) ($result['__status'] ?? 200));
            }
            Response::data($result);
        }

        if ($allowed !== []) {
            header('Allow: ' . implode(', ', array_unique($allowed)));
            throw new ApiException(405, 'method_not_allowed', 'Méthode non autorisée.');
        }

        throw new ApiException(404, 'not_found', 'Ressource introuvable.');
    }

    private function compile(string $pattern): string
    {
        if ($pattern === '/') {
            return '#^/$#';
        }

        $parts = array_filter(explode('/', trim($pattern, '/')), 'strlen');
        $compiled = array_map(static function (string $part): string {
            if (preg_match('/^\{([A-Za-z][A-Za-z0-9_]*)\}$/', $part, $match)) {
                return '(?P<' . $match[1] . '>[^/]+)';
            }
            return preg_quote($part, '#');
        }, $parts);

        return '#^/' . implode('/', $compiled) . '$#';
    }
}

function render_unexpected(Throwable $exception, Config $config): never
{
    error_log(sprintf(
        '[lizzirene-api] %s in %s:%d\n%s',
        $exception->getMessage(),
        $exception->getFile(),
        $exception->getLine(),
        $exception->getTraceAsString()
    ));

    $message = $config->isProduction()
        ? 'Une erreur interne est survenue. Réessayez dans un instant.'
        : $exception->getMessage();

    Response::error(new ApiException(500, 'internal_error', $message));
}
