import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

// ⚠ Témoignages provisoires — à remplacer par de vrais avis clients
// (commentaires Facebook / WhatsApp) avant la mise en ligne.
const TESTIMONIALS = [
  {
    quote:
      "Le bouquet d'anniversaire de ma mère était magnifique, livré à l'heure. Toute la famille en parle encore !",
    name: 'Aïssatou B.',
    role: 'Cliente fidèle',
  },
  {
    quote:
      'Lizzirene a entièrement décoré notre salon. Un goût sûr, des conseils précieux, un résultat au-delà de nos attentes.',
    name: 'Mariame & Ibrahima',
    role: 'Décoration d’intérieur',
  },
  {
    quote:
      "Packaging soigné et très professionnel pour les cadeaux de fin d'année de notre société. Je recommande vivement.",
    name: 'Ousmane C.',
    role: 'Client entreprise',
  },
]

function Testimonials() {
  return (
    <section className="testimonials" id="temoignages">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Témoignages</span>
            <h2>Ils nous ont fait confiance</h2>
            <p>La plus belle des récompenses : vos sourires et vos retours.</p>
          </div>
        </Reveal>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <article className="testimonial-card">
                <div className="stars" aria-label="5 étoiles sur 5">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Icon key={n} name="star" size={17} />
                  ))}
                </div>
                <blockquote>« {t.quote} »</blockquote>
                <div className="testimonial-author">
                  <div className="avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
