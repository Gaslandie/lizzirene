<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use JsonException;

final class Mailer
{
    private Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function sendPasswordReset(array $user, string $token, int $validityMinutes): void
    {
        $email = $user['email'] ?? null;
        if (!is_string($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new ApiException(422, 'email_required', 'Ce compte ne possède pas d’adresse e-mail valide.');
        }

        $url = rtrim((string) $this->config->get('app_url', ''), '/')
            . '/reinitialiser-mot-de-passe?token=' . rawurlencode($token);
        $name = trim((string) ($user['name'] ?? ''));
        $greeting = $name !== '' ? "Bonjour {$name}," : 'Bonjour,';
        $body = implode("\n\n", [
            $greeting,
            'Vous avez demandé à choisir un nouveau mot de passe pour votre compte Lizzirene Déco.',
            "Ouvrez ce lien dans les {$validityMinutes} prochaines minutes :\n{$url}",
            'Ce lien ne fonctionne qu’une seule fois. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet e-mail.',
            'Lizzirene Déco',
        ]);

        if (!$this->send($email, 'Réinitialisation de votre mot de passe', $body)) {
            throw new ApiException(
                502,
                'email_delivery_failed',
                'L’e-mail n’a pas pu être envoyé. Vérifiez l’adresse puis réessayez.'
            );
        }
    }

    public function send(string $to, string $subject, string $body): bool
    {
        if (filter_var($to, FILTER_VALIDATE_EMAIL) === false) {
            return false;
        }

        $outbox = trim((string) $this->config->get('mail.outbox_directory', ''));
        if (!$this->config->isProduction() && $outbox !== '') {
            return $this->writeToOutbox($outbox, $to, $subject, $body);
        }
        if (!function_exists('mail')) {
            return false;
        }

        $host = parse_url((string) $this->config->get('app_url', ''), PHP_URL_HOST);
        $fallbackFrom = 'no-reply@' . (is_string($host) && $host !== '' ? $host : 'localhost');
        $configuredFrom = trim((string) $this->config->get('mail.from_address', ''));
        $from = filter_var($configuredFrom, FILTER_VALIDATE_EMAIL) !== false
            ? $configuredFrom
            : $fallbackFrom;
        $fromName = $this->headerValue((string) $this->config->get('mail.from_name', 'Lizzirene Deco'));
        $replyTo = trim((string) $this->config->get('mail.reply_to', $this->config->get('shop_email', '')));
        $headers = [
            'From: ' . $fromName . ' <' . $from . '>',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        if (filter_var($replyTo, FILTER_VALIDATE_EMAIL) !== false) {
            $headers[] = 'Reply-To: ' . $replyTo;
        }

        return @mail(
            $to,
            '=?UTF-8?B?' . base64_encode($this->headerValue($subject)) . '?=',
            $body,
            implode("\r\n", $headers)
        );
    }

    private function writeToOutbox(
        string $directory,
        string $to,
        string $subject,
        string $body
    ): bool {
        if (!is_dir($directory) || !is_writable($directory)) {
            return false;
        }

        try {
            $payload = json_encode([
                'to' => $to,
                'subject' => $subject,
                'body' => $body,
                'createdAt' => gmdate(DATE_ATOM),
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return false;
        }

        $path = rtrim($directory, DIRECTORY_SEPARATOR)
            . DIRECTORY_SEPARATOR
            . sprintf('%s-%s.json', gmdate('Ymd-His-u'), bin2hex(random_bytes(6)));
        return file_put_contents($path, $payload . "\n", LOCK_EX) !== false;
    }

    private function headerValue(string $value): string
    {
        return trim(str_replace(["\r", "\n"], ' ', $value));
    }
}
