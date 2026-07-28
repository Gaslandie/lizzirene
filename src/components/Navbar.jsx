import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { CONTACT, PHOTOS, waLink } from '../config.js'
import { useCart } from '../context/CartContext.jsx'
import { FAMILLES, normaliserCategorie } from '../data/products.js'
import {
  intercepterNavigation,
  urlAccueil,
  urlContact,
  urlProduits,
} from '../utils/navigation.js'

const LIENS_APRES_PRODUITS = [
  { ancre: 'apropos', label: 'À propos' },
  { page: 'contact', label: 'Contact' },
]

const hoverDisponible = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

function MenuProduits({ page, categorie, onCategorie, onNaviguer }) {
  const [ouvert, setOuvert] = useState(false)
  const zoneRef = useRef(null)
  const boutonRef = useRef(null)
  const fermetureRef = useRef()
  const produitsActifs = page === 'produits' || page === 'produit'
  const categorieActive = normaliserCategorie(categorie)

  useEffect(() => {
    if (!ouvert) return undefined

    const fermerHorsZone = (event) => {
      if (!zoneRef.current?.contains(event.target)) setOuvert(false)
    }

    const fermerEchap = (event) => {
      if (event.key !== 'Escape') return
      setOuvert(false)
      boutonRef.current?.focus()
    }

    document.addEventListener('pointerdown', fermerHorsZone)
    document.addEventListener('keydown', fermerEchap)

    return () => {
      document.removeEventListener('pointerdown', fermerHorsZone)
      document.removeEventListener('keydown', fermerEchap)
    }
  }, [ouvert])

  useEffect(() => () => clearTimeout(fermetureRef.current), [])

  const ouvrirAuSurvol = () => {
    if (!hoverDisponible()) return
    clearTimeout(fermetureRef.current)
    setOuvert(true)
  }

  const fermerAuSurvol = () => {
    if (!hoverDisponible()) return
    fermetureRef.current = setTimeout(() => setOuvert(false), 160)
  }

  const fermerAuDepartDuFocus = (event) => {
    if (!zoneRef.current?.contains(event.relatedTarget)) setOuvert(false)
  }

  const choisir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(id, { ajouterHistorique: true })
    setOuvert(false)
    onNaviguer?.()
  }

  return (
    <div
      className="nav-produits"
      ref={zoneRef}
      onMouseEnter={ouvrirAuSurvol}
      onMouseLeave={fermerAuSurvol}
      onBlur={fermerAuDepartDuFocus}
    >
      <button
        ref={boutonRef}
        type="button"
        className={`nav-produits-btn ${produitsActifs ? 'active-page' : ''}`}
        aria-expanded={ouvert}
        aria-controls="sous-menu-produits"
        onClick={() => setOuvert((etat) => !etat)}
      >
        Nos Produits
        <Icon name="chevron" size={16} className={ouvert ? 'pivote' : ''} />
      </button>

      <ul
        id="sous-menu-produits"
        className={`sous-menu ${ouvert ? 'ouvert' : ''}`}
      >
        <li>
          <a
            href={urlProduits()}
            aria-current={
              page === 'produits' && categorieActive === 'tous'
                ? 'page'
                : undefined
            }
            onClick={(event) => choisir(event, 'tous')}
          >
            Tout le catalogue
          </a>
        </li>
        {FAMILLES.map((famille) => (
          <li key={famille.id}>
            <a
              href={urlProduits(famille.id)}
              aria-current={
                page === 'produits' && categorieActive === famille.id
                  ? 'page'
                  : undefined
              }
              onClick={(event) => choisir(event, famille.id)}
            >
              {famille.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Navbar({ page = 'accueil', categorie = 'tous', onAller, onCategorie }) {
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const { count, setOpen: openCart } = useCart()

  useEffect(() => {
    if (!open) return undefined

    const fermerEchap = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      burgerRef.current?.focus()
    }

    document.addEventListener('keydown', fermerEchap)
    return () => document.removeEventListener('keydown', fermerEchap)
  }, [open])

  const allerPage = (event, destination, options) => {
    if (!intercepterNavigation(event)) return
    setOpen(false)
    onAller?.(destination, options)
  }

  const naviguer = (event, lien) => {
    allerPage(
      event,
      lien.page || 'accueil',
      lien.ancre ? { ancre: lien.ancre } : undefined,
    )
  }

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="topbar-note">
            <Icon name="pin" size={16} />
            Kipé, Conakry — livraison 7j/7, paiement à la livraison
          </span>
          <div className="topbar-links">
            <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
              <Icon name="phone" size={16} />
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={waLink('Bonjour Lizzirene Déco !')}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={16} />
              {CONTACT.whatsappDisplay}
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={16} />
              {CONTACT.instagram}
            </a>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container">
          <a
            href={urlAccueil()}
            className="brand"
            onClick={(event) => allerPage(event, 'accueil')}
          >
            <img src={PHOTOS.logo} alt="Logo Lizzirene Déco" />
            <span className="brand-block">
              <span className="brand-name">
                LIZZIRENE <span>DECO</span>
              </span>
              <span className="brand-tagline">{CONTACT.tagline}</span>
            </span>
          </a>

          <nav
            id="navigation-principale"
            className={`nav-links ${open ? 'open' : ''}`}
            aria-label="Navigation principale"
          >
            <a
              href={urlAccueil()}
              aria-current={page === 'accueil' ? 'page' : undefined}
              onClick={(event) => allerPage(event, 'accueil')}
            >
              Accueil
            </a>
            <MenuProduits
              page={page}
              categorie={categorie}
              onCategorie={onCategorie}
              onNaviguer={() => setOpen(false)}
            />
            {LIENS_APRES_PRODUITS.map((lien) => (
              <a
                key={lien.label}
                href={
                  lien.page ? urlContact() : urlAccueil(lien.ancre)
                }
                aria-current={
                  lien.page && page === lien.page ? 'page' : undefined
                }
                onClick={(event) => naviguer(event, lien)}
              >
                {lien.label}
              </a>
            ))}
          </nav>

          <div className="nav-cta">
            <button
              className="cart-btn"
              onClick={() => openCart(true)}
              aria-label={`Ouvrir le panier (${count} article${count > 1 ? 's' : ''})`}
            >
              <Icon name="bag" size={22} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <a
              href={urlProduits()}
              className="btn btn-primary nav-shop"
              onClick={(event) => allerPage(event, 'produits')}
            >
              Commander
            </a>
            <button
              ref={burgerRef}
              className="burger"
              onClick={() => setOpen((etat) => !etat)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              aria-controls="navigation-principale"
            >
              <Icon name={open ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
