import { useState } from 'react'
import Icon from './Icon.jsx'
import { CONTACT, waLink } from '../config.js'
import { useCart } from '../context/CartContext.jsx'

const LINKS = [
  { href: '#services', label: 'Univers' },
  { href: '#boutique', label: 'Boutique' },
  { href: '#evenements', label: 'Événements' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#apropos', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { count, setOpen: openCart } = useCart()

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
          <a href="#accueil" className="brand">
            <img src="/logo.jpeg" alt="Logo Lizzirene Déco" />
            <span className="brand-block">
              <span className="brand-name">
                LIZZIRENE <span>DECO</span>
              </span>
              <span className="brand-tagline">{CONTACT.tagline}</span>
            </span>
          </a>

          <nav className={`nav-links ${open ? 'open' : ''}`}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
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
            <a href="#boutique" className="btn btn-primary nav-shop">
              Commander
            </a>
            <button
              className="burger"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
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
