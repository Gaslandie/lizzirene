import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { CONTACT, waLink } from '../config.js'

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Maquette : le formulaire sera branché sur le backend NestJS plus tard.
    alert('Merci ! Votre demande a bien été prise en compte (démo).')
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <Reveal variant="left">
          <div className="contact-info">
            <h2>Passez nous voir à Kipé</h2>
            <p>
              Une envie de fleurs, un événement à décorer, un cadeau à
              préparer ? Écrivez-nous ou venez découvrir la boutique.
            </p>
            <ul className="contact-list">
              <li>
                <span className="ico">
                  <Icon name="pin" size={21} />
                </span>
                <div>
                  <strong>{CONTACT.address}</strong>
                  <span>{CONTACT.addressDetail}</span>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="phone" size={21} />
                </span>
                <div>
                  <strong>Téléphone</strong>
                  <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="whatsapp" size={21} />
                </span>
                <div>
                  <strong>WhatsApp & catalogue</strong>
                  <a
                    href={waLink('Bonjour Lizzirene Déco !')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {CONTACT.whatsappDisplay}
                  </a>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="mail" size={21} />
                </span>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="clock" size={21} />
                </span>
                <div>
                  <strong>Horaires</strong>
                  <span>{CONTACT.hours}</span>
                </div>
              </li>
            </ul>
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! J’ai un projet à vous confier.',
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <Icon name="whatsapp" size={19} />
              Discuter sur WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Demande de devis</h3>
            <div className="form-row">
              <input type="text" placeholder="Votre nom" required />
              <input type="tel" placeholder="Votre téléphone" required />
            </div>
            <select defaultValue="">
              <option value="" disabled>
                Type de demande
              </option>
              <option>Bouquet personnalisé</option>
              <option>Composition ou terrarium</option>
              <option>Box cadeau</option>
              <option>Décoration d'intérieur</option>
              <option>Événement (mariage, anniversaire…)</option>
            </select>
            <textarea placeholder="Décrivez votre projet…" />
            <button type="submit" className="btn btn-primary">
              Envoyer ma demande
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
