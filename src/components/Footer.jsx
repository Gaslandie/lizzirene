import Icon from './Icon.jsx'
import { CONTACT, waLink } from '../config.js'

function Footer() {
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
              Bouquets personnalisés, compositions florales, plantes et box
              cadeaux. Notre boutique vous accueille à Kipé, Conakry.
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
              <li><a href="#services">Notre univers</a></li>
              <li><a href="#boutique">Boutique</a></li>
              <li><a href="#evenements">Événements</a></li>
              <li><a href="#galerie">Galerie</a></li>
              <li><a href="#apropos">À propos</a></li>
            </ul>
          </div>
          <div>
            <h4>Nos créations</h4>
            <ul>
              <li><a href="#boutique">Bouquets personnalisés</a></li>
              <li><a href="#boutique">Compositions & terrariums</a></li>
              <li><a href="#boutique">Box cadeaux</a></li>
              <li><a href="#boutique">Plantes & déco</a></li>
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
                <span>{CONTACT.hours}</span>
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
