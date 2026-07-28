import Media from './Media.jsx'
import Icon from './Icon.jsx'
import { PHOTOS, CONTACT, waLink } from '../config.js'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

function Hero({ onCategorie }) {
  const [avant, apres] = CONTACT.heroTitle.split('chaque fleur')

  const ouvrirFleurs = (event) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.('fleurs', { ajouterHistorique: true })
  }

  return (
    <section className="hero" id="accueil">
      <div className="container">
        <div className="hero-content">
          <span className="hero-eyebrow">Kipé · Conakry · Guinée</span>
          <h1 tabIndex={-1}>
            {avant}
            <em>chaque fleur</em>
            {apres}
          </h1>
          <p className="hero-sub">
            Bouquets personnalisés, compositions florales, plantes et box
            cadeaux. Notre nouvelle boutique vous accueille à Kipé — et nous
            livrons partout à Conakry.
          </p>
          <div className="hero-actions">
            <a
              href={urlProduits('fleurs')}
              className="btn btn-primary"
              onClick={ouvrirFleurs}
            >
              Commander un bouquet
            </a>
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! Je souhaite recevoir votre catalogue.',
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Recevoir le catalogue
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>Dès 300 000</strong>
              <span>GNF le bouquet</span>
            </div>
            <div>
              <strong>7j/7</strong>
              <span>Livraison à Conakry</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Fait main</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <Media
            src={PHOTOS.vedette}
            alt="Composition florale Lizzirene Déco dans un pot noir, ruban jaune"
          />
          <div className="hero-card">
            <span className="dot">
              <Icon name="flower" size={22} />
            </span>
            <div>
              <strong>Nouvelle boutique à Kipé</strong>
              <span>{CONTACT.addressDetail}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
