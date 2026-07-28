import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { waLink } from '../config.js'
import { intercepterNavigation, urlContact } from '../utils/navigation.js'

// Bandeau de fin d'accueil : il garde l'ancre #contact (utilisée par le
// bouton « Venir à la boutique » de la section À propos) et mène vers la
// page Contact complète.
function ContactCta({ onAller }) {
  return (
    <section className="contact-cta" id="contact">
      <div className="container">
        <Reveal variant="zoom">
          <div className="contact-cta-box">
            <div>
              <span className="eyebrow">Contact</span>
              <h2>Parlons de votre projet</h2>
              <p>
                Adresse, horaires, formulaire de devis et questions
                fréquentes : tout est sur notre page contact — ou écrivez-nous
                directement sur WhatsApp.
              </p>
            </div>
            <div className="contact-cta-actions">
              <a
                href={urlContact()}
                className="btn btn-accent"
                onClick={(e) => {
                  if (!intercepterNavigation(e)) return
                  onAller?.('contact')
                }}
              >
                Ouvrir la page contact
                <Icon name="arrow" size={18} />
              </a>
              <a
                href={waLink('Bonjour Lizzirene Déco !')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <Icon name="whatsapp" size={19} />
                Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ContactCta
