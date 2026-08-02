import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import MenuDeroulant from './MenuDeroulant.jsx'
import { CONTACT, PHOTOS, waLink } from '../config.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { FAMILLES } from '../data/products.js'
import { FAMILLES_SERVICES } from '../data/services.js'
import {
  intercepterNavigation,
  urlAccueil,
  urlContact,
  urlProduits,
  urlServices,
  urlAPropos,
  urlAdmin,
  urlCompte,
  urlConnexion,
} from '../utils/navigation.js'

// Entrées des deux panneaux déroulants, construites depuis la source de
// vérité de chaque domaine (produits / services).
const ENTREES_PRODUITS = [
  { valeur: 'tous', label: 'Tout le catalogue', href: urlProduits() },
  ...FAMILLES.map((f) => ({
    valeur: f.id,
    label: f.label,
    href: urlProduits(f.id),
  })),
]

const ENTREES_SERVICES = [
  { valeur: 'tous', label: 'Tous nos services', href: urlServices() },
  ...FAMILLES_SERVICES.map((t) => ({
    valeur: t.id,
    label: t.label,
    href: urlServices(t.id),
  })),
]

const LIENS_FIN = [{ page: 'contact', label: 'Contact' }]

function Navbar({
  page = 'accueil',
  categorie = 'tous',
  theme = 'tous',
  onAller,
  onCategorie,
  onTheme,
}) {
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const { count, setOpen: openCart } = useCart()
  const { user } = useAuth()
  const accountPage = user?.role === 'admin' ? 'admin' : user ? 'compte' : 'connexion'
  const accountUrl = user?.role === 'admin' ? urlAdmin() : user ? urlCompte() : urlConnexion()

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
            <img
              src={PHOTOS.logo.src}
              alt={PHOTOS.logo.alt}
              width={PHOTOS.logo.width}
              height={PHOTOS.logo.height}
            />
            <span className="brand-block">
              <span className="brand-name">
                LIZZIRENE <span>DÉCO</span>
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
            <a
              href={urlAPropos()}
              aria-current={page === 'apropos' ? 'page' : undefined}
              onClick={(event) => allerPage(event, 'apropos')}
            >
              À propos
            </a>
            <MenuDeroulant
              id="sous-menu-produits"
              libelle="Nos Produits"
              actif={page === 'produits' || page === 'produit'}
              entrees={ENTREES_PRODUITS}
              valeurActive={categorie}
              onChoisir={(id) => onCategorie?.(id, { ajouterHistorique: true })}
              onNaviguer={() => setOpen(false)}
            />
            <MenuDeroulant
              id="sous-menu-services"
              libelle="Nos Services"
              actif={page === 'services'}
              entrees={ENTREES_SERVICES}
              valeurActive={theme}
              onChoisir={(id) => onTheme?.(id, { ajouterHistorique: true })}
              onNaviguer={() => setOpen(false)}
            />
            {LIENS_FIN.map((lien) => (
              <a
                key={lien.label}
                href={lien.page ? urlContact() : urlAccueil(lien.ancre)}
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
            <a
              className="account-btn"
              href={accountUrl}
              onClick={(event) =>
                allerPage(event, accountPage)
              }
              aria-label={user?.role === 'admin' ? 'Ouvrir l’administration' : user ? `Ouvrir le compte de ${user.name}` : 'Se connecter ou créer un compte'}
              title={user?.role === 'admin' ? 'Administration' : user ? 'Mon espace' : 'Compte client'}
            >
              <Icon name="user" size={21} />
              <span>{user?.role === 'admin' ? 'Admin' : user ? user.name.split(' ')[0] : 'Compte'}</span>
            </a>
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
