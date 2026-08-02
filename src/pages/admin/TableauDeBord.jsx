import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.js'
import { formatPrice } from '../../config.js'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from '../../utils/orderStatus.js'

function TableauDeBord({ onAller }) {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/admin/dashboard')
      .then((data) => { if (active) setDashboard(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])

  if (error) return <p className="form-alert" role="alert">{error}</p>
  if (!dashboard) return <p>Chargement du tableau de bord…</p>

  const activeOrders = Object.entries(dashboard.orders)
    .filter(([status]) => !['delivered', 'cancelled', 'expired'].includes(status))
    .reduce((total, [, count]) => total + count, 0)

  return (
    <>
      <header className="admin-heading">
        <div><span className="eyebrow">Pilotage</span><h1>Vue d’ensemble</h1></div>
      </header>
      <div className="admin-stats">
        <article><span>Commandes actives</span><strong>{activeOrders}</strong></article>
        <article><span>À confirmer</span><strong>{dashboard.orders.awaiting_whatsapp || 0}</strong></article>
        <article><span>Produits publiés</span><strong>{dashboard.products.active || 0}</strong></article>
        <article><span>Comptes clients</span><strong>{dashboard.customers}</strong></article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Dernières demandes</h2>
          <button className="admin-text-button" onClick={() => onAller?.('admin-commandes')}>
            Voir toutes
          </button>
        </div>
        {dashboard.recentOrders.length === 0 ? (
          <p>Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Référence</th><th>Client</th><th>Statut</th><th>Total</th><th /></tr></thead>
              <tbody>
                {dashboard.recentOrders.map((order) => (
                  <tr key={order.reference}>
                    <td><strong>{order.reference}</strong></td>
                    <td>{order.customer.name}<small>{order.customer.phone}</small></td>
                    <td><span className={`status-badge status-${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                    <td>{formatPrice(order.total)}</td>
                    <td><button className="admin-text-button" onClick={() => onAller?.('admin-commande', { reference: order.reference })}>Ouvrir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default TableauDeBord
