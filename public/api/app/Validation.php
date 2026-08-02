<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use DateTimeImmutable;

final class Validation
{
    public static function text(
        array $data,
        string $key,
        int $min,
        int $max,
        bool $required = true
    ): ?string {
        $value = $data[$key] ?? null;
        if ($value === null || (is_string($value) && trim($value) === '')) {
            if ($required) {
                throw new ApiException(422, 'validation_error', 'Certaines informations sont manquantes.', [
                    $key => 'Ce champ est obligatoire.',
                ]);
            }
            return null;
        }

        if (!is_string($value)) {
            throw new ApiException(422, 'validation_error', 'Certaines informations sont invalides.', [
                $key => 'La valeur est invalide.',
            ]);
        }

        $value = preg_replace('/\s+/u', ' ', trim($value)) ?? trim($value);
        $length = mb_strlen($value);
        if ($length < $min || $length > $max) {
            throw new ApiException(422, 'validation_error', 'Certaines informations sont invalides.', [
                $key => "Ce champ doit contenir entre {$min} et {$max} caractères.",
            ]);
        }

        return $value;
    }

    public static function email(array $data, string $key = 'email', bool $required = false): ?string
    {
        $value = self::text($data, $key, 3, 190, $required);
        if ($value === null) {
            return null;
        }

        $value = mb_strtolower($value);
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException(422, 'validation_error', 'Adresse e-mail invalide.', [
                $key => 'Saisissez une adresse e-mail valide.',
            ]);
        }

        return $value;
    }

    public static function phone(array $data, string $key = 'phone', bool $required = true): ?string
    {
        $raw = self::text($data, $key, 8, 30, $required);
        if ($raw === null) {
            return null;
        }

        if (!preg_match('/^\+?[0-9\s().-]+$/u', $raw)) {
            throw new ApiException(422, 'validation_error', 'Numéro de téléphone invalide.', [
                $key => 'Utilisez uniquement des chiffres, espaces, parenthèses, tirets et éventuellement +.',
            ]);
        }

        $digits = preg_replace('/\D+/', '', $raw) ?? '';
        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }
        if (strlen($digits) === 9) {
            $digits = '224' . $digits;
        } elseif (strlen($digits) === 10 && str_starts_with($digits, '0')) {
            $digits = '224' . substr($digits, 1);
        }

        if (strlen($digits) < 8 || strlen($digits) > 15) {
            throw new ApiException(422, 'validation_error', 'Numéro de téléphone invalide.', [
                $key => 'Utilisez un numéro guinéen ou international valide.',
            ]);
        }

        return '+' . $digits;
    }

    public static function password(array $data, string $key = 'password'): string
    {
        $password = $data[$key] ?? null;
        if (!is_string($password) || mb_strlen($password) < 10 || mb_strlen($password) > 128) {
            throw new ApiException(422, 'validation_error', 'Le mot de passe est invalide.', [
                $key => 'Choisissez au moins 10 caractères.',
            ]);
        }

        return $password;
    }

    public static function integer(
        array $data,
        string $key,
        int $min,
        int $max,
        bool $required = true
    ): ?int {
        $value = $data[$key] ?? null;
        if (($value === null || $value === '') && !$required) {
            return null;
        }
        if (filter_var($value, FILTER_VALIDATE_INT) === false) {
            throw new ApiException(422, 'validation_error', 'Nombre invalide.', [
                $key => 'Saisissez un nombre valide.',
            ]);
        }

        $integer = (int) $value;
        if ($integer < $min || $integer > $max) {
            throw new ApiException(422, 'validation_error', 'Nombre hors limites.', [
                $key => "La valeur doit être comprise entre {$min} et {$max}.",
            ]);
        }

        return $integer;
    }

    public static function boolean(array $data, string $key, bool $default = false): bool
    {
        $value = $data[$key] ?? $default;
        if (is_bool($value)) {
            return $value;
        }
        if ($value === 1 || $value === 0 || $value === '1' || $value === '0') {
            return (bool) $value;
        }
        throw new ApiException(422, 'validation_error', 'Valeur booléenne invalide.', [
            $key => 'La valeur doit être vraie ou fausse.',
        ]);
    }

    public static function oneOf(array $data, string $key, array $allowed, bool $required = true): ?string
    {
        $value = self::text($data, $key, 1, 100, $required);
        if ($value === null) {
            return null;
        }
        if (!in_array($value, $allowed, true)) {
            throw new ApiException(422, 'validation_error', 'Choix invalide.', [
                $key => 'Sélectionnez une valeur proposée.',
            ]);
        }
        return $value;
    }

    public static function date(
        array $data,
        string $key,
        bool $required = false,
        bool $allowPast = false
    ): ?string
    {
        $value = self::text($data, $key, 10, 10, $required);
        if ($value === null) {
            return null;
        }
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        $errors = DateTimeImmutable::getLastErrors();
        if (!$date || ($errors !== false && ($errors['warning_count'] || $errors['error_count']))) {
            throw new ApiException(422, 'validation_error', 'Date invalide.', [
                $key => 'Saisissez une date valide.',
            ]);
        }

        $today = new DateTimeImmutable('today');
        $minimum = $allowPast ? $today->modify('-5 years') : $today;
        $maximum = $allowPast ? $today->modify('+2 years') : $today->modify('+1 year');
        if ($date < $minimum || $date > $maximum) {
            throw new ApiException(422, 'validation_error', 'Date hors limites.', [
                $key => $allowPast
                    ? 'Choisissez une date comprise dans une période raisonnable.'
                    : 'Choisissez une date comprise entre aujourd’hui et un an.',
            ]);
        }
        return $value;
    }
}
