import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext.jsx'

const CartContext = createContext(null)
const STORAGE_KEY = 'lizzirene-panier'
const normaliserQuantite = (value) =>
  Math.min(20, Math.max(1, Math.trunc(Number(value) || 1)))

const creerLignePanier = (product, qty) => {
  const {
    id,
    name,
    price,
    prixPrefixe,
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    variant,
    category,
    availability,
    status,
  } = product

  return {
    id,
    name,
    price,
    prixPrefixe,
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    variant,
    category,
    availability,
    status,
    qty,
  }
}

// Panier côté client, conservé dans le navigateur. Les prix et disponibilités
// sont toujours resynchronisés avec le catalogue avant une commande.
function readStored(products) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const stored = JSON.parse(raw)
    if (!Array.isArray(stored)) return []
    return stored
      .slice(0, 30)
      .map((ligne) => {
        const produit = products.find((item) => item.id === ligne.id)
        if (
          produit?.price == null ||
          produit.status === 'archived' ||
          produit.availability === 'out_of_stock'
        ) return null
        return creerLignePanier(produit, normaliserQuantite(ligne.qty))
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [items, setItems] = useState(() => readStored(products))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setItems((current) =>
      current
        .map((line) => {
          const product = products.find((item) => item.id === line.id)
          if (
            !product ||
            product.price == null ||
            product.status === 'archived' ||
            product.availability === 'out_of_stock'
          ) {
            return null
          }
          return creerLignePanier(product, line.qty)
        })
        .filter(Boolean),
    )
  }, [products])

  useEffect(() => {
    try {
      // Seuls l'identifiant et la quantité persistent. Les prix, textes et
      // images sont réhydratés depuis PRODUCTS au prochain chargement.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, qty }) => ({ id, qty }))),
      )
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [items])

  // Bloque le défilement de la page quand le panier est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const value = useMemo(() => {
    const add = (product, qty = 1) => {
      if (
        product.price == null ||
        product.status === 'archived' ||
        product.availability === 'out_of_stock'
      ) {
        return
      }
      setItems((prev) => {
        const found = prev.find((i) => i.id === product.id)
        if (found) {
          return prev.map((i) =>
            i.id === product.id
              ? { ...i, qty: normaliserQuantite(i.qty + qty) }
              : i,
          )
        }
        if (prev.length >= 30) return prev
        return [...prev, creerLignePanier(product, normaliserQuantite(qty))]
      })
      setOpen(true)
    }

    const setQty = (id, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) =>
              i.id === id ? { ...i, qty: normaliserQuantite(qty) } : i,
            ),
      )

    const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
    const clear = () => setItems([])

    return {
      items,
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.price * i.qty, 0),
      totalMinimum: items.some((item) => item.prixPrefixe),
    }
  }, [items, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Le hook partage volontairement le contexte avec son fournisseur.
// oxlint-disable-next-line react/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
