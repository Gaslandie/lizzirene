# Déploiement Bluehost de Lizzirene Déco

## Architecture

- `lizzirenedeco.com` est servi par Bluehost avec HTTPS.
- GitHub reste la source du code.
- Un push sur `main` construit puis publie `dist/` par FTPS.
- MySQL conserve les comptes, produits, commandes et historiques.
- `/uploads/products/` conserve les photos ajoutées par l’administratrice.
- La configuration contenant les secrets vit hors du dossier public, dans
  `/home2/fnksrwmy/lizzirene-private/config.php`.

Le workflow ne supprime jamais la configuration privée ni les photos. Il publie
les nouveaux fichiers en deux phases, puis vérifie le site public et l’API.

## 1. Paramètres GitHub déjà nécessaires

Dans **GitHub → Settings → Environments → production** :

| Type | Nom | Valeur |
| --- | --- | --- |
| Variable | `BLUEHOST_FTP_IP` | `50.6.153.225` |
| Variable | `BLUEHOST_FTP_USER` | `lizzirenedeploy@lizzirenedeco.com` |
| Secret | `BLUEHOST_FTP_PASSWORD` | mot de passe du compte FTP dédié |
| Secret | `BLUEHOST_MIGRATION_TOKEN` | troisième secret de 64 caractères, identique à `migration_token` |
| Variable | `BLUEHOST_API_READY` | absent ou `false` avant l’installation, puis `true` |

Le compte FTP doit arriver directement dans le Document Root de
`lizzirenedeco.com`. Le fichier `.deploy-target-ok` doit y contenir exactement :

```text
lizzirenedeco.com
```

Ne jamais envoyer ou enregistrer le mot de passe FTP dans le dépôt.

## 2. Créer la base MySQL dans Bluehost

Dans **Select PHP Version** ou **MultiPHP Manager**, choisir PHP 8.1 ou plus
récent et vérifier les extensions `pdo_mysql`, `mbstring`, `fileinfo` et `gd`.
Le fichier `.user.ini` publié règle aussi les limites nécessaires aux photos ;
Bluehost peut appliquer ces valeurs après quelques minutes.

Dans cPanel, ouvrir **MySQL Databases** :

1. créer une base, par exemple `lizzirene` ;
2. créer un utilisateur dédié, par exemple `lizzireneapp`, avec un mot de passe
   généré et long ;
3. ajouter cet utilisateur à cette base avec **ALL PRIVILEGES** ;
4. noter les noms complets affichés par cPanel. Bluehost ajoute généralement le
   préfixe du compte, par exemple `fnksrwmy_lizzirene`.

Ne pas réutiliser un utilisateur MySQL appartenant à un autre site.

## 3. Créer la configuration privée

Dans **cPanel → File Manager**, remonter à `/home2/fnksrwmy`, puis créer :

```text
/home2/fnksrwmy/lizzirene-private/
/home2/fnksrwmy/lizzirene-private/sessions/
```

Appliquer si cPanel le permet : dossiers `700`, fichier `config.php` `600`.
Ces éléments doivent rester hors de
`/home2/fnksrwmy/html_public/site_Web_17d0c211`.

Générer trois secrets différents. Dans le terminal cPanel ou un terminal local,
exécuter trois fois :

```bash
php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

Créer `/home2/fnksrwmy/lizzirene-private/config.php` avec le contenu suivant,
puis remplacer uniquement les valeurs en majuscules :

```php
<?php

declare(strict_types=1);

return [
    'environment' => 'production',
    'app_url' => 'https://lizzirenedeco.com',
    'app_key' => 'SECRET_A_DE_64_CARACTERES_OU_PLUS',
    'setup_enabled' => true,
    'setup_token' => 'SECRET_B_DIFFERENT_DE_64_CARACTERES_OU_PLUS',
    'migration_token' => 'SECRET_C_DIFFERENT_DE_64_CARACTERES_OU_PLUS',
    'whatsapp_number' => '224664327554',
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=NOM_COMPLET_BASE;charset=utf8mb4',
        'username' => 'NOM_COMPLET_UTILISATEUR',
        'password' => 'MOT_DE_PASSE_MYSQL',
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
```

Les trois secrets doivent être distincts. Ne jamais utiliser les exemples
`CHANGE_ME`, le nom du domaine ou un mot de passe humain pour `app_key` et
les jetons. Ajouter `SECRET_C` dans le secret GitHub
`BLUEHOST_MIGRATION_TOKEN` ; il permet au workflow d’appliquer les migrations
avant de publier une nouvelle version de l’API et ne doit jamais apparaître
dans une variable publique.

## 4. Publier et installer l’administration

1. Fusionner la branche validée dans `main` et attendre le workflow
   **Déploiement Bluehost**.
2. Vérifier `https://lizzirenedeco.com/api/v1/health` :
   `configured`, `database` doivent être vrais ; `installed` est encore faux.
3. Ouvrir `https://lizzirenedeco.com/admin/installation`.
4. Saisir le jeton `setup_token`, puis créer le premier compte administratrice.
   Cette action crée les tables et importe les produits versionnés existants.
5. Vérifier l’accès à `/admin`, ajouter une photo test et créer une commande test.

Immédiatement après l’installation, modifier le fichier privé :

```php
'setup_enabled' => false,
'setup_token' => '',
```

Puis définir la variable GitHub `BLUEHOST_API_READY` à `true` et relancer le
workflow. Les contrôles de production exigeront alors une base connectée, une
installation terminée et un catalogue non vide. Conserver `migration_token`
dans le fichier privé et `BLUEHOST_MIGRATION_TOKEN` dans les secrets GitHub :
ils assurent les futures mises à jour automatiques de la base. Le point
`/api/v1/health` est volontairement en lecture seule.

## 5. Contrôles après activation

- créer une commande sans compte, vérifier sa référence et le message WhatsApp ;
- créer un compte après cette commande et vérifier son rattachement ;
- confirmer la commande dans l’administration ;
- ajouter un produit en brouillon, envoyer une photo, puis le publier ;
- relancer un second déploiement et vérifier que cette photo existe toujours ;
- tester `/`, `/produits`, `/mon-compte`, `/admin` et une URL profonde après
  rafraîchissement ;
- vérifier les redirections HTTP et `www` vers
  `https://lizzirenedeco.com/`.

## 6. Sauvegardes et retour arrière

Sauvegarder régulièrement :

- la base MySQL via cPanel/phpMyAdmin ;
- `/uploads/products/` ;
- le fichier privé `config.php` dans un coffre chiffré.

Tester périodiquement une restauration. Un retour arrière GitHub restaure le
code, pas la base ni les photos. Ne jamais remplacer une migration SQL déjà
appliquée ; toute évolution future de schéma doit recevoir un nouveau numéro.

Pour redéployer une version déjà fusionnée dans `main`, lancer manuellement le
workflow et saisir son SHA dans `ref`. Le workflow refuse une version extérieure
à l’historique de `main`.

## 7. Domaine et messagerie

Les enregistrements web attendus sont déjà : `A @ → 50.6.153.225` et
`CNAME www → lizzirenedeco.com`. Ne pas supprimer les enregistrements MX, SPF,
DKIM ou DMARC lors d’une modification du domaine : ils servent à la messagerie.
