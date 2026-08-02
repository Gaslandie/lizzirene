import { CONTACT, PHOTOS } from '../config.js'
import { QUESTIONS } from '../data/faq.js'
import { LIBELLES_CATEGORIES_PRODUITS } from '../data/products.js'
import {
  urlAccueil,
  urlAPropos,
  urlContact,
  urlProduit,
  urlProduits,
  urlServices,
} from './navigation.js'

// Adresse canonique publique. Les moteurs veulent des URL absolues ; les
// helpers de navigation ne produisent que des chemins commençant par « / ».
export const SITE = 'https://lizzirenedeco.com/'

const absolu = (chemin) => new URL(chemin, SITE).href

// « Lun – Sam : 8h30 – 21h30 » → { jours: [...], ouverture, fermeture }
// Le format schema.org attend des jours en anglais et des heures ISO.
const JOURS = {
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  jeu: 'Thursday',
  ven: 'Friday',
  sam: 'Saturday',
  dim: 'Sunday',
}
const ORDRE_JOURS = Object.keys(JOURS)

const heureIso = (texte) => {
  const [, h, m] = texte.match(/(\d{1,2})\s*h\s*(\d{2})?/i) || []
  return h ? `${h.padStart(2, '0')}:${m || '00'}` : null
}

const horaires = () =>
  CONTACT.hours
    .map((ligne) => {
      const [partieJours, partieHeures = ''] = ligne.split(':')
      const cles = partieJours
        .toLowerCase()
        .match(/lun|mar|mer|jeu|ven|sam|dim/g)
      if (!cles || cles.length === 0) return null

      // « Lun – Sam » désigne un intervalle, « Dim » un seul jour.
      const jours =
        cles.length === 2 && /[–-]/.test(partieJours)
          ? ORDRE_JOURS.slice(
              ORDRE_JOURS.indexOf(cles[0]),
              ORDRE_JOURS.indexOf(cles[1]) + 1,
            )
          : cles

      const [ouverture, fermeture] = partieHeures.split(/[–-]/).map(heureIso)
      if (!ouverture || !fermeture) return null

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: jours.map((cle) => JOURS[cle]),
        opens: ouverture,
        closes: fermeture,
      }
    })
    .filter(Boolean)

const ID_BOUTIQUE = `${SITE}#boutique`

// La boutique elle-même : c'est cette fiche que Google utilise pour les
// résultats locaux (adresse, horaires, téléphone, zone desservie).
const boutique = () => ({
  '@type': ['Florist', 'LocalBusiness'],
  '@id': ID_BOUTIQUE,
  name: 'Lizzirène Déco',
  alternateName: 'Lizzirene Déco by Irma',
  description:
    'Fleuriste et décoration à Kipé, Conakry : bouquets sur mesure, plantes, coffrets cadeaux, vases et décoration florale d’événements. Livraison 7j/7 à Conakry, paiement à la livraison.',
  slogan: CONTACT.tagline,
  url: SITE,
  image: absolu(PHOTOS.vedette.src),
  logo: absolu(PHOTOS.logo.src),
  telephone: CONTACT.phone,
  email: CONTACT.email,
  founder: { '@type': 'Person', name: CONTACT.founderFullName },
  foundingDate: '2023',
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.addressDetail,
    addressLocality: 'Conakry',
    addressRegion: 'Kipé',
    addressCountry: 'GN',
  },
  areaServed: {
    '@type': 'City',
    name: 'Conakry',
    containedInPlace: { '@type': 'Country', name: 'Guinée' },
  },
  openingHoursSpecification: horaires(),
  currenciesAccepted: 'GNF',
  paymentAccepted: 'Espèces à la livraison',
  priceRange: 'GNF',
  sameAs: [CONTACT.instagramUrl],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: CONTACT.phone,
    availableLanguage: ['fr'],
  },
})

const siteWeb = () => ({
  '@type': 'WebSite',
  '@id': `${SITE}#site`,
  url: SITE,
  name: 'Lizzirène Déco',
  inLanguage: 'fr',
  publisher: { '@id': ID_BOUTIQUE },
})

const faq = () => ({
  '@type': 'FAQPage',
  '@id': `${SITE}#faq`,
  mainEntity: QUESTIONS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.r },
  })),
})

const filDAriane = (etapes) => ({
  '@type': 'BreadcrumbList',
  itemListElement: etapes.map((etape, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: etape.nom,
    item: absolu(etape.url),
  })),
})

// Fiche produit. `price: null` signifie « sur devis » : on ne publie alors
// aucun prix plutôt qu'un prix faux — une offre sans montant reste valide.
const produitSchema = (produit) => {
  const availability = produit.availability === 'out_of_stock'
    ? 'https://schema.org/OutOfStock'
    : produit.availability === 'on_order'
      ? 'https://schema.org/PreOrder'
      : 'https://schema.org/InStock'
  const offre = {
    '@type': 'Offer',
    url: absolu(urlProduit(produit.id)),
    availability,
    priceCurrency: 'GNF',
    seller: { '@id': ID_BOUTIQUE },
  }

  if (produit.price != null) {
    // Un prix « à partir de » se déclare comme un minimum, pas comme un prix ferme.
    if (produit.prixPrefixe) {
      offre.priceSpecification = {
        '@type': 'PriceSpecification',
        minPrice: produit.price,
        priceCurrency: 'GNF',
      }
    } else {
      offre.price = produit.price
    }
  }

  return {
    '@type': 'Product',
    '@id': absolu(urlProduit(produit.id)) + '#produit',
    name: produit.name,
    description: produit.desc,
    category: LIBELLES_CATEGORIES_PRODUITS[produit.category],
    ...(produit.src ? { image: absolu(produit.src) } : {}),
    brand: { '@type': 'Brand', name: 'Lizzirène Déco' },
    offers: offre,
  }
}

// Construit le graphe de la page courante. Une seule balise <script> est
// injectée par page : les moteurs préfèrent un graphe unique à dix fragments.
export const grapheDePage = ({ page, produit, categorie }) => {
  const graphe = [boutique(), siteWeb()]

  if (page === 'accueil') {
    graphe.push(faq())
    return graphe
  }

  if (page === 'produit' && produit) {
    graphe.push(produitSchema(produit))
    graphe.push(
      filDAriane([
        { nom: 'Accueil', url: urlAccueil() },
        { nom: 'Nos produits', url: urlProduits() },
        { nom: produit.name, url: urlProduit(produit.id) },
      ]),
    )
    return graphe
  }

  const PAGES = {
    produits: { nom: 'Nos produits', url: urlProduits(categorie) },
    services: { nom: 'Nos services', url: urlServices() },
    apropos: { nom: 'À propos', url: urlAPropos() },
    contact: { nom: 'Contact', url: urlContact() },
  }

  if (PAGES[page]) {
    graphe.push(
      filDAriane([{ nom: 'Accueil', url: urlAccueil() }, PAGES[page]]),
    )
  }

  if (page === 'contact') graphe.push(faq())

  return graphe
}

const ID_BALISE = 'donnees-structurees'

// Remplace le contenu de l'unique balise JSON-LD du document.
export const appliquerDonneesStructurees = (contexte) => {
  let balise = document.getElementById(ID_BALISE)

  if (!balise) {
    balise = document.createElement('script')
    balise.type = 'application/ld+json'
    balise.id = ID_BALISE
    document.head.appendChild(balise)
  }

  balise.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': grapheDePage(contexte),
  })
}
