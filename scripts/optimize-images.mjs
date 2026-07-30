import { mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const racine = process.cwd()
const sourcesDir = path.join(racine, 'image-sources')
const publicDir = path.join(racine, 'public')
const sortieDir = path.join(publicDir, 'optimized')

const images = [
  {
    source: 'logo.jpeg',
    nom: 'logo',
    largeurs: [160],
    qualite: 88,
  },
  {
    source: 'bouquetFleurs.jpeg',
    nom: 'bouquet-fleurs',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'photoVedette.jpeg',
    nom: 'photo-vedette',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'la-fondatrice.jpeg',
    nom: 'la-fondatrice',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'fondatrice-boutique.jpeg',
    nom: 'fondatrice-boutique',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'paquet-emballé.jpeg',
    nom: 'paquet-emballe',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'fleure-fraiches.jpg',
    nom: 'fleurs-fraiches',
    largeurs: [640, 1200],
    qualite: 80,
  },
  {
    source: 'deco-floral.jpg',
    nom: 'deco-floral',
    largeurs: [640, 1200],
    qualite: 80,
  },
  {
    source: 'hero-images/hero-image1.jpg',
    nom: 'hero-image1',
    largeurs: [1920],
    qualite: 74,
    mobile: { largeur: 900, hauteur: 1200, qualite: 78 },
  },
  {
    source: 'hero-images/hero-image2.jpeg',
    nom: 'hero-image2',
    largeurs: [1080],
    qualite: 76,
    mobile: { largeur: 608, hauteur: 810, qualite: 78 },
  },
  {
    source: 'hero-pc.png',
    nom: 'hero-nouveau',
    largeurs: [1672],
    qualite: 76,
    mobileSource: 'hero-mobile.png',
    mobile: { largeur: 900, hauteur: 1200, qualite: 78 },
  },
  {
    source: 'nosServices/deco-interieur.jpg',
    nom: 'service-decoration-espaces',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/creation-florale.jpg',
    nom: 'service-creations-florales',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/celebration.jpg',
    nom: 'service-celebrations',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/attention-hommage.jpg',
    nom: 'service-attentions-hommages',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/hommage-condoleances.png',
    nom: 'service-hommage-condoleances',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/convalescence.png',
    nom: 'service-convalescence',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/visite-naissance.png',
    nom: 'service-visite-naissance',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/anniversaire.png',
    nom: 'service-anniversaire',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'nosServices/diplome.png',
    nom: 'service-remise-diplome',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'comite-miss-guinee.png',
    nom: 'comite-miss-guinee',
    largeurs: [640, 1080],
    qualite: 80,
  },
  {
    source: 'cliente-comblee.jpeg',
    nom: 'cliente-comblee',
    largeurs: [480, 960],
    qualite: 80,
  },
  {
    source: 'inspiration-florale.jpeg',
    nom: 'inspiration-florale',
    largeurs: [480, 810],
    qualite: 80,
  },
  // Logos partenaires : affichés en 64 px de haut, on prévoit le double
  // pour les écrans à forte densité. Un emblème d'État en PNG source pèse
  // près d'un mégaoctet, sans aucune raison.
  {
    source: 'partenaires/ambassade-russie.png',
    nom: 'partenaire-ambassade-russie',
    largeurs: [128, 256],
    qualite: 88,
  },
  {
    source: 'partenaires/ambassade-emirats-arabes-unis.png',
    nom: 'partenaire-ambassade-emirats-arabes-unis',
    largeurs: [256, 400],
    qualite: 88,
  },
  {
    source: 'partenaires/guinee-fashion.png',
    nom: 'partenaire-guinee-fashion',
    largeurs: [256, 400],
    qualite: 88,
  },
  {
    source: 'partenaires/comite-miss-guinee-logo.png',
    nom: 'partenaire-comite-miss-guinee',
    largeurs: [256, 400],
    qualite: 88,
  },
  {
    source: 'evenements/mariage.jpg',
    nom: 'prestation-mariage',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
  {
    source: 'evenements/anniversaire.jpeg',
    nom: 'prestation-anniversaire',
    // Photo en portrait (810 × 1080) : pas de variante 1280.
    largeurs: [480, 810],
    qualite: 78,
  },
  {
    source: 'evenements/bureau-fleuri.png',
    nom: 'prestation-conseil-amenagement',
    largeurs: [480, 800, 1280],
    qualite: 78,
  },
]

const taille = async (fichier) => (await stat(fichier)).size

// Ce dossier est entièrement généré : le vider évite de publier d'anciennes
// variantes qui ne sont plus déclarées dans le manifeste ci-dessus.
await rm(sortieDir, { recursive: true, force: true })
await mkdir(sortieDir, { recursive: true })

let poidsSources = 0
let poidsOptimise = 0

for (const image of images) {
  const source = path.join(sourcesDir, image.source)
  poidsSources += await taille(source)

  for (const largeur of image.largeurs) {
    const sortie = path.join(sortieDir, `${image.nom}-${largeur}.webp`)

    await sharp(source)
      .rotate()
      .resize({ width: largeur, withoutEnlargement: true })
      .webp({
        quality: image.qualite,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(sortie)

    const metadata = await sharp(sortie).metadata()
    if (metadata.width !== largeur) {
      throw new Error(
        `${image.source} est trop étroite pour produire la variante ${largeur}w.`,
      )
    }

    poidsOptimise += await taille(sortie)
  }

  if (image.mobile) {
    const sortieMobile = path.join(sortieDir, `${image.nom}-mobile.webp`)
    const sourceMobile = image.mobileSource
      ? path.join(sourcesDir, image.mobileSource)
      : source

    if (sourceMobile !== source) {
      poidsSources += await taille(sourceMobile)
    }

    await sharp(sourceMobile)
      .rotate()
      .resize({
        width: image.mobile.largeur,
        height: image.mobile.hauteur,
        fit: 'cover',
        position: 'attention',
        withoutEnlargement: true,
      })
      .webp({
        quality: image.mobile.qualite,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(sortieMobile)

    const metadataMobile = await sharp(sortieMobile).metadata()
    if (
      metadataMobile.width !== image.mobile.largeur ||
      metadataMobile.height !== image.mobile.hauteur
    ) {
      throw new Error(
        `${image.source} ne peut pas produire le recadrage mobile demandé.`,
      )
    }

    poidsOptimise += await taille(sortieMobile)
  }
}

const partage = path.join(sortieDir, 'social-share-1200x630.jpg')
await sharp(path.join(sourcesDir, 'deco-floral.jpg'))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 84, progressive: true, mozjpeg: true })
  .toFile(partage)
poidsOptimise += await taille(partage)

const megaoctets = (octets) => `${(octets / 1024 / 1024).toFixed(2)} Mo`

console.log(
  `Images optimisées : ${megaoctets(poidsSources)} de sources → ${megaoctets(poidsOptimise)} de variantes WebP/JPEG.`,
)
