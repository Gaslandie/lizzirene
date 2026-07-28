import { useState } from 'react'
import Media from './Media.jsx'
import Icon from './Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { CONTACT, ZONES, formatPrice, waLink } from '../config.js'

function CartDrawer() {
  const { items, setQty, remove, clear, open, setOpen, count, total } = useCart()
  const [step, setStep] = useState('panier') // panier | commande | confirme
  const [order, setOrder] = useState(null)

  const close = () => {
    setOpen(false)
    // Laisse l'animation se terminer avant de revenir au panier.
    setTimeout(() => setStep('panier'), 300)
  }

  const handleOrder = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))

    // Maquette : la commande part sur WhatsApp.
    // Plus tard : POST /commandes vers l'API NestJS.
    const lignes = items
      .map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.price * i.qty)}`)
      .join('\n')

    const message = [
      'Nouvelle commande — Lizzirene Déco',
      '',
      lignes,
      '',
      `TOTAL : ${formatPrice(total)}`,
      'Paiement à la livraison',
      '',
      `Nom : ${data.nom}`,
      `Téléphone : ${data.telephone}`,
      `Commune : ${data.zone}`,
      `Adresse : ${data.adresse}`,
      data.date ? `Livraison souhaitée : ${data.date}` : null,
      data.note ? `Note : ${data.note}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    setOrder({ nom: data.nom, link: waLink(message) })
    setStep('confirme')
    clear()
  }

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'show' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? 'open' : ''}`}
        aria-label="Panier"
        aria-hidden={!open}
      >
        <header className="drawer-head">
          <h3>
            {step === 'panier' && `Mon panier${count ? ` (${count})` : ''}`}
            {step === 'commande' && 'Finaliser la commande'}
            {step === 'confirme' && 'Commande enregistrée'}
          </h3>
          <button onClick={close} className="drawer-close" aria-label="Fermer">
            <Icon name="close" size={22} />
          </button>
        </header>

        {/* --- Étape 1 : le panier --- */}
        {step === 'panier' && (
          <>
            <div className="drawer-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <span className="cart-empty-icon">
                    <Icon name="bag" size={38} strokeWidth={1.3} />
                  </span>
                  <p>Votre panier est vide.</p>
                  <button className="btn btn-outline" onClick={close}>
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <ul className="cart-list">
                  {items.map((i) => (
                    <li className="cart-item" key={i.id}>
                      <Media
                        src={i.src}
                        srcSet={i.srcSet}
                        sizes="84px"
                        alt={i.alt}
                        width={i.width}
                        height={i.height}
                        variant={i.variant}
                        label={i.name}
                      />
                      <div className="cart-item-info">
                        <strong>{i.name}</strong>
                        <span className="price">{formatPrice(i.price)}</span>
                        <div className="qty">
                          <button
                            onClick={() => setQty(i.id, i.qty - 1)}
                            aria-label={`Retirer un ${i.name}`}
                          >
                            <Icon name="minus" size={16} />
                          </button>
                          <span>{i.qty}</span>
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            aria-label={`Ajouter un ${i.name}`}
                          >
                            <Icon name="plus" size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="cart-remove"
                        onClick={() => remove(i.id)}
                        aria-label={`Supprimer ${i.name}`}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="drawer-foot">
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <p className="cart-note">
                  <Icon name="cash" size={17} />
                  Paiement à la livraison · frais de livraison confirmés avec
                  vous avant l'envoi.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep('commande')}
                >
                  Commander
                  <Icon name="arrow" size={18} />
                </button>
              </footer>
            )}
          </>
        )}

        {/* --- Étape 2 : les coordonnées de livraison --- */}
        {step === 'commande' && (
          <form className="drawer-body checkout" onSubmit={handleOrder}>
            <div className="cod-badge">
              <Icon name="cash" size={20} />
              <span>
                <strong>Paiement à la livraison</strong> — vous réglez en
                espèces à la réception de votre commande.
              </span>
            </div>

            <label>
              Nom complet
              <input name="nom" type="text" required placeholder="Votre nom" />
            </label>
            <label>
              Téléphone
              <input
                name="telephone"
                type="tel"
                required
                placeholder="6XX XX XX XX"
              />
            </label>
            <label>
              Commune de livraison
              <select name="zone" required defaultValue="">
                <option value="" disabled>
                  Choisir une commune
                </option>
                {ZONES.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </label>
            <label>
              Adresse / repère
              <input
                name="adresse"
                type="text"
                required
                placeholder="Quartier, rue, point de repère"
              />
            </label>
            <label>
              Date de livraison souhaitée
              <input name="date" type="date" />
            </label>
            <label>
              Message sur la carte (optionnel)
              <textarea
                name="note"
                rows="3"
                placeholder="Ex : Joyeux anniversaire Maman"
              />
            </label>

            <div className="cart-total">
              <span>Total à payer à la livraison</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button type="submit" className="btn btn-primary">
              Valider ma commande
            </button>
            <button
              type="button"
              className="link-back"
              onClick={() => setStep('panier')}
            >
              Retour au panier
            </button>
          </form>
        )}

        {/* --- Étape 3 : confirmation --- */}
        {step === 'confirme' && order && (
          <div className="drawer-body confirm">
            <div className="confirm-icon">
              <Icon name="check" size={34} strokeWidth={2} />
            </div>
            <h4>Merci {order.nom} !</h4>
            <p>
              Votre commande est enregistrée. Envoyez-la maintenant sur
              WhatsApp pour que nous confirmions la livraison et le montant
              final.
            </p>
            <a
              className="btn btn-whatsapp"
              href={order.link}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={19} />
              Envoyer ma commande sur WhatsApp
            </a>
            <p className="confirm-alt">
              Ou appelez-nous au{' '}
              <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
                {CONTACT.phoneDisplay}
              </a>
            </p>
            <button className="link-back" onClick={close}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
