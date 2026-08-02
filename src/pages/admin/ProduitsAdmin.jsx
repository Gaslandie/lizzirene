import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.js'
import { formatPrice } from '../../config.js'
import { urlAdminNouveauProduit, urlAdminProduit, intercepterNavigation } from '../../utils/navigation.js'

const STATUS_LABELS = { active: 'Publié', draft: 'Brouillon', archived: 'Archivé' }
const AVAILABILITY_LABELS = { available: 'Disponible', on_order: 'Sur commande', out_of_stock: 'Indisponible' }

function ProduitsAdmin({ onAller }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const parameters = new URLSearchParams()
    if (status) parameters.set('status', status)
    if (search.trim()) parameters.set('search', search.trim())
    setLoading(true)
    setError('')
    const timer = window.setTimeout(() => {
      apiRequest(`/admin/products${parameters.size ? `?${parameters}` : ''}`)
        .then((data) => { if (active) setProducts(data) })
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
      <header className="admin-heading">
        <div><span className="eyebrow">Catalogue</span><h1>Produits</h1><p>{products.length} résultat{products.length > 1 ? 's' : ''}</p></div>
        <a
          className="btn btn-primary"
          href={urlAdminNouveauProduit()}
          onClick={(event) => {
            if (!intercepterNavigation(event)) return
            onAller?.('admin-produit-nouveau')
          }}
        >
          Ajouter un produit
        </a>
      </header>
      <div className="admin-toolbar">
        <input aria-label="Rechercher un produit" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un produit…" />
        <select aria-label="Filtrer les produits par statut" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="active">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="archived">Archivés</option>
        </select>
      </div>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <section className="admin-panel">
        {loading ? <p>Chargement…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table products-admin-table">
              <thead><tr><th scope="col">Produit</th><th scope="col">Prix</th><th scope="col">Disponibilité</th><th scope="col">Statut</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.recordId}>
                    <td><div className="admin-product-cell">{product.src ? <img src={product.src} alt="" /> : <span className="admin-image-placeholder" />}<div><strong>{product.name}</strong><small>{product.category}</small></div></div></td>
                    <td>{product.price == null ? (product.priceLabel || 'Sur devis') : formatPrice(product.price)}</td>
                    <td>{AVAILABILITY_LABELS[product.availability]}</td>
                    <td><span className={`status-badge status-${product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'muted'}`}>{STATUS_LABELS[product.status]}</span></td>
                    <td><a href={urlAdminProduit(product.recordId)} className="admin-text-button" onClick={(event) => { if (!intercepterNavigation(event)) return; onAller?.('admin-produit', { id: product.recordId }) }}>Modifier</a></td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="5">Aucun produit ne correspond à ces filtres.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default ProduitsAdmin
