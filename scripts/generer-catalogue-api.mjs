import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const serveur = await createServer({
  root: racine,
  configFile: false,
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
})

const { PRODUCTS } = await serveur.ssrLoadModule('/src/data/products.js')
await serveur.close()

const VEDETTES = new Set([
  'bouquet-roses-naturelles',
  'bouquet-roses-colorees',
  'bouquet-seoul',
  'bouquet-de-fleurs-jaune-blanc',
  'palmier-cuillere',
  'terrarium',
  'pachira-arbre-argent',
  'bambou',
])

const catalogue = PRODUCTS.map((produit, index) => {
  const status = produit.status ?? (produit.src ? 'active' : 'draft')
  return {
    slug: produit.id,
    name: produit.name,
    category: produit.category,
    description: produit.desc,
    priceGnf: produit.price,
    priceMode:
      produit.price == null
        ? 'quote'
        : produit.prixPrefixe
          ? 'from'
          : 'fixed',
    priceLabel: produit.priceLabel ?? null,
    pricePrefix: produit.prixPrefixe ?? null,
    tag: produit.tag,
    imageUrl: produit.src ?? null,
    imageSrcSet: produit.srcSet ?? null,
    imageSizes: produit.sizes ?? null,
    imageAlt: produit.alt ?? null,
    imageWidth: produit.width ?? null,
    imageHeight: produit.height ?? null,
    imagePosition: produit.imagePosition ?? null,
    visualVariant: produit.variant ?? null,
    care: produit.entretien ?? null,
    status,
    availability: 'available',
    featuredHome: status === 'active' && VEDETTES.has(produit.id),
    sortOrder: (index + 1) * 10,
  }
})

const cible = resolve(
  racine,
  'public/api/database/catalogue-initial.json',
)
await mkdir(dirname(cible), { recursive: true })
await writeFile(cible, `${JSON.stringify(catalogue, null, 2)}\n`)

console.log(`Catalogue API généré : ${catalogue.length} produits`)
