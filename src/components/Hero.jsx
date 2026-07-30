import { CONTACT, HERO_IMAGES, waLink } from '../config.js'
import Icon from './Icon.jsx'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

// Une seule image de fond : la fondatrice dans sa boutique. La rotation a
// été retirée à la demande de la cliente — les autres visuels restent
// déclarés dans HERO_IMAGES pour le jour où elle voudra les reprendre.
const IMAGE = HERO_IMAGES[0]

function Hero({ onCategorie }) {
  const [avant, apres] = CONTACT.heroTitle.split('chaque fleur')

  const ouvrirFleurs = (event) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.('fleurs', { ajouterHistorique: true })
  }

  return (
    <section className="hero hero-with-background" id="accueil">
      <div className="hero-background" aria-hidden="true">
        <picture className="hero-background-image active">
          <source media="(max-width: 900px)" srcSet={IMAGE.mobileSrc} />
          <img
            src={IMAGE.src}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero-background-overlay" />
      </div>

      <div className="container">
        <div className="hero-content">
          <span className="hero-eyebrow">Kipé · Conakry · Guinée</span>
          <h1 tabIndex={-1}>
            {avant}
            <em>chaque fleur</em>
            {apres}
          </h1>
          <p className="hero-sub">
            Bienvenue chez Lizzirène Déco. Depuis 2023, la passion des roses
            et des plantes nous anime&nbsp;: semer l'espoir, la joie et la
            beauté dans vos vies, avec des décors qui vous ressemblent.
          </p>
          <div className="hero-actions">
            <a
              href={urlProduits('fleurs')}
              className="btn btn-accent"
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
              className="btn btn-ghost"
            >
              <Icon name="whatsapp" size={18} />
              Recevoir le catalogue
            </a>
          </div>
          <ul className="hero-reperes">
            <li>
              <strong>Dès 300 000 GNF</strong>
              <span>prix provisoire</span>
            </li>
            <li>
              <strong>Livraison 7j/7</strong>
              <span>partout à Conakry</span>
            </li>
            <li>
              <strong>Paiement à la livraison</strong>
              <span>en espèces, à la réception</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero
