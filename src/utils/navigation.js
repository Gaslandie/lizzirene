export const BASE = import.meta.env.BASE_URL

export const urlAccueil = (ancre) => `${BASE}${ancre ? `#${ancre}` : ''}`

export const urlProduits = (categorie = 'tous') =>
  `${BASE}produits${
    categorie && categorie !== 'tous'
      ? `?categorie=${encodeURIComponent(categorie)}`
      : ''
  }`

export const urlProduit = (id) =>
  `${BASE}produits/${encodeURIComponent(id)}`

export const urlServices = (theme = 'tous') =>
  `${BASE}services${
    theme && theme !== 'tous' ? `?theme=${encodeURIComponent(theme)}` : ''
  }`

export const urlAPropos = () => `${BASE}a-propos`

export const urlContact = () => `${BASE}contact`
export const urlConfidentialite = () => `${BASE}confidentialite`

const CLAIM_STORAGE_KEY = 'lizzirene-commande-a-rattacher'
const CLAIM_REFERENCE_STORAGE_KEY = 'lizzirene-reference-a-rattacher'

export const memoriserClaimToken = (token, reference) => {
  try {
    if (token) {
      sessionStorage.setItem(CLAIM_STORAGE_KEY, token)
      // La référence n'est pas secrète. La conserver séparément permet de
      // conduire la cliente directement au suivi après le rattachement.
      if (reference) {
        sessionStorage.setItem(CLAIM_REFERENCE_STORAGE_KEY, reference)
      }
    } else {
      sessionStorage.removeItem(CLAIM_STORAGE_KEY)
      sessionStorage.removeItem(CLAIM_REFERENCE_STORAGE_KEY)
    }
  } catch {
    /* La commande reste utilisable même si le stockage est bloqué. */
  }
}

export const lireClaimToken = () => {
  try {
    return sessionStorage.getItem(CLAIM_STORAGE_KEY)
  } catch {
    return null
  }
}

export const lireClaimReference = () => {
  try {
    return sessionStorage.getItem(CLAIM_REFERENCE_STORAGE_KEY)
  } catch {
    return null
  }
}

export const effacerClaimToken = () => memoriserClaimToken(null)

const queryCompte = ({ returnTo } = {}) => {
  const query = new URLSearchParams()
  if (returnTo) query.set('retour', returnTo)
  return query.size ? `?${query}` : ''
}

export const urlConnexion = (options) => `${BASE}connexion${queryCompte(options)}`
export const urlInscription = ({ returnTo } = {}) =>
  `${BASE}inscription${queryCompte({ returnTo })}`
export const urlMotDePasseOublie = () => `${BASE}mot-de-passe-oublie`
export const urlCompte = () => `${BASE}mon-compte`
export const urlCompteCommande = (reference) =>
  `${BASE}mon-compte/commandes/${encodeURIComponent(reference)}`
export const urlAdmin = () => `${BASE}admin`
export const urlAdminInstallation = () => `${BASE}admin/installation`
export const urlAdminClientes = () => `${BASE}admin/clientes`
export const urlAdminProduits = () => `${BASE}admin/produits`
export const urlAdminNouveauProduit = () => `${BASE}admin/produits/nouveau`
export const urlAdminProduit = (id) =>
  `${BASE}admin/produits/${encodeURIComponent(id)}`
export const urlAdminCommandes = () => `${BASE}admin/commandes`
export const urlAdminNouvelleCommande = () => `${BASE}admin/commandes/nouvelle`
export const urlAdminCommande = (reference) =>
  `${BASE}admin/commandes/${encodeURIComponent(reference)}`

// N'intercepte que le clic principal simple. Les clics avec Ctrl/Cmd,
// Maj ou Alt gardent le comportement natif (nouvel onglet, nouvelle fenêtre…).
export const intercepterNavigation = (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false
  }

  event.preventDefault()
  return true
}
