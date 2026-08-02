<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;
use PDOException;

final class Auth
{
    private Config $config;
    private Database $database;
    private Security $security;
    private Setup $setup;

    public function __construct(
        Config $config,
        Database $database,
        Security $security,
        Setup $setup
    ) {
        $this->config = $config;
        $this->database = $database;
        $this->security = $security;
        $this->setup = $setup;
    }

    public function session(): array
    {
        return [
            'user' => $this->security->currentUser(),
            'csrfToken' => $this->security->csrfToken(),
            'configured' => $this->config->configured(),
            'installed' => $this->config->configured() && $this->setup->isInstalled(),
        ];
    }

    public function register(Request $request): array
    {
        $this->security->requireMutation($request);
        $data = $request->json();
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data);
        $password = Validation::password($data);
        $claimToken = Validation::text($data, 'claimToken', 20, 200, false);
        if (!Validation::boolean($data, 'consent')) {
            throw new ApiException(422, 'validation_error', 'Votre accord est requis pour créer le compte.', [
                'consent' => 'Acceptez l’utilisation de vos coordonnées pour le compte et les commandes.',
            ]);
        }

        $this->security->rateLimit('register-session', session_id(), 3, 3600);
        $this->security->rateLimit('register-phone', $phone, 3, 3600);
        // Limite IP assez large pour les accès mobiles partagés à Conakry,
        // tout en bloquant la création automatisée de comptes.
        $this->security->rateLimit('register-ip', $this->security->clientIp(), 20, 3600);

        try {
            $registration = $this->database->transaction(function (PDO $pdo) use (
                $name,
                $phone,
                $email,
                $password,
                $claimToken
            ): array {
                $existing = $pdo->prepare(
                    'SELECT phone_e164, email FROM users
                     WHERE phone_e164 = ? OR (? IS NOT NULL AND email = ?) LIMIT 1'
                );
                $existing->execute([$phone, $email, $email]);
                if ($existing->fetch()) {
                    throw new ApiException(
                        409,
                        'account_exists',
                        'Un compte utilise déjà ce téléphone ou cet e-mail.'
                    );
                }

                $publicId = Security::uuid();
                $insert = $pdo->prepare(
                    'INSERT INTO users
                     (public_id, role, status, name, phone_e164, email, password_hash,
                      privacy_accepted_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())'
                );
                $insert->execute([
                    $publicId,
                    'customer',
                    'active',
                    $name,
                    $phone,
                    $email,
                    Security::passwordHash($password),
                ]);
                $userId = (int) $pdo->lastInsertId();

                $claimWarning = null;
                $claimedReference = null;
                if ($claimToken !== null) {
                    $claimSelect = $pdo->prepare(
                        'SELECT id, reference, delivery_mode, commune, quartier, address_landmark
                         FROM orders WHERE user_id IS NULL AND claim_token_hash = ?
                         AND customer_phone = ? AND claim_token_expires_at >= UTC_TIMESTAMP()
                         LIMIT 1 FOR UPDATE'
                    );
                    $claimSelect->execute([hash('sha256', $claimToken), $phone]);
                    $claimedOrder = $claimSelect->fetch();
                    if (!$claimedOrder) {
                        $claimWarning = 'Le compte a bien été créé, mais la commande n’a pas pu être rattachée. Contactez la boutique avec sa référence.';
                    } else {
                        $claim = $pdo->prepare(
                            'UPDATE orders SET user_id = ?, claim_token_hash = NULL,
                             claim_token_expires_at = NULL, version = version + 1
                             WHERE id = ? AND user_id IS NULL'
                        );
                        $claim->execute([$userId, (int) $claimedOrder['id']]);
                        if ($claim->rowCount() !== 1) {
                            $claimWarning = 'Le compte a bien été créé, mais la commande a déjà été rattachée. Contactez la boutique avec sa référence.';
                        } else {
                            $claimedReference = (string) $claimedOrder['reference'];
                            if ((string) $claimedOrder['delivery_mode'] === 'delivery') {
                                $saveAddress = $pdo->prepare(
                                    'UPDATE users SET commune = ?, quartier = ?, address_landmark = ? WHERE id = ?'
                                );
                                $saveAddress->execute([
                                    $claimedOrder['commune'],
                                    $claimedOrder['quartier'],
                                    $claimedOrder['address_landmark'],
                                    $userId,
                                ]);
                            }
                        }
                    }
                }

                $select = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
                $select->execute([$userId]);
                return [
                    'user' => $select->fetch()
                        ?: throw new ApiException(500, 'registration_error', 'Création du compte impossible.'),
                    'claimWarning' => $claimWarning,
                    'claimedReference' => $claimedReference,
                ];
            });
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                throw new ApiException(409, 'account_exists', 'Un compte utilise déjà ces coordonnées.');
            }
            throw $exception;
        }

        $loggedIn = $this->security->login($registration['user']);
        $this->security->audit('auth.register', 'user', (string) $registration['user']['public_id']);

        return [
            'user' => $loggedIn,
            'csrfToken' => $this->security->csrfToken(),
            'claimWarning' => $registration['claimWarning'],
            'claimedReference' => $registration['claimedReference'],
        ];
    }

    public function login(Request $request): array
    {
        $this->security->requireMutation($request);
        $data = $request->json();
        $identifier = Validation::text($data, 'identifier', 3, 190);
        $password = $data['password'] ?? null;
        if (!is_string($password) || $password === '' || mb_strlen($password) > 128) {
            throw new ApiException(422, 'validation_error', 'Mot de passe requis.', [
                'password' => 'Saisissez votre mot de passe.',
            ]);
        }

        if (str_contains($identifier, '@')) {
            $normalizedIdentifier = mb_strtolower($identifier);
            $lookupColumn = 'email';
        } else {
            $phone = Validation::phone(['phone' => $identifier]);
            $normalizedIdentifier = $phone;
            $lookupColumn = 'phone_e164';
        }

        $this->security->rateLimit('login-account', $normalizedIdentifier, 5, 900);
        $this->security->rateLimit('login-ip', $this->security->clientIp(), 25, 900);
        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM users WHERE {$lookupColumn} = ? LIMIT 1"
        );
        $statement->execute([$normalizedIdentifier]);

        $user = $statement->fetch();
        if (
            !$user ||
            $user['status'] !== 'active' ||
            !password_verify($password, (string) $user['password_hash'])
        ) {
            usleep(random_int(80000, 180000));
            throw new ApiException(401, 'invalid_credentials', 'Téléphone, e-mail ou mot de passe incorrect.');
        }

        $passwordHash = (string) $user['password_hash'];
        $updateSql = 'UPDATE users SET last_login_at = UTC_TIMESTAMP()';
        $parameters = [];
        if (password_needs_rehash(
            $passwordHash,
            defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT
        )) {
            $updateSql .= ', password_hash = ?';
            $parameters[] = Security::passwordHash($password);
        }
        $updateSql .= ' WHERE id = ?';
        $parameters[] = (int) $user['id'];
        $update = $this->database->pdo()->prepare($updateSql);
        $update->execute($parameters);

        $loggedIn = $this->security->login($user);
        $this->security->audit('auth.login', 'user', (string) $user['public_id']);
        return [
            'user' => $loggedIn,
            'csrfToken' => $this->security->csrfToken(),
        ];
    }

    public function logout(Request $request): array
    {
        $this->security->requireMutation($request);
        $user = $this->security->currentUser();
        if ($user !== null) {
            $this->security->audit('auth.logout', 'user', (string) $user['id']);
        }
        $this->security->logout();
        return [
            'user' => null,
            'csrfToken' => $this->security->csrfToken(),
        ];
    }

    public function updateProfile(Request $request): array
    {
        $this->security->requireMutation($request);
        $user = $this->security->requireUser();
        $userId = $this->security->sessionUserId()
            ?? throw new ApiException(401, 'authentication_required', 'Connectez-vous pour continuer.');
        $data = array_merge($user, $request->json());
        $name = Validation::text($data, 'name', 2, 120);
        $phone = Validation::phone($data);
        $email = Validation::email($data);
        $commune = Validation::text($data, 'commune', 2, 80, false);
        $quartier = Validation::text($data, 'quartier', 2, 120, false);
        $landmark = Validation::text($data, 'addressLandmark', 2, 255, false);

        $identityChanged = $phone !== $user['phone'] || $email !== $user['email'];
        if ($identityChanged) {
            $currentPassword = $data['currentPassword'] ?? null;
            if (!is_string($currentPassword) || $currentPassword === '' || mb_strlen($currentPassword) > 128) {
                throw new ApiException(422, 'current_password_required', 'Votre mot de passe actuel est requis pour changer le téléphone ou l’e-mail.', [
                    'currentPassword' => 'Saisissez votre mot de passe actuel.',
                ]);
            }

            $this->security->rateLimit(
                'profile-identity-account',
                (string) $userId,
                5,
                3600
            );
            $this->security->rateLimit('profile-identity-ip', $this->security->clientIp(), 20, 3600);
            $passwordStatement = $this->database->pdo()->prepare(
                'SELECT password_hash FROM users WHERE id = ? LIMIT 1'
            );
            $passwordStatement->execute([$userId]);
            $passwordHash = $passwordStatement->fetchColumn();
            if (!is_string($passwordHash) || !password_verify($currentPassword, $passwordHash)) {
                throw new ApiException(401, 'invalid_password', 'Le mot de passe actuel est incorrect.');
            }
        }

        try {
            $statement = $this->database->pdo()->prepare(
                'UPDATE users SET name = ?, phone_e164 = ?, email = ?, commune = ?,
                 quartier = ?, address_landmark = ?,
                 auth_version = auth_version + ? WHERE id = ?'
            );
            $statement->execute([
                $name,
                $phone,
                $email,
                $commune,
                $quartier,
                $landmark,
                $identityChanged ? 1 : 0,
                $userId,
            ]);
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                throw new ApiException(409, 'account_exists', 'Ces coordonnées sont déjà utilisées par un autre compte.');
            }
            throw $exception;
        }

        if ($identityChanged) {
            $refresh = $this->database->pdo()->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
            $refresh->execute([$userId]);
            $updatedUser = $refresh->fetch()
                ?: throw new ApiException(500, 'account_error', 'Impossible de renouveler la session.');
            $publicUser = $this->security->login($updatedUser);
        } else {
            $publicUser = $this->security->refreshUser();
        }
        $this->security->audit('profile.update', 'user', (string) $user['id']);

        return [
            'user' => $publicUser,
            'csrfToken' => $this->security->csrfToken(),
        ];
    }

    public function updatePassword(Request $request): array
    {
        $this->security->requireMutation($request);
        $user = $this->security->requireUser();
        $data = $request->json();
        $current = $data['currentPassword'] ?? null;
        if (!is_string($current) || $current === '' || mb_strlen($current) > 128) {
            throw new ApiException(422, 'validation_error', 'Mot de passe actuel requis.', [
                'currentPassword' => 'Saisissez votre mot de passe actuel.',
            ]);
        }
        $new = Validation::password($data, 'newPassword');

        $this->security->rateLimit(
            'password-change-account',
            (string) $this->security->sessionUserId(),
            5,
            3600
        );
        $this->security->rateLimit('password-change-ip', $this->security->clientIp(), 20, 3600);

        $statement = $this->database->pdo()->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
        $statement->execute([$this->security->sessionUserId()]);
        $hash = $statement->fetchColumn();
        if (!is_string($hash) || !password_verify($current, $hash)) {
            throw new ApiException(401, 'invalid_password', 'Le mot de passe actuel est incorrect.');
        }

        $update = $this->database->pdo()->prepare(
            'UPDATE users SET password_hash = ?, auth_version = auth_version + 1 WHERE id = ?'
        );
        $update->execute([Security::passwordHash($new), $this->security->sessionUserId()]);
        $refresh = $this->database->pdo()->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $refresh->execute([$this->security->sessionUserId()]);
        $updatedUser = $refresh->fetch()
            ?: throw new ApiException(500, 'account_error', 'Impossible de renouveler la session.');
        $this->security->login($updatedUser);
        $this->security->audit('profile.password_changed', 'user', (string) $user['id']);
        return [
            'updated' => true,
            'csrfToken' => $this->security->csrfToken(),
        ];
    }

}
