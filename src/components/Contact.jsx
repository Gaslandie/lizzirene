import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { CONTACT, waLink } from '../config.js'

function Contact() {
  // Le formulaire compose un message WhatsApp prêt à envoyer — même canal
  // que les commandes. Il sera doublé d'un POST vers l'API NestJS plus tard.
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const message = [
      'Demande de devis — site Lizzirene Déco',
      '',
      `Nom : ${data.nom}`,
      `Téléphone : ${data.telephone}`,
      data.type ? `Demande : ${data.type}` : null,
      data.message ? `Projet : ${data.message}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(message), '_blank', 'noopener')
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
                  <span className="hours-lines">
                    {CONTACT.hours.map((ligne) => (
                      <span key={ligne}>{ligne}</span>
                    ))}
                  </span>
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
              <input name="nom" type="text" placeholder="Votre nom" required />
              <input
                name="telephone"
                type="tel"
                placeholder="Votre téléphone"
                required
              />
            </div>
            <select name="type" defaultValue="">
              <option value="" disabled>
                Type de demande
              </option>
              <option>Bouquet personnalisé</option>
              <option>Fleurs artificielles</option>
              <option>Plantes, vases ou caches postes</option>
              <option>Box cadeau</option>
              <option>Tableaux ou matériel décoratif</option>
              <option>Luminaire professionnel</option>
              <option>Événement (mariage, anniversaire…)</option>
            </select>
            <textarea name="message" placeholder="Décrivez votre projet…" />
            <button type="submit" className="btn btn-primary">
              <Icon name="whatsapp" size={18} />
              Envoyer via WhatsApp
            </button>
            <p className="form-note">
              Votre demande s'ouvre dans WhatsApp — il ne reste qu'à appuyer
              sur Envoyer. Réponse rapide, 7j/7.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
