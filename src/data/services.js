// Prestations de la boutique, regroupées en quatre thèmes pour tenir dans
// le sous-menu « Nos Services ». Une prestation = une carte sur /services.
import { SERVICE_THEME_PHOTOS } from '../config.js'

// Chaque thème reçoit une photo optimisée pour l'accueil. Sur la page services,
// seules les prestations qui correspondent vraiment aux images disponibles les
// utilisent ; les autres gardent un visuel provisoire jusqu'aux prochaines photos.
export const THEMES = [
  { id: 'tous', label: 'Tous nos services' },
  {
    id: 'decoration',
    label: 'Décoration & espaces',
    photo: SERVICE_THEME_PHOTOS.decoration,
    intro:
      'Nous habillons vos lieux de vie et de travail, du salon à la salle de conférence.',
  },
  {
    id: 'creations',
    label: 'Créations florales',
    photo: SERVICE_THEME_PHOTOS.creations,
    intro:
      'Bouquets, coffrets et attentions composés à la main, selon votre occasion et votre budget.',
  },
  {
    id: 'celebrations',
    label: 'Célébrations',
    photo: SERVICE_THEME_PHOTOS.celebrations,
    intro:
      'Mariages, baptêmes, anniversaires : nous mettons vos grands jours en fleurs.',
  },
  {
    id: 'attentions',
    label: 'Attentions & hommages',
    photo: SERVICE_THEME_PHOTOS.attentions,
    intro:
      'Les moments qui comptent méritent un geste juste — une naissance, un rétablissement, un adieu.',
  },
]

// Le sous-menu ne montre pas « Tous nos services » comme un thème :
// il a son propre lien en tête de panneau.
export const FAMILLES_SERVICES = THEMES.filter((theme) => theme.id !== 'tous')

const IDS_THEMES = new Set(THEMES.map((theme) => theme.id))

export const normaliserTheme = (id) => (IDS_THEMES.has(id) ? id : 'tous')

const SERVICES_BASE = [
  // ---- Décoration & espaces ----
  {
    id: 'decoration-interieur',
    theme: 'decoration',
    icon: 'maison',
    name: "Décoration d'intérieur",
    desc: 'Conseil, aménagement et mise en fleurs de votre salon, chambre ou boutique — pour un intérieur qui vous ressemble.',
    image: 'services/decoration-interieur.jpg',
  },
  {
    id: 'salle-conference',
    theme: 'decoration',
    icon: 'ecran',
    name: 'Décoration de salle de conférence',
    desc: 'Tables, pupitre, entrée et scène : un décor sobre et professionnel qui valorise vos prises de parole.',
    image: 'services/salle-conference.jpg',
  },
  {
    id: 'evenement-professionnel',
    theme: 'decoration',
    icon: 'groupe',
    name: 'Événement professionnel',
    desc: "Séminaires, réceptions d'entreprise, remises de prix : nous imaginons et installons le décor de A à Z.",
    image: 'services/evenement-professionnel.jpg',
  },
  {
    id: 'inauguration',
    theme: 'decoration',
    icon: 'scissors',
    name: 'Inauguration',
    desc: "Ouverture de boutique ou de bureau : ruban, arche florale et compositions pour marquer le premier jour.",
    image: 'services/inauguration.jpg',
  },

  // ---- Créations florales ----
  {
    id: 'confection-bouquet',
    theme: 'creations',
    icon: 'bouquet',
    name: 'Confection de bouquets',
    desc: 'Bouquets composés à la main selon vos couleurs, votre occasion et votre budget — à partir de 300 000 GNF.',
    image: 'services/confection-bouquet.jpg',
  },
  {
    id: 'box-cadeau',
    theme: 'creations',
    icon: 'gift',
    name: 'Confection de box cadeaux',
    desc: 'Fleurs, soins, chocolats, peluches : un coffret pensé pour la personne à qui vous l’offrez.',
    image: 'services/box-cadeau.jpg',
  },
  {
    id: 'accueil-fleuri',
    theme: 'creations',
    icon: 'sparkles',
    name: 'Accueil fleuri',
    desc: 'Bouquet de bienvenue remis à vos invités, délégations ou clients — à l’aéroport, à l’hôtel ou au bureau.',
    image: 'services/accueil-fleuri.jpg',
  },

  // ---- Célébrations ----
  {
    id: 'mariage',
    theme: 'celebrations',
    icon: 'gem',
    name: 'Mariage',
    desc: 'Bouquet de la mariée, décor de cérémonie, centres de table et arche florale pour un jour unique.',
    image: 'services/mariage.jpg',
  },
  {
    id: 'bapteme',
    theme: 'celebrations',
    icon: 'flower',
    name: 'Baptême',
    desc: 'Compositions douces et lumineuses pour accueillir l’enfant et décorer la table de fête.',
    image: 'services/bapteme.jpg',
  },
  {
    id: 'anniversaire',
    theme: 'celebrations',
    icon: 'cake',
    name: 'Anniversaire',
    desc: 'Bouquets d’anniversaire et mises en scène florales qui font briller les yeux le jour J.',
    image: 'services/anniversaire.jpg',
  },
  {
    id: 'remise-diplome',
    theme: 'celebrations',
    icon: 'diplome',
    name: 'Remise de diplôme',
    desc: 'Un bouquet de félicitations pour saluer des années d’efforts, remis le jour de la cérémonie.',
    image: 'services/remise-diplome.jpg',
  },

  // ---- Attentions & hommages ----
  {
    id: 'naissance',
    theme: 'attentions',
    icon: 'etoile',
    name: 'Visite surprise — naissance',
    desc: 'Fleurs et douceurs livrées à la maternité ou à la maison pour féliciter les jeunes parents.',
    image: 'services/naissance.jpg',
  },
  {
    id: 'convalescence',
    theme: 'attentions',
    icon: 'leaf',
    name: 'Visite de convalescence',
    desc: 'Un bouquet qui fait du bien, livré à l’hôpital ou au domicile pour souhaiter un prompt rétablissement.',
    image: 'services/convalescence.jpg',
  },
  {
    id: 'hommage',
    theme: 'attentions',
    icon: 'heart',
    name: 'Hommages & condoléances',
    desc: 'Couronnes, gerbes et compositions de deuil, préparées avec discrétion et livrées dans les délais.',
    image: 'services/hommage.jpg',
  },
]

const PHOTOS_PAR_PRESTATION = {
  'decoration-interieur': SERVICE_THEME_PHOTOS.decoration,
  'confection-bouquet': SERVICE_THEME_PHOTOS.creations,
  mariage: SERVICE_THEME_PHOTOS.celebrations,
  hommage: SERVICE_THEME_PHOTOS.attentions,
}

export const SERVICES = SERVICES_BASE.map((service) => ({
  ...service,
  photo: PHOTOS_PAR_PRESTATION[service.id],
}))

export const trouverService = (id) =>
  SERVICES.find((service) => service.id === id) || null
