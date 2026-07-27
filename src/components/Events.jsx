import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { waLink } from '../config.js'

const EVENTS = [
  {
    icon: 'gem',
    title: 'Mariages',
    text: "Décor de cérémonie, bouquet de la mariée, centres de table… un jour unique mérite un décor unique.",
  },
  {
    icon: 'cake',
    title: 'Anniversaires',
    text: "Bouquets d'anniversaire et mises en scène florales qui marquent les esprits.",
  },
  {
    icon: 'building',
    title: 'Entreprises & réceptions',
    text: 'Décoration de bureaux, inaugurations, séminaires et événements professionnels.',
  },
]

function Events() {
  return (
    <section className="events" id="evenements">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Événements</span>
            <h2>Nous décorons vos plus beaux moments</h2>
            <p>
              Confiez-nous votre événement : nous imaginons, installons et
              sublimons le décor de A à Z.
            </p>
          </div>
        </Reveal>
        <div className="events-grid">
          {EVENTS.map((e, i) => (
            <Reveal
              key={e.title}
              variant={['left', 'up', 'right'][i] || 'up'}
              delay={i * 100}
            >
              <article className="event-card">
                <span className="event-icon">
                  <Icon name={e.icon} size={30} />
                </span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="events-cta">
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! Je souhaite un devis pour un événement.',
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-accent"
            >
              Demander un devis gratuit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Events
