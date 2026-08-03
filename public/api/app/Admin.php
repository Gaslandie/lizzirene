<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use finfo;
use PDO;
use Throwable;

final class Admin
{
    private Config $config;
    private Database $database;
    private Security $security;
    private Catalog $catalog;
    private Orders $orders;

    private const TRANSITIONS = [
        'awaiting_whatsapp' => ['confirmed', 'cancelled', 'expired'],
        'confirmed' => ['preparing', 'cancelled'],
        'preparing' => ['ready', 'cancelled'],
        'ready' => ['out_for_delivery', 'delivered', 'cancelled'],
        'out_for_delivery' => ['delivered', 'cancelled'],
        'delivered' => [],
        'cancelled' => ['confirmed'],
        'expired' => ['confirmed'],
    ];

    public function __construct(
        Config $config,
        Database $database,
        Security $security,
        Catalog $catalog,
        Orders $orders
    ) {
        $this->config = $config;
        $this->database = $database;
        $this->security = $security;
        $this->catalog = $catalog;
        $this->orders = $orders;
    }

    public function dashboard(): array
    {
        $this->security->requireAdmin();
        $this->orders->expireStaleRequests();
        $pdo = $this->database->pdo();
        $orderCounts = [];
        foreach ($pdo->query('SELECT status, COUNT(*) AS total FROM orders GROUP BY status')->fetchAll() as $row) {
            $orderCounts[(string) $row['status']] = (int) $row['total'];
        }
        $productCounts = [];
        foreach ($pdo->query('SELECT status, COUNT(*) AS total FROM products GROUP BY status')->fetchAll() as $row) {
            $productCounts[(string) $row['status']] = (int) $row['total'];
        }
        $recent = $pdo->query(
            'SELECT * FROM orders ORDER BY created_at DESC LIMIT 8'
        )->fetchAll();

        return [
            'orders' => $orderCounts,
            'products' => $productCounts,
            'customers' => (int) $pdo->query(
                "SELECT COUNT(*) FROM users WHERE role = 'customer' AND status = 'active'"
            )->fetchColumn(),
            'recentOrders' => array_map(
                fn (array $row): array => $this->orders->orderSummary($row),
                $recent
            ),
        ];
    }

    public function products(Request $request): array
    {
        $this->security->requireAdmin();
        $status = $request->query('status');
        $search = $request->query('search');
        return $this->catalog->adminProducts(
            is_string($status) ? $status : null,
            is_string($search) ? $search : null
        );
    }

    public function product(int $id): array
    {
        $this->security->requireAdmin();
        return $this->catalog->adminProduct($id);
    }

    public function createProduct(Request $request): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $product = $this->catalog->create(
            $request->json(),
            $this->security->sessionUserId() ?? 0
        );
        $this->security->audit('product.created', 'product', (string) $product['recordId'], [
            'slug' => $product['id'],
        ]);
        return $product;
    }

    public function updateProduct(Request $request, int $id): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $product = $this->catalog->update(
            $id,
            $request->json(),
            $this->security->sessionUserId() ?? 0
        );
        $this->security->audit('product.updated', 'product', (string) $id, [
            'slug' => $product['id'],
            'version' => $product['version'],
        ]);
        return $product;
    }

    public function archiveProduct(Request $request, int $id): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $version = Validation::integer($request->json(), 'version', 1, PHP_INT_MAX);
        $product = $this->catalog->archive(
            $id,
            $version,
            $this->security->sessionUserId() ?? 0
        );
        $this->security->audit('product.archived', 'product', (string) $id);
        return $product;
    }

    public function restoreProduct(Request $request, int $id): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $version = Validation::integer($request->json(), 'version', 1, PHP_INT_MAX);
        $product = $this->catalog->restore(
            $id,
            $version,
            $this->security->sessionUserId() ?? 0
        );
        $this->security->audit('product.restored', 'product', (string) $id);
        return $product;
    }

    public function uploadProductImage(Request $request, int $id): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $this->security->rateLimit('admin-upload', (string) $this->security->sessionUserId(), 60, 3600);
        $product = $this->catalog->adminProduct($id);
        $version = Validation::integer($_POST, 'version', 1, PHP_INT_MAX);
        $alt = Validation::text($_POST, 'alt', 2, 255, false) ?? $product['name'];
        $file = $request->file('image');
        if ($file === null || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new ApiException(422, 'upload_error', 'Sélectionnez une image valide.');
        }

        $temporary = (string) ($file['tmp_name'] ?? '');
        $size = (int) ($file['size'] ?? 0);
        $maxBytes = (int) $this->config->get('uploads.max_bytes', 8 * 1024 * 1024);
        if ($size < 1 || $size > $maxBytes || !is_uploaded_file($temporary)) {
            throw new ApiException(422, 'upload_size', 'L’image doit peser moins de 8 Mo.');
        }

        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($temporary);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        if (!is_string($mime) || !isset($extensions[$mime])) {
            throw new ApiException(422, 'upload_type', 'Formats acceptés : JPEG, PNG ou WebP.');
        }

        $dimensions = getimagesize($temporary);
        if (!is_array($dimensions) || !isset($dimensions[0], $dimensions[1])) {
            throw new ApiException(422, 'upload_invalid', 'Le fichier ne contient pas une image lisible.');
        }
        $pixels = (int) $dimensions[0] * (int) $dimensions[1];
        if ($pixels < 1 || $pixels > (int) $this->config->get('uploads.max_pixels', 16000000)) {
            throw new ApiException(422, 'upload_dimensions', 'Les dimensions de cette image sont trop grandes.');
        }

        $directory = (string) $this->config->get(
            'uploads.directory',
            dirname(__DIR__, 2) . '/uploads/products'
        );
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new ApiException(500, 'upload_directory', 'Le dossier des images n’est pas accessible.');
        }

        // Base commune aux variantes : « <id>-<jeton> », complétée par la
        // largeur et l'extension choisies par le ré-encodage.
        $base = $id . '-' . bin2hex(random_bytes(10));
        $set = $this->reencodeImageSet($temporary, $mime, $directory, $base);
        $variants = $set['variants'];
        $largest = $variants[count($variants) - 1];

        $maximumTotalBytes = (int) $this->config->get(
            'uploads.max_total_bytes',
            500 * 1024 * 1024
        );
        $publicPath = rtrim((string) $this->config->get('uploads.public_path', '/uploads/products'), '/');
        $url = $publicPath . '/' . rawurlencode($largest['filename']);
        $srcset = count($variants) > 1
            ? implode(', ', array_map(
                static fn (array $variant): string => $publicPath . '/'
                    . rawurlencode($variant['filename']) . ' ' . $variant['width'] . 'w',
                $variants
            ))
            : null;
        // Mêmes points de bascule que le pipeline du dépôt, pour que les
        // fiches envoyées depuis l'administration se comportent à l'identique.
        $sizes = $srcset !== null
            ? '(max-width: 720px) calc(100vw - 40px), (max-width: 900px) 50vw, 25vw'
            : null;

        $nettoyerParts = static function () use ($variants): void {
            foreach ($variants as $variant) {
                @unlink($variant['part']);
            }
        };

        $lockHandle = @fopen(rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '.upload.lock', 'c');
        if ($lockHandle === false || !flock($lockHandle, LOCK_EX)) {
            $nettoyerParts();
            if (is_resource($lockHandle)) {
                fclose($lockHandle);
            }
            throw new ApiException(503, 'upload_busy', 'Une autre photo est en cours de traitement. Réessayez.');
        }

        $ecrits = [];
        try {
            $anciens = $this->managedProductImageFiles(
                is_string($product['src'] ?? null) ? $product['src'] : null,
                is_string($product['srcSet'] ?? null) ? $product['srcSet'] : null,
                $directory,
                $publicPath
            );
            $reclaimableBytes = array_sum(array_map(
                static fn (string $chemin): int => is_file($chemin) ? (int) filesize($chemin) : 0,
                $anciens
            ));
            $ajout = array_sum(array_map(
                static fn (array $variant): int => (int) filesize($variant['part']),
                $variants
            ));
            if ($this->directoryBytes($directory) - $reclaimableBytes + $ajout > $maximumTotalBytes) {
                $nettoyerParts();
                throw new ApiException(
                    507,
                    'upload_quota',
                    'L’espace réservé aux photos est plein. Contactez la personne qui gère le site.'
                );
            }

            foreach ($variants as $variant) {
                $final = rtrim($directory, DIRECTORY_SEPARATOR)
                    . DIRECTORY_SEPARATOR . $variant['filename'];
                if (!chmod($variant['part'], 0644) || !rename($variant['part'], $final)) {
                    $nettoyerParts();
                    foreach ($ecrits as $chemin) {
                        @unlink($chemin);
                    }
                    throw new ApiException(500, 'upload_write', 'Impossible de finaliser l’image.');
                }
                $ecrits[] = $final;
            }

            try {
                $updated = $this->catalog->updateImage(
                    $id,
                    $version,
                    $url,
                    $srcset,
                    $sizes,
                    $alt,
                    $largest['width'],
                    $largest['height'],
                    $this->security->sessionUserId() ?? 0
                );
            } catch (Throwable $exception) {
                foreach ($ecrits as $chemin) {
                    @unlink($chemin);
                }
                throw $exception;
            }

            foreach ($anciens as $ancien) {
                if (
                    !in_array($ancien, $ecrits, true) &&
                    is_file($ancien) &&
                    !@unlink($ancien)
                ) {
                    error_log('[lizzirene-api] impossible de supprimer une ancienne image produit gérée.');
                }
            }
        } finally {
            flock($lockHandle, LOCK_UN);
            fclose($lockHandle);
        }
        $this->security->audit('product.image_uploaded', 'product', (string) $id, [
            'path' => $url,
            'variants' => count($ecrits),
            'format' => $set['extension'],
            'bytes' => array_sum(array_map(
                static fn (string $chemin): int => is_file($chemin) ? (int) filesize($chemin) : 0,
                $ecrits
            )),
        ]);
        return $updated;
    }

    /**
     * Le suffixe de largeur est facultatif : les photos envoyées avant le
     * passage au multi-largeurs s'appellent encore « <id>-<jeton>.<ext> » et
     * doivent rester supprimables.
     */
    private function managedProductImagePath(
        ?string $oldUrl,
        string $directory,
        string $publicPath
    ): ?string {
        $prefix = rtrim($publicPath, '/') . '/';
        if ($oldUrl === null || !str_starts_with($oldUrl, $prefix)) {
            return null;
        }

        $filename = rawurldecode(substr($oldUrl, strlen($prefix)));
        if (!preg_match('/^[1-9][0-9]*-[a-f0-9]{20}(?:-[0-9]{2,4})?\.(?:jpg|png|webp)$/D', $filename)) {
            return null;
        }
        return rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
    }

    /**
     * Tous les fichiers gérés d'un produit : l'image principale et, depuis le
     * multi-largeurs, ses variantes déclarées dans le srcset. Remplacer une
     * photo doit effacer l'ancien jeu complet, sinon le dossier gonfle
     * silencieusement à chaque envoi.
     *
     * @return list<string>
     */
    private function managedProductImageFiles(
        ?string $oldUrl,
        ?string $oldSrcset,
        string $directory,
        string $publicPath
    ): array {
        $urls = [$oldUrl];
        if (is_string($oldSrcset) && $oldSrcset !== '') {
            foreach (explode(',', $oldSrcset) as $candidat) {
                $candidat = trim($candidat);
                if ($candidat === '') {
                    continue;
                }
                // « /uploads/products/12-abc-480.webp 480w » → l'URL seule.
                $urls[] = explode(' ', $candidat)[0];
            }
        }

        $chemins = [];
        foreach ($urls as $url) {
            $chemin = $this->managedProductImagePath($url, $directory, $publicPath);
            if ($chemin !== null && !in_array($chemin, $chemins, true)) {
                $chemins[] = $chemin;
            }
        }
        return $chemins;
    }

    /**
     * Ré-encode la photo envoyée en plusieurs largeurs, comme le fait
     * `scripts/optimize-images.mjs` pour les produits du dépôt.
     *
     * Avant, une seule image bornée à 1800 px était produite dans le format
     * d'origine : une photo de téléphone finissait à ~370 Ko en JPEG, quand
     * les cartes du catalogue n'en affichent que ~450 px de large. Un PNG
     * pouvait même sortir à 3,4 Mo sans dépasser le plafond.
     *
     * On écrit donc 480 et 810 px, en WebP quand l'hébergement sait l'écrire
     * — sinon dans le format d'origine, la page reste correcte, seulement un
     * peu plus lourde.
     *
     * @return array{extension:string, variants:list<array{width:int,height:int,part:string,filename:string}>}
     */
    private function reencodeImageSet(
        string $source,
        string $mime,
        string $directory,
        string $base
    ): array {
        if (!extension_loaded('gd')) {
            throw new ApiException(503, 'image_processing_unavailable', 'Le traitement sécurisé des images est indisponible.');
        }

        $image = $this->decodeImage($source, $mime);
        $width = imagesx($image);
        $height = imagesy($image);

        // Le WebP est préféré partout où il est disponible ; à défaut on
        // conserve le format reçu plutôt que de refuser l'envoi.
        $webpAvailable = function_exists('imagewebp');
        $outputMime = $webpAvailable ? 'image/webp' : $mime;
        $extension = match ($outputMime) {
            'image/webp' => 'webp',
            'image/png' => 'png',
            default => 'jpg',
        };

        $ceiling = max(320, min(
            2400,
            (int) $this->config->get('uploads.max_dimension', 1800)
        ));
        $targets = [];
        foreach ([480, 810] as $cible) {
            $largeur = min($cible, $ceiling, $width);
            if ($largeur > 0 && !in_array($largeur, $targets, true)) {
                $targets[] = $largeur;
            }
        }
        // Image plus étroite que 480 px : une seule variante, à sa taille.
        if ($targets === []) {
            $targets[] = $width;
        }
        sort($targets);

        $variants = [];
        try {
            foreach ($targets as $largeur) {
                $hauteur = max(1, (int) round($height * ($largeur / $width)));
                $filename = $base . '-' . $largeur . '.' . $extension;
                $part = rtrim($directory, DIRECTORY_SEPARATOR)
                    . DIRECTORY_SEPARATOR . $filename . '.part';
                $this->writeVariant(
                    $image,
                    $outputMime,
                    $part,
                    $largeur,
                    $hauteur,
                    $width,
                    $height
                );
                $variants[] = [
                    'width' => $largeur,
                    'height' => $hauteur,
                    'part' => $part,
                    'filename' => $filename,
                ];
            }
        } catch (Throwable $exception) {
            foreach ($variants as $variant) {
                @unlink($variant['part']);
            }
            imagedestroy($image);
            throw $exception;
        }

        imagedestroy($image);

        return ['extension' => $extension, 'variants' => $variants];
    }

    /**
     * Redimensionne puis écrit une variante. La transparence est préservée
     * pour tout ce qui n'est pas du JPEG.
     */
    private function writeVariant(
        \GdImage $image,
        string $outputMime,
        string $destination,
        int $targetWidth,
        int $targetHeight,
        int $sourceWidth,
        int $sourceHeight
    ): void {
        $resized = imagecreatetruecolor($targetWidth, $targetHeight);
        if ($resized === false) {
            throw new ApiException(503, 'image_processing_unavailable', 'La photo ne peut pas être redimensionnée.');
        }
        if ($outputMime !== 'image/jpeg') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
            imagefilledrectangle($resized, 0, 0, $targetWidth, $targetHeight, $transparent);
        }
        if (!imagecopyresampled(
            $resized,
            $image,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight
        )) {
            imagedestroy($resized);
            throw new ApiException(503, 'image_processing_unavailable', 'La photo ne peut pas être redimensionnée.');
        }
        if ($outputMime !== 'image/jpeg') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
        }

        $written = match ($outputMime) {
            'image/jpeg' => imagejpeg($resized, $destination, 82),
            'image/png' => imagepng($resized, $destination, 7),
            'image/webp' => imagewebp($resized, $destination, 82),
            default => false,
        };
        imagedestroy($resized);

        if (!$written || !is_file($destination) || filesize($destination) < 1) {
            @unlink($destination);
            throw new ApiException(500, 'upload_write', 'Impossible d’enregistrer l’image traitée.');
        }

        $maximumOutputBytes = (int) $this->config->get(
            'uploads.max_output_bytes',
            6 * 1024 * 1024
        );
        if (filesize($destination) > $maximumOutputBytes) {
            @unlink($destination);
            throw new ApiException(422, 'upload_output_size', 'La photo reste trop lourde après optimisation. Essayez une autre image.');
        }
    }

    /** Décode le fichier reçu et redresse l'orientation EXIF des JPEG. */
    private function decodeImage(string $source, string $mime): \GdImage
    {
        $image = match ($mime) {
            'image/jpeg' => function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($source) : false,
            'image/png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($source) : false,
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($source) : false,
            default => false,
        };
        if ($image === false) {
            throw new ApiException(422, 'upload_decode', 'Cette image ne peut pas être traitée en sécurité.');
        }

        if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
            $metadata = @exif_read_data($source);
            $orientation = is_array($metadata) ? (int) ($metadata['Orientation'] ?? 1) : 1;
            $angle = match ($orientation) {
                3 => 180,
                6 => -90,
                8 => 90,
                default => 0,
            };
            if ($angle !== 0) {
                $rotated = imagerotate($image, $angle, 0);
                if ($rotated === false) {
                    imagedestroy($image);
                    throw new ApiException(422, 'upload_orientation', 'Impossible de corriger l’orientation de cette photo.');
                }
                imagedestroy($image);
                $image = $rotated;
            }
        }

        return $image;
    }

    private function directoryBytes(string $directory): int
    {
        $total = 0;
        $entries = glob(rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '*');
        if (!is_array($entries)) {
            return 0;
        }
        foreach ($entries as $entry) {
            if (is_file($entry)) {
                $total += (int) filesize($entry);
            }
        }
        return $total;
    }

    public function orders(Request $request): array
    {
        $this->security->requireAdmin();
        $this->orders->expireStaleRequests();
        $status = $request->query('status');
        $search = $request->query('search');
        $conditions = [];
        $parameters = [];
        if (is_string($status) && in_array($status, Orders::STATUSES, true)) {
            $conditions[] = 'status = ?';
            $parameters[] = $status;
        }
        if (is_string($search) && trim($search) !== '') {
            $needle = '%' . trim($search) . '%';
            $conditions[] = '(reference LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            array_push($parameters, $needle, $needle, $needle);
        }
        $where = $conditions === [] ? '' : 'WHERE ' . implode(' AND ', $conditions);
        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM orders {$where} ORDER BY created_at DESC LIMIT 200"
        );
        $statement->execute($parameters);
        return array_map(
            fn (array $row): array => $this->orders->orderSummary($row),
            $statement->fetchAll()
        );
    }

    public function order(string $reference): array
    {
        $this->security->requireAdmin();
        $statement = $this->database->pdo()->prepare('SELECT id FROM orders WHERE reference = ? LIMIT 1');
        $statement->execute([$reference]);
        $id = $statement->fetchColumn();
        if (!$id) {
            throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
        }

        $order = $this->orders->orderResponse((int) $id, false, false);
        $events = $this->database->pdo()->prepare(
            'SELECT e.event_type, e.previous_status, e.new_status, e.message,
             e.visible_to_customer, e.created_at, u.name AS actor_name
             FROM order_events e LEFT JOIN users u ON u.id = e.actor_user_id
             WHERE e.order_id = ? ORDER BY e.id'
        );
        $events->execute([(int) $id]);
        $order['events'] = array_map(static fn (array $event): array => [
            'type' => (string) $event['event_type'],
            'previousStatus' => $event['previous_status'],
            'newStatus' => $event['new_status'],
            'message' => $event['message'],
            'visibleToCustomer' => (bool) $event['visible_to_customer'],
            'actorName' => $event['actor_name'],
            'createdAt' => (string) $event['created_at'],
        ], $events->fetchAll());
        return $order;
    }

    public function linkOrderAccount(Request $request, string $reference): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $version = Validation::integer($request->json(), 'version', 1, PHP_INT_MAX);

        $orderId = $this->database->transaction(function (PDO $pdo) use ($reference, $version): int {
            $select = $pdo->prepare('SELECT * FROM orders WHERE reference = ? FOR UPDATE');
            $select->execute([$reference]);
            $order = $select->fetch();
            if (!$order) {
                throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
            }
            if ((int) $order['version'] !== $version) {
                throw new ApiException(409, 'version_conflict', 'La commande a été modifiée dans un autre onglet.');
            }
            if ($order['user_id'] !== null) {
                throw new ApiException(409, 'already_linked', 'Cette commande est déjà rattachée à un compte.');
            }

            $customer = $pdo->prepare(
                "SELECT id FROM users
                 WHERE role = 'customer' AND status = 'active' AND phone_e164 = ? LIMIT 1"
            );
            $customer->execute([(string) $order['customer_phone']]);
            $userId = $customer->fetchColumn();
            if ($userId === false) {
                throw new ApiException(
                    422,
                    'customer_account_not_found',
                    'Aucun compte client actif n’utilise encore ce numéro de téléphone.'
                );
            }

            $update = $pdo->prepare(
                'UPDATE orders SET user_id = ?, claim_token_hash = NULL,
                 claim_token_expires_at = NULL, version = version + 1
                 WHERE id = ? AND version = ? AND user_id IS NULL'
            );
            $update->execute([(int) $userId, (int) $order['id'], $version]);
            if ($update->rowCount() !== 1) {
                throw new ApiException(409, 'version_conflict', 'La commande vient d’être modifiée.');
            }

            $event = $pdo->prepare(
                'INSERT INTO order_events
                 (order_id, actor_user_id, event_type, message, visible_to_customer)
                 VALUES (?, ?, ?, ?, 1)'
            );
            $event->execute([
                (int) $order['id'],
                $this->security->sessionUserId(),
                'order.account_linked',
                'Cette commande a été rattachée à l’espace client.',
            ]);
            return (int) $order['id'];
        });

        $this->security->audit('order.account_linked', 'order', $reference);
        return $this->order($reference);
    }

    public function updateOrderDetails(Request $request, string $reference): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $data = $request->json();
        $version = Validation::integer($data, 'version', 1, PHP_INT_MAX);
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data);
        $deliveryMode = Validation::oneOf($data, 'deliveryMode', ['delivery', 'pickup']);
        $commune = $deliveryMode === 'delivery'
            ? Validation::text($data, 'commune', 2, 80)
            : null;
        $quartier = $deliveryMode === 'delivery'
            ? Validation::text($data, 'quartier', 2, 120)
            : null;
        $landmark = $deliveryMode === 'delivery'
            ? Validation::text($data, 'addressLandmark', 2, 255)
            : null;
        $desiredDate = Validation::date($data, 'desiredDate', false, true);
        $recipientName = Validation::text($data, 'recipientName', 2, 120, false);
        $recipientPhone = Validation::phone($data, 'recipientPhone', false);
        $cardMessage = Validation::text($data, 'cardMessage', 1, 500, false);
        $note = Validation::text($data, 'note', 1, 1000, false);

        $this->database->transaction(function (PDO $pdo) use (
            $reference,
            $version,
            $name,
            $phone,
            $email,
            $deliveryMode,
            $commune,
            $quartier,
            $landmark,
            $desiredDate,
            $recipientName,
            $recipientPhone,
            $cardMessage,
            $note
        ): void {
            $select = $pdo->prepare('SELECT * FROM orders WHERE reference = ? FOR UPDATE');
            $select->execute([$reference]);
            $order = $select->fetch();
            if (!$order) {
                throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
            }
            if ((int) $order['version'] !== $version) {
                throw new ApiException(409, 'version_conflict', 'La commande a été modifiée dans un autre onglet.');
            }

            if ($phone === (string) $order['customer_phone'] && $order['user_id'] !== null) {
                $userId = (int) $order['user_id'];
            } else {
                $customer = $pdo->prepare(
                    "SELECT id FROM users
                     WHERE role = 'customer' AND status = 'active' AND phone_e164 = ? LIMIT 1"
                );
                $customer->execute([$phone]);
                $matchingUserId = $customer->fetchColumn();
                $userId = $matchingUserId !== false ? (int) $matchingUserId : null;
            }
            $fee = $deliveryMode === 'pickup'
                ? null
                : ($order['delivery_fee_gnf'] !== null ? (int) $order['delivery_fee_gnf'] : null);
            $total = (int) $order['subtotal_gnf'] + (int) $order['price_adjustment_gnf'] + ($fee ?? 0);

            $update = $pdo->prepare(
                'UPDATE orders SET user_id = ?, customer_name = ?, customer_phone = ?,
                 customer_email = ?, recipient_name = ?, recipient_phone = ?,
                 delivery_mode = ?, commune = ?, quartier = ?, address_landmark = ?,
                 desired_date = ?, card_message = ?, customer_note = ?,
                 delivery_fee_gnf = ?, total_gnf = ?, version = version + 1
                 WHERE id = ? AND version = ?'
            );
            $update->execute([
                $userId,
                $name,
                $phone,
                $email,
                $recipientName,
                $recipientPhone,
                $deliveryMode,
                $commune,
                $quartier,
                $landmark,
                $desiredDate,
                $cardMessage,
                $note,
                $fee,
                $total,
                (int) $order['id'],
                $version,
            ]);
            if ($update->rowCount() !== 1) {
                throw new ApiException(409, 'version_conflict', 'La commande vient d’être modifiée.');
            }

            $event = $pdo->prepare(
                'INSERT INTO order_events
                 (order_id, actor_user_id, event_type, message, visible_to_customer)
                 VALUES (?, ?, ?, ?, 1)'
            );
            $event->execute([
                (int) $order['id'],
                $this->security->sessionUserId(),
                'order.details_updated',
                'Les coordonnées ou les informations de livraison ont été mises à jour.',
            ]);
        });

        $this->security->audit('order.details_updated', 'order', $reference);
        return $this->order($reference);
    }

    public function updateOrder(Request $request, string $reference): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $data = $request->json();
        $version = Validation::integer($data, 'version', 1, PHP_INT_MAX);
        $newStatus = Validation::oneOf($data, 'status', Orders::STATUSES);
        $paymentStatus = Validation::oneOf($data, 'paymentStatus', ['unpaid', 'paid', 'refunded']);
        $priceAdjustment = Validation::integer(
            $data,
            'priceAdjustment',
            -1000000000,
            1000000000
        );
        $adjustmentReason = Validation::text($data, 'adjustmentReason', 2, 500, false);
        if ($priceAdjustment !== 0 && $adjustmentReason === null) {
            throw new ApiException(422, 'validation_error', 'Précisez la raison de l’ajustement du prix.', [
                'adjustmentReason' => 'Expliquez le changement de composition ou de prix.',
            ]);
        }
        $hasDeliveryFee = array_key_exists('deliveryFee', $data);
        $deliveryFee = Validation::integer($data, 'deliveryFee', 0, 1000000000, false);
        $privateNote = Validation::text($data, 'privateNote', 1, 1000, false);
        $customerMessage = Validation::text($data, 'customerMessage', 1, 1000, false);

        $updatedId = $this->database->transaction(function (PDO $pdo) use (
            $reference,
            $version,
            $newStatus,
            $paymentStatus,
            $priceAdjustment,
            $adjustmentReason,
            $hasDeliveryFee,
            $deliveryFee,
            $privateNote,
            $customerMessage
        ): int {
            $select = $pdo->prepare('SELECT * FROM orders WHERE reference = ? FOR UPDATE');
            $select->execute([$reference]);
            $order = $select->fetch();
            if (!$order) {
                throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
            }
            if ((int) $order['version'] !== $version) {
                throw new ApiException(409, 'version_conflict', 'La commande a été modifiée dans un autre onglet.');
            }

            $previousStatus = (string) $order['status'];
            if ($newStatus !== $previousStatus && !in_array($newStatus, self::TRANSITIONS[$previousStatus] ?? [], true)) {
                throw new ApiException(422, 'invalid_transition', 'Ce changement de statut n’est pas autorisé.');
            }

            if ($paymentStatus === 'paid' && in_array($newStatus, ['awaiting_whatsapp', 'cancelled', 'expired'], true)) {
                throw new ApiException(422, 'invalid_payment_status', 'Une demande non confirmée, annulée ou expirée ne peut pas rester marquée payée.');
            }
            if ($paymentStatus === 'refunded' && !in_array($newStatus, ['cancelled', 'expired'], true)) {
                throw new ApiException(422, 'invalid_payment_status', 'Le statut « remboursé » est réservé aux commandes annulées ou expirées.');
            }
            if (
                $paymentStatus === 'refunded' &&
                !in_array((string) $order['payment_status'], ['paid', 'refunded'], true)
            ) {
                throw new ApiException(422, 'invalid_payment_status', 'Seule une commande déjà payée peut être remboursée.');
            }

            $previousFee = $order['delivery_fee_gnf'] !== null ? (int) $order['delivery_fee_gnf'] : null;
            if ((string) $order['delivery_mode'] === 'pickup') {
                if ($hasDeliveryFee && $deliveryFee !== null && $deliveryFee !== 0) {
                    throw new ApiException(422, 'invalid_delivery_fee', 'Aucun frais de livraison ne peut être ajouté à un retrait boutique.');
                }
                $fee = null;
            } else {
                $fee = $hasDeliveryFee ? $deliveryFee : $previousFee;
            }
            $subtotalAfterAdjustment = (int) $order['subtotal_gnf'] + $priceAdjustment;
            if ($subtotalAfterAdjustment < 0) {
                throw new ApiException(422, 'invalid_total', 'L’ajustement ne peut pas rendre le total négatif.');
            }
            $total = $subtotalAfterAdjustment + ($fee ?? 0);
            $update = $pdo->prepare(
                'UPDATE orders SET status = ?, payment_status = ?,
                 price_adjustment_gnf = ?, adjustment_reason = ?,
                 delivery_fee_gnf = ?, total_gnf = ?,
                 total_is_minimum = CASE WHEN ? = \'confirmed\' THEN 0 ELSE total_is_minimum END,
                 confirmed_at = CASE WHEN ? = \'confirmed\' THEN COALESCE(confirmed_at, UTC_TIMESTAMP()) ELSE confirmed_at END,
                 delivered_at = CASE WHEN ? = \'delivered\' THEN COALESCE(delivered_at, UTC_TIMESTAMP()) ELSE delivered_at END,
                 version = version + 1
                 WHERE id = ? AND version = ?'
            );
            $update->execute([
                $newStatus,
                $paymentStatus,
                $priceAdjustment,
                $adjustmentReason,
                $fee,
                $total,
                $newStatus,
                $newStatus,
                $newStatus,
                (int) $order['id'],
                $version,
            ]);
            if ($update->rowCount() !== 1) {
                throw new ApiException(409, 'version_conflict', 'La commande vient d’être modifiée.');
            }

            $priceChanged =
                (int) $order['price_adjustment_gnf'] !== $priceAdjustment ||
                $previousFee !== $fee;
            $paymentChanged = (string) $order['payment_status'] !== $paymentStatus;
            if ($newStatus !== $previousStatus || $customerMessage !== null || $priceChanged || $paymentChanged) {
                $event = $pdo->prepare(
                    'INSERT INTO order_events
                     (order_id, actor_user_id, event_type, previous_status, new_status,
                      message, visible_to_customer)
                     VALUES (?, ?, ?, ?, ?, ?, 1)'
                );
                $event->execute([
                    (int) $order['id'],
                    $this->security->sessionUserId(),
                    $newStatus !== $previousStatus
                        ? 'order.status_changed'
                        : ($priceChanged
                            ? 'order.price_updated'
                            : ($paymentChanged ? 'order.payment_updated' : 'order.customer_message')),
                    $previousStatus,
                    $newStatus,
                    $customerMessage ?? (
                        $newStatus !== $previousStatus
                            ? $this->defaultStatusMessage($newStatus)
                            : ($priceChanged
                                ? 'Le prix ou la livraison de votre commande a été mis à jour.'
                                : ($paymentChanged
                                    ? 'Le statut du paiement de votre commande a été mis à jour.'
                                    : 'Une précision a été ajoutée à votre commande.'))
                    ),
                ]);
            }
            if ($privateNote !== null) {
                $event = $pdo->prepare(
                    'INSERT INTO order_events
                     (order_id, actor_user_id, event_type, message, visible_to_customer)
                     VALUES (?, ?, ?, ?, 0)'
                );
                $event->execute([
                    (int) $order['id'],
                    $this->security->sessionUserId(),
                    'order.private_note',
                    $privateNote,
                ]);
            }

            return (int) $order['id'];
        });

        $this->security->audit('order.updated', 'order', $reference, [
            'status' => $newStatus,
            'paymentStatus' => $paymentStatus,
            'priceAdjustment' => $priceAdjustment,
            'deliveryFee' => $deliveryFee,
        ]);
        return $this->order($reference);
    }

    private function defaultStatusMessage(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Votre commande a été confirmée par Lizzirene Déco.',
            'preparing' => 'Votre commande est en préparation.',
            'ready' => 'Votre commande est prête.',
            'out_for_delivery' => 'Votre commande est en cours de livraison.',
            'delivered' => 'Votre commande a été livrée. Merci pour votre confiance.',
            'cancelled' => 'La commande a été annulée.',
            'expired' => 'La demande a expiré faute de confirmation.',
            default => 'Le statut de votre commande a été mis à jour.',
        };
    }
}
