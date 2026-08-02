import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../services/api.js'
import { formatPrice } from '../config.js'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  formatOrderDay,
  formatOrderDate,
} from '../utils/orderStatus.js'

function CommandeClient({ reference, onAller }) {
  const { user, loading } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !reference) return
    let active = true
    setOrder(null)
    setError('')
    apiRequest(`/me/orders/${encodeURIComponent(reference)}`)
      .then((data) => { if (active) setOrder(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [reference, user])

  if (loading) return <div className="page-state">Chargement…</div>
  if (!user) {
    return (
      <div className="page-state">
        <h1>Connexion nécessaire</h1>
        <button className="btn btn-primary" onClick={() => onAller?.('connexion')}>
          Se connecter
        </button>
      </div>
    )
  }
  if (error) return <div className="page-state"><h1>Commande introuvable</h1><p>{error}</p></div>
  if (!order) return <div className="page-state">Chargement de la commande…</div>

  return (
    <section className="account-page">
      <div className="account-shell order-detail-page">
        <button className="link-back" onClick={() => onAller?.('compte')}>
          ← Retour à mon espace
        </button>
        <header className="order-detail-heading">
          <div>
            <span className="eyebrow">Commande {order.reference}</span>
            <h1 tabIndex={-1}>{ORDER_STATUS_LABELS[order.status] || order.status}</h1>
            <p>Demande créée le {formatOrderDate(order.createdAt)}</p>
          </div>
          <span className={`status-badge status-${ORDER_STATUS_TONES[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </header>

        {order.status === 'awaiting_whatsapp' && (
          <div className="form-alert form-alert-warning">
            <strong>Cette demande n’est pas encore confirmée.</strong>
            <span>La boutique la confirmera après votre échange WhatsApp.</span>
            {order.whatsappUrl && (
              <a
                className="btn btn-whatsapp"
                href={order.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                Envoyer le récapitulatif sur WhatsApp
              </a>
            )}
          </div>
        )}

        <div className="account-grid">
          <div className="account-panel">
            <h2>Articles</h2>
            <ul className="order-items-detail">
              {order.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name} × {item.quantity}{item.description && <small>{item.description}</small>}</span>
                  <strong>{formatPrice(item.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <div className="order-total-detail">
              <span>{order.totalIsMinimum ? 'Total minimum' : 'Total'}</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            {order.priceAdjustment !== 0 && (
              <p className="order-adjustment">
                Ajustement : {order.adjustmentReason} ({order.priceAdjustment > 0 ? '+' : '−'}{formatPrice(Math.abs(order.priceAdjustment))})
              </p>
            )}
            {order.deliveryFee != null && (
              <p className="order-adjustment">Livraison : {formatPrice(order.deliveryFee)}</p>
            )}
            {order.delivery.mode === 'delivery' && order.deliveryFee == null && <small>Frais de livraison à confirmer.</small>}
            <p className="payment-state">Paiement : <strong>{PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}</strong></p>
          </div>

          <div className="account-panel">
            <h2>Livraison</h2>
            {order.delivery.mode === 'pickup' ? (
              <div>
                <p>Retrait à la boutique de Kipé.</p>
                {order.delivery.desiredDate && <p>Date souhaitée : {formatOrderDay(order.delivery.desiredDate)}</p>}
              </div>
            ) : (
              <dl className="order-data-list">
                <div><dt>Commune</dt><dd>{order.delivery.commune}</dd></div>
                <div><dt>Quartier</dt><dd>{order.delivery.quartier}</dd></div>
                <div><dt>Repère</dt><dd>{order.delivery.addressLandmark}</dd></div>
                {order.delivery.desiredDate && (
                  <div><dt>Date souhaitée</dt><dd>{formatOrderDay(order.delivery.desiredDate)}</dd></div>
                )}
              </dl>
            )}
          </div>
        </div>

        {(order.recipient || order.cardMessage || order.note) && (
          <div className="account-panel">
            <h2>Informations pour la préparation</h2>
            <dl className="order-data-list">
              {order.recipient && <>
                <div><dt>Destinataire</dt><dd>{order.recipient.name || 'Non précisé'}</dd></div>
                {order.recipient.phone && <div><dt>Téléphone</dt><dd>{order.recipient.phone}</dd></div>}
              </>}
              {order.cardMessage && <div><dt>Message carte</dt><dd>{order.cardMessage}</dd></div>}
              {order.note && <div><dt>Précision</dt><dd>{order.note}</dd></div>}
            </dl>
          </div>
        )}

        {order.events?.length > 0 && (
          <div className="account-panel order-timeline">
            <h2>Suivi</h2>
            <ol>
              {order.events.map((event, index) => (
                <li key={`${event.createdAt}-${index}`}>
                  <Icon name="check" size={16} />
                  <div><strong>{event.message}</strong><small>{formatOrderDate(event.createdAt)}</small></div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}

export default CommandeClient
