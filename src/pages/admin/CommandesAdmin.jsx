import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.js'
import { formatPrice } from '../../config.js'
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_TONES, formatOrderDate } from '../../utils/orderStatus.js'
import { intercepterNavigation, urlAdminNouvelleCommande } from '../../utils/navigation.js'

function CommandesAdmin({ onAller }) {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const parameters = new URLSearchParams()
    if (status) parameters.set('status', status)
    if (search.trim()) parameters.set('search', search.trim())
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      apiRequest(`/admin/orders${parameters.size ? `?${parameters}` : ''}`)
        .then((data) => { if (active) setOrders(data) })
        .catch((requestError) => { if (active) setError(requestError.message) })
        .finally(() => { if (active) setLoading(false) })
    }, search ? 250 : 0)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [search, status])

  return (
    <>
      <header className="admin-heading"><div><span className="eyebrow">Suivi</span><h1>Commandes</h1><p>{orders.length} demande{orders.length > 1 ? 's' : ''}</p></div><a className="btn btn-primary" href={urlAdminNouvelleCommande()} onClick={(event) => { if (!intercepterNavigation(event)) return; onAller?.('admin-commande-nouvelle') }}>Enregistrer une commande WhatsApp</a></header>
      <div className="admin-toolbar">
        <input aria-label="Rechercher une commande" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Référence, nom ou téléphone…" />
        <select aria-label="Filtrer les commandes par statut" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous les statuts</option>{ORDER_STATUSES.map((value) => <option key={value} value={value}>{ORDER_STATUS_LABELS[value]}</option>)}</select>
      </div>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <section className="admin-panel">
        {loading ? <p>Chargement…</p> : orders.length === 0 ? <p>Aucune commande ne correspond à ces filtres.</p> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th scope="col">Commande</th><th scope="col">Client</th><th scope="col">Livraison</th><th scope="col">Statut</th><th scope="col">Total</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{orders.map((order) => <tr key={order.reference}><td><strong>{order.reference}</strong><small>{formatOrderDate(order.createdAt)}</small></td><td>{order.customer.name}<small>{order.customer.phone}</small></td><td>{order.delivery.mode === 'pickup' ? 'Retrait Kipé' : `${order.delivery.commune} · ${order.delivery.quartier}`}</td><td><span className={`status-badge status-${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td><td>{formatPrice(order.total)}</td><td><button className="admin-text-button" onClick={() => onAller?.('admin-commande', { reference: order.reference })}>Ouvrir</button></td></tr>)}</tbody></table></div>
        )}
      </section>
    </>
  )
}

export default CommandesAdmin
