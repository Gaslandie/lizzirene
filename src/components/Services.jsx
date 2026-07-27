import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

const SERVICES = [
  {
    icon: 'flower',
    title: 'Bouquets personnalisés',
    text: "Composés à la main selon votre budget et l'occasion — de la simple attention au grand geste.",
  },
  {
    icon: 'leaf',
    title: 'Fleurs fraîches & plantes',
    text: 'Fleurs sélectionnées avec soin et jolies plantes vertes pour la maison ou le bureau.',
  },
  {
    icon: 'gift',
    title: 'Box cadeaux & packaging',
    text: 'Soins, chocolats, peluches et surprises romantiques dans un emballage soigné.',
  },
  {
    icon: 'sparkles',
    title: 'Décoration florale',
    text: 'Intérieurs, vitrines et événements : nous habillons vos espaces de fleurs.',
  },
]

function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Notre univers</span>
            <h2>Tout pour faire battre les cœurs</h2>
            <p>
              Venez découvrir un espace chaleureux où chaque création est
              pensée pour transmettre une émotion.
            </p>
          </div>
        </Reveal>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <article className="service-card">
                <span className="service-icon">
                  <Icon name={s.icon} size={28} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
