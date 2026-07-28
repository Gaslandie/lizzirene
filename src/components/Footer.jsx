import Icon from './Icon.jsx'
import { CONTACT, waLink } from '../config.js'
import { FAMILLES } from '../data/products.js'
import { FAMILLES_SERVICES } from '../data/services.js'
import {
  intercepterNavigation,
  urlAccueil,
  urlContact,
  urlProduits,
  urlServices,
} from '../utils/navigation.js'

// Les colonnes de liens passent par le routeur (pas de rechargement de
// page) tout en gardant de vraies URL dans les href.
function Footer({ onAller, onCategorie, onTheme }) {
  const versAncre = (e, ancre) => {
    if (!intercepterNavigation(e)) return
    onAller?.('accueil', { ancre })
  }

  const versCategorie = (e, id) => {
    if (!intercepterNavigation(e)) return
    onCategorie?.(id, { ajouterHistorique: true })
  }

  const versTheme = (e, id) => {
    if (!intercepterNavigation(e)) return
    onTheme?.(id, { ajouterHistorique: true })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-name">
                LIZZIRENE <span>DECO</span>
              </span>
            </div>
            <p className="footer-tagline">{CONTACT.tagline}</p>
            <p>
              Fleurs naturelles et artificielles, plantes, vases, box cadeaux
              et décoration. Notre boutique vous accueille à Kipé, Conakry.
            </p>
            <div className="socials">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Icon name="instagram" size={19} />
              </a>
              <a href="#" aria-label="Facebook">
                <Icon name="facebook" size={19} />
              </a>
              <a
                href={waLink('Bonjour Lizzirene Déco !')}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <Icon name="whatsapp" size={19} />
              </a>
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li>
                <a
                  href={urlAccueil()}
                  onClick={(e) => {
                    if (!intercepterNavigation(e)) return
                    onAller?.('accueil')
                  }}
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href={urlProduits()}
                  onClick={(e) => versCategorie(e, 'tous')}
                >
                  Nos produits
                </a>
              </li>
              <li>
                <a href={urlServices()} onClick={(e) => versTheme(e, 'tous')}>
                  Nos services
                </a>
              </li>
              <li>
                <a
                  href={urlAccueil('evenements')}
                  onClick={(e) => versAncre(e, 'evenements')}
                >
                  Événements
                </a>
              </li>
              <li>
                <a
                  href={urlAccueil('galerie')}
                  onClick={(e) => versAncre(e, 'galerie')}
                >
                  Galerie
                </a>
              </li>
              <li>
                <a
                  href={urlAccueil('apropos')}
                  onClick={(e) => versAncre(e, 'apropos')}
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href={urlContact()}
                  onClick={(e) => {
                    if (!intercepterNavigation(e)) return
                    onAller?.('contact')
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Nos produits</h4>
            <ul>
              {FAMILLES.slice(0, 6).map((famille) => (
                <li key={famille.id}>
                  <a
                    href={urlProduits(famille.id)}
                    onClick={(e) => versCategorie(e, famille.id)}
                  >
                    {famille.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Nos services</h4>
            <ul>
              {FAMILLES_SERVICES.map((t) => (
                <li key={t.id}>
                  <a
                    href={urlServices(t.id)}
                    onClick={(e) => versTheme(e, t.id)}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Boutique</h4>
            <ul className="footer-contact">
              <li>
                <Icon name="pin" size={17} />
                <span>
                  {CONTACT.address}
                  <span className="footer-detail">{CONTACT.addressDetail}</span>
                </span>
              </li>
              <li>
                <Icon name="phone" size={17} />
                <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <Icon name="whatsapp" size={17} />
                <a
                  href={waLink('Bonjour Lizzirene Déco !')}
                  target="_blank"
                  rel="noreferrer"
                >
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li>
                <Icon name="mail" size={17} />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <Icon name="clock" size={17} />
                <span className="hours-lines">
                  {CONTACT.hours.map((ligne) => (
                    <span key={ligne}>{ligne}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Lizzirene Déco by {CONTACT.founder} —
          Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

export default Footer
