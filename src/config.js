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
  palmierCuillere: responsivePhoto({
    nom: 'produit-palmier-cuillere',
    largeurs: [480, 720],
    alt: 'Palmier cuillère en pot',
    width: 720,
    height: 953,
  }),
  centreTableAllonge: responsivePhoto({
    nom: 'produit-centre-de-table-allonge',
    largeurs: [480, 960],
    alt: 'Centre de table allongé avec composition florale',
    width: 960,
    height: 720,
  }),
  centreTableHauteur: responsivePhoto({
    nom: 'produit-centre-de-table-en-hauteur',
    largeurs: [480, 607],
    alt: 'Centre de table en hauteur avec composition florale',
    width: 607,
    height: 1080,
  }),
  bambou: responsivePhoto({
    nom: 'produit-bambou',
    largeurs: [480, 720],
    alt: 'Bambou décoratif en pot',
    width: 720,
    height: 980,
  }),
  bouquetRosesNaturelles: responsivePhoto({
    nom: 'produit-bouquet-roses-naturelles',
    largeurs: [480, 720],
    alt: 'Bouquet de roses naturelles',
    width: 720,
    height: 800,
  }),
  chrysanthemeBlanc: responsivePhoto({
    nom: 'produit-chrysantheme-blanc',
    largeurs: [480, 800],
    alt: 'Chrysanthème blanc',
    width: 800,
    height: 800,
  }),
  chrysanthemeBicolore: responsivePhoto({
    nom: 'produit-chrysantheme-bicolore',
    largeurs: [480, 600],
    alt: 'Chrysanthème bicolore',
    width: 600,
    height: 600,
  }),
  chrysanthemeViolet: responsivePhoto({
    nom: 'produit-chrysantheme-violet',
    largeurs: [360, 460],
    alt: 'Chrysanthème violet',
    width: 460,
    height: 460,
  }),
  hortensiaBlanc: responsivePhoto({
    nom: 'produit-hortensia-blanc',
    largeurs: [360, 447],
    alt: 'Hortensia blanc',
    width: 447,
    height: 447,
  }),
  hortensiaFuchsia: responsivePhoto({
    nom: 'produit-hortensia-fuchsia',
    largeurs: [480, 960],
    alt: 'Hortensia fuchsia',
    width: 1536,
    height: 2048,
  }),
  hortensiaVert: responsivePhoto({
    nom: 'produit-hortensia-vert',
    largeurs: [480, 1000],
    alt: 'Hortensia vert',
    width: 1000,
    height: 1000,
  }),
  lysOrientalBlanc: responsivePhoto({
    nom: 'produit-lys-oriental-blanc',
    largeurs: [320, 388],
    alt: 'Lys oriental blanc',
    width: 388,
    height: 515,
  }),
  lysOrientalRose: responsivePhoto({
    nom: 'produit-lys-oriental-rose',
    largeurs: [360, 447],
    alt: 'Lys oriental rose',
    width: 447,
    height: 447,
  }),
  lysAsiatiqueBlanc: responsivePhoto({
    nom: 'produit-lys-asiatique-blanc',
    largeurs: [480, 554],
    alt: 'Lys asiatique blanc',
    width: 554,
    height: 554,
  }),
  lysAsiatiqueOrange: responsivePhoto({
    nom: 'produit-lys-asiatique-orange',
    largeurs: [480, 554],
    alt: 'Lys asiatique orange',
    width: 554,
    height: 554,
  }),
  lysAsiatiqueRouge: responsivePhoto({
    nom: 'produit-lys-asiatique-rouge',
    largeurs: [360, 450],
    alt: 'Lys asiatique rouge',
    width: 450,
    height: 600,
  }),
  roseBlanche: responsivePhoto({
    nom: 'produit-rose-blanche',
    largeurs: [480, 678],
    alt: 'Rose blanche',
    width: 678,
    height: 452,
  }),
  roseJaune: responsivePhoto({
    nom: 'produit-rose-jaune',
    largeurs: [480, 600],
    alt: 'Rose jaune',
    width: 600,
    height: 600,
  }),
  roseOrange: responsivePhoto({
    nom: 'produit-rose-orange',
    largeurs: [480, 591],
    alt: 'Rose orange',
    width: 591,
    height: 519,
  }),
  roseRouge: responsivePhoto({
    nom: 'produit-rose-rouge',
    largeurs: [480, 554],
    alt: 'Rose rouge',
    width: 554,
    height: 554,
  }),
  roseRose: responsivePhoto({
    nom: 'produit-rose-rose',
    largeurs: [480, 960],
    alt: 'Rose rose',
    width: 1160,
    height: 670,
  }),
  spraysBlanc: responsivePhoto({
    nom: 'produit-sprays-blanc',
    largeurs: [360, 400],
    alt: 'Sprays blancs',
    width: 400,
    height: 533,
  }),
  spraysOrange: responsivePhoto({
    nom: 'produit-sprays-orange',
    largeurs: [320, 387],
    alt: 'Sprays orange',
    width: 387,
    height: 516,
  }),
  spraysRouge: responsivePhoto({
    nom: 'produit-sprays-rouge',
    largeurs: [320, 387],
    alt: 'Sprays rouges',
    width: 387,
    height: 516,
  }),
  cachePotVide: responsivePhoto({
    nom: 'produit-cache-pot-vide',
    largeurs: [480, 720],
    alt: 'Cache-pot vide décoratif',
    width: 720,
    height: 960,
  }),
  bouquetRosesAPartir: responsivePhoto({
    nom: 'produit-bouquet-roses-a-partir',
    largeurs: [480, 720],
    alt: 'Bouquet de roses naturelles',
    width: 720,
    height: 960,
  }),
  langueDeBelleMere: responsivePhoto({
    nom: 'produit-langue-de-belle-mere',
    largeurs: [480, 714],
    alt: 'Langue de belle-mère en pot',
    width: 714,
    height: 1280,
  }),
  panierRamadan: responsivePhoto({
    nom: 'produit-panier-ramadan',
    largeurs: [480, 720],
    alt: 'Panier Ramadan garni',
    width: 720,
    height: 782,
  }),
  gerbeFunebreArtificielle: responsivePhoto({
    nom: 'produit-gerbe-funebre-artificielle',
    largeurs: [480, 810],
    alt: 'Gerbe funèbre artificielle',
    width: 810,
    height: 1080,
  }),
  jatropha: responsivePhoto({
    nom: 'produit-jatropha',
    largeurs: [480, 836],
    alt: 'Jatropha en pot',
    width: 836,
    height: 1280,
  }),
  pachiraArbreArgent: responsivePhoto({
    nom: 'produit-pachira-arbre-argent',
    largeurs: [480, 810],
    alt: 'Pachira, arbre à argent en pot',
    width: 810,
    height: 1080,
  }),
  terrarium: responsivePhoto({
    nom: 'produit-terrarium',
    largeurs: [480, 720],
    alt: 'Terrarium décoratif',
    width: 720,
    height: 1280,
  }),
  dieffenbachia: responsivePhoto({
    nom: 'produit-dieffenbachia',
    largeurs: [480, 1080],
    alt: 'Dieffenbachia en pot',
    width: 1080,
    height: 970,
  }),
  bouquetRosesColorees: responsivePhoto({
    nom: 'produit-bouquet-roses-colorees',
    largeurs: [480, 830],
    alt: 'Bouquet de roses colorées',
    width: 830,
    height: 1080,
  }),
  bouquetSeoul: responsivePhoto({
    nom: 'produit-bouquet-seoul',
    largeurs: [480, 984],
    alt: 'Bouquet Séoul avec roses jaunes et rouges',
    width: 984,
    height: 1280,
  }),
  langueDeBelleMereCachePot: responsivePhoto({
    nom: 'produit-langue-de-belle-mere-cache-pot',
    largeurs: [360, 464],
    alt: 'Langue de belle-mère avec cache-pot blanc',
    width: 464,
    height: 1080,
  }),
  aglaonema: responsivePhoto({
    nom: 'produit-aglaonema',
    largeurs: [480, 960],
    alt: 'Aglaonema en pot',
    width: 960,
    height: 1280,
  }),
  bouquetDauphineMissGuinee: responsivePhoto({
    nom: 'produit-bouquet-dauphine-miss-guinee',
    largeurs: [480, 810],
    alt: 'Bouquet Dauphine Miss Guinée',
    width: 810,
    height: 1080,
  }),
  decorationChambreRomantique: responsivePhoto({
    nom: 'produit-decoration-chambre-romantique',
    largeurs: [480, 810],
    alt: 'Décoration de chambre romantique avec ballons rouges',
    width: 810,
    height: 1080,
  }),
  planteCrayonEuphorbia: responsivePhoto({
    nom: 'produit-plante-crayon-euphorbia-tirucalli',
    largeurs: [480, 960],
    alt: 'Plante crayon Euphorbia tirucalli en pot',
    width: 960,
    height: 1079,
  }),
  bouquetMariee: responsivePhoto({
    nom: 'produit-bouquet-mariee',
    largeurs: [480, 720],
    alt: 'Bouquet de mariée rose et blanc',
    width: 720,
    height: 1080,
  }),
  decorationBouteilleEvenementielle: responsivePhoto({
    nom: 'produit-decoration-bouteille-evenementielle',
    largeurs: [360, 498],
    alt: 'Décoration de bouteille événementielle avec fleurs et roses',
    width: 498,
    height: 1080,
  }),
  bouquetAccueil: responsivePhoto({
    nom: 'produit-bouquet-accueil',
    largeurs: [480, 960],
    alt: 'Bouquet d’accueil aux roses colorées',
    width: 960,
    height: 720,
  }),
  bouquetDeFleursColorees: responsivePhoto({
    nom: 'produit-bouquet-de-fleurs-colorees',
    largeurs: [480, 810],
    alt: 'Bouquet de fleurs colorées aux tons rose, jaune et orange',
    width: 810,
    height: 1080,
  }),
  bouquetDeFleursJauneBlanc: responsivePhoto({
    nom: 'produit-bouquet-de-fleurs-jaune-blanc',
    largeurs: [480, 810],
    alt: 'Bouquet de fleurs jaune et blanc',
    width: 810,
    height: 1080,
  }),
  bouquetRomantique: responsivePhoto({
    nom: 'produit-bouquet-romantique',
    largeurs: [480, 960],
    alt: 'Bouquet romantique rouge présenté en chambre',
    width: 960,
    height: 639,
  }),
  bouquetArgent: responsivePhoto({
    nom: 'produit-bouquet-argent',
    largeurs: [480, 810],
    alt: 'Bouquet d’argent avec roses rouges',
    width: 810,
    height: 1080,
  }),
  bouquetDeFleursAvecPeluche: responsivePhoto({
    nom: 'produit-bouquet-de-fleurs-avec-peluche',
    largeurs: [480, 794],
    alt: 'Bouquet de fleurs avec petite peluche',
    width: 794,
    height: 1080,
  }),
  bouquetDeMarieeArtificiel: responsivePhoto({
    nom: 'produit-bouquet-de-mariee-artificiel',
    largeurs: [480, 810],
    alt: 'Bouquet de mariée artificiel blanc',
    width: 810,
    height: 1080,
  }),
  pelucheViolette: responsivePhoto({
    nom: 'produit-peluche-violette',
    largeurs: [480, 1080],
    alt: 'Grande peluche violette avec rose rouge',
    width: 1080,
    height: 1026,
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
  evenements: responsivePhoto({
    nom: 'service-celebrations',
    largeurs: [480, 800, 1280],
    alt: 'Décoration florale d’événement avec table festive',
    width: 1280,
    height: 853,
    sizes:
      '(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 25vw',
  }),
  hommages: responsivePhoto({
    nom: 'service-attentions-hommages',
    largeurs: [480, 800, 1280],
    alt: 'Composition sobre pour un hommage floral',
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
