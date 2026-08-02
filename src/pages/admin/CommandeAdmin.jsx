import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.js'
import { formatPrice } from '../../config.js'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS_LABELS,
  formatOrderDay,
  formatOrderDate,
} from '../../utils/orderStatus.js'

function CommandeAdmin({ reference, onAller }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [deliveryMode, setDeliveryMode] = useState('delivery')

  useEffect(() => {
    let active = true
    setOrder(null)
    setError('')
    apiRequest(`/admin/orders/${encodeURIComponent(reference)}`)
      .then((data) => {
        if (active) {
          setOrder(data)
          setDeliveryMode(data.delivery.mode)
        }
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [reference])

  const save = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setSaving(true)
    setError('')
    setNotice('')
    const data = Object.fromEntries(new FormData(form))
    try {
      const updated = await apiRequest(`/admin/orders/${encodeURIComponent(reference)}`, {
        method: 'PATCH',
        body: {
          version: order.version,
          status: data.status,
          deliveryFee: data.deliveryFee === '' ? null : Number(data.deliveryFee),
          priceAdjustment: Number(data.priceAdjustment || 0),
          adjustmentReason: data.adjustmentReason || null,
          paymentStatus: data.paymentStatus,
          customerMessage: data.customerMessage || null,
          privateNote: data.privateNote || null,
        },
      })
      setOrder(updated)
      form.elements.customerMessage.value = ''
      form.elements.privateNote.value = ''
      setNotice('La commande a été mise à jour.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const saveDetails = async (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setDetailsSaving(true)
    setError('')
    setNotice('')
    try {
      const updated = await apiRequest(`/admin/orders/${encodeURIComponent(reference)}/details`, {
        method: 'PATCH',
        body: {
          version: order.version,
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          deliveryMode: data.deliveryMode,
          commune: data.deliveryMode === 'delivery' ? data.commune : null,
          quartier: data.deliveryMode === 'delivery' ? data.quartier : null,
          addressLandmark: data.deliveryMode === 'delivery' ? data.addressLandmark : null,
          desiredDate: data.desiredDate || null,
          recipientName: data.recipientName || null,
          recipientPhone: data.recipientPhone || null,
          cardMessage: data.cardMessage || null,
          note: data.note || null,
        },
      })
      setOrder(updated)
      setDeliveryMode(updated.delivery.mode)
      setNotice('Les coordonnées et la livraison ont été mises à jour.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDetailsSaving(false)
    }
  }

  const linkAccount = async () => {
    setDetailsSaving(true)
    setError('')
    setNotice('')
    try {
      const updated = await apiRequest(`/admin/orders/${encodeURIComponent(reference)}/link-account`, {
        method: 'POST',
        body: { version: order.version },
      })
      setOrder(updated)
      setNotice('La commande est maintenant visible dans l’espace de cette cliente.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDetailsSaving(false)
    }
  }

  if (error && !order) return <p className="form-alert" role="alert">{error}</p>
  if (!order) return <p>Chargement de la commande…</p>

  const summary = `Bonjour ${order.customer.name}, concernant votre commande ${order.reference} chez Lizzirene Déco : `
  const customerWhatsapp = `https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(summary)}`
  const allowedStatuses = [
    order.status,
    ...(ORDER_STATUS_TRANSITIONS[order.status] || []),
  ]

  return (
    <>
      <header className="admin-heading"><div><span className="eyebrow">Commande</span><h1>{order.reference}</h1><p>{formatOrderDate(order.createdAt)}</p></div><button className="btn btn-outline" onClick={() => onAller?.('admin-commandes')}>Retour aux commandes</button></header>
      {error && <p className="form-alert" role="alert">{error}</p>}
      {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}
      <div className="admin-order-grid">
        <div>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>Articles</h2><span className={`status-badge status-${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></div><ul className="order-items-detail">{order.items.map((item) => <li key={item.id}><span>{item.name} × {item.quantity}{item.description && <small>{item.description}</small>}</span><strong>{formatPrice(item.lineTotal)}</strong></li>)}</ul>{order.priceAdjustment !== 0 && <div className="order-price-line"><span>Ajustement — {order.adjustmentReason}</span><strong>{order.priceAdjustment > 0 ? '+' : '−'} {formatPrice(Math.abs(order.priceAdjustment))}</strong></div>}{order.deliveryFee != null && <div className="order-price-line"><span>Livraison</span><strong>{formatPrice(order.deliveryFee)}</strong></div>}<div className="order-total-detail"><span>Total actuel</span><strong>{formatPrice(order.total)}</strong></div>{order.deliveryFee == null && order.delivery.mode === 'delivery' && <small>Frais de livraison non définis.</small>}<p className="payment-state">Paiement : <strong>{PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}</strong></p></section>
          <section className="admin-panel">
            <h2>Client et livraison</h2>
            <dl className="order-data-list">
              <div><dt>Client</dt><dd>{order.customer.name}</dd></div>
              <div><dt>Téléphone</dt><dd><a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a></dd></div>
              {order.customer.email && <div><dt>E-mail</dt><dd><a href={`mailto:${order.customer.email}`}>{order.customer.email}</a></dd></div>}
              <div><dt>Mode</dt><dd>{order.delivery.mode === 'pickup' ? 'Retrait boutique' : 'Livraison'}</dd></div>
              {order.delivery.desiredDate && <div><dt>Date souhaitée</dt><dd>{formatOrderDay(order.delivery.desiredDate)}</dd></div>}
              {order.delivery.mode === 'delivery' && <>
                <div><dt>Commune</dt><dd>{order.delivery.commune}</dd></div>
                <div><dt>Quartier</dt><dd>{order.delivery.quartier}</dd></div>
                <div><dt>Repère</dt><dd>{order.delivery.addressLandmark}</dd></div>
              </>}
              {order.recipient && <>
                <div><dt>Destinataire</dt><dd>{order.recipient.name || 'Non précisé'}</dd></div>
                {order.recipient.phone && <div><dt>Tél. destinataire</dt><dd><a href={`tel:${order.recipient.phone}`}>{order.recipient.phone}</a></dd></div>}
              </>}
              {order.cardMessage && <div><dt>Message carte</dt><dd>{order.cardMessage}</dd></div>}
              {order.note && <div><dt>Précision client</dt><dd>{order.note}</dd></div>}
            </dl>
            <a className="btn btn-whatsapp" href={customerWhatsapp} target="_blank" rel="noreferrer">Écrire au client sur WhatsApp</a>
            {!order.linkedToAccount && (
              <button type="button" className="btn btn-outline" onClick={linkAccount} disabled={detailsSaving}>
                Rattacher à son compte client
              </button>
            )}
            {order.linkedToAccount && <small>Cette commande est visible dans l’espace client.</small>}
          </section>
          <details className="admin-panel admin-order-details-editor">
            <summary>Modifier le client ou la livraison</summary>
            <form key={`details-${order.reference}-${order.version}`} onSubmit={saveDetails}>
              <label>Nom du client<input name="name" defaultValue={order.customer.name} required /></label>
              <label>Téléphone<input name="phone" type="tel" defaultValue={order.customer.phone} required /></label>
              <label>E-mail <small>(facultatif)</small><input name="email" type="email" defaultValue={order.customer.email || ''} /></label>
              <label>Mode de remise
                <select name="deliveryMode" value={deliveryMode} onChange={(event) => setDeliveryMode(event.target.value)}>
                  <option value="delivery">Livraison</option>
                  <option value="pickup">Retrait boutique</option>
                </select>
              </label>
              {deliveryMode === 'delivery' && <>
                <label>Commune<input name="commune" defaultValue={order.delivery.commune || ''} required /></label>
                <label>Quartier<input name="quartier" defaultValue={order.delivery.quartier || ''} required /></label>
                <label>Adresse / repère<input name="addressLandmark" defaultValue={order.delivery.addressLandmark || ''} required /></label>
              </>}
              <label>Date souhaitée<input name="desiredDate" type="date" defaultValue={order.delivery.desiredDate || ''} /></label>
              <label>Nom du destinataire<input name="recipientName" defaultValue={order.recipient?.name || ''} /></label>
              <label>Téléphone du destinataire<input name="recipientPhone" type="tel" defaultValue={order.recipient?.phone || ''} /></label>
              <label>Message carte<textarea name="cardMessage" rows="2" defaultValue={order.cardMessage || ''} /></label>
              <label>Précision client<textarea name="note" rows="2" defaultValue={order.note || ''} /></label>
              <button className="btn btn-primary" disabled={detailsSaving}>{detailsSaving ? 'Enregistrement…' : 'Enregistrer les coordonnées'}</button>
            </form>
          </details>
          {order.events?.length > 0 && <section className="admin-panel order-timeline"><h2>Historique</h2><ol>{order.events.map((event, index) => <li key={`${event.createdAt}-${index}`}><span className="timeline-dot" /><div><strong>{event.message || event.type}</strong><small>{event.actorName ? `${event.actorName} · ` : ''}{formatOrderDate(event.createdAt)}{!event.visibleToCustomer ? ' · Note privée' : ''}</small></div></li>)}</ol></section>}
        </div>
        <form className="admin-panel admin-order-actions" onSubmit={save}>
          <h2>Mettre à jour</h2>
          <label>Statut<select name="status" key={`${order.reference}-${order.version}`} defaultValue={order.status}>{allowedStatuses.map((value) => <option key={value} value={value}>{ORDER_STATUS_LABELS[value]}</option>)}</select></label>
          {order.delivery.mode === 'delivery' && <label>Frais de livraison (GNF)<input name="deliveryFee" type="number" min="0" step="1000" defaultValue={order.deliveryFee ?? ''} placeholder="À confirmer" /></label>}
          <label>Ajustement du prix (GNF)<input name="priceAdjustment" type="number" step="1000" defaultValue={order.priceAdjustment || 0} /></label>
          <label>Raison de l’ajustement<input name="adjustmentReason" defaultValue={order.adjustmentReason || ''} placeholder="Ex : bouquet plus volumineux" /></label>
          <label>Paiement<select name="paymentStatus" defaultValue={order.paymentStatus}><option value="unpaid">Non payé</option><option value="paid">Payé</option><option value="refunded">Remboursé</option></select></label>
          <label>Message visible par le client<textarea name="customerMessage" rows="3" placeholder="Facultatif : précision sur sa commande" /></label>
          <label>Note privée<textarea name="privateNote" rows="3" placeholder="Visible uniquement dans l’administration" /></label>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </form>
      </div>
    </>
  )
}

export default CommandeAdmin
