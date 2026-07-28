import { PHOTOS } from '../config.js'

// Catalogue de la boutique. Prix en GNF (nombres bruts, formatés à l'affichage).
// `price: null` = article sur devis : le client passe par WhatsApp.
// À terme ces données viendront de l'API NestJS / MongoDB.
export const SOUS_CATEGORIES_FLEURS = [
  { id: 'fleurs-naturelles', label: 'Fleurs naturelles' },
  { id: 'fleurs-artificielles', label: 'Fleurs artificielles' },
]

// Familles visibles dans la navigation et dans les filtres du catalogue.
// « Fleurs » agrège les deux catégories précises conservées sur les produits.
export const FAMILLES = [
  {
    id: 'fleurs',
    label: 'Fleurs',
    categories: SOUS_CATEGORIES_FLEURS.map((categorie) => categorie.id),
  },
  { id: 'plantes', label: 'Plantes', categories: ['plantes'] },
  { id: 'vases', label: 'Vases', categories: ['vases'] },
  { id: 'peluches', label: 'Peluches', categories: ['peluches'] },
  { id: 'box-cadeaux', label: 'Box cadeaux', categories: ['box-cadeaux'] },
  { id: 'tableaux', label: 'Tableaux', categories: ['tableaux'] },
  {
    id: 'materiel-decoratif',
    label: 'Matériel décoratif',
    categories: ['materiel-decoratif'],
  },
  {
    id: 'luminaire',
    label: 'Luminaire professionnel',
    categories: ['luminaire'],
  },
  {
    id: 'caches-postes',
    label: 'Caches postes',
    categories: ['caches-postes'],
  },
]

export const CATEGORIES = [{ id: 'tous', label: 'Tout voir' }, ...FAMILLES]

export const LIBELLES_CATEGORIES_PRODUITS = Object.fromEntries([
  ...SOUS_CATEGORIES_FLEURS.map(({ id, label }) => [id, label]),
  ...FAMILLES.filter(({ id }) => id !== 'fleurs').map(({ id, label }) => [
    id,
    label,
  ]),
])

const IDS_FAMILLES = new Set(CATEGORIES.map(({ id }) => id))
const IDS_FLEURS = new Set(SOUS_CATEGORIES_FLEURS.map(({ id }) => id))

export const normaliserCategorie = (id) => {
  if (IDS_FLEURS.has(id)) return 'fleurs'
  return IDS_FAMILLES.has(id) ? id : 'tous'
}

export const categoriesProduitPour = (id) => {
  const categorie = normaliserCategorie(id)
  if (categorie === 'tous') return null
  return FAMILLES.find((famille) => famille.id === categorie)?.categories || []
}

export const PRODUCTS = [
  {
    id: 'bouquet-fraicheur',
    name: 'Bouquet Fraîcheur',
    category: 'fleurs-naturelles',
    price: 300000,
    tag: 'Best-seller',
    src: PHOTOS.bouquet,
    alt: 'Bouquet de roses rouges, gerbera blanc et gypsophile',
    desc: 'Roses fraîches, gerbera et gypsophile, emballage blanc et or.',
  },
  {
    id: 'bouquet-grand-amour',
    name: 'Bouquet Grand Amour',
    category: 'fleurs-naturelles',
    price: 500000,
    tag: 'Romantique',
    variant: 'teal',
    desc: 'Un bouquet plus généreux pour les grandes déclarations.',
  },
  {
    id: 'bouquet-prestige',
    name: 'Bouquet Prestige',
    category: 'fleurs-naturelles',
    price: 800000,
    tag: 'Premium',
    variant: 'slate',
    desc: 'Notre plus belle composition, pour marquer les grands moments.',
  },
  {
    id: 'pot-forever',
    name: 'Composition en pot « Forever »',
    category: 'fleurs-artificielles',
    price: 500000,
    tag: 'Coup de cœur',
    src: PHOTOS.vedette,
    alt: 'Composition florale en pot noir avec ruban jaune',
    desc: 'Composition généreuse dans son pot noir, nouée d’un ruban satin.',
  },
  {
    id: 'terrarium-boule-lagon',
    name: 'Terrarium « Boule Lagon » Ø 20 cm',
    category: 'plantes',
    price: null,
    tag: 'Fait main · Pièce unique',
    variant: 'soft',
    desc: 'Parfait pour un bureau, une table basse, un restaurant ou un cadeau premium.',
  },
  {
    id: 'box-romantique',
    name: 'Box cadeau romantique',
    category: 'box-cadeaux',
    price: null,
    tag: 'Sur mesure',
    variant: 'sun',
    desc: 'Soins, chocolats, peluches et surprises romantiques réunis dans un coffret.',
  },
  {
    id: 'plantes-interieur',
    name: 'Plantes vertes d’intérieur',
    category: 'plantes',
    price: null,
    tag: 'Boutique',
    variant: 'slate',
    desc: 'Une sélection de jolies plantes pour habiller la maison ou le bureau.',
  },
  {
    id: 'packaging-premium',
    name: 'Emballage cadeau premium',
    category: 'materiel-decoratif',
    price: null,
    tag: 'Packaging',
    variant: 'teal',
    desc: 'Votre cadeau emballé avec soin : papier, ruban et carte manuscrite.',
  },
  {
    id: 'selection-vases',
    name: 'Sélection de vases',
    category: 'vases',
    price: null,
    tag: 'Sur commande',
    variant: 'soft',
    desc: 'Vases décoratifs pour bouquets, tables, bureaux et compositions personnalisées.',
  },
  {
    id: 'peluches-cadeaux',
    name: 'Peluches cadeaux',
    category: 'peluches',
    price: null,
    tag: 'Catalogue',
    variant: 'sun',
    desc: 'Peluches à associer à une box, un bouquet ou une surprise romantique.',
  },
  {
    id: 'tableaux-deco',
    name: 'Tableaux décoratifs',
    category: 'tableaux',
    price: null,
    tag: 'Sur devis',
    variant: 'slate',
    desc: 'Tableaux et pièces murales pour habiller un intérieur, une vitrine ou un espace événementiel.',
  },
  {
    id: 'luminaire-pro',
    name: 'Luminaire professionnel',
    category: 'luminaire',
    price: null,
    tag: 'Professionnel',
    variant: 'teal',
    desc: 'Solutions lumineuses pour boutiques, stands, cérémonies et décors professionnels.',
  },
  {
    id: 'caches-postes-selection',
    name: 'Caches postes',
    category: 'caches-postes',
    price: null,
    tag: 'Sur devis',
    variant: 'soft',
    desc: 'Housses décoratives pour protéger et habiller les postes TV avec élégance.',
  },
]

export const trouverProduit = (id) =>
  PRODUCTS.find((produit) => produit.id === id)

export const produitsPourCategorie = (id) => {
  const categories = categoriesProduitPour(id)
  return categories
    ? PRODUCTS.filter((produit) => categories.includes(produit.category))
    : PRODUCTS
}
