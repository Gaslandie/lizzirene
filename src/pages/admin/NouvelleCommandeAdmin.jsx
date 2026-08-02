import { useRef, useState } from 'react'
import { ZONES } from '../../config.js'
import { apiRequest } from '../../services/api.js'

const todayConakry = () => new Intl.DateTimeFormat('fr-CA', {
  timeZone: 'Africa/Conakry',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())

function NouvelleCommandeAdmin({ onAller }) {
  const [deliveryMode, setDeliveryMode] = useState('delivery')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const idempotencyRef = useRef(null)

  const submit = async (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setSaving(true)
    setError('')
    if (!idempotencyRef.current) {
      idempotencyRef.current = globalThis.crypto?.randomUUID?.()
        || `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`
    }

    try {
      const order = await apiRequest('/admin/orders/manual', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyRef.current },
        body: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          description: data.description,
          subtotal: Number(data.subtotal),
          deliveryMode: data.deliveryMode,
          commune: data.deliveryMode === 'delivery' ? data.commune : null,
          quartier: data.deliveryMode === 'delivery' ? data.quartier : null,
          addressLandmark: data.deliveryMode === 'delivery' ? data.addressLandmark : null,
          deliveryFee:
            data.deliveryMode === 'delivery' && data.deliveryFee !== ''
              ? Number(data.deliveryFee)
              : null,
          desiredDate: data.desiredDate || null,
          recipientName: data.recipientName || null,
          recipientPhone: data.recipientPhone || null,
          note: data.note || null,
          paymentStatus: data.paymentStatus,
        },
      })
      onAller?.('admin-commande', { reference: order.reference })
    } catch (requestError) {
      if (requestError.code === 'idempotency_conflict') {
        idempotencyRef.current = null
      }
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <header className="admin-heading">
        <div>
          <span className="eyebrow">Commande hors panier</span>
          <h1>Enregistrer une commande WhatsApp</h1>
          <p>Pour une cliente qui a commandé directement par message ou par téléphone.</p>
        </div>
        <button className="btn btn-outline" onClick={() => onAller?.('admin-commandes')}>
          Retour aux commandes
        </button>
      </header>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <form
        className="admin-product-form"
        onSubmit={submit}
        onChange={() => { if (!saving) idempotencyRef.current = null }}
      >
        <section className="admin-panel admin-form-main">
          <h2>Cliente et contenu convenu</h2>
          <div className="admin-form-grid">
            <label>Nom complet<input name="name" autoComplete="name" required /></label>
            <label>Téléphone<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="6XX XX XX XX" /></label>
            <label className="admin-field-wide">E-mail <small>(facultatif)</small><input name="email" type="email" autoComplete="email" /></label>
            <label className="admin-field-wide">Articles et détails convenus<textarea name="description" rows="6" required placeholder="Ex : bouquet de 20 roses rouges, emballage blanc et ruban doré…" /></label>
            <label>Montant des articles (GNF)<input name="subtotal" type="number" min="1" max="1000000000" step="1000" required /></label>
            <label>Paiement<select name="paymentStatus" defaultValue="unpaid"><option value="unpaid">Non payé</option><option value="paid">Déjà payé</option></select></label>
          </div>

          <h2>Remise de la commande</h2>
          <div className="admin-form-grid">
            <fieldset className="admin-field-wide checkout-mode">
              <legend>Mode</legend>
              <label><input type="radio" name="deliveryMode" value="delivery" checked={deliveryMode === 'delivery'} onChange={() => setDeliveryMode('delivery')} /> Livraison</label>
              <label><input type="radio" name="deliveryMode" value="pickup" checked={deliveryMode === 'pickup'} onChange={() => setDeliveryMode('pickup')} /> Retrait à Kipé</label>
            </fieldset>
            {deliveryMode === 'delivery' && <>
              <label>Commune<select name="commune" defaultValue="" required><option value="" disabled>Choisir</option>{ZONES.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
              <label>Quartier<input name="quartier" required /></label>
              <label className="admin-field-wide">Adresse / repère<input name="addressLandmark" required /></label>
              <label>Frais de livraison (GNF)<input name="deliveryFee" type="number" min="0" step="1000" placeholder="Facultatif" /></label>
            </>}
            <label>Date souhaitée<input name="desiredDate" type="date" min={todayConakry()} /></label>
          </div>
        </section>

        <aside className="admin-form-sidebar">
          <section className="admin-panel">
            <h2>Destinataire</h2>
            <label>Nom <small>(facultatif)</small><input name="recipientName" /></label>
            <label>Téléphone <small>(facultatif)</small><input name="recipientPhone" type="tel" inputMode="tel" /></label>
          </section>
          <section className="admin-panel">
            <label>Précisions convenues <small>(facultatif)</small><textarea name="note" rows="5" placeholder="Heure, couleurs, message, consigne…" /></label>
          </section>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer la commande confirmée'}
          </button>
        </aside>
      </form>
    </>
  )
}

export default NouvelleCommandeAdmin
