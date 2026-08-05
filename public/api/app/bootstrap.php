<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use Throwable;

require __DIR__ . '/Config.php';
require __DIR__ . '/Http.php';
require __DIR__ . '/Database.php';
require __DIR__ . '/Validation.php';
require __DIR__ . '/Security.php';
require __DIR__ . '/Mailer.php';
require __DIR__ . '/Setup.php';
require __DIR__ . '/Catalog.php';
require __DIR__ . '/Auth.php';
require __DIR__ . '/PasswordReset.php';
require __DIR__ . '/Orders.php';
require __DIR__ . '/Admin.php';

function run(): never
{
    ini_set('display_errors', '0');
    ini_set('expose_php', '0');
    header_remove('X-Powered-By');
    date_default_timezone_set('UTC');

    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

    try {
        $config = Config::load();
    } catch (Throwable $exception) {
        error_log('[lizzirene-api] configuration: ' . $exception->getMessage());
        Response::error(new ApiException(
            500,
            'configuration_error',
            'La configuration privée de l’application est invalide.'
        ));
    }

    try {
        $request = new Request();
        $database = new Database($config);
        if (
            $request->path === '/v1/health' &&
            in_array($request->method, ['GET', 'HEAD'], true)
        ) {
            Response::data(healthPayload(new Setup($config, $database)));
        }

        $security = new Security($config, $database);
        $mailer = new Mailer($config);
        $setup = new Setup($config, $database, $security);
        $catalog = new Catalog($database);
        $auth = new Auth($config, $database, $security, $setup);
        $passwordReset = new PasswordReset($database, $security, $mailer);
        $orders = new Orders($config, $database, $security, $catalog, $mailer);
        $admin = new Admin($config, $database, $security, $catalog, $orders);
        $router = new Router();

        $router->add('GET', '/v1/health', static fn (): array => healthPayload($setup));

        $router->add('GET', '/v1/session', static fn (): array => $auth->session());
        $router->add('POST', '/v1/setup/initialize', static function (Request $request) use ($setup): array {
            return ['__response' => $setup->initialize($request), '__status' => 201];
        });
        $router->add(
            'POST',
            '/v1/setup/migrate',
            static fn (Request $request): array => $setup->migrate($request)
        );

        $router->add('GET', '/v1/products', static fn (): array => $catalog->publicProducts());
        $router->add('GET', '/v1/products/{slug}', static fn (Request $_, array $params): array =>
            $catalog->publicProduct($params['slug'])
        );

        $router->add('POST', '/v1/auth/register', static function (Request $request) use ($auth): array {
            return ['__response' => $auth->register($request), '__status' => 201];
        });
        $router->add('POST', '/v1/auth/login', static fn (Request $request): array => $auth->login($request));
        $router->add('POST', '/v1/auth/logout', static fn (Request $request): array => $auth->logout($request));
        $router->add(
            'POST',
            '/v1/auth/password-reset/request',
            static fn (Request $request): array => $passwordReset->request($request)
        );
        $router->add(
            'POST',
            '/v1/auth/password-reset/complete',
            static fn (Request $request): array => $passwordReset->complete($request)
        );
        $router->add('GET', '/v1/me', static function () use ($security): array {
            return ['user' => $security->requireUser()];
        });
        $router->add('PATCH', '/v1/me', static fn (Request $request): array => $auth->updateProfile($request));
        $router->add('PATCH', '/v1/me/password', static fn (Request $request): array => $auth->updatePassword($request));

        $router->add('POST', '/v1/orders', static function (Request $request) use ($orders): array {
            return ['__response' => $orders->create($request), '__status' => 201];
        });
        $router->add(
            'POST',
            '/v1/orders/{reference}/whatsapp-opened',
            static fn (Request $request, array $params): array =>
                $orders->markWhatsAppOpened($request, $params['reference'])
        );
        $router->add('POST', '/v1/orders/claim', static fn (Request $request): array => $orders->claim($request));
        $router->add('GET', '/v1/me/orders', static fn (): array => $orders->mine());
        $router->add(
            'GET',
            '/v1/me/orders/{reference}',
            static fn (Request $_, array $params): array => $orders->mineOne($params['reference'])
        );

        $router->add('GET', '/v1/admin/dashboard', static fn (): array => $admin->dashboard());
        $router->add('GET', '/v1/admin/customers', static fn (Request $request): array => $admin->customers($request));
        $router->add(
            'POST',
            '/v1/admin/customers/{id}/password-reset',
            static fn (Request $request, array $params): array =>
                $passwordReset->requestForCustomer($request, $params['id'])
        );
        $router->add('GET', '/v1/admin/products', static fn (Request $request): array => $admin->products($request));
        $router->add('POST', '/v1/admin/products', static function (Request $request) use ($admin): array {
            return ['__response' => $admin->createProduct($request), '__status' => 201];
        });
        $router->add(
            'GET',
            '/v1/admin/products/{id}',
            static fn (Request $_, array $params): array => $admin->product(routeId($params['id']))
        );
        $router->add(
            'PATCH',
            '/v1/admin/products/{id}',
            static fn (Request $request, array $params): array =>
                $admin->updateProduct($request, routeId($params['id']))
        );
        $router->add(
            'POST',
            '/v1/admin/products/{id}/archive',
            static fn (Request $request, array $params): array =>
                $admin->archiveProduct($request, routeId($params['id']))
        );
        $router->add(
            'POST',
            '/v1/admin/products/{id}/restore',
            static fn (Request $request, array $params): array =>
                $admin->restoreProduct($request, routeId($params['id']))
        );
        $router->add(
            'POST',
            '/v1/admin/products/{id}/image',
            static fn (Request $request, array $params): array =>
                $admin->uploadProductImage($request, routeId($params['id']))
        );
        $router->add('GET', '/v1/admin/orders', static fn (Request $request): array => $admin->orders($request));
        $router->add('POST', '/v1/admin/orders/manual', static function (Request $request) use ($orders): array {
            return ['__response' => $orders->createManual($request), '__status' => 201];
        });
        $router->add(
            'GET',
            '/v1/admin/orders/{reference}',
            static fn (Request $_, array $params): array => $admin->order($params['reference'])
        );
        $router->add(
            'PATCH',
            '/v1/admin/orders/{reference}',
            static fn (Request $request, array $params): array =>
                $admin->updateOrder($request, $params['reference'])
        );
        $router->add(
            'PATCH',
            '/v1/admin/orders/{reference}/details',
            static fn (Request $request, array $params): array =>
                $admin->updateOrderDetails($request, $params['reference'])
        );
        $router->add(
            'POST',
            '/v1/admin/orders/{reference}/link-account',
            static fn (Request $request, array $params): array =>
                $admin->linkOrderAccount($request, $params['reference'])
        );

        $sitemap = static function () use ($config, $catalog): never {
            $base = rtrim((string) $config->get('app_url', 'https://lizzirenedeco.com'), '/') . '/';
            try {
                $products = $catalog->publicProducts();
            } catch (Throwable) {
                $raw = file_get_contents(dirname(__DIR__) . '/database/catalogue-initial.json');
                $seed = is_string($raw) ? json_decode($raw, true) : [];
                $products = is_array($seed)
                    ? array_map(static fn (array $item): array => ['id' => $item['slug']], $seed)
                    : [];
            }

            $paths = ['', 'produits', 'services', 'a-propos', 'contact', 'confidentialite'];
            foreach ($products as $product) {
                $paths[] = 'produits/' . rawurlencode((string) $product['id']);
            }
            $entries = array_map(static function (string $path) use ($base): string {
                $url = htmlspecialchars($base . $path, ENT_XML1 | ENT_QUOTES, 'UTF-8');
                return "  <url><loc>{$url}</loc></url>";
            }, $paths);
            $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
            $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
            $xml .= implode("\n", $entries) . "\n</urlset>\n";
            Response::xml($xml);
        };
        $router->add('GET', '/v1/sitemap.xml', $sitemap);
        $router->add('GET', '/sitemap.xml', $sitemap);

        $router->dispatch($request);
    } catch (ApiException $exception) {
        Response::error($exception);
    } catch (Throwable $exception) {
        render_unexpected($exception, $config);
    }
}

function healthPayload(Setup $setup): array
{
    $health = $setup->health();
    $health['requirements'] = [
        'php' => PHP_VERSION,
        'pdoMysql' => extension_loaded('pdo_mysql'),
        'mbstring' => extension_loaded('mbstring'),
        'fileinfo' => extension_loaded('fileinfo'),
        'gd' => extension_loaded('gd'),
    ];
    return $health;
}

function routeId(string $value): int
{
    if (!preg_match('/^[1-9][0-9]*$/', $value)) {
        throw new ApiException(404, 'not_found', 'Ressource introuvable.');
    }
    return (int) $value;
}
