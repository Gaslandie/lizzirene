// Coordonnées officielles de la boutique — un seul endroit à modifier.
export const CONTACT = {
  tagline: 'Des fleurs pour chaque émotion',
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
  hours: 'Lun – Sam : 9h00 – 19h00',
}

// Photos de la boutique (fichiers déposés dans /public).
// `BASE_URL` préfixe le chemin quand le site est servi depuis un
// sous-dossier (GitHub Pages) — ne jamais écrire les chemins en dur.
const asset = (fichier) => `${import.meta.env.BASE_URL}${fichier}`

export const PHOTOS = {
  logo: asset('logo.jpeg'),
  vedette: asset('photoVedette.jpeg'),
  bouquet: asset('bouquetFleurs.jpeg'),
}

// Communes et quartiers de Conakry proposés à la livraison.
export const ZONES = ['Kaloum', 'Dixinn', 'Matam', 'Ratoma', 'Matoto', 'Autre']

export const waLink = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`

// 350000 → "350 000 GNF"
export const formatPrice = (value) =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} GNF`
