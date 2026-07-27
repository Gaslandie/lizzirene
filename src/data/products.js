import { PHOTOS } from '../config.js'

// Catalogue de la boutique. Prix en GNF (nombres bruts, formatés à l'affichage).
// `price: null` = article sur devis : le client passe par WhatsApp.
// À terme ces données viendront de l'API NestJS / MongoDB.
export const CATEGORIES = [
  { id: 'tous', label: 'Tout voir' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'compositions', label: 'Compositions & terrariums' },
  { id: 'coffrets', label: 'Box cadeaux' },
  { id: 'plantes', label: 'Plantes & déco' },
]

export const PRODUCTS = [
  {
    id: 'bouquet-fraicheur',
    name: 'Bouquet Fraîcheur',
    category: 'bouquets',
    price: 300000,
    tag: 'Best-seller',
    src: PHOTOS.bouquet,
    alt: 'Bouquet de roses rouges, gerbera blanc et gypsophile',
    desc: 'Roses fraîches, gerbera et gypsophile, emballage blanc et or.',
  },
  {
    id: 'bouquet-grand-amour',
    name: 'Bouquet Grand Amour',
    category: 'bouquets',
    price: 500000,
    tag: 'Romantique',
    variant: 'teal',
    desc: 'Un bouquet plus généreux pour les grandes déclarations.',
  },
  {
    id: 'bouquet-prestige',
    name: 'Bouquet Prestige',
    category: 'bouquets',
    price: 800000,
    tag: 'Premium',
    variant: 'slate',
    desc: 'Notre plus belle composition, pour marquer les grands moments.',
  },
  {
    id: 'pot-forever',
    name: 'Composition en pot « Forever »',
    category: 'compositions',
    price: 500000,
    tag: 'Coup de cœur',
    src: PHOTOS.vedette,
    alt: 'Composition florale en pot noir avec ruban jaune',
    desc: 'Composition généreuse dans son pot noir, nouée d’un ruban satin.',
  },
  {
    id: 'terrarium-boule-lagon',
    name: 'Terrarium « Boule Lagon » Ø 20 cm',
    category: 'compositions',
    price: null,
    tag: 'Fait main · Pièce unique',
    variant: 'soft',
    desc: 'Parfait pour un bureau, une table basse, un restaurant ou un cadeau premium.',
  },
  {
    id: 'box-romantique',
    name: 'Box cadeau romantique',
    category: 'coffrets',
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
    category: 'coffrets',
    price: null,
    tag: 'Packaging',
    variant: 'teal',
    desc: 'Votre cadeau emballé avec soin : papier, ruban et carte manuscrite.',
  },
]
