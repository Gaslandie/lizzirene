<?php

declare(strict_types=1);

// Copier ce fichier HORS du répertoire public, par exemple dans :
// /home2/fnksrwmy/lizzirene-private/config.php
// Puis remplacer chaque valeur CHANGE_ME et appliquer la permission 600.
return [
    'environment' => 'production',
    'app_url' => 'https://lizzirenedeco.com',
    'app_key' => 'CHANGE_ME_RANDOM_64_CHARACTERS_MINIMUM',
    // Après la première installation : passer à false et vider setup_token.
    'setup_enabled' => true,
    'setup_token' => 'CHANGE_ME_DIFFERENT_RANDOM_64_CHARACTERS',
    // Conserver ce troisième secret après l’installation pour les migrations CI.
    'migration_token' => 'CHANGE_ME_THIRD_RANDOM_64_CHARACTERS',
    'whatsapp_number' => '224XXXXXXXXX',
    // Adresse prévenue à chaque nouvelle commande. C'est le seul canal
    // d'alerte qui ne dépend pas du client : le message WhatsApp, lui, ne
    // part que si le client appuie sur « envoyer ».
    // Laisser vide désactive l'envoi.
    'shop_email' => 'lizzirenedeco@gmail.com',
    'mail' => [
        // Utiliser une adresse du domaine améliore la délivrabilité chez les
        // fournisseurs qui refusent les expéditeurs non authentifiés.
        'from_address' => 'no-reply@lizzirenedeco.com',
        'from_name' => 'Lizzirene Déco',
        'reply_to' => 'lizzirenedeco@gmail.com',
    ],
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=CHANGE_ME;charset=utf8mb4',
        'username' => 'CHANGE_ME',
        'password' => 'CHANGE_ME',
    ],
    'session' => [
        'name' => '__Host-lizzirene_session',
        'idle_minutes' => 120,
        'admin_idle_minutes' => 30,
        'absolute_hours' => 12,
        'save_path' => '/home2/fnksrwmy/lizzirene-private/sessions',
    ],
    'uploads' => [
        'public_path' => '/uploads/products',
        'max_bytes' => 8 * 1024 * 1024,
        'max_pixels' => 16000000,
        'max_dimension' => 1800,
        'max_output_bytes' => 6 * 1024 * 1024,
        'max_total_bytes' => 500 * 1024 * 1024,
    ],
    'orders' => [
        'request_expiry_hours' => 72,
    ],
];
