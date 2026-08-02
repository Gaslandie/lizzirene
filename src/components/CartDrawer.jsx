import { useCallback, useEffect, useRef, useState } from 'react'
import Media from './Media.jsx'
import Icon from './Icon.jsx'
import { SuggestionsPanier } from './SeMarieBienAvec.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { CONTACT, ZONES, formatPrice, waLink } from '../config.js'
import { apiRequest } from '../services/api.js'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const dateIsoConakry = () => {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Conakry',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

function CartDrawer({ onAller }) {
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
  const { user } = useAuth()
  const [step, setStep] = useState('panier') // panier | choix | commande | confirme
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deliveryMode, setDeliveryMode] = useState('delivery')
  const [differentRecipient, setDifferentRecipient] = useState(false)
  const [copie, setCopie] = useState(false)
  const copieTimerRef = useRef(null)
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const idempotencyRef = useRef(null)
  const submittingRef = useRef(false)

  const close = useCallback((options = {}) => {
    if (submittingRef.current) return
    const resetConfirmation = options?.reset === true
    setOpen(false)
    if (resetConfirmation || step !== 'confirme') {
      idempotencyRef.current = null
    }
    // Laisse l'animation se terminer avant de revenir au panier.
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      if (resetConfirmation || step !== 'confirme') {
        setStep('panier')
        setOrder(null)
        setError('')
        setCopie(false)
        setDifferentRecipient(false)
        setDeliveryMode('delivery')
      }
    }, 300)
  }, [setOpen, step])

  // Un rattachement réussi vide le panier depuis la page de connexion. Dans
  // ce cas, retirer aussi la confirmation conservée dans le tiroir.
  useEffect(() => {
    if (open || items.length > 0 || !order) return
    idempotencyRef.current = null
    setStep('panier')
    setOrder(null)
    setError('')
    setCopie(false)
  }, [items.length, open, order])

  useEffect(
    () => () => {
      clearTimeout(closeTimerRef.current)
      clearTimeout(copieTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!open) return undefined

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

  const handleOrder = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    setError('')
    setSubmitting(true)
    submittingRef.current = true

    const lignes = items
      .map(
        (i) =>
          `• ${i.name} × ${i.qty} — ${formatPrice(i.price * i.qty)}${
            i.prixPrefixe ? ' minimum' : ''
          }`,
      )
      .join('\n')

    const message = [
      'Nouvelle demande — Lizzirene Déco',
      '',
      lignes,
      '',
      `TOTAL${totalMinimum ? ' MINIMUM' : ''} : ${formatPrice(total)}`,
      totalMinimum
        ? 'Les produits marqués “à partir de” peuvent varier selon la composition finale.'
        : null,
      '',
      `Nom : ${data.nom}`,
      `Téléphone : ${data.telephone}`,
      data.deliveryMode === 'pickup'
        ? 'Retrait souhaité à la boutique de Kipé'
        : `Commune : ${data.zone}`,
      data.deliveryMode === 'delivery' ? `Quartier : ${data.quartier}` : null,
      data.deliveryMode === 'delivery' ? `Adresse / repère : ${data.adresse}` : null,
      data.date ? `Livraison souhaitée : ${data.date}` : null,
      data.destinataireNom ? `Destinataire : ${data.destinataireNom}` : null,
      data.destinataireTelephone
        ? `Téléphone destinataire : ${data.destinataireTelephone}`
        : null,
      data.messageCarte ? `Message carte : ${data.messageCarte}` : null,
      data.note ? `Précision : ${data.note}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    if (!idempotencyRef.current) {
      idempotencyRef.current =
        globalThis.crypto?.randomUUID?.() ||
        `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}`
    }

    try {
      const created = await apiRequest('/orders', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyRef.current },
        body: {
          name: data.nom,
          phone: data.telephone,
          email: data.email || null,
          deliveryMode: data.deliveryMode,
          commune: data.deliveryMode === 'delivery' ? data.zone : null,
          quartier: data.deliveryMode === 'delivery' ? data.quartier : null,
          addressLandmark:
            data.deliveryMode === 'delivery' ? data.adresse : null,
          desiredDate: data.date || null,
          recipientName: data.destinataireNom || null,
          recipientPhone: data.destinataireTelephone || null,
          cardMessage: data.messageCarte || null,
          note: data.note || null,
          items: items.map((item) => ({ id: item.id, quantity: item.qty })),
        },
      })

      setOrder({
        ...created,
        nom: created.customer.name,
        link: created.whatsappUrl || waLink(created.whatsappMessage),
        message: created.whatsappMessage,
        offline: false,
      })
      setCopie(false)
      setStep('confirme')
    } catch (requestError) {
      const fallbackAllowed =
        requestError.status === 0 ||
        requestError.status >= 500 ||
        ['configuration_required', 'database_unavailable', 'invalid_response'].includes(
          requestError.code,
        )

      if (!fallbackAllowed) {
        setError(requestError.message)
        return
      }

      const offlineMessage = [
        'Demande WhatsApp — Lizzirene Déco',
        'Le catalogue en ligne est momentanément indisponible : prix et disponibilités à confirmer.',
        '',
        ...message.split('\n').slice(1),
      ].join('\n')
      setOrder({
        nom: data.nom,
        link: waLink(offlineMessage),
        message: offlineMessage,
        reference: null,
        claimToken: null,
        publicToken: null,
        offline: true,
      })
      setCopie(false)
      setStep('confirme')
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
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
    idempotencyRef.current = null
    close({ reset: true })
  }

  const naviguerDepuisPanier = (page, options) => {
    close()
    window.setTimeout(() => onAller?.(page, options), 320)
  }

  const commencerCommande = () => {
    idempotencyRef.current = null
    setOrder(null)
    setError('')
    setStep(user ? 'commande' : 'choix')
  }

  const dateConakry = dateIsoConakry()
  const dateMax = new Date(`${dateConakry}T00:00:00Z`)
  dateMax.setUTCFullYear(dateMax.getUTCFullYear() + 1)
  const dateMaximum = dateMax.toISOString().slice(0, 10)

  const ouvrirWhatsApp = () => {
    if (!order?.reference || !order?.publicToken) return
    apiRequest(
      `/orders/${encodeURIComponent(order.reference)}/whatsapp-opened`,
      {
        method: 'POST',
        body: { token: order.publicToken },
      },
    ).catch(() => {})
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
            {step === 'choix' && 'Comment continuer ?'}
            {step === 'commande' && 'Préparer la commande'}
            {step === 'confirme' && 'Commande prête à envoyer'}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="drawer-close"
            aria-label="Fermer"
            disabled={submitting}
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
                            disabled={i.qty >= 20}
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
                  onClick={commencerCommande}
                >
                  Commander
                  <Icon name="arrow" size={18} />
                </button>
              </footer>
            )}
          </>
        )}

        {/* --- Choix facultatif du compte --- */}
        {step === 'choix' && (
          <div className="drawer-body checkout-choice">
            <div className="checkout-choice-main">
              <Icon name="whatsapp" size={26} />
              <h4>Commander rapidement</h4>
              <p>
                Aucun compte nécessaire. Nous enregistrons la demande puis vous
                ouvrez WhatsApp pour confirmer avec la boutique.
              </p>
              <button
                className="btn btn-whatsapp"
                onClick={() => setStep('commande')}
              >
                Continuer sans compte
              </button>
            </div>

            <div className="checkout-account-option">
              <span className="checkout-separator">ou</span>
              <h4>Utiliser mon espace client</h4>
              <ul>
                <li><Icon name="check" size={15} /> Suivre la commande</li>
                <li><Icon name="check" size={15} /> Retrouver l’historique</li>
                <li><Icon name="check" size={15} /> Adresse mémorisée après la commande</li>
              </ul>
              <div className="checkout-account-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => naviguerDepuisPanier('inscription', { returnTo: 'commande' })}
                >
                  Créer mon compte
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => naviguerDepuisPanier('connexion', { returnTo: 'commande' })}
                >
                  J’ai déjà un compte
                </button>
              </div>
            </div>
            <button className="link-back" onClick={() => setStep('panier')}>
              Retour au panier
            </button>
          </div>
        )}

        {/* --- Étape 2 : les coordonnées de livraison --- */}
        {step === 'commande' && (
          <form className="drawer-body checkout" onSubmit={handleOrder}>
            <div className="cod-badge checkout-info-badge">
              <Icon name="whatsapp" size={20} />
              <span>
                <strong>Demande enregistrée puis WhatsApp</strong> — la boutique
                confirme ensuite la disponibilité, le délai et la livraison.
              </span>
            </div>

            {user && (
              <p className="checkout-connected">
                <Icon name="user" size={17} /> Commande rattachée au compte de {user.name}.
                Votre adresse sera mémorisée si vous choisissez la livraison.
              </p>
            )}
            {error && <p className="form-alert" role="alert">{error}</p>}

            <label>
              Nom complet
              <input
                name="nom"
                type="text"
                required
                defaultValue={user?.name || ''}
                autoComplete="name"
                placeholder="Votre nom"
              />
            </label>
            <label>
              Téléphone
              <input
                name="telephone"
                type="tel"
                required
                defaultValue={user?.phone || ''}
                autoComplete="tel"
                inputMode="tel"
                placeholder="6XX XX XX XX"
              />
            </label>
            <label>
              E-mail <small>(facultatif)</small>
              <input
                name="email"
                type="email"
                defaultValue={user?.email || ''}
                autoComplete="email"
                placeholder="Pour votre reçu ou votre compte"
              />
            </label>
            <fieldset className="checkout-mode">
              <legend>Comment souhaitez-vous recevoir la commande ?</legend>
              <label>
                <input
                  type="radio"
                  name="deliveryMode"
                  value="delivery"
                  checked={deliveryMode === 'delivery'}
                  onChange={() => setDeliveryMode('delivery')}
                />
                Livraison à Conakry
              </label>
              <label>
                <input
                  type="radio"
                  name="deliveryMode"
                  value="pickup"
                  checked={deliveryMode === 'pickup'}
                  onChange={() => setDeliveryMode('pickup')}
                />
                Retrait à la boutique de Kipé
              </label>
            </fieldset>
            {deliveryMode === 'delivery' && (
              <>
            <label>
              Commune de livraison
              <select name="zone" required defaultValue={user?.commune || ''}>
                <option value="" disabled>
                  Choisir une commune
                </option>
                {ZONES.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </label>
            <label>
              Quartier
              <input
                name="quartier"
                type="text"
                required
                defaultValue={user?.quartier || ''}
                placeholder="Ex : Kipé, Nongo, Lambanyi…"
              />
            </label>
            <label>
              Adresse / repère
              <input
                name="adresse"
                type="text"
                required
                defaultValue={user?.addressLandmark || ''}
                placeholder="Rue, immeuble ou point de repère connu"
              />
            </label>
              </>
            )}
            <label>
              Date souhaitée
              <input
                name="date"
                type="date"
                min={dateConakry}
                max={dateMaximum}
              />
            </label>
            <label className="checkout-recipient-toggle">
              <input
                type="checkbox"
                checked={differentRecipient}
                onChange={(event) => setDifferentRecipient(event.target.checked)}
              />
              <span>La commande est destinée à une autre personne</span>
            </label>
            {differentRecipient && (
              <div className="checkout-recipient-fields">
                <label>
                  Nom du destinataire
                  <input name="destinataireNom" required />
                </label>
                <label>
                  Téléphone du destinataire <small>(facultatif)</small>
                  <input name="destinataireTelephone" type="tel" inputMode="tel" />
                </label>
              </div>
            )}
            <label>
              Message sur la carte (optionnel)
              <textarea
                name="messageCarte"
                rows="3"
                placeholder="Ex : Joyeux anniversaire Maman"
              />
            </label>
            <label>
              Précision pour la boutique (optionnel)
              <textarea
                name="note"
                rows="3"
                placeholder="Couleurs, heure, consigne particulière…"
              />
            </label>

            <div className="cart-total">
              <span>
                {totalMinimum
                  ? `Total minimum ${deliveryMode === 'pickup' ? 'au retrait' : 'à payer à la livraison'}`
                  : `Total ${deliveryMode === 'pickup' ? 'au retrait' : 'à payer à la livraison'}`}
              </span>
              <strong>{formatPrice(total)}</strong>
            </div>
            {totalMinimum && (
              <p className="checkout-price-note">
                Les produits marqués “à partir de” peuvent varier selon la
                composition finale.
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement…' : 'Enregistrer et continuer sur WhatsApp'}
            </button>
            <button
              type="button"
              className="link-back"
              onClick={() => setStep(user ? 'panier' : 'choix')}
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
            {order.reference ? (
              <>
                <p className="confirm-reference">Référence <strong>{order.reference}</strong></p>
                <p>
                  Votre demande est enregistrée. Envoyez maintenant le
                  récapitulatif sur WhatsApp ; la boutique confirmera ensuite la
                  disponibilité et la livraison.
                </p>
              </>
            ) : (
              <p className="form-alert form-alert-warning">
                L’enregistrement en ligne est momentanément indisponible. Votre
                récapitulatif reste prêt à être envoyé directement sur WhatsApp.
              </p>
            )}
            <a
              className="btn btn-whatsapp"
              href={order.link}
              target="_blank"
              rel="noreferrer"
              onClick={ouvrirWhatsApp}
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
            {!user && order.claimToken && (
              <div className="confirm-account-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    naviguerDepuisPanier('inscription', {
                      claimToken: order.claimToken,
                      reference: order.reference,
                    })
                  }
                >
                  Créer mon compte et suivre cette commande
                </button>
                <button
                  type="button"
                  className="admin-text-button"
                  onClick={() =>
                    naviguerDepuisPanier('connexion', {
                      claimToken: order.claimToken,
                      reference: order.reference,
                    })
                  }
                >
                  J’ai déjà un compte
                </button>
              </div>
            )}
            {user?.role === 'customer' && order.reference && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  naviguerDepuisPanier('compte-commande', {
                    reference: order.reference,
                  })
                }
              >
                Voir le suivi dans mon espace
              </button>
            )}
            <p className="confirm-alt">
              Ou appelez-nous au{' '}
              <a href={`tel:+224${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>
                {CONTACT.phoneDisplay}
              </a>
            </p>
            <button className="btn btn-primary" onClick={confirmerEnvoi}>
              Terminer et vider mon panier
            </button>
            <button className="link-back" onClick={confirmerEnvoi}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
