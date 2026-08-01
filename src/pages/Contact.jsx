import Contact from '../components/Contact.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import Faq from '../components/Faq.jsx'
import { QUESTIONS } from '../data/faq.js'
import { CONTACT, waLink } from '../config.js'

const CARTE_LIEN = `https://www.google.com/maps?q=${encodeURIComponent(
  'Kipé, Conakry, Guinée',
)}`
const CARTE_EMBED = `${CARTE_LIEN}&output=embed`

function PageContact() {
  return (
    <>
      <header className="page-hero page-hero--catalogue">
        <div className="container">
          <div className="catalogue-entete">
            <div>
              <span className="eyebrow">Contact</span>
              <h1 tabIndex={-1}>Parlons de votre projet</h1>
              <p>
                Un bouquet à offrir, un intérieur à fleurir, un événement à
                décorer ? Nous vous répondons 7j/7 — et la boutique de Kipé
                vous accueille toute la semaine.
              </p>
            </div>
            <div className="contact-entete-actions">
              <a
                href={waLink('Bonjour Lizzirene Déco !')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <Icon name="whatsapp" size={19} />
                {CONTACT.whatsappDisplay}
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                className="btn btn-outline"
              >
                <Icon name="phone" size={18} />
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Coordonnées détaillées + formulaire de devis */}
      <Contact />

      <section className="carte">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Nous trouver</span>
              <h2>La boutique vous attend à Kipé</h2>
            </div>
          </Reveal>
          <Reveal variant="zoom">
            <div className="carte-card">
              <iframe
                src={CARTE_EMBED}
                title="Carte — Lizzirene Déco, Kipé, Conakry"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="carte-info">
                <span className="carte-badge">
                  <Icon name="pin" size={20} />
                </span>
                <strong>{CONTACT.address}</strong>
                <span>{CONTACT.addressDetail}</span>
                <span className="hours-lines">
                  {CONTACT.hours.map((ligne) => (
                    <span key={ligne}>{ligne}</span>
                  ))}
                </span>
                <a
                  className="btn btn-outline"
                  href={CARTE_LIEN}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir dans Google Maps
                  <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Questions fréquentes</h2>
            </div>
          </Reveal>
          <Faq questions={QUESTIONS} />
        </div>
      </section>
    </>
  )
}

export default PageContact
