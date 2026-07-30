// Coordonnées officielles de la boutique — un seul endroit à modifier.
export const CONTACT = {
  tagline: 'Des fleurs pour chaque émotion',
  heroTitle: "L'amour se dit en fleur et chaque fleur a une histoire ...",
  // Forme d'usage, celle de l'enseigne « by Irma » : boutons, messages,
  // métadonnées. Le nom complet ne sert qu'à la présentation de la fondatrice.
  founder: 'Irma',
  founderFullName: 'Sandouno Irene Mayer',
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
  fondatrice: responsivePhoto({
    nom: 'la-fondatrice',
    largeurs: [480, 810],
    alt: 'Sandouno Irene Mayer, fondatrice de Lizzirene Déco',
    width: 810,
    height: 1080,
  }),
  fondatriceBoutique: responsivePhoto({
    nom: 'fondatrice-boutique',
    largeurs: [480, 810],
    alt: 'Fondatrice de Lizzirene Déco entourée de fleurs en boutique',
    width: 810,
    height: 1080,
  }),
  comiteMissGuinee: responsivePhoto({
    nom: 'comite-miss-guinee',
    largeurs: [640, 1080],
    alt: 'Les lauréates de Miss Guinée 2025 avec leurs bouquets Lizzirene Déco',
    width: 1080,
    height: 864,
    sizes: '(max-width: 900px) calc(100vw - 40px), 620px',
  }),
  clienteComblee: responsivePhoto({
    nom: 'cliente-comblee',
    largeurs: [480, 960],
    alt: "Cliente émue à la réception d'un bouquet de roses et d'un coffret cadeau Lizzirene Déco",
    width: 960,
    height: 1280,
    sizes: '(max-width: 900px) calc(100vw - 40px), 480px',
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
  inspirationFlorale: responsivePhoto({
    nom: 'inspiration-florale',
    largeurs: [480, 810],
    alt: 'Inspiration florale Lizzirene Déco',
    width: 810,
    height: 1080,
  }),
}

export const SERVICE_THEME_PHOTOS = {
  decoration: responsivePhoto({
    nom: 'service-decoration-espaces',
    largeurs: [480, 800, 1280],
    alt: 'Intérieur décoré avec une composition florale et une ambiance élégante',
    width: 1280,
    height: 853,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  creations: responsivePhoto({
    nom: 'service-creations-florales',
    largeurs: [480, 800, 1280],
    alt: 'Création florale artisanale composée pour offrir',
    width: 1280,
    height: 919,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  celebrations: responsivePhoto({
    nom: 'service-celebrations',
    largeurs: [480, 800, 1280],
    alt: 'Décoration florale de célébration avec table festive',
    width: 1280,
    height: 853,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  attentions: responsivePhoto({
    nom: 'service-attentions-hommages',
    largeurs: [480, 800, 1280],
    alt: 'Bouquet doux pour une attention ou un hommage',
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  hommageCondoleances: responsivePhoto({
    nom: 'service-hommage-condoleances',
    largeurs: [480, 800, 1280],
    alt: 'Composition florale de deuil pour hommages et condoléances',
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  convalescence: responsivePhoto({
    nom: 'service-convalescence',
    largeurs: [480, 800, 1280],
    alt: 'Bouquet de convalescence pour souhaiter un prompt rétablissement',
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  naissance: responsivePhoto({
    nom: 'service-visite-naissance',
    largeurs: [480, 800, 1280],
    alt: 'Bouquet et douceurs pour féliciter de jeunes parents après une naissance',
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  anniversaire: responsivePhoto({
    nom: 'service-anniversaire',
    largeurs: [480, 800, 1280],
    alt: "Mise en scène florale pour célébrer un anniversaire",
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  remiseDiplome: responsivePhoto({
    nom: 'service-remise-diplome',
    largeurs: [480, 800, 1280],
    alt: 'Bouquet de félicitations pour une remise de diplôme',
    width: 1280,
    height: 720,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
}

// Photos de la section Événements de l'accueil : une par carte, jamais
// réutilisée ailleurs. Les cartes recadrent en 16/10, d'où des rapports
// d'origine différents sans conséquence.
const PHOTO_EVENEMENT = ({ nom, largeurs, alt, width, height }) =>
  responsivePhoto({
    nom,
    largeurs,
    alt,
    width,
    height,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 980px) 50vw, 33vw',
  })

export const PHOTOS_EVENEMENTS = {
  mariages: PHOTO_EVENEMENT({
    nom: 'prestation-mariage',
    largeurs: [480, 800, 1280],
    alt: 'Salle de réception de mariage dressée, tables fleuries et compositions pastel',
    width: 1280,
    height: 844,
  }),
  anniversaires: PHOTO_EVENEMENT({
    nom: 'prestation-anniversaire',
    largeurs: [480, 810],
    alt: "Bouquet d'anniversaire Lizzirene Déco : roses rouges, gypsophile, chocolats et coffret cadeau",
    width: 810,
    height: 1080,
  }),
  entreprises: PHOTO_EVENEMENT({
    nom: 'prestation-conseil-amenagement',
    largeurs: [480, 800, 1280],
    alt: 'Bureau aménagé avec des compositions florales blanches et des plantes vertes',
    width: 1280,
    height: 720,
  }),
}

export const HERO_IMAGES = [
  {
    src: asset('optimized/hero-nouveau-1672.webp'),
    mobileSrc: asset('optimized/hero-nouveau-mobile.webp'),
    label: 'Nouvelle ambiance florale Lizzirène Déco',
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
