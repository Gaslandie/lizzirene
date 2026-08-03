import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'

// Génère public/sitemap.xml à partir du catalogue réel.
// Écrit à la main, ce fichier oublierait chaque nouveau produit ; généré
// avant chaque build, il ne peut plus mentir.
//
// Domaine canonique public. Cette valeur reste alignée avec `SITE` dans
// src/utils/donneesStructurees.js et la balise canonical de index.html.
const SITE = 'https://lizzirenedeco.com/'

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// `products.js` importe `config.js`, qui dépend de `import.meta.env`.
// Vite donne le même contexte qu'au build et permet d'exclure les brouillons.
const identifiantsProduits = async () => {
  const serveur = await createServer({
    root: racine,
    configFile: false,
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
  })
  try {
    const { PUBLIC_PRODUCTS } = await serveur.ssrLoadModule(
      '/src/data/products.js',
    )
    return PUBLIC_PRODUCTS.map((produit) => produit.id)
  } finally {
    await serveur.close()
  }
}

// Les familles servent aussi de pages filtrées du catalogue.
const identifiantsFamilles = async () => {
  const source = await readFile(
    resolve(racine, 'src/data/products.js'),
    'utf8',
  )
  const debut = source.indexOf('export const FAMILLES = [')
  const fin = source.indexOf('\n]', debut)
  const corps = source.slice(debut, fin)

  return [...corps.matchAll(/id: '([^']+)'/g)]
    .map(([, id]) => id)
    .filter((id) => !id.startsWith('fleurs-'))
}

const url = (chemin, priorite) =>
  `  <url>\n    <loc>${SITE}${chemin}</loc>\n    <priority>${priorite}</priority>\n  </url>`

const produits = await identifiantsProduits()
const familles = await identifiantsFamilles()

const entrees = [
  url('', '1.0'),
  url('produits', '0.9'),
  url('services', '0.8'),
  url('a-propos', '0.6'),
  url('contact', '0.7'),
  url('confidentialite', '0.3'),
  ...familles.map((id) => url(`produits?categorie=${id}`, '0.7')),
  ...produits.map((id) => url(`produits/${id}`, '0.6')),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees.join('\n')}
</urlset>
`

await writeFile(resolve(racine, 'public/sitemap.xml'), sitemap)

console.log(
  `sitemap.xml — ${entrees.length} URL (${produits.length} produits, ${familles.length} familles)`,
)
