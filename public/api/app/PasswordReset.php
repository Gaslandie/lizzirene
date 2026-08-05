<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;
use PDOException;
use Throwable;

final class PasswordReset
{
    private const VALIDITY_MINUTES = 30;

    private Database $database;
    private Security $security;
    private Mailer $mailer;

    public function __construct(
        Database $database,
        Security $security,
        Mailer $mailer
    ) {
        $this->database = $database;
        $this->security = $security;
        $this->mailer = $mailer;
    }

    public function request(Request $request): array
    {
        $this->security->requireMutation($request);
        [$column, $identifier] = $this->normalizedIdentifier($request->json());
        $this->security->rateLimit('password-reset-request-identifier', $identifier, 3, 3600);
        $this->security->rateLimit('password-reset-request-ip', $this->security->clientIp(), 15, 3600);

        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM users WHERE {$column} = ? AND status = 'active' LIMIT 1"
        );
        $statement->execute([$identifier]);
        $user = $statement->fetch();
        $sent = false;

        if ($user && is_string($user['email']) && filter_var($user['email'], FILTER_VALIDATE_EMAIL)) {
            try {
                $this->issueAndSend($user);
                $sent = true;
            } catch (Throwable $exception) {
                error_log('[lizzirene-api] réinitialisation publique : ' . $exception->getMessage());
            }
        } else {
            usleep(random_int(80000, 180000));
        }

        $this->security->audit('auth.password_reset_requested', null, null, [
            'emailSent' => $sent,
        ]);

        return [
            'accepted' => true,
            'message' => 'Si un compte avec une adresse e-mail correspond, un lien vient d’être envoyé.',
        ];
    }

    public function requestForCustomer(Request $request, string $publicId): array
    {
        $this->security->requireMutation($request);
        $admin = $this->security->requireAdmin();
        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $publicId)) {
            throw new ApiException(404, 'not_found', 'Cliente introuvable.');
        }

        $data = $request->json();
        $requestedEmail = null;
        if (array_key_exists('email', $data)) {
            $requestedEmail = Validation::email($data, 'email', true);
            if (!Validation::boolean($data, 'emailVerified')) {
                throw new ApiException(422, 'email_verification_required', 'Confirmez que l’adresse a été vérifiée avec la cliente.', [
                    'emailVerified' => 'Cette confirmation est obligatoire.',
                ]);
            }
        }

        try {
            $result = $this->database->transaction(function (PDO $pdo) use ($publicId, $requestedEmail, $admin): array {
                $select = $pdo->prepare(
                    "SELECT * FROM users WHERE public_id = ? AND role = 'customer' LIMIT 1 FOR UPDATE"
                );
                $select->execute([$publicId]);
                $user = $select->fetch();
                if (!$user) {
                    throw new ApiException(404, 'not_found', 'Cliente introuvable.');
                }
                if ((string) $user['status'] !== 'active') {
                    throw new ApiException(409, 'inactive_account', 'Ce compte client n’est pas actif.');
                }

                $this->security->rateLimit(
                    'admin-password-reset-customer',
                    (string) $user['id'],
                    5,
                    3600
                );
                $this->security->rateLimit(
                    'admin-password-reset-actor',
                    (string) $admin['id'],
                    30,
                    3600
                );

                $emailChanged = $requestedEmail !== null && $requestedEmail !== $user['email'];
                if ($emailChanged) {
                    $update = $pdo->prepare(
                        'UPDATE users SET email = ?, auth_version = auth_version + 1 WHERE id = ?'
                    );
                    $update->execute([$requestedEmail, (int) $user['id']]);
                    $invalidate = $pdo->prepare(
                        'UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP()
                         WHERE user_id = ? AND used_at IS NULL'
                    );
                    $invalidate->execute([(int) $user['id']]);

                    $select->execute([$publicId]);
                    $user = $select->fetch()
                        ?: throw new ApiException(500, 'account_error', 'Impossible de relire le compte client.');
                }

                return ['user' => $user, 'emailChanged' => $emailChanged];
            });
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                throw new ApiException(409, 'email_already_used', 'Cette adresse e-mail est déjà utilisée par un autre compte.');
            }
            throw $exception;
        }

        $user = $result['user'];
        if (!is_string($user['email']) || filter_var($user['email'], FILTER_VALIDATE_EMAIL) === false) {
            throw new ApiException(422, 'email_required', 'Ajoutez d’abord une adresse e-mail vérifiée pour cette cliente.');
        }

        if ($result['emailChanged']) {
            $this->security->audit('admin.customer_email_changed', 'user', $publicId, [
                'email' => $user['email'],
            ]);
        }
        $this->issueAndSend($user);
        $this->security->audit('admin.password_reset_sent', 'user', $publicId);

        return [
            'sent' => true,
            'email' => (string) $user['email'],
            'validityMinutes' => self::VALIDITY_MINUTES,
        ];
    }

    public function complete(Request $request): array
    {
        $this->security->requireMutation($request);
        $data = $request->json();
        $token = Validation::text($data, 'token', 40, 200);
        if (!preg_match('/^[A-Za-z0-9_-]+$/', $token)) {
            throw $this->invalidToken();
        }
        $password = Validation::password($data, 'newPassword');
        $confirmation = $data['passwordConfirmation'] ?? null;
        if (!is_string($confirmation) || !hash_equals($password, $confirmation)) {
            throw new ApiException(422, 'password_mismatch', 'Les deux mots de passe ne correspondent pas.', [
                'passwordConfirmation' => 'Saisissez exactement le même mot de passe.',
            ]);
        }

        $tokenHash = hash('sha256', $token);
        $this->security->rateLimit('password-reset-complete-token', $tokenHash, 8, 3600);
        $this->security->rateLimit('password-reset-complete-ip', $this->security->clientIp(), 25, 3600);

        $publicId = $this->database->transaction(function (PDO $pdo) use ($tokenHash, $password): string {
            $select = $pdo->prepare(
                "SELECT pr.id, pr.user_id, u.public_id
                 FROM password_reset_tokens pr
                 INNER JOIN users u ON u.id = pr.user_id
                 WHERE pr.token_hash = ? AND pr.used_at IS NULL
                   AND pr.expires_at >= UTC_TIMESTAMP() AND u.status = 'active'
                 LIMIT 1 FOR UPDATE"
            );
            $select->execute([$tokenHash]);
            $reset = $select->fetch();
            if (!$reset) {
                throw $this->invalidToken();
            }

            $update = $pdo->prepare(
                'UPDATE users SET password_hash = ?, auth_version = auth_version + 1 WHERE id = ?'
            );
            $update->execute([Security::passwordHash($password), (int) $reset['user_id']]);
            $consume = $pdo->prepare(
                'UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP()
                 WHERE user_id = ? AND used_at IS NULL'
            );
            $consume->execute([(int) $reset['user_id']]);

            return (string) $reset['public_id'];
        });

        $this->security->logout();
        $this->security->audit('auth.password_reset_completed', 'user', $publicId);

        return [
            'updated' => true,
            'csrfToken' => $this->security->csrfToken(),
        ];
    }

    private function issueAndSend(array $user): void
    {
        $token = Security::randomToken(32);
        $tokenHash = hash('sha256', $token);
        $tokenId = $this->database->transaction(function (PDO $pdo) use ($user, $tokenHash): int {
            $invalidate = $pdo->prepare(
                'UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP()
                 WHERE user_id = ? AND used_at IS NULL'
            );
            $invalidate->execute([(int) $user['id']]);
            $insert = $pdo->prepare(
                'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
                 VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))'
            );
            $insert->execute([(int) $user['id'], $tokenHash]);
            return (int) $pdo->lastInsertId();
        });

        try {
            $this->mailer->sendPasswordReset($user, $token, self::VALIDITY_MINUTES);
        } catch (Throwable $exception) {
            $failed = $this->database->pdo()->prepare(
                'UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP() WHERE id = ? AND used_at IS NULL'
            );
            $failed->execute([$tokenId]);
            throw $exception;
        }
    }

    private function normalizedIdentifier(array $data): array
    {
        $identifier = Validation::text($data, 'identifier', 3, 190);
        if (str_contains($identifier, '@')) {
            $email = Validation::email(['email' => $identifier], 'email', true);
            return ['email', $email];
        }

        return ['phone_e164', Validation::phone(['phone' => $identifier])];
    }

    private function invalidToken(): ApiException
    {
        return new ApiException(
            422,
            'invalid_reset_token',
            'Ce lien est invalide, expiré ou a déjà été utilisé.'
        );
    }
}
