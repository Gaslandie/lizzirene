import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { THEMES } from '../data/services.js'
import { intercepterNavigation, urlServices } from '../utils/navigation.js'

// Aperçu des quatre thèmes de prestations sur l'accueil ; le détail vit
// sur /services. Les icônes reprennent celles des services phares.
const ICONES = {
  decoration: 'maison',
  creations: 'bouquet',
  celebrations: 'gem',
  attentions: 'heart',
}

function Services({ onTheme }) {
  const themes = THEMES.filter((theme) => theme.id !== 'tous')

  const choisir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onTheme?.(id, { ajouterHistorique: true })
  }

  return (
    <section className="services" id="services">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Nos services</span>
            <h2>Tout pour faire battre les cœurs</h2>
            <p>
              De la décoration d'intérieur aux grands moments de la vie, nous
              créons, installons et livrons partout à Conakry.
            </p>
          </div>
        </Reveal>
        <div className="services-grid">
          {themes.map((theme, i) => (
            <Reveal key={theme.id} delay={i * 100}>
              <a
                className="service-card"
                href={urlServices(theme.id)}
                onClick={(event) => choisir(event, theme.id)}
              >
                <span className="service-icon">
                  <Icon name={ICONES[theme.id]} size={28} />
                </span>
                <h3>{theme.label}</h3>
                <p>{theme.intro}</p>
                <span className="service-card-lien">
                  Voir les prestations
                  <Icon name="arrow" size={17} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
