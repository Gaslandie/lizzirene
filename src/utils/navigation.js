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
