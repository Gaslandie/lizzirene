<?php

declare(strict_types=1);

namespace Lizzirene\Api;

use PDO;

final class Catalog
{
    public const CATEGORIES = [
        'fleurs-naturelles',
        'fleurs-artificielles',
        'plantes',
        'vases',
        'peluches',
        'box-cadeaux',
        'tableaux',
        'luminaire',
        'cache-pots',
    ];

    public const STATUSES = ['draft', 'active', 'archived'];
    public const AVAILABILITIES = ['available', 'out_of_stock', 'on_order'];
    public const PRICE_MODES = ['fixed', 'from', 'quote'];

    private Database $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    public function publicProducts(): array
    {
        $statement = $this->database->pdo()->query(
            "SELECT * FROM products
             WHERE status = 'active'
             ORDER BY featured_home DESC, sort_order ASC, id ASC"
        );

        return array_map([$this, 'mapPublicProduct'], $statement->fetchAll());
    }

    public function publicProduct(string $slug): array
    {
        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM products WHERE slug = ? AND status = 'active' LIMIT 1"
        );
        $statement->execute([$slug]);
        $row = $statement->fetch();
        if (!$row) {
            throw new ApiException(404, 'product_not_found', 'Ce produit n’est plus disponible.');
        }

        return $this->mapPublicProduct($row);
    }

    public function rowsForOrder(array $slugs): array
    {
        $slugs = array_values(array_unique(array_filter($slugs, 'is_string')));
        if ($slugs === []) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($slugs), '?'));
        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM products WHERE status = 'active' AND slug IN ({$placeholders})"
        );
        $statement->execute($slugs);

        $rows = [];
        foreach ($statement->fetchAll() as $row) {
            $rows[(string) $row['slug']] = $row;
        }
        return $rows;
    }

    public function adminProducts(?string $status = null, ?string $search = null): array
    {
        $conditions = [];
        $parameters = [];
        if ($status !== null && in_array($status, self::STATUSES, true)) {
            $conditions[] = 'status = ?';
            $parameters[] = $status;
        }
        if ($search !== null && trim($search) !== '') {
            $conditions[] = '(name LIKE ? OR slug LIKE ? OR description LIKE ?)';
            $needle = '%' . trim($search) . '%';
            array_push($parameters, $needle, $needle, $needle);
        }

        $where = $conditions === [] ? '' : 'WHERE ' . implode(' AND ', $conditions);
        $statement = $this->database->pdo()->prepare(
            "SELECT * FROM products {$where} ORDER BY status = 'archived', sort_order ASC, id DESC"
        );
        $statement->execute($parameters);
        return array_map([$this, 'mapProduct'], $statement->fetchAll());
    }

    public function adminProduct(int $id): array
    {
        $statement = $this->database->pdo()->prepare('SELECT * FROM products WHERE id = ? LIMIT 1');
        $statement->execute([$id]);
        $row = $statement->fetch();
        if (!$row) {
            throw new ApiException(404, 'product_not_found', 'Produit introuvable.');
        }
        return $this->mapProduct($row);
    }

    public function create(array $data, int $adminId): array
    {
        $values = $this->validateProduct($data, false);
        $slug = $this->uniqueSlug($values['slug'] ?: $values['name']);
        $statement = $this->database->pdo()->prepare(
            'INSERT INTO products
             (slug, name, category, description, price_gnf, price_mode,
              price_label, price_prefix, tag, image_url, image_alt, image_position,
              visual_variant, status, availability, featured_home, sort_order,
              created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $statement->execute([
            $slug,
            $values['name'],
            $values['category'],
            $values['description'],
            $values['priceGnf'],
            $values['priceMode'],
            $values['priceLabel'],
            $values['pricePrefix'],
            $values['tag'],
            $values['imageUrl'],
            $values['imageAlt'],
            $values['imagePosition'],
            $values['visualVariant'],
            $values['status'],
            $values['availability'],
            $values['featuredHome'] ? 1 : 0,
            $values['sortOrder'],
            $adminId,
            $adminId,
        ]);

        return $this->adminProduct((int) $this->database->pdo()->lastInsertId());
    }

    public function update(int $id, array $data, int $adminId): array
    {
        $existing = $this->adminProduct($id);
        $values = $this->validateProduct($data, true, $existing);
        $version = Validation::integer($data, 'version', 1, PHP_INT_MAX);

        $statement = $this->database->pdo()->prepare(
            'UPDATE products SET
               name = ?, category = ?, description = ?, price_gnf = ?, price_mode = ?,
               price_label = ?, price_prefix = ?, tag = ?, image_url = ?, image_alt = ?,
               image_position = ?, visual_variant = ?, status = ?, availability = ?,
               featured_home = ?, sort_order = ?, updated_by = ?, version = version + 1
             WHERE id = ? AND version = ?'
        );
        $statement->execute([
            $values['name'],
            $values['category'],
            $values['description'],
            $values['priceGnf'],
            $values['priceMode'],
            $values['priceLabel'],
            $values['pricePrefix'],
            $values['tag'],
            $values['imageUrl'],
            $values['imageAlt'],
            $values['imagePosition'],
            $values['visualVariant'],
            $values['status'],
            $values['availability'],
            $values['featuredHome'] ? 1 : 0,
            $values['sortOrder'],
            $adminId,
            $id,
            $version,
        ]);

        if ($statement->rowCount() !== 1) {
            throw new ApiException(
                409,
                'version_conflict',
                'Ce produit a été modifié dans un autre onglet. Rechargez-le avant de continuer.'
            );
        }

        return $this->adminProduct($id);
    }

    public function archive(int $id, int $version, int $adminId): array
    {
        $statement = $this->database->pdo()->prepare(
            "UPDATE products SET status = 'archived', featured_home = 0,
             updated_by = ?, version = version + 1 WHERE id = ? AND version = ?"
        );
        $statement->execute([$adminId, $id, $version]);
        if ($statement->rowCount() !== 1) {
            throw new ApiException(409, 'version_conflict', 'Le produit a déjà été modifié.');
        }
        return $this->adminProduct($id);
    }

    public function restore(int $id, int $version, int $adminId): array
    {
        $statement = $this->database->pdo()->prepare(
            "UPDATE products SET status = 'draft', updated_by = ?,
             version = version + 1 WHERE id = ? AND version = ? AND status = 'archived'"
        );
        $statement->execute([$adminId, $id, $version]);
        if ($statement->rowCount() !== 1) {
            throw new ApiException(409, 'version_conflict', 'Le produit a déjà été modifié ou restauré.');
        }
        return $this->adminProduct($id);
    }

    /**
     * `$srcset` et `$sizes` sont désormais renseignés : l'envoi depuis
     * l'administration produit plusieurs largeurs, comme le pipeline du
     * dépôt. Sans eux, un téléphone téléchargeait l'image prévue pour un
     * grand écran — environ neuf fois le poids nécessaire.
     */
    public function updateImage(
        int $id,
        int $version,
        string $url,
        ?string $srcset,
        ?string $sizes,
        string $alt,
        int $width,
        int $height,
        int $adminId
    ): array
    {
        $statement = $this->database->pdo()->prepare(
            'UPDATE products SET image_url = ?, image_srcset = ?, image_sizes = ?,
             image_alt = ?, image_width = ?, image_height = ?,
             updated_by = ?, version = version + 1
             WHERE id = ? AND version = ?'
        );
        $statement->execute([$url, $srcset, $sizes, $alt, $width, $height, $adminId, $id, $version]);
        if ($statement->rowCount() !== 1) {
            throw new ApiException(
                409,
                'version_conflict',
                'Ce produit a été modifié dans un autre onglet. Rechargez-le avant d’envoyer l’image.'
            );
        }
        return $this->adminProduct($id);
    }

    public function mapProduct(array $row): array
    {
        $care = null;
        if (is_string($row['care_json'] ?? null) && $row['care_json'] !== '') {
            $decoded = json_decode($row['care_json'], true);
            $care = is_array($decoded) ? $decoded : null;
        }

        return [
            'id' => (string) $row['slug'],
            'recordId' => (int) $row['id'],
            'name' => (string) $row['name'],
            'category' => (string) $row['category'],
            'price' => $row['price_gnf'] !== null ? (int) $row['price_gnf'] : null,
            'priceMode' => (string) $row['price_mode'],
            'priceLabel' => $row['price_label'] !== null ? (string) $row['price_label'] : null,
            'prixPrefixe' => $row['price_prefix'] !== null ? (string) $row['price_prefix'] : null,
            'tag' => (string) $row['tag'],
            'desc' => (string) $row['description'],
            'src' => $row['image_url'] !== null ? (string) $row['image_url'] : null,
            'srcSet' => $row['image_srcset'] !== null ? (string) $row['image_srcset'] : null,
            'sizes' => $row['image_sizes'] !== null ? (string) $row['image_sizes'] : null,
            'alt' => $row['image_alt'] !== null ? (string) $row['image_alt'] : null,
            'width' => $row['image_width'] !== null ? (int) $row['image_width'] : null,
            'height' => $row['image_height'] !== null ? (int) $row['image_height'] : null,
            'imagePosition' => $row['image_position'] !== null ? (string) $row['image_position'] : null,
            'variant' => $row['visual_variant'] !== null ? (string) $row['visual_variant'] : null,
            'entretien' => $care,
            'status' => (string) $row['status'],
            'availability' => (string) $row['availability'],
            'featuredHome' => (bool) $row['featured_home'],
            'sortOrder' => (int) $row['sort_order'],
            'version' => (int) $row['version'],
            'createdAt' => (string) $row['created_at'],
            'updatedAt' => (string) $row['updated_at'],
        ];
    }

    private function mapPublicProduct(array $row): array
    {
        $product = $this->mapProduct($row);
        unset(
            $product['recordId'],
            $product['version'],
            $product['status'],
            $product['createdAt'],
            $product['updatedAt']
        );
        return $product;
    }

    private function validateProduct(array $data, bool $updating, ?array $existing = null): array
    {
        $existingInput = $existing !== null ? [
            ...$existing,
            'description' => $existing['desc'] ?? null,
            'src' => $existing['src'] ?? null,
            'alt' => $existing['alt'] ?? null,
            'variant' => $existing['variant'] ?? null,
        ] : [];
        $merged = array_merge($existingInput, $data);
        $name = Validation::text($merged, 'name', 2, 180);
        $category = Validation::oneOf($merged, 'category', self::CATEGORIES);
        $description = Validation::text($merged, 'description', 10, 5000);
        $priceMode = Validation::oneOf($merged, 'priceMode', self::PRICE_MODES);
        $price = $priceMode === 'quote'
            ? null
            : Validation::integer($merged, 'price', 1, 1000000000);

        return [
            'slug' => $updating ? (string) ($existing['id'] ?? '') : (string) ($data['slug'] ?? ''),
            'name' => $name,
            'category' => $category,
            'description' => $description,
            'priceMode' => $priceMode,
            'priceGnf' => $price,
            'priceLabel' => Validation::text($merged, 'priceLabel', 2, 80, false),
            'pricePrefix' => $priceMode === 'from'
                ? (Validation::text($merged, 'prixPrefixe', 2, 80, false) ?? 'À partir de')
                : null,
            'tag' => Validation::text($merged, 'tag', 2, 80),
            'imageUrl' => Validation::text($merged, 'src', 2, 500, false),
            'imageAlt' => Validation::text($merged, 'alt', 2, 255, false),
            'imagePosition' => Validation::text($merged, 'imagePosition', 2, 80, false),
            'visualVariant' => Validation::text($merged, 'variant', 2, 40, false),
            'status' => Validation::oneOf($merged, 'status', self::STATUSES),
            'availability' => Validation::oneOf($merged, 'availability', self::AVAILABILITIES),
            'featuredHome' => Validation::boolean($merged, 'featuredHome'),
            'sortOrder' => Validation::integer($merged, 'sortOrder', -1000000, 1000000) ?? 0,
        ];
    }

    private function uniqueSlug(string $value): string
    {
        $base = self::slugify($value);
        if ($base === '') {
            $base = 'produit';
        }
        $candidate = $base;
        $suffix = 2;
        $statement = $this->database->pdo()->prepare('SELECT 1 FROM products WHERE slug = ? LIMIT 1');
        while (true) {
            $statement->execute([$candidate]);
            if (!$statement->fetchColumn()) {
                return $candidate;
            }
            $candidate = substr($base, 0, 150) . '-' . $suffix;
            $suffix++;
        }
    }

    private static function slugify(string $value): string
    {
        $value = mb_strtolower(trim($value));
        $value = strtr($value, [
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ä' => 'a', 'ã' => 'a',
            'ç' => 'c', 'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'î' => 'i', 'ï' => 'i', 'ô' => 'o', 'ö' => 'o', 'ù' => 'u',
            'û' => 'u', 'ü' => 'u', 'œ' => 'oe', '’' => '-', "'" => '-',
        ]);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
        return trim(substr($value, 0, 160), '-');
    }
}
