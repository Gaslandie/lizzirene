import { useEffect, useRef, useState } from 'react'
import { useProducts } from '../../context/ProductsContext.jsx'
import { apiRequest, apiUpload } from '../../services/api.js'

const CATEGORIES = [
  ['fleurs-naturelles', 'Fleurs naturelles'],
  ['fleurs-artificielles', 'Fleurs artificielles'],
  ['plantes', 'Plantes'],
  ['vases', 'Vases'],
  ['peluches', 'Peluches'],
  ['box-cadeaux', 'Box cadeaux'],
  ['tableaux', 'Tableaux'],
  ['luminaire', 'Luminaire'],
  ['cache-pots', 'Cache-pots'],
]

const EMPTY = {
  name: '',
  category: 'fleurs-naturelles',
  desc: '',
  priceMode: 'fixed',
  price: '',
  priceLabel: '',
  prixPrefixe: '',
  tag: 'Nouveau',
  alt: '',
  imagePosition: '',
  variant: 'soft',
  status: 'draft',
  availability: 'available',
  featuredHome: false,
  sortOrder: 1000,
  version: 1,
}

function ProduitAdminForm({ productId, onAller }) {
  const [product, setProduct] = useState(EMPTY)
  const editing = Boolean(productId || product.recordId)
  const persistedId = product.recordId || productId
  const [loading, setLoading] = useState(Boolean(productId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef(null)
  const { refresh: refreshProducts } = useProducts()

  useEffect(() => {
    if (!productId) return
    let active = true
    setLoading(true)
    setError('')
    apiRequest(`/admin/products/${encodeURIComponent(productId)}`)
      .then((data) => {
        if (!active) return
        setProduct(data)
        setPreview(data.src || '')
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [productId])

  useEffect(
    () => () => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    },
    [preview],
  )

  const update = (key, value) => setProduct((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    const wasNew = !persistedId
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const payload = {
        name: product.name,
        category: product.category,
        description: product.desc,
        priceMode: product.priceMode,
        price: product.priceMode === 'quote' ? null : Number(product.price),
        priceLabel: product.priceLabel || null,
        prixPrefixe: product.priceMode === 'from' ? (product.prixPrefixe || 'À partir de') : null,
        tag: product.tag,
        src: product.src || null,
        alt: product.alt || null,
        imagePosition: product.imagePosition || null,
        variant: product.variant || null,
        status: product.status,
        availability: product.availability,
        featuredHome: Boolean(product.featuredHome),
        sortOrder: Number(product.sortOrder) || 0,
        version: product.version,
      }
      let saved = persistedId
        ? await apiRequest(`/admin/products/${encodeURIComponent(persistedId)}`, {
            method: 'PATCH',
            body: payload,
          })
        : await apiRequest('/admin/products', { method: 'POST', body: payload })

      // À partir d'ici le produit existe réellement. Même si l'envoi de
      // l'image échoue, un nouvel essai modifiera ce produit au lieu d'en
      // créer un doublon.
      setProduct(saved)
      if (!fileRef.current?.files?.[0]) setPreview(saved.src || '')

      const file = fileRef.current?.files?.[0]
      if (file) {
        const form = new FormData()
        form.append('image', file)
        form.append('alt', product.alt || product.name)
        form.append('version', String(saved.version))
        saved = await apiUpload(`/admin/products/${saved.recordId}/image`, form)
      }

      setProduct(saved)
      setPreview(saved.src || '')
      if (fileRef.current) fileRef.current.value = ''
      setNotice('Le produit a été enregistré.')
      await refreshProducts()
      if (wasNew) {
        onAller?.('admin-produit', { id: saved.recordId })
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const archive = async () => {
    if (!window.confirm('Archiver ce produit ? Il disparaîtra de la boutique mais restera dans les anciennes commandes.')) return
    setSaving(true)
    try {
      const archived = await apiRequest(`/admin/products/${persistedId}/archive`, {
        method: 'POST',
        body: { version: product.version },
      })
      setProduct(archived)
      setNotice('Le produit a été archivé.')
      await refreshProducts()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const restore = async () => {
    if (!window.confirm('Restaurer ce produit en brouillon ? Vous pourrez le vérifier avant de le republier.')) return
    setSaving(true)
    setError('')
    try {
      const restored = await apiRequest(`/admin/products/${persistedId}/restore`, {
        method: 'POST',
        body: { version: product.version },
      })
      setProduct(restored)
      setNotice('Le produit est restauré en brouillon.')
      await refreshProducts()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Chargement du produit…</p>

  return (
    <>
      <header className="admin-heading">
        <div><span className="eyebrow">Catalogue</span><h1>{editing ? `Modifier ${product.name}` : 'Nouveau produit'}</h1></div>
        <button className="btn btn-outline" onClick={() => onAller?.('admin-produits')}>Retour aux produits</button>
      </header>
      {error && <p className="form-alert" role="alert">{error}</p>}
      {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}
      <form className="admin-product-form" onSubmit={submit}>
        <section className="admin-panel admin-form-main">
          <h2>Informations</h2>
          <div className="admin-form-grid">
            <label className="admin-field-wide">Nom du produit<input value={product.name} onChange={(event) => update('name', event.target.value)} required /></label>
            <label>Catégorie<select value={product.category} onChange={(event) => update('category', event.target.value)}>{CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Badge<input value={product.tag} onChange={(event) => update('tag', event.target.value)} required /></label>
            <label className="admin-field-wide">Description<textarea rows="6" value={product.desc} onChange={(event) => update('desc', event.target.value)} required /></label>
          </div>

          <h2>Prix et disponibilité</h2>
          <div className="admin-form-grid">
            <label>Type de prix<select value={product.priceMode} onChange={(event) => update('priceMode', event.target.value)}><option value="fixed">Prix fixe</option><option value="from">À partir de</option><option value="quote">Sur devis</option></select></label>
            {product.priceMode !== 'quote' && <label>Prix en GNF<input type="number" min="1" step="1000" value={product.price ?? ''} onChange={(event) => update('price', event.target.value)} required /></label>}
            {product.priceMode === 'quote' && <label>Libellé du prix<input value={product.priceLabel || ''} onChange={(event) => update('priceLabel', event.target.value)} placeholder="Prix sur demande" /></label>}
            <label>Disponibilité<select value={product.availability} onChange={(event) => update('availability', event.target.value)}><option value="available">Disponible</option><option value="on_order">Sur commande</option><option value="out_of_stock">Indisponible</option></select></label>
            <label>Publication<select value={product.status} onChange={(event) => update('status', event.target.value)} disabled={product.status === 'archived'}><option value="draft">Brouillon</option><option value="active">Publié</option>{product.status === 'archived' && <option value="archived">Archivé</option>}</select></label>
          </div>
        </section>

        <aside className="admin-form-sidebar">
          <section className="admin-panel">
            <h2>Image principale</h2>
            {preview ? <img className="admin-image-preview" src={preview} alt="Aperçu" /> : <div className="admin-image-empty">Aucune image</div>}
            <label>Choisir une image<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); if (file) setPreview(URL.createObjectURL(file)) }} /></label>
            <small>JPEG, PNG ou WebP, maximum 8 Mo.</small>
            <label>Texte alternatif<input value={product.alt || ''} onChange={(event) => update('alt', event.target.value)} placeholder="Décrivez précisément la photo" /></label>
          </section>
          <section className="admin-panel">
            <label className="admin-checkbox"><input type="checkbox" checked={Boolean(product.featuredHome)} onChange={(event) => update('featuredHome', event.target.checked)} /><span>Mettre en avant sur l’accueil</span></label>
            <label>Ordre d’affichage<input type="number" value={product.sortOrder} onChange={(event) => update('sortOrder', event.target.value)} /></label>
          </section>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer le produit'}</button>
          {editing && product.status !== 'archived' && <button type="button" className="btn btn-danger" onClick={archive} disabled={saving}>Archiver</button>}
          {editing && product.status === 'archived' && <button type="button" className="btn btn-outline" onClick={restore} disabled={saving}>Restaurer en brouillon</button>}
        </aside>
      </form>
    </>
  )
}

export default ProduitAdminForm
