import Contact from '../components/Contact.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { CONTACT, waLink } from '../config.js'

const CARTE_LIEN = `https://www.google.com/maps?q=${encodeURIComponent(
  'Kipé, Conakry, Guinée',
)}`
const CARTE_EMBED = `${CARTE_LIEN}&output=embed`

// Réponses alignées sur ce que le site promet déjà — rien d'inventé.
const QUESTIONS = [
  {
    q: 'Comment passer commande ?',
    r: 'Ajoutez vos articles au panier depuis la boutique, indiquez votre adresse, puis envoyez le récapitulatif sur WhatsApp : nous confirmons la commande et la livraison. Vous pouvez aussi nous appeler ou passer directement à la boutique à Kipé.',
  },
  {
    q: 'Comment se passe le paiement ?',
    r: 'Le paiement se fait à la livraison, en espèces, à la réception de votre commande. Aucun paiement en ligne n’est demandé.',
  },
  {
    q: 'Livrez-vous partout à Conakry ?',
    r: 'Oui, nous livrons dans toutes les communes de Conakry, 7j/7. Les frais de livraison sont confirmés avec vous sur WhatsApp avant l’envoi.',
  },
  {
    q: 'Peut-on personnaliser un bouquet ?',
    r: 'Bien sûr — c’est notre spécialité. Dites-nous l’occasion, vos couleurs et votre budget : nos tarifs provisoires démarrent à 300 000 GNF et sont confirmés avec vous avant la préparation.',
  },
  {
    q: 'Décorez-vous les événements ?',
    r: 'Oui : mariages, anniversaires, réceptions et événements d’entreprise. Écrivez-nous sur WhatsApp pour un devis gratuit, nous imaginons le décor avec vous.',
  },
]

function PageContact() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1 tabIndex={-1}>Parlons de votre projet</h1>
          <p>
            Un bouquet à offrir, un intérieur à fleurir, un événement à
            décorer ? Nous vous répondons 7j/7 — et la boutique de Kipé vous
            accueille toute la semaine.
          </p>
          <div className="page-hero-actions">
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
          <div className="faq-list">
            {QUESTIONS.map((item, i) => (
              <Reveal key={item.q} delay={i * 70}>
                <details className="faq-item" open={i === 0}>
                  <summary>
                    {item.q}
                    <Icon name="chevron" size={18} />
                  </summary>
                  <p>{item.r}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default PageContact
