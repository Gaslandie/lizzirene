import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'lizzirene-panier'

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
    qty,
  }
}

// Panier côté client, conservé dans le navigateur.
// À brancher plus tard sur l'API NestJS (mêmes champs : id, name, price, qty).
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    return JSON.parse(raw)
      .map((ligne) => {
        const produit = PRODUCTS.find((item) => item.id === ligne.id)
        if (produit?.price == null) return null
        return creerLignePanier(produit, Math.max(1, Number(ligne.qty) || 1))
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored)
  const [open, setOpen] = useState(false)

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
      setItems((prev) => {
        const found = prev.find((i) => i.id === product.id)
        if (found) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          )
        }
        return [...prev, creerLignePanier(product, qty)]
      })
      setOpen(true)
    }

    const setQty = (id, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
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

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
