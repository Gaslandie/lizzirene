import { useCallback, useEffect, useState } from 'react'
import { normaliserCategorie } from '../data/products.js'
import { normaliserTheme } from '../data/services.js'
import {
  BASE,
  urlAccueil,
  urlContact,
  urlConfidentialite,
  urlProduit,
  urlProduits,
  urlServices,
  urlAPropos,
  urlAdmin,
  urlAdminCommande,
  urlAdminCommandes,
  urlAdminInstallation,
  urlAdminNouvelleCommande,
  urlAdminNouveauProduit,
  urlAdminProduit,
  urlAdminProduits,
  urlCompte,
  urlCompteCommande,
  urlConnexion,
  urlInscription,
  effacerClaimToken,
  memoriserClaimToken,
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

  const base = {
    categorie,
    theme,
    produitId: null,
    commandeReference: null,
    adminProduitId: null,
    ancienneUrl: false,
  }

  if (ancienneUrl) {
    return { ...base, page: 'produits', theme: 'tous', ancienneUrl: true }
  }

  if (relatif === null) {
    return { ...base, page: 'introuvable', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 0) {
    return { ...base, page: 'accueil', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'contact') {
    return { ...base, page: 'contact', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'confidentialite') {
    return { ...base, page: 'confidentialite', categorie: 'tous', theme: 'tous' }
  }

  if (segments[0] === 'produits' && segments.length === 1) {
    return { ...base, page: 'produits', theme: 'tous' }
  }

  if (segments[0] === 'produits' && segments.length === 2) {
    return {
      ...base,
      page: 'produit',
      categorie: 'tous',
      theme: 'tous',
      produitId: decoder(segments[1]),
    }
  }

  if (segments.length === 1 && segments[0] === 'a-propos') {
    return { ...base, page: 'apropos', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'services') {
    return { ...base, page: 'services', categorie: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'connexion') {
    return { ...base, page: 'connexion', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'inscription') {
    return { ...base, page: 'inscription', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 1 && segments[0] === 'mon-compte') {
    return { ...base, page: 'compte', categorie: 'tous', theme: 'tous' }
  }

  if (
    segments.length === 3 &&
    segments[0] === 'mon-compte' &&
    segments[1] === 'commandes'
  ) {
    return {
      ...base,
      page: 'compte-commande',
      categorie: 'tous',
      theme: 'tous',
      commandeReference: decoder(segments[2]),
    }
  }

  if (segments.length === 1 && segments[0] === 'admin') {
    return { ...base, page: 'admin', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 2 && segments.join('/') === 'admin/installation') {
    return {
      ...base,
      page: 'admin-installation',
      categorie: 'tous',
      theme: 'tous',
    }
  }

  if (segments.length === 2 && segments.join('/') === 'admin/produits') {
    return { ...base, page: 'admin-produits', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 3 && segments.join('/') === 'admin/produits/nouveau') {
    return {
      ...base,
      page: 'admin-produit-nouveau',
      categorie: 'tous',
      theme: 'tous',
    }
  }

  if (segments.length === 3 && segments[0] === 'admin' && segments[1] === 'produits') {
    return {
      ...base,
      page: 'admin-produit',
      categorie: 'tous',
      theme: 'tous',
      adminProduitId: decoder(segments[2]),
    }
  }

  if (segments.length === 2 && segments.join('/') === 'admin/commandes') {
    return { ...base, page: 'admin-commandes', categorie: 'tous', theme: 'tous' }
  }

  if (segments.length === 3 && segments.join('/') === 'admin/commandes/nouvelle') {
    return {
      ...base,
      page: 'admin-commande-nouvelle',
      categorie: 'tous',
      theme: 'tous',
    }
  }

  if (segments.length === 3 && segments[0] === 'admin' && segments[1] === 'commandes') {
    return {
      ...base,
      page: 'admin-commande',
      categorie: 'tous',
      theme: 'tous',
      commandeReference: decoder(segments[2]),
    }
  }

  return { ...base, page: 'introuvable', categorie: 'tous', theme: 'tous' }
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
    (page, { ancre, id, reference, claimToken, returnTo } = {}) => {
      if (page === 'connexion' || page === 'inscription') {
        if (claimToken) memoriserClaimToken(claimToken, reference)
        else if (returnTo === 'commande') effacerClaimToken()
      }
      let href = urlAccueil(ancre)
      if (page === 'produits') href = urlProduits()
      if (page === 'services') href = urlServices()
      if (page === 'apropos') href = urlAPropos()
      if (page === 'contact') href = urlContact()
      if (page === 'confidentialite') href = urlConfidentialite()
      if (page === 'connexion') href = urlConnexion({ claimToken, returnTo })
      if (page === 'inscription') href = urlInscription({ returnTo })
      if (page === 'compte') href = urlCompte()
      if (page === 'compte-commande') href = urlCompteCommande(reference)
      if (page === 'admin') href = urlAdmin()
      if (page === 'admin-installation') href = urlAdminInstallation()
      if (page === 'admin-produits') href = urlAdminProduits()
      if (page === 'admin-produit-nouveau') href = urlAdminNouveauProduit()
      if (page === 'admin-produit') href = urlAdminProduit(id)
      if (page === 'admin-commandes') href = urlAdminCommandes()
      if (page === 'admin-commande-nouvelle') href = urlAdminNouvelleCommande()
      if (page === 'admin-commande') href = urlAdminCommande(reference)

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
