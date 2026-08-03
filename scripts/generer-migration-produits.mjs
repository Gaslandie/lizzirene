import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Écrit une migration SQL insérant des produits dans la base en ligne.
//
// Pourquoi : `catalogue-initial.json` n'est semé qu'à l'installation, et
// seulement si la table `products` est vide (Setup::seedCatalog). Passé ce
// cap, le dépôt et la base divergent — un produit ajouté à products.js reste
// invisible en ligne. Les migrations sont le seul canal versionné vers la
// base de production.
//
// Le SQL produit est volontairement idempotent (INSERT … ON DUPLICATE KEY
// UPDATE sur la contrainte d'unicité du slug) : rejouer la migration ne crée
// pas de doublon. Il n'écrase QUE les colonnes de présentation, jamais le
// prix ni la disponibilité — ceux-là appartiennent à la boutique dès que le
// produit existe, et l'administration doit rester maîtresse.
//
// Usage : node scripts/generer-migration-produits.mjs <version> <slug…>
const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const [, , version, ...slugs] = process.argv
if (!version || !/^\d{3}_[a-z0-9_]+$/.test(version) || slugs.length === 0) {
  console.error(
    'Usage : node scripts/generer-migration-produits.mjs 002_nom_migration slug1 slug2…',
  )
  process.exit(1)
}

const catalogue = JSON.parse(
  await readFile(
    resolve(racine, 'public/api/database/catalogue-initial.json'),
    'utf8',
  ),
)

const parSlug = new Map(catalogue.map((produit) => [produit.slug, produit]))
const manquants = slugs.filter((slug) => !parSlug.has(slug))
if (manquants.length > 0) {
  console.error(`Slugs absents du catalogue : ${manquants.join(', ')}`)
  process.exit(1)
}

// Échappement MySQL des littéraux. Les données viennent du dépôt, pas d'une
// saisie utilisateur, mais une apostrophe dans « Ours « Love You » » suffit à
// casser le fichier — donc on échappe pour de bon.
const sql = (valeur) => {
  if (valeur === null || valeur === undefined) return 'NULL'
  if (typeof valeur === 'number') return String(valeur)
  if (typeof valeur === 'boolean') return valeur ? '1' : '0'
  return `'${String(valeur).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

const COLONNES = [
  ['slug', (p) => p.slug],
  ['name', (p) => p.name],
  ['category', (p) => p.category],
  ['description', (p) => p.description],
  ['price_gnf', (p) => p.priceGnf],
  ['price_mode', (p) => p.priceMode],
  ['price_label', (p) => p.priceLabel],
  ['price_prefix', (p) => p.pricePrefix],
  ['tag', (p) => p.tag],
  ['image_url', (p) => p.imageUrl],
  ['image_srcset', (p) => p.imageSrcSet],
  ['image_sizes', (p) => p.imageSizes],
  ['image_alt', (p) => p.imageAlt],
  ['image_width', (p) => p.imageWidth],
  ['image_height', (p) => p.imageHeight],
  ['image_position', (p) => p.imagePosition],
  ['visual_variant', (p) => p.visualVariant],
  ['care_json', (p) => (p.care ? JSON.stringify(p.care) : null)],
  ['status', () => 'active'],
  ['availability', () => 'available'],
  ['featured_home', (p) => (p.featuredHome ? 1 : 0)],
  ['sort_order', (p) => p.sortOrder ?? 0],
]

// Rejouée, la migration rafraîchit la présentation mais laisse à la boutique
// la main sur le prix, la disponibilité et la mise en avant.
const NON_ECRASEES = new Set([
  'slug',
  'price_gnf',
  'price_mode',
  'price_label',
  'price_prefix',
  'status',
  'availability',
  'featured_home',
  'sort_order',
])

const lignes = slugs.map((slug) => {
  const produit = parSlug.get(slug)
  return `  (${COLONNES.map(([, lire]) => sql(lire(produit))).join(', ')})`
})

const misesAJour = COLONNES.filter(([nom]) => !NON_ECRASEES.has(nom)).map(
  ([nom]) => `  ${nom} = VALUES(${nom})`,
)

const contenu = `-- ${version}
-- Produits ajoutés au dépôt après l'installation initiale.
--
-- catalogue-initial.json n'est semé qu'une fois, sur une table vide
-- (Setup::seedCatalog). Cette migration est donc le seul moyen de faire
-- remonter de nouveaux produits dans la base de production.
--
-- Rejouable sans risque : ON DUPLICATE KEY UPDATE sur le slug unique.
-- Le prix, la disponibilité, la mise en avant et le rang restent la
-- propriété de l'administration une fois le produit créé.

INSERT INTO products
  (${COLONNES.map(([nom]) => nom).join(', ')})
VALUES
${lignes.join(',\n')}
ON DUPLICATE KEY UPDATE
${misesAJour.join(',\n')},
  updated_at = CURRENT_TIMESTAMP;
`

const chemin = resolve(racine, `public/api/database/${version}.sql`)
await writeFile(chemin, contenu)
console.log(
  `${version}.sql — ${slugs.length} produits (${contenu.length} octets)`,
)
