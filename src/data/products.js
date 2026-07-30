import { PHOTOS } from '../config.js'

// Catalogue de la boutique. Prix en GNF (nombres bruts, formatés à l'affichage).
// `price: null` = article sur devis : le client passe par WhatsApp.
// `prixProvisoire: true` = montant indicatif à confirmer avec la cliente.
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
    id: 'cache-pots',
    label: 'Cache-pots',
    categories: ['cache-pots'],
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
    id: 'poussa',
    name: 'Poussa',
    category: 'fleurs-naturelles',
    price: 500000,
    prixProvisoire: true,
    tag: 'Bouquet du catalogue',
    variant: 'slate',
    desc: 'Dôme serré de roses rouges présenté dans un contenant noir.',
  },
  {
    id: 'simoda',
    name: 'Simoda',
    category: 'fleurs-naturelles',
    price: 300000,
    prixProvisoire: true,
    tag: 'Bouquet du catalogue',
    variant: 'soft',
    desc: 'Bouquet de roses rouges et de petites fleurs blanches, enveloppé de papier bordeaux bordé d’or.',
  },
  {
    id: 'lill-skate',
    name: 'Lill Skate',
    category: 'fleurs-naturelles',
    price: 500000,
    prixProvisoire: true,
    tag: 'Bouquet du catalogue',
    variant: 'teal',
    desc: 'Composition de fleurs turquoise et blanches, accompagnée d’un petit ours blanc et enveloppée de papier bleu clair.',
  },
  {
    id: 'miss-fati',
    name: 'Miss Fati',
    category: 'fleurs-naturelles',
    price: 300000,
    prixProvisoire: true,
    tag: 'Bouquet du catalogue',
    variant: 'soft',
    desc: 'Bouquet de roses rouges présenté dans un emballage blanc imprimé et noué d’un ruban bordeaux.',
  },
  {
    id: 'composition-fleurs-artificielles',
    name: 'Compositions florales artificielles',
    category: 'fleurs-artificielles',
    price: null,
    tag: 'Sur mesure',
    ...PHOTOS.vedette,
    alt: 'Composition florale artificielle dans un pot noir avec ruban jaune',
    desc: 'Compositions durables réalisées sur mesure selon vos couleurs, votre espace et votre occasion.',
  },
  {
    id: 'carino',
    name: 'Carino',
    category: 'box-cadeaux',
    price: 500000,
    prixProvisoire: true,
    tag: 'Création cadeau',
    variant: 'teal',
    desc: 'Composition cadeau enveloppée de cellophane transparent et ornée de rubans colorés.',
  },
  {
    id: 'la-vida',
    name: 'La vida',
    category: 'box-cadeaux',
    price: 800000,
    prixProvisoire: true,
    tag: 'Création cadeau',
    variant: 'soft',
    desc: 'Ensemble cadeau réunissant un ours en peluche blanc, une rose rouge et plusieurs articles emballés.',
  },
  {
    id: 'maritou',
    name: 'Maritou',
    category: 'box-cadeaux',
    price: 500000,
    prixProvisoire: true,
    tag: 'Création cadeau',
    ...PHOTOS.paquetEmballe,
    alt: 'Coffret Maritou en forme de cœur fermé par un ruban rouge',
    desc: 'Coffret rose en forme de cœur, fermé par un large ruban rouge.',
  },
  {
    id: 'choco-coeur',
    name: 'Choco Coeur',
    category: 'box-cadeaux',
    price: 800000,
    prixProvisoire: true,
    tag: 'Création cadeau',
    variant: 'sun',
    desc: 'Composition en forme de cœur associant des chocolats emballés et des roses rouges, sous cellophane.',
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
    id: 'selection-materiel-decoratif',
    name: 'Matériel décoratif',
    category: 'materiel-decoratif',
    price: null,
    tag: 'Sur devis',
    variant: 'teal',
    desc: 'Sélection de matériel pour vos décors, installations et mises en scène personnalisées.',
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
    id: 'cache-pots-selection',
    name: 'Cache-pots',
    category: 'cache-pots',
    price: null,
    tag: 'Sur devis',
    variant: 'soft',
    desc: 'Cache-pots décoratifs pour habiller vos plantes d’intérieur — matières, tailles et coloris variés.',
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
