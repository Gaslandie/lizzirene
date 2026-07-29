import Media from './Media.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { CONTACT } from '../config.js'
import { intercepterNavigation, urlAPropos } from '../utils/navigation.js'

const POINTS = [
  'Bouquets personnalisés selon votre budget',
  'Fleurs fraîches sélectionnées avec soin',
  'Terrariums et créations faits main',
  'Livraison partout à Conakry, paiement à la réception',
]

function About({ onAller }) {
  return (
    <section className="about" id="apropos">
      <div className="container">
        <Reveal variant="left">
          <div className="about-visual">
            <Media variant="soft" label="Photo de la boutique" />
          </div>
        </Reveal>
        <Reveal variant="right" delay={120}>
          <div className="about-content">
            <span className="eyebrow">À propos</span>
            <h2>Lizzirene Déco, by {CONTACT.founder}</h2>
            <p>
              Notre nouvelle boutique de fleurs a ouvert ses portes à Kipé.
              Nous vous y accueillons dans un espace chaleureux : bouquets,
              compositions florales élégantes, jolies plantes et fleurs
              fraîches choisies avec soin pour toutes vos occasions.
            </p>
            <p>
              Venez découvrir notre univers floral et partager avec nous cette
              belle aventure.
            </p>
            <p className="about-quote">
              « Votre confiance sera notre plus belle fleur. »
            </p>
            <ul className="about-points">
              {POINTS.map((p) => (
                <li key={p}>
                  <span className="check">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={urlAPropos()}
              className="btn btn-primary"
              onClick={(event) => {
                if (!intercepterNavigation(event)) return
                onAller?.('apropos')
              }}
            >
              Notre histoire
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default About
