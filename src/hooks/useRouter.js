import { useCallback, useEffect, useState } from 'react'
import { normaliserCategorie } from '../data/products.js'
import { normaliserTheme } from '../data/services.js'
import {
  BASE,
  urlAccueil,
  urlContact,
  urlProduit,
  urlProduits,
  urlServices,
} from '../utils/navigation.js'

const cheminRelatif = () => {
  const chemin = window.location.pathname
  const baseSansSlash = BASE.replace(/\/$/, '')

  if (chemin === baseSansSlash) return ''
  if (chemin.startsWith(BASE)) return chemin.slice(BASE.length)
  return null
}

const decoder = (valeur) => {
  try {
    return decodeURIComponent(valeur)
  } catch {
    return valeur
  }
}

const lireEtat = () => {
  const relatif = cheminRelatif()
  const segments = relatif === null ? [] : relatif.split('/').filter(Boolean)
  const categorieDemandee = new URLSearchParams(window.location.search).get(
    'categorie',
  )
  const categorie = normaliserCategorie(categorieDemandee || 'tous')
  const theme = normaliserTheme(
    new URLSearchParams(window.location.search).get('theme') || 'tous',
  )
  const ancienneUrl =
    relatif !== null &&
    segments.length === 0 &&
    (categorieDemandee !== null || window.location.hash === '#boutique')

  if (ancienneUrl) {
    return { page: 'produits', categorie, theme: 'tous', produitId: null, ancienneUrl: true }
  }

  if (relatif === null) {
    return {
      page: 'introuvable',
      categorie: 'tous',
      theme: 'tous',
      produitId: null,
      ancienneUrl: false,
    }
  }

  if (segments.length === 0) {
    return {
      page: 'accueil',
      categorie: 'tous',
      theme: 'tous',
      produitId: null,
      ancienneUrl: false,
    }
  }

  if (segments.length === 1 && segments[0] === 'contact') {
    return {
      page: 'contact',
      categorie: 'tous',
      theme: 'tous',
      produitId: null,
      ancienneUrl: false,
    }
  }

  if (segments[0] === 'produits' && segments.length === 1) {
    return {
      page: 'produits',
      categorie,
      theme: 'tous',
      produitId: null,
      ancienneUrl: false,
    }
  }

  if (segments[0] === 'produits' && segments.length === 2) {
    return {
      page: 'produit',
      categorie: 'tous',
      theme: 'tous',
      produitId: decoder(segments[1]),
      ancienneUrl: false,
    }
  }

  if (segments.length === 1 && segments[0] === 'services') {
    return {
      page: 'services',
      categorie: 'tous',
      theme,
      produitId: null,
      ancienneUrl: false,
    }
  }

  return {
    page: 'introuvable',
    categorie: 'tous',
    theme: 'tous',
    produitId: null,
    ancienneUrl: false,
  }
}

const defilerVers = (ancre, essais = 12) => {
  const element = document.getElementById(ancre)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    element.focus?.({ preventScroll: true })
  } else if (essais > 0) {
    window.requestAnimationFrame(() => defilerVers(ancre, essais - 1))
  }
}

const remonterEnHaut = () => {
  const html = document.documentElement
  const memo = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = memo
}

const focaliserTitre = (essais = 8) => {
  const titre = document.querySelector('main h1')
  if (titre) {
    titre.focus({ preventScroll: true })
  } else if (essais > 0) {
    window.requestAnimationFrame(() => focaliserTitre(essais - 1))
  }
}

export function useRouter() {
  const [etat, setEtat] = useState(lireEtat)

  useEffect(() => {
    const sync = () => setEtat(lireEtat())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  // Les liens publiés avant la création de la page catalogue restent valides.
  useEffect(() => {
    if (!etat.ancienneUrl) return
    window.history.replaceState({}, '', urlProduits(etat.categorie))
    setEtat(lireEtat())
  }, [etat.ancienneUrl, etat.categorie])

  // Une ancre partagée vers une section de l'accueil reste utilisable.
  useEffect(() => {
    if (etat.ancienneUrl || etat.page !== 'accueil') return
    const ancre = window.location.hash.replace(/^#/, '')
    if (ancre) defilerVers(ancre)
  }, [etat.ancienneUrl, etat.page])

  const finaliserNavigation = useCallback(({ ancre } = {}) => {
    setEtat(lireEtat())
    if (ancre) {
      defilerVers(ancre)
    } else {
      remonterEnHaut()
      window.requestAnimationFrame(() => focaliserTitre())
    }
  }, [])

  const aller = useCallback(
    (page, { ancre } = {}) => {
      let href = urlAccueil(ancre)
      if (page === 'produits') href = urlProduits()
      if (page === 'services') href = urlServices()
      if (page === 'contact') href = urlContact()

      window.history.pushState({}, '', href)
      finaliserNavigation({ ancre })
    },
    [finaliserNavigation],
  )

  const choisirCategorie = useCallback(
    (id, { ajouterHistorique = false } = {}) => {
      const categorie = normaliserCategorie(id)
      const methode = ajouterHistorique ? 'pushState' : 'replaceState'
      window.history[methode]({}, '', urlProduits(categorie))
      setEtat(lireEtat())

      if (ajouterHistorique) {
        remonterEnHaut()
        window.requestAnimationFrame(() => focaliserTitre())
      }
    },
    [],
  )

  const choisirTheme = useCallback(
    (id, { ajouterHistorique = false } = {}) => {
      const theme = normaliserTheme(id)
      const methode = ajouterHistorique ? 'pushState' : 'replaceState'
      window.history[methode]({}, '', urlServices(theme))
      setEtat(lireEtat())

      if (ajouterHistorique) {
        remonterEnHaut()
        window.requestAnimationFrame(() => focaliserTitre())
      }
    },
    [],
  )

  const allerProduit = useCallback((id) => {
    window.history.pushState({}, '', urlProduit(id))
    setEtat(lireEtat())
    remonterEnHaut()
    window.requestAnimationFrame(() => focaliserTitre())
  }, [])

  return { ...etat, aller, choisirCategorie, choisirTheme, allerProduit }
}
