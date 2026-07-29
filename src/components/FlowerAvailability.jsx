import Icon from './Icon.jsx'
import {
  GROUPES_VARIETES_FLEURS,
  NOMBRE_VARIETES_FLEURS,
} from '../data/fleurs.js'
import { waLink } from '../config.js'

function FlowerAvailability() {
  return (
    <section
      className="flower-availability"
      aria-labelledby="flower-availability-title"
    >
      <div className="flower-availability-head">
        <div>
          <span className="eyebrow">Selon les arrivages</span>
          <h4 id="flower-availability-title">
            Fleurs et coloris du catalogue
          </h4>
          <p>
            Ces références servent à composer votre bouquet sur mesure. Les
            coloris disponibles sont confirmés avec vous au moment de la
            commande.
          </p>
        </div>
        <span className="flower-variety-count">
          {NOMBRE_VARIETES_FLEURS} références
        </span>
      </div>

      <ul className="flower-variety-grid">
        {GROUPES_VARIETES_FLEURS.map((groupe) => (
          <li className="flower-variety-card" key={groupe.id}>
            <h5>{groupe.label}</h5>
            <ul className="flower-variety-list">
              {groupe.variantes.map((variante) => (
                <li key={variante}>{variante}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <a
        className="btn btn-whatsapp flower-availability-cta"
        href={waLink(
          'Bonjour Lizzirene Déco ! Je souhaite connaître les fleurs et coloris disponibles pour composer un bouquet.',
        )}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="whatsapp" size={18} />
        Demander les disponibilités
      </a>
    </section>
  )
}

export default FlowerAvailability
