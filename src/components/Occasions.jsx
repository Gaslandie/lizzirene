import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { OCCASIONS } from '../data/occasions.js'
import {
  intercepterNavigation,
  urlProduits,
  urlServices,
} from '../utils/navigation.js'

// Raccourcis par occasion. Volontairement compacts : ils orientent, ils ne
// remplacent ni la vitrine produits ni la page services.
function Occasions({ onCategorie, onTheme }) {
  const ouvrir = (event, destination) => {
    if (!intercepterNavigation(event)) return
    if (destination.type === 'categorie') {
      onCategorie?.(destination.id, { ajouterHistorique: true })
    } else {
      onTheme?.(destination.id, { ajouterHistorique: true })
    }
  }

  const lien = (destination) =>
    destination.type === 'categorie'
      ? urlProduits(destination.id)
      : urlServices(destination.id)

  return (
    <section className="occasions" id="occasions">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Occasions</span>
            <h2>Pour quelle occasion offrez-vous&nbsp;?</h2>
            <p>
              Dites-nous le moment, nous nous occupons des fleurs. Chaque
              occasion mène à la sélection qui lui correspond.
            </p>
          </div>
        </Reveal>
        <ul className="occasions-grid">
          {OCCASIONS.map((occasion, i) => (
            <li key={occasion.id}>
              <Reveal variant="zoom" delay={(i % 5) * 70}>
                <a
                  className="occasion-card"
                  href={lien(occasion.destination)}
                  onClick={(event) => ouvrir(event, occasion.destination)}
                >
                  <span className="occasion-icon">
                    <Icon name={occasion.icon} size={22} />
                  </span>
                  <span className="occasion-body">
                    <strong>{occasion.label}</strong>
                    <span className="occasion-periode">{occasion.periode}</span>
                    <span className="occasion-texte">{occasion.texte}</span>
                  </span>
                  <Icon name="arrow" size={17} />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Occasions
