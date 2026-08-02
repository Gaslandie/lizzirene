<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;
use PDOException;

final class Orders
{
    public const STATUSES = [
        'awaiting_whatsapp',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'expired',
    ];

    private Config $config;
    private Database $database;
    private Security $security;
    private Catalog $catalog;

    public function __construct(
        Config $config,
        Database $database,
        Security $security,
        Catalog $catalog
    ) {
        $this->config = $config;
        $this->database = $database;
        $this->security = $security;
        $this->catalog = $catalog;
    }

    public function create(Request $request): array
    {
        $this->security->requireMutation($request);
        $data = $request->json();
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data);
        $deliveryMode = Validation::oneOf($data, 'deliveryMode', ['delivery', 'pickup']);
        $commune = $deliveryMode === 'delivery' ? Validation::text($data, 'commune', 2, 80) : null;
        $quartier = $deliveryMode === 'delivery' ? Validation::text($data, 'quartier', 2, 120) : null;
        $landmark = $deliveryMode === 'delivery' ? Validation::text($data, 'addressLandmark', 2, 255) : null;
        $desiredDate = Validation::date($data, 'desiredDate');
        $recipientName = Validation::text($data, 'recipientName', 2, 120, false);
        $recipientPhone = Validation::phone($data, 'recipientPhone', false);
        $cardMessage = Validation::text($data, 'cardMessage', 1, 500, false);
        $note = Validation::text($data, 'note', 1, 1000, false);
        $items = $this->validateItems($data['items'] ?? null);
        $currentUser = $this->security->currentUser();
        $customerUserId = $currentUser !== null && $currentUser['role'] === 'customer'
            ? $this->security->sessionUserId()
            : null;

        $idempotency = $request->header('Idempotency-Key');
        if ($idempotency === null || !preg_match('/^[A-Za-z0-9._:-]{16,128}$/', $idempotency)) {
            throw new ApiException(400, 'idempotency_required', 'Identifiant de validation manquant. Rechargez le panier.');
        }
        $idempotencyHash = hash('sha256', $idempotency);
        $fingerprintItems = $items;
        usort(
            $fingerprintItems,
            static fn (array $left, array $right): int => $left['id'] <=> $right['id']
        );
        $requestFingerprint = hash('sha256', serialize([
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'deliveryMode' => $deliveryMode,
            'commune' => $commune,
            'quartier' => $quartier,
            'landmark' => $landmark,
            'desiredDate' => $desiredDate,
            'recipientName' => $recipientName,
            'recipientPhone' => $recipientPhone,
            'cardMessage' => $cardMessage,
            'note' => $note,
            'items' => $fingerprintItems,
        ]));

        $existing = $this->findByIdempotency($idempotencyHash);
        if ($existing !== null) {
            $this->assertIdempotencyMatch($existing, $requestFingerprint);
            return $this->orderResponse((int) $existing['id'], true);
        }

        $this->security->rateLimit('order-session', session_id(), 5, 3600);
        $this->security->rateLimit('order-phone', $phone, 5, 3600);
        // Limite volontairement large : plusieurs clients mobiles peuvent
        // partager la même IP chez un opérateur guinéen.
        $this->security->rateLimit('order-ip', $this->security->clientIp(), 60, 3600);

        try {
            $orderId = $this->database->transaction(function (PDO $pdo) use (
                $items,
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
                $note,
                $idempotencyHash,
                $requestFingerprint,
                $customerUserId
            ): int {
                $slugs = array_column($items, 'id');
                $products = $this->catalog->rowsForOrder($slugs);
                if (count($products) !== count(array_unique($slugs))) {
                    throw new ApiException(409, 'catalog_changed', 'Un produit du panier n’est plus disponible. Actualisez le panier.');
                }

                $subtotal = 0;
                $minimum = false;
                $snapshots = [];
                foreach ($items as $item) {
                    $product = $products[$item['id']];
                    if ($product['price_gnf'] === null || $product['price_mode'] === 'quote') {
                        throw new ApiException(409, 'quote_product', "« {$product['name']} » doit être demandé séparément sur WhatsApp.");
                    }
                    if ($product['availability'] === 'out_of_stock') {
                        throw new ApiException(409, 'out_of_stock', "« {$product['name']} » est momentanément indisponible.");
                    }
                    $unit = (int) $product['price_gnf'];
                    $line = $unit * $item['quantity'];
                    $subtotal += $line;
                    $minimum = $minimum || $product['price_mode'] === 'from';
                    $snapshots[] = [$product, $item['quantity'], $unit, $line];
                }

                $reference = $this->uniqueReference($pdo);
                $publicToken = $this->tokenFor('public', $reference);
                $claimToken = $this->tokenFor('claim', $reference);
                $insert = $pdo->prepare(
                    'INSERT INTO orders
                     (reference, user_id, customer_name, customer_phone, customer_email,
                      recipient_name, recipient_phone, delivery_mode, commune, quartier,
                      address_landmark, desired_date, card_message, customer_note,
                      subtotal_gnf, total_gnf, total_is_minimum, status, payment_status,
                      public_token_hash, claim_token_hash, claim_token_expires_at,
                      idempotency_key_hash, request_fingerprint)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                             DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR), ?, ?)'
                );
                $insert->execute([
                    $reference,
                    $customerUserId,
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
                    $subtotal,
                    $subtotal,
                    $minimum ? 1 : 0,
                    'awaiting_whatsapp',
                    'unpaid',
                    hash('sha256', $publicToken),
                    $customerUserId === null ? hash('sha256', $claimToken) : null,
                    $idempotencyHash,
                    $requestFingerprint,
                ]);
                $orderId = (int) $pdo->lastInsertId();

                $insertItem = $pdo->prepare(
                    'INSERT INTO order_items
                     (order_id, product_id, product_slug, product_name, product_description,
                      price_mode, unit_price_gnf, quantity, line_total_gnf, image_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($snapshots as [$product, $quantity, $unit, $line]) {
                    $insertItem->execute([
                        $orderId,
                        (int) $product['id'],
                        $product['slug'],
                        $product['name'],
                        mb_substr((string) $product['description'], 0, 500),
                        $product['price_mode'],
                        $unit,
                        $quantity,
                        $line,
                        $product['image_url'],
                    ]);
                }

                $event = $pdo->prepare(
                    'INSERT INTO order_events
                     (order_id, actor_user_id, event_type, new_status, message, visible_to_customer)
                     VALUES (?, ?, ?, ?, ?, 1)'
                );
                $event->execute([
                    $orderId,
                    $customerUserId,
                    'order.created',
                    'awaiting_whatsapp',
                    'Demande enregistrée, en attente du message WhatsApp.',
                ]);

                if ($customerUserId !== null && $deliveryMode === 'delivery') {
                    $saveAddress = $pdo->prepare(
                        "UPDATE users SET commune = ?, quartier = ?, address_landmark = ?
                         WHERE id = ? AND role = 'customer' AND status = 'active'"
                    );
                    $saveAddress->execute([
                        $commune,
                        $quartier,
                        $landmark,
                        $customerUserId,
                    ]);
                }

                return $orderId;
            });
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                $existing = $this->findByIdempotency($idempotencyHash);
                if ($existing !== null) {
                    $this->assertIdempotencyMatch($existing, $requestFingerprint);
                    return $this->orderResponse((int) $existing['id'], true);
                }
            }
            throw $exception;
        }

        $response = $this->orderResponse($orderId, true);
        $this->security->audit('order.created', 'order', $response['reference']);
        return $response;
    }

    public function markWhatsAppOpened(Request $request, string $reference): array
    {
        $this->security->requireMutation($request);
        $data = $request->json();
        $token = Validation::text($data, 'token', 20, 200);
        $statement = $this->database->pdo()->prepare(
            'UPDATE orders SET whatsapp_opened_at = COALESCE(whatsapp_opened_at, UTC_TIMESTAMP())
             WHERE reference = ? AND public_token_hash = ?'
        );
        $statement->execute([$reference, hash('sha256', $token)]);
        if ($statement->rowCount() === 0) {
            $check = $this->database->pdo()->prepare(
                'SELECT 1 FROM orders WHERE reference = ? AND public_token_hash = ? LIMIT 1'
            );
            $check->execute([$reference, hash('sha256', $token)]);
            if (!$check->fetchColumn()) {
                throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
            }
        }
        return ['recorded' => true];
    }

    public function createManual(Request $request): array
    {
        $this->security->requireMutation($request);
        $this->security->requireAdmin();
        $data = $request->json();
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data);
        $description = Validation::text($data, 'description', 2, 1000);
        $subtotal = Validation::integer($data, 'subtotal', 1, 1000000000);
        $deliveryMode = Validation::oneOf($data, 'deliveryMode', ['delivery', 'pickup']);
        $commune = $deliveryMode === 'delivery' ? Validation::text($data, 'commune', 2, 80) : null;
        $quartier = $deliveryMode === 'delivery' ? Validation::text($data, 'quartier', 2, 120) : null;
        $landmark = $deliveryMode === 'delivery' ? Validation::text($data, 'addressLandmark', 2, 255) : null;
        $deliveryFee = $deliveryMode === 'delivery'
            ? Validation::integer($data, 'deliveryFee', 0, 1000000000, false)
            : null;
        $desiredDate = Validation::date($data, 'desiredDate');
        $recipientName = Validation::text($data, 'recipientName', 2, 120, false);
        $recipientPhone = Validation::phone($data, 'recipientPhone', false);
        $note = Validation::text($data, 'note', 1, 1000, false);
        $paymentStatus = Validation::oneOf($data, 'paymentStatus', ['unpaid', 'paid']);

        $idempotency = $request->header('Idempotency-Key');
        if ($idempotency === null || !preg_match('/^[A-Za-z0-9._:-]{16,128}$/', $idempotency)) {
            throw new ApiException(400, 'idempotency_required', 'Identifiant d’enregistrement manquant. Rechargez le formulaire.');
        }
        $idempotencyHash = hash('sha256', 'manual:' . $idempotency);
        $requestFingerprint = hash('sha256', serialize([
            $name,
            $phone,
            $email,
            $description,
            $subtotal,
            $deliveryMode,
            $commune,
            $quartier,
            $landmark,
            $deliveryFee,
            $desiredDate,
            $recipientName,
            $recipientPhone,
            $note,
            $paymentStatus,
        ]));
        $existing = $this->findByIdempotency($idempotencyHash);
        if ($existing !== null) {
            $this->assertIdempotencyMatch($existing, $requestFingerprint);
            return $this->orderResponse((int) $existing['id'], false);
        }

        $this->security->rateLimit(
            'admin-manual-order',
            (string) $this->security->sessionUserId(),
            100,
            3600
        );
        try {
            $orderId = $this->database->transaction(function (PDO $pdo) use (
            $name,
            $phone,
            $email,
            $description,
            $subtotal,
            $deliveryMode,
            $commune,
            $quartier,
            $landmark,
            $deliveryFee,
            $desiredDate,
            $recipientName,
            $recipientPhone,
            $note,
            $paymentStatus,
            $idempotencyHash,
            $requestFingerprint
        ): int {
            $customer = $pdo->prepare(
                "SELECT id FROM users
                 WHERE role = 'customer' AND status = 'active' AND phone_e164 = ? LIMIT 1"
            );
            $customer->execute([$phone]);
            $userId = $customer->fetchColumn();
            $reference = $this->uniqueReference($pdo);
            $publicToken = $this->tokenFor('public', $reference);
            $total = $subtotal + ($deliveryFee ?? 0);

            $insert = $pdo->prepare(
                'INSERT INTO orders
                 (reference, user_id, customer_name, customer_phone, customer_email,
                  recipient_name, recipient_phone, delivery_mode, commune, quartier,
                  address_landmark, desired_date, customer_note, subtotal_gnf,
                  delivery_fee_gnf, total_gnf, total_is_minimum, status, payment_status,
                  public_token_hash, idempotency_key_hash, request_fingerprint, confirmed_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())'
            );
            $insert->execute([
                $reference,
                $userId !== false ? (int) $userId : null,
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
                $note,
                $subtotal,
                $deliveryFee,
                $total,
                0,
                'confirmed',
                $paymentStatus,
                hash('sha256', $publicToken),
                $idempotencyHash,
                $requestFingerprint,
            ]);
            $orderId = (int) $pdo->lastInsertId();

            $item = $pdo->prepare(
                'INSERT INTO order_items
                 (order_id, product_id, product_slug, product_name, product_description,
                  price_mode, unit_price_gnf, quantity, line_total_gnf, image_url)
                 VALUES (?, NULL, ?, ?, ?, ?, ?, 1, ?, NULL)'
            );
            $item->execute([
                $orderId,
                'manuel-whatsapp-' . strtolower($reference),
                'Commande reçue sur WhatsApp',
                $description,
                'fixed',
                $subtotal,
                $subtotal,
            ]);

            $event = $pdo->prepare(
                'INSERT INTO order_events
                 (order_id, actor_user_id, event_type, new_status, message, visible_to_customer)
                 VALUES (?, ?, ?, ?, ?, 1)'
            );
            $event->execute([
                $orderId,
                $this->security->sessionUserId(),
                'order.created_manually',
                'confirmed',
                'Commande enregistrée par la boutique après un échange WhatsApp ou téléphonique.',
            ]);
            return $orderId;
            });
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                $existing = $this->findByIdempotency($idempotencyHash);
                if ($existing !== null) {
                    $this->assertIdempotencyMatch($existing, $requestFingerprint);
                    return $this->orderResponse((int) $existing['id'], false);
                }
            }
            throw $exception;
        }

        $response = $this->orderResponse($orderId, false);
        $this->security->audit('order.created_manually', 'order', $response['reference']);
        return $response;
    }

    public function claim(Request $request): array
    {
        $this->security->requireMutation($request);
        $user = $this->security->requireUser();
        if ($user['role'] !== 'customer') {
            throw new ApiException(403, 'customer_required', 'Utilisez un compte client pour rattacher cette commande.');
        }
        $data = $request->json();
        $token = Validation::text($data, 'claimToken', 20, 200);
        $reference = $this->database->transaction(function (PDO $pdo) use ($token, $user): string {
            $select = $pdo->prepare(
                'SELECT id, reference, delivery_mode, commune, quartier, address_landmark FROM orders
                 WHERE user_id IS NULL AND claim_token_hash = ?
                 AND customer_phone = ? AND claim_token_expires_at >= UTC_TIMESTAMP()
                 LIMIT 1 FOR UPDATE'
            );
            $select->execute([hash('sha256', $token), $user['phone']]);
            $order = $select->fetch();
            if (!$order) {
                throw new ApiException(410, 'claim_expired', 'Ce lien de rattachement a expiré, ne correspond pas à ce téléphone ou a déjà été utilisé.');
            }

            $statement = $pdo->prepare(
                'UPDATE orders SET user_id = ?, claim_token_hash = NULL,
                 claim_token_expires_at = NULL, version = version + 1 WHERE id = ? AND user_id IS NULL'
            );
            $statement->execute([
                $this->security->sessionUserId(),
                (int) $order['id'],
            ]);
            if ($statement->rowCount() !== 1) {
                throw new ApiException(410, 'claim_expired', 'Cette commande a déjà été rattachée.');
            }
            if ((string) $order['delivery_mode'] === 'delivery') {
                $saveAddress = $pdo->prepare(
                    'UPDATE users SET commune = ?, quartier = ?, address_landmark = ? WHERE id = ?'
                );
                $saveAddress->execute([
                    $order['commune'],
                    $order['quartier'],
                    $order['address_landmark'],
                    $this->security->sessionUserId(),
                ]);
            }
            return (string) $order['reference'];
        });
        $this->security->audit('order.claimed', 'order', $reference);
        return ['claimed' => true, 'reference' => $reference];
    }

    public function mine(): array
    {
        $this->security->requireUser();
        $statement = $this->database->pdo()->prepare(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100'
        );
        $statement->execute([$this->security->sessionUserId()]);
        return array_map(
            fn (array $row): array => $this->orderSummary($row),
            $statement->fetchAll()
        );
    }

    public function orderSummary(array $order): array
    {
        return [
            'reference' => (string) $order['reference'],
            'status' => (string) $order['status'],
            'paymentStatus' => (string) $order['payment_status'],
            'customer' => [
                'name' => (string) $order['customer_name'],
                'phone' => (string) $order['customer_phone'],
                'email' => $order['customer_email'] !== null ? (string) $order['customer_email'] : null,
            ],
            'delivery' => [
                'mode' => (string) $order['delivery_mode'],
                'commune' => $order['commune'],
                'quartier' => $order['quartier'],
                'addressLandmark' => $order['address_landmark'],
                'desiredDate' => $order['desired_date'],
            ],
            'subtotal' => (int) $order['subtotal_gnf'],
            'priceAdjustment' => (int) $order['price_adjustment_gnf'],
            'deliveryFee' => $order['delivery_fee_gnf'] !== null ? (int) $order['delivery_fee_gnf'] : null,
            'total' => (int) $order['total_gnf'],
            'totalIsMinimum' => (bool) $order['total_is_minimum'],
            'version' => (int) $order['version'],
            'createdAt' => (string) $order['created_at'],
            'updatedAt' => (string) $order['updated_at'],
            'linkedToAccount' => $order['user_id'] !== null,
        ];
    }

    public function mineOne(string $reference): array
    {
        $this->security->requireUser();
        $statement = $this->database->pdo()->prepare(
            'SELECT id FROM orders WHERE reference = ? AND user_id = ? LIMIT 1'
        );
        $statement->execute([$reference, $this->security->sessionUserId()]);
        $id = $statement->fetchColumn();
        if (!$id) {
            throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
        }
        return $this->orderResponse((int) $id, false, true);
    }

    public function expireStaleRequests(): int
    {
        $hours = max(24, min(
            168,
            (int) $this->config->get('orders.request_expiry_hours', 72)
        ));
        $cutoff = gmdate('Y-m-d H:i:s', time() - ($hours * 3600));

        return $this->database->transaction(function (PDO $pdo) use ($cutoff): int {
            $select = $pdo->prepare(
                "SELECT id FROM orders
                 WHERE status = 'awaiting_whatsapp' AND created_at < ?
                 ORDER BY id LIMIT 500 FOR UPDATE"
            );
            $select->execute([$cutoff]);
            $ids = array_map('intval', array_column($select->fetchAll(), 'id'));
            if ($ids === []) {
                return 0;
            }

            $update = $pdo->prepare(
                "UPDATE orders SET status = 'expired', version = version + 1
                 WHERE id = ? AND status = 'awaiting_whatsapp'"
            );
            $event = $pdo->prepare(
                'INSERT INTO order_events
                 (order_id, event_type, previous_status, new_status, message, visible_to_customer)
                 VALUES (?, ?, ?, ?, ?, 1)'
            );
            $expired = 0;
            foreach ($ids as $id) {
                $update->execute([$id]);
                if ($update->rowCount() !== 1) {
                    continue;
                }
                $event->execute([
                    $id,
                    'order.expired',
                    'awaiting_whatsapp',
                    'expired',
                    'La demande a expiré faute de confirmation. La boutique peut la réactiver si nécessaire.',
                ]);
                $expired++;
            }
            return $expired;
        });
    }

    public function orderResponse(int $orderId, bool $includeTokens, bool $includeEvents = false): array
    {
        $statement = $this->database->pdo()->prepare('SELECT * FROM orders WHERE id = ? LIMIT 1');
        $statement->execute([$orderId]);
        $order = $statement->fetch();
        if (!$order) {
            throw new ApiException(404, 'order_not_found', 'Commande introuvable.');
        }

        $itemsStatement = $this->database->pdo()->prepare(
            'SELECT product_slug, product_name, product_description, price_mode, unit_price_gnf,
             quantity, line_total_gnf, image_url FROM order_items WHERE order_id = ? ORDER BY id'
        );
        $itemsStatement->execute([$orderId]);
        $items = array_map(static fn (array $item): array => [
            'id' => (string) $item['product_slug'],
            'name' => (string) $item['product_name'],
            'description' => $item['product_description'] !== null
                ? (string) $item['product_description']
                : null,
            'priceMode' => (string) $item['price_mode'],
            'unitPrice' => (int) $item['unit_price_gnf'],
            'quantity' => (int) $item['quantity'],
            'lineTotal' => (int) $item['line_total_gnf'],
            'imageUrl' => $item['image_url'] !== null ? (string) $item['image_url'] : null,
        ], $itemsStatement->fetchAll());

        $response = [
            'reference' => (string) $order['reference'],
            'status' => (string) $order['status'],
            'paymentStatus' => (string) $order['payment_status'],
            'customer' => [
                'name' => (string) $order['customer_name'],
                'phone' => (string) $order['customer_phone'],
                'email' => $order['customer_email'] !== null ? (string) $order['customer_email'] : null,
            ],
            'recipient' => $order['recipient_name'] !== null || $order['recipient_phone'] !== null
                ? [
                    'name' => $order['recipient_name'],
                    'phone' => $order['recipient_phone'],
                ]
                : null,
            'delivery' => [
                'mode' => (string) $order['delivery_mode'],
                'commune' => $order['commune'],
                'quartier' => $order['quartier'],
                'addressLandmark' => $order['address_landmark'],
                'desiredDate' => $order['desired_date'],
            ],
            'cardMessage' => $order['card_message'],
            'note' => $order['customer_note'],
            'items' => $items,
            'subtotal' => (int) $order['subtotal_gnf'],
            'priceAdjustment' => (int) $order['price_adjustment_gnf'],
            'adjustmentReason' => $order['adjustment_reason'],
            'deliveryFee' => $order['delivery_fee_gnf'] !== null ? (int) $order['delivery_fee_gnf'] : null,
            'total' => (int) $order['total_gnf'],
            'totalIsMinimum' => (bool) $order['total_is_minimum'],
            'version' => (int) $order['version'],
            'createdAt' => (string) $order['created_at'],
            'updatedAt' => (string) $order['updated_at'],
            'linkedToAccount' => $order['user_id'] !== null,
        ];

        $message = $this->whatsAppMessage($response);
        $number = preg_replace('/\D+/', '', (string) $this->config->get('whatsapp_number', '')) ?? '';
        $response['whatsappMessage'] = $message;
        $response['whatsappUrl'] = $number !== ''
            ? 'https://wa.me/' . $number . '?text=' . rawurlencode($message)
            : null;

        if ($includeTokens) {
            $response['publicToken'] = $this->tokenFor('public', (string) $order['reference']);
            $claimIsValid = $order['claim_token_expires_at'] !== null
                && strtotime((string) $order['claim_token_expires_at'] . ' UTC') > time();
            $response['claimToken'] = $order['user_id'] === null && $claimIsValid
                ? $this->tokenFor('claim', (string) $order['reference'])
                : null;
        }

        if ($includeEvents) {
            $events = $this->database->pdo()->prepare(
                'SELECT event_type, previous_status, new_status, message, created_at
                 FROM order_events WHERE order_id = ? AND visible_to_customer = 1 ORDER BY id'
            );
            $events->execute([$orderId]);
            $response['events'] = array_map(static fn (array $event): array => [
                'type' => (string) $event['event_type'],
                'previousStatus' => $event['previous_status'],
                'newStatus' => $event['new_status'],
                'message' => $event['message'],
                'createdAt' => (string) $event['created_at'],
            ], $events->fetchAll());
        }

        return $response;
    }

    private function validateItems(mixed $value): array
    {
        if (!is_array($value) || !array_is_list($value) || $value === [] || count($value) > 30) {
            throw new ApiException(422, 'invalid_cart', 'Le panier doit contenir entre 1 et 30 produits.');
        }

        $items = [];
        foreach ($value as $index => $item) {
            if (!is_array($item)) {
                throw new ApiException(422, 'invalid_cart', 'Une ligne du panier est invalide.');
            }
            $id = Validation::text($item, 'id', 1, 160);
            $quantity = Validation::integer($item, 'quantity', 1, 20);
            $items[] = ['id' => $id, 'quantity' => $quantity, 'index' => $index];
        }

        $grouped = [];
        foreach ($items as $item) {
            $grouped[$item['id']] = ($grouped[$item['id']] ?? 0) + $item['quantity'];
            if ($grouped[$item['id']] > 20) {
                throw new ApiException(422, 'invalid_cart', 'La quantité maximale par produit est 20.');
            }
        }

        return array_map(
            static fn (string $id, int $quantity): array => ['id' => $id, 'quantity' => $quantity],
            array_keys($grouped),
            array_values($grouped)
        );
    }

    private function findByIdempotency(string $hash): ?array
    {
        $statement = $this->database->pdo()->prepare(
            'SELECT id, request_fingerprint FROM orders WHERE idempotency_key_hash = ? LIMIT 1'
        );
        $statement->execute([$hash]);
        $row = $statement->fetch();
        return $row ?: null;
    }

    private function assertIdempotencyMatch(array $order, string $fingerprint): void
    {
        if (!hash_equals((string) ($order['request_fingerprint'] ?? ''), $fingerprint)) {
            throw new ApiException(
                409,
                'idempotency_conflict',
                'Le panier a changé pendant la validation. Revenez au panier puis recommencez.'
            );
        }
    }

    private function uniqueReference(PDO $pdo): string
    {
        $statement = $pdo->prepare('SELECT 1 FROM orders WHERE reference = ? LIMIT 1');
        for ($attempt = 0; $attempt < 8; $attempt++) {
            $reference = 'LIZ-' . gmdate('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
            $statement->execute([$reference]);
            if (!$statement->fetchColumn()) {
                return $reference;
            }
        }
        throw new ApiException(500, 'reference_error', 'Impossible de créer la référence de commande.');
    }

    private function tokenFor(string $type, string $reference): string
    {
        $key = $this->config->requireString('app_key');
        $raw = hash_hmac('sha256', $type . '|' . $reference, $key, true);
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    private function whatsAppMessage(array $order): string
    {
        $lines = [
            'Nouvelle demande — Lizzirene Déco',
            'Référence : ' . $order['reference'],
            '',
        ];
        foreach ($order['items'] as $item) {
            $lines[] = sprintf(
                '• %s × %d — %s GNF%s',
                $item['name'],
                $item['quantity'],
                number_format($item['lineTotal'], 0, ',', ' '),
                $item['priceMode'] === 'from' ? ' minimum' : ''
            );
        }
        $lines[] = '';
        $lines[] = sprintf(
            'TOTAL%s : %s GNF',
            $order['totalIsMinimum'] ? ' MINIMUM' : '',
            number_format($order['total'], 0, ',', ' ')
        );
        if ($order['delivery']['mode'] === 'delivery') {
            $lines[] = $order['deliveryFee'] === null
                ? 'Frais de livraison à confirmer avec la boutique.'
                : 'Livraison : ' . number_format($order['deliveryFee'], 0, ',', ' ') . ' GNF';
        }
        $lines[] = '';
        $lines[] = 'Nom : ' . $order['customer']['name'];
        $lines[] = 'Téléphone : ' . $order['customer']['phone'];
        if ($order['delivery']['mode'] === 'pickup') {
            $lines[] = 'Retrait souhaité à la boutique de Kipé';
        } else {
            $lines[] = 'Commune : ' . $order['delivery']['commune'];
            $lines[] = 'Quartier : ' . $order['delivery']['quartier'];
            $lines[] = 'Adresse / repère : ' . $order['delivery']['addressLandmark'];
        }
        if ($order['delivery']['desiredDate']) {
            $lines[] = 'Date souhaitée : ' . $order['delivery']['desiredDate'];
        }
        if ($order['recipient']) {
            $lines[] = 'Destinataire : ' . ($order['recipient']['name'] ?: 'non précisé');
            if ($order['recipient']['phone']) {
                $lines[] = 'Téléphone destinataire : ' . $order['recipient']['phone'];
            }
        }
        if ($order['cardMessage']) {
            $lines[] = 'Message carte : ' . $order['cardMessage'];
        }
        if ($order['note']) {
            $lines[] = 'Précision : ' . $order['note'];
        }
        $lines[] = '';
        $lines[] = 'Merci de confirmer la disponibilité, les frais et le délai.';

        return implode("\n", $lines);
    }
}
