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
    source: 'produits/plante-dinterieure-verte.jpeg',
    nom: 'produit-plante-interieur',
    largeurs: [360, 554],
    qualite: 82,
  },
  {
    source: 'produits/palmier-cuillere.png',
    nom: 'produit-palmier-cuillere',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/bambou.jpeg',
    nom: 'produit-bambou',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-roses-naturelles.png',
    nom: 'produit-bouquet-roses-naturelles',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/chrysantheme-blanc.jpg',
    nom: 'produit-chrysantheme-blanc',
    largeurs: [480, 800],
    qualite: 82,
  },
  {
    source: 'produits/chrysantheme-bicolore.webp',
    nom: 'produit-chrysantheme-bicolore',
    largeurs: [480, 600],
    qualite: 82,
  },
  {
    source: 'produits/chrysantheme-violet.jpeg',
    nom: 'produit-chrysantheme-violet',
    largeurs: [360, 460],
    qualite: 82,
  },
  {
    source: 'produits/hortensia-blanc.jpeg',
    nom: 'produit-hortensia-blanc',
    largeurs: [360, 447],
    qualite: 82,
  },
  {
    source: 'produits/hortensia-fuchsia.webp',
    nom: 'produit-hortensia-fuchsia',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/hortensia-vert.jpg',
    nom: 'produit-hortensia-vert',
    largeurs: [480, 1000],
    qualite: 82,
  },
  {
    source: 'produits/lys-oriental-blanc.jpeg',
    nom: 'produit-lys-oriental-blanc',
    largeurs: [320, 388],
    qualite: 82,
  },
  {
    source: 'produits/lys-oriental-rose.jpeg',
    nom: 'produit-lys-oriental-rose',
    largeurs: [360, 447],
    qualite: 82,
  },
  {
    source: 'produits/lys-asiatique-blanc.jpeg',
    nom: 'produit-lys-asiatique-blanc',
    largeurs: [480, 554],
    qualite: 82,
  },
  {
    source: 'produits/lys-asiatique-orange.jpeg',
    nom: 'produit-lys-asiatique-orange',
    largeurs: [480, 554],
    qualite: 82,
  },
  {
    source: 'produits/lys-asiatique-rouge.webp',
    nom: 'produit-lys-asiatique-rouge',
    largeurs: [360, 450],
    qualite: 82,
  },
  {
    source: 'produits/rose-blanche.jpeg',
    nom: 'produit-rose-blanche',
    largeurs: [480, 678],
    qualite: 82,
  },
  {
    source: 'produits/rose-jaune.jpg',
    nom: 'produit-rose-jaune',
    largeurs: [480, 600],
    qualite: 82,
  },
  {
    source: 'produits/rose-orange.jpeg',
    nom: 'produit-rose-orange',
    largeurs: [480, 591],
    qualite: 82,
  },
  {
    source: 'produits/rose-rouge.jpeg',
    nom: 'produit-rose-rouge',
    largeurs: [480, 554],
    qualite: 82,
  },
  {
    source: 'produits/rose-rose.jpg',
    nom: 'produit-rose-rose',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/sprays-blanc.jpg',
    nom: 'produit-sprays-blanc',
    largeurs: [360, 400],
    qualite: 82,
  },
  {
    source: 'produits/sprays-orange.jpeg',
    nom: 'produit-sprays-orange',
    largeurs: [320, 387],
    qualite: 82,
  },
  {
    source: 'produits/sprays-rouge.jpeg',
    nom: 'produit-sprays-rouge',
    largeurs: [320, 387],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-vide.jpeg',
    nom: 'produit-cache-pot-vide',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-gris-ondule.jpeg',
    nom: 'produit-cache-pot-gris-ondule',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-gris-arrondi.jpeg',
    nom: 'produit-cache-pot-gris-arrondi',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-blanc-mouchete.jpeg',
    nom: 'produit-cache-pot-blanc-mouchete',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-beige-arrondi.jpeg',
    nom: 'produit-cache-pot-beige-arrondi',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-blanc-haut.jpeg',
    nom: 'produit-cache-pot-blanc-haut',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-noir-haut.jpeg',
    nom: 'produit-cache-pot-noir-haut',
    largeurs: [480, 848],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-vert-haut.jpeg',
    nom: 'produit-cache-pot-vert-haut',
    largeurs: [480, 716],
    qualite: 82,
  },
  {
    source: 'produits/cache-pot-bleu-haut.jpeg',
    nom: 'produit-cache-pot-bleu-haut',
    largeurs: [480, 844],
    qualite: 82,
  },
  {
    source: 'produits/petits-vases-decoratifs.jpeg',
    nom: 'produit-petits-vases-decoratifs',
    largeurs: [360, 608],
    qualite: 82,
  },
  {
    source: 'produits/vases-sablier-colores.jpeg',
    nom: 'produit-vases-sablier-colores',
    largeurs: [360, 608],
    qualite: 82,
  },
  {
    source: 'produits/vases-bouteille-colores.jpeg',
    nom: 'produit-vases-bouteille-colores',
    largeurs: [360, 608],
    qualite: 82,
  },
  {
    source: 'produits/vases-gris-torsades.jpeg',
    nom: 'produit-vases-gris-torsades',
    largeurs: [360, 608],
    qualite: 82,
  },
  {
    source: 'produits/vases-cylindriques-transparents.jpeg',
    nom: 'produit-vases-cylindriques-transparents',
    largeurs: [360, 556],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-roses-a-partir.png',
    nom: 'produit-bouquet-roses-a-partir',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/langue-de-belle-mere.jpeg',
    nom: 'produit-langue-de-belle-mere',
    largeurs: [480, 714],
    qualite: 82,
  },
  {
    source: 'produits/panier-ramadan.jpeg',
    nom: 'produit-panier-ramadan',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/gerbe-funebre-artificielle.jpeg',
    nom: 'produit-gerbe-funebre-artificielle',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/jatropha.jpeg',
    nom: 'produit-jatropha',
    largeurs: [480, 836],
    qualite: 82,
  },
  {
    source: 'produits/pachira-arbre-argent.jpeg',
    nom: 'produit-pachira-arbre-argent',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/terrarium.jpeg',
    nom: 'produit-terrarium',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/dieffenbachia.jpeg',
    nom: 'produit-dieffenbachia',
    largeurs: [480, 1080],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-roses-colorees.jpeg',
    nom: 'produit-bouquet-roses-colorees',
    largeurs: [480, 830],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-seoul.jpeg',
    nom: 'produit-bouquet-seoul',
    largeurs: [480, 984],
    qualite: 82,
  },
  {
    source: 'produits/langue-de-belle-mere-cache-pot.jpeg',
    nom: 'produit-langue-de-belle-mere-cache-pot',
    largeurs: [360, 464],
    qualite: 82,
  },
  {
    source: 'produits/aglaonema.jpeg',
    nom: 'produit-aglaonema',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-dauphine-miss-guinee.jpeg',
    nom: 'produit-bouquet-dauphine-miss-guinee',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/plante-crayon-euphorbia-tirucalli.png',
    nom: 'produit-plante-crayon-euphorbia-tirucalli',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-mariee.png',
    nom: 'produit-bouquet-mariee',
    largeurs: [480, 720],
    qualite: 82,
  },
  {
    source: 'produits/decoration-bouteille-evenementielle.jpeg',
    nom: 'produit-decoration-bouteille-evenementielle',
    largeurs: [360, 498],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-accueil.png',
    nom: 'produit-bouquet-accueil',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-de-fleurs-colorees.jpeg',
    nom: 'produit-bouquet-de-fleurs-colorees',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-de-fleurs-jaune-blanc.png',
    nom: 'produit-bouquet-de-fleurs-jaune-blanc',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-romantique.png',
    nom: 'produit-bouquet-romantique',
    largeurs: [480, 960],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-argent.jpeg',
    nom: 'produit-bouquet-argent',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-de-fleurs-avec-peluche.jpeg',
    nom: 'produit-bouquet-de-fleurs-avec-peluche',
    largeurs: [480, 794],
    qualite: 82,
  },
  {
    source: 'produits/bouquet-de-mariee-artificiel.jpeg',
    nom: 'produit-bouquet-de-mariee-artificiel',
    largeurs: [480, 810],
    qualite: 82,
  },
  {
    source: 'produits/peluche-lama.jpeg',
    nom: 'produit-peluche-lama',
    largeurs: [480, 606],
    qualite: 82,
  },
  {
    source: 'produits/luminaire-plafonnier-anneaux-led.jpg',
    nom: 'produit-luminaire-plafonnier-anneaux-led',
    largeurs: [480, 842],
    qualite: 82,
  },
  {
    source: 'produits/luminaire-suspension-verre-ambre.jpeg',
    nom: 'produit-luminaire-suspension-verre-ambre',
    largeurs: [480, 681],
    qualite: 82,
  },
  {
    source: 'produits/luminaire-suspension-triple-verre.jpeg',
    nom: 'produit-luminaire-suspension-triple-verre',
    largeurs: [360, 447],
    qualite: 82,
  },
  {
    source: 'produits/luminaire-lustre-cinq-branches.jpg',
    nom: 'produit-luminaire-lustre-cinq-branches',
    largeurs: [480, 600],
    qualite: 82,
  },
  {
    source: 'produits/luminaire-suspension-industrielle.jpeg',
    nom: 'produit-luminaire-suspension-industrielle',
    largeurs: [480, 543],
    qualite: 82,
  },
  {
    source: 'produits/peluche-ours-blanc.jpeg',
    nom: 'produit-peluche-ours-blanc',
    largeurs: [480, 608],
    qualite: 82,
  },
  {
    source: 'produits/peluche-ours-brun.jpeg',
    nom: 'produit-peluche-ours-brun',
    largeurs: [480, 608],
    qualite: 82,
  },
  {
    source: 'produits/peluche-ours-rouge.jpeg',
    nom: 'produit-peluche-ours-rouge',
    largeurs: [480, 608],
    qualite: 82,
  },
  {
    source: 'produits/peluche-ours-coeur.jpeg',
    nom: 'produit-peluche-ours-coeur',
    largeurs: [480, 608],
    qualite: 82,
  },
  {
    source: 'produits/peluche-violette.jpeg',
    nom: 'produit-peluche-violette',
    largeurs: [480, 1080],
    qualite: 82,
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
