// Coordonnées officielles de la boutique — un seul endroit à modifier.
export const CONTACT = {
  tagline: 'Des fleurs pour chaque émotion',
  heroTitle: "L'amour se dit en fleur et chaque fleur a une histoire ...",
  founder: 'Irma',
  phone: '+224 610 81 17 17',
  phoneDisplay: '610 81 17 17',
  whatsapp: '224664327554',
  whatsappDisplay: '664 32 75 54',
  email: 'lizzirenedeco@gmail.com',
  instagram: '@lizzirenedeco',
  instagramUrl: 'https://instagram.com/lizzirenedeco',
  city: 'Conakry, Guinée',
  address: 'Kipé, Conakry — Guinée II',
  addressDetail:
    "À 50 m de l'école française, rue non bitumée, en face du collège Koffi Annan",
  hours: ['Lun – Sam : 8h30 – 21h30', 'Dim : 10h – 18h'],
}

// Variantes optimisées générées dans /public/optimized depuis /image-sources.
// `BASE_URL` préfixe le chemin quand le site est servi depuis un
// sous-dossier (GitHub Pages) — ne jamais écrire les chemins en dur.
const asset = (fichier) => `${import.meta.env.BASE_URL}${fichier}`

const responsivePhoto = ({
  nom,
  largeurs,
  alt,
  width,
  height,
  sizes = '(max-width: 720px) calc(100vw - 40px), (max-width: 900px) 50vw, 25vw',
}) => ({
  src: asset(`optimized/${nom}-${largeurs.at(-1)}.webp`),
  srcSet: largeurs
    .map((largeur) => `${asset(`optimized/${nom}-${largeur}.webp`)} ${largeur}w`)
    .join(', '),
  sizes,
  alt,
  width,
  height,
})

export const PHOTOS = {
  logo: {
    src: asset('optimized/logo-160.webp'),
    alt: 'Logo Lizzirene Déco',
    width: 160,
    height: 160,
  },
  vedette: responsivePhoto({
    nom: 'photo-vedette',
    largeurs: [480, 960],
    alt: 'Composition florale Lizzirene Déco dans un pot noir avec ruban jaune',
    width: 960,
    height: 1280,
  }),
  bouquet: responsivePhoto({
    nom: 'bouquet-fleurs',
    largeurs: [480, 720],
    alt: 'Bouquet de roses rouges, gerbera blanc et gypsophile',
    width: 720,
    height: 1280,
  }),
  paquetEmballe: responsivePhoto({
    nom: 'paquet-emballe',
    largeurs: [480, 810],
    alt: 'Coffret cadeau en forme de cœur noué avec un ruban rouge',
    width: 810,
    height: 1080,
  }),
  fleursFraiches: responsivePhoto({
    nom: 'fleurs-fraiches',
    largeurs: [640, 1200],
    alt: 'Roses fraîches orange et roses couvertes de gouttes d’eau',
    width: 1200,
    height: 900,
  }),
  decoFlorale: responsivePhoto({
    nom: 'deco-floral',
    largeurs: [640, 1200],
    alt: 'Composition florale colorée dans un panier en osier',
    width: 1200,
    height: 799,
  }),
}

export const HERO_IMAGES = [
  {
    src: asset('optimized/hero-image3-1920.webp'),
    mobileSrc: asset('optimized/hero-image3-mobile.webp'),
    label: 'Ambiance florale lumineuse',
    position: 'center center',
  },
  {
    src: asset('optimized/hero-image1-1920.webp'),
    mobileSrc: asset('optimized/hero-image1-mobile.webp'),
    label: 'Compositions florales colorées',
    position: 'center center',
  },
  {
    src: asset('optimized/hero-image2-1080.webp'),
    mobileSrc: asset('optimized/hero-image2-mobile.webp'),
    label: 'Sélection de fleurs et cadeaux',
    position: 'center center',
  },
]

// Communes et quartiers de Conakry proposés à la livraison.
export const ZONES = ['Kaloum', 'Dixinn', 'Matam', 'Ratoma', 'Matoto', 'Autre']

export const waLink = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`

// 350000 → "350 000 GNF"
export const formatPrice = (value) =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} GNF`
