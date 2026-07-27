import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'lizzirene-panier'

// Panier côté client, conservé dans le navigateur.
// À brancher plus tard sur l'API NestJS (mêmes champs : id, name, price, qty).
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
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
        const { id, name, price, src, variant } = product
        return [...prev, { id, name, price, src, variant, qty }]
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
    }
  }, [items, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
