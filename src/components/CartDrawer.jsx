import { useCallback, useEffect, useRef, useState } from 'react'
import Media from './Media.jsx'
import Icon from './Icon.jsx'
import { SuggestionsPanier } from './SeMarieBienAvec.jsx'
import { useCart } from '../context/CartContext.jsx'
import { CONTACT, ZONES, formatPrice, waLink } from '../config.js'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function CartDrawer() {
  const {
    items,
    setQty,
    remove,
    clear,
    open,
    setOpen,
    count,
    total,
    totalMinimum,
  } = useCart()
  const [step, setStep] = useState('panier') // panier | commande | confirme
  const [order, setOrder] = useState(null)
  const [copie, setCopie] = useState(false)
  const copieTimerRef = useRef(null)
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const closeTimerRef = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    // Laisse l'animation se terminer avant de revenir au panier.
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setStep('panier'), 300)
  }, [setOpen])

  useEffect(
    () => () => {
      clearTimeout(closeTimerRef.current)
      clearTimeout(copieTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!open) return undefined

    clearTimeout(closeTimerRef.current)
    triggerRef.current = document.querySelector('.cart-btn')
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const drawer = drawerRef.current
      const focusables = Array.from(
        drawer?.querySelectorAll(FOCUSABLE_SELECTOR) || [],
      ).filter((element) => element.getClientRects().length > 0)

      if (focusables.length === 0) {
        event.preventDefault()
        drawer?.focus()
        return
      }

      const first = focusables[0]
      const last = focusables.at(-1)
      const focusDansTiroir = drawer?.contains(document.activeElement)

      if (
        event.shiftKey &&
        (!focusDansTiroir || document.activeElement === first)
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (!focusDansTiroir || document.activeElement === last)
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }, [close, open])

  // Le bouton actif disparaît lors des transitions panier → formulaire →
  // confirmation. Le focus revient alors au premier contrôle du tiroir.
  useEffect(() => {
    if (!open) return undefined

    const focusFrame = window.requestAnimationFrame(() => {
      if (!drawerRef.current?.contains(document.activeElement)) {
        closeButtonRef.current?.focus()
      }
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [open, step])

  const handleOrder = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))

    // Maquette : la commande part sur WhatsApp.
    // Plus tard : POST /commandes vers l'API NestJS.
    const lignes = items
      .map(
        (i) =>
          `• ${i.name} × ${i.qty} — ${formatPrice(i.price * i.qty)}${
            i.prixPrefixe ? ' minimum' : ''
          }`,
      )
      .join('\n')

    const message = [
      'Nouvelle commande — Lizzirene Déco',
      '',
      lignes,
      '',
      `TOTAL${totalMinimum ? ' MINIMUM' : ''} : ${formatPrice(total)}`,
      totalMinimum
        ? 'Les produits marqués “à partir de” peuvent varier selon la composition finale.'
        : null,
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

    setOrder({ nom: data.nom, link: waLink(message), message })
    setCopie(false)
    setStep('confirme')
  }

  // Secours quand wa.me ne s'ouvre pas (ordinateur sans WhatsApp, pop-up
  // bloquée) : le client copie le récapitulatif et l'envoie lui-même.
  const copierRecap = async () => {
    try {
      await navigator.clipboard.writeText(order.message)
    } catch {
      // Contexte non sécurisé ou permission refusée : repli textarea.
      const zone = document.createElement('textarea')
      zone.value = order.message
      zone.setAttribute('readonly', '')
      zone.style.position = 'fixed'
      zone.style.opacity = '0'
      document.body.appendChild(zone)
      zone.select()
      document.execCommand('copy')
      zone.remove()
    }
    setCopie(true)
    clearTimeout(copieTimerRef.current)
    copieTimerRef.current = setTimeout(() => setCopie(false), 2500)
  }

  // Le panier n'est vidé que lorsque le client confirme l'envoi : un clic
  // sur wa.me qui échoue ne doit pas détruire un panier composé avec soin.
  const confirmerEnvoi = () => {
    clear()
    close()
  }

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'show' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        aria-hidden={!open}
        tabIndex={-1}
      >
        <header className="drawer-head">
          <h3>
            {step === 'panier' && `Mon panier${count ? ` (${count})` : ''}`}
            {step === 'commande' && 'Préparer la commande'}
            {step === 'confirme' && 'Commande prête à envoyer'}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="drawer-close"
            aria-label="Fermer"
          >
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
                        <div className="price-stack">
                          {i.prixPrefixe && (
                            <small className="price-prefix">
                              {i.prixPrefixe}
                            </small>
                          )}
                          <span className="price">{formatPrice(i.price)}</span>
                        </div>
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

              {/* L'accessoire naturel du panier (vase avec le bouquet,
                  cache-pot avec la plante), proposé sans quitter le tiroir. */}
              <SuggestionsPanier />
            </div>

            {items.length > 0 && (
              <footer className="drawer-foot">
                <div className="cart-total">
                  <span>
                    {totalMinimum ? 'Total minimum' : 'Total'}
                  </span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <p className="cart-note">
                  <Icon name="cash" size={17} />
                  {totalMinimum
                    ? 'Certains produits sont affichés à partir de ce montant.'
                    : "Paiement à la livraison · frais de livraison confirmés avec vous avant l'envoi."}
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
              <span>
                {totalMinimum
                  ? 'Total minimum à payer à la livraison'
                  : 'Total à payer à la livraison'}
              </span>
              <strong>{formatPrice(total)}</strong>
            </div>
            {totalMinimum && (
              <p className="checkout-price-note">
                Les produits marqués “à partir de” peuvent varier selon la
                composition finale.
              </p>
            )}

            <button type="submit" className="btn btn-primary">
              Préparer l’envoi
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

        {/* --- Étape 3 : envoi vers WhatsApp --- */}
        {step === 'confirme' && order && (
          <div className="drawer-body confirm">
            <div className="confirm-icon">
              <Icon name="check" size={34} strokeWidth={2} />
            </div>
            <h4>Merci {order.nom} !</h4>
            <p>
              Votre récapitulatif est prêt. Envoyez-le maintenant sur WhatsApp
              pour transmettre la commande et confirmer la livraison.
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
            <button
              type="button"
              className="btn btn-outline confirm-copier"
              onClick={copierRecap}
            >
              <Icon name={copie ? 'check' : 'copier'} size={17} />
              {copie ? 'Récapitulatif copié !' : 'Copier le récapitulatif'}
            </button>
            <p className="confirm-alt">
              Ou appelez-nous au{' '}
              <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
                {CONTACT.phoneDisplay}
              </a>
            </p>
            <button className="btn btn-primary" onClick={confirmerEnvoi}>
              J’ai bien envoyé ma commande
            </button>
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
