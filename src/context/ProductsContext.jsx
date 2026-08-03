import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  PUBLIC_PRODUCTS as STATIC_PRODUCTS,
  categoriesProduitPour,
} from '../data/products.js'
import { apiRequest } from '../services/api.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS)
  const [source, setSource] = useState('static')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    setLoading(true)
    try {
      const remote = await apiRequest('/products')
      if (Array.isArray(remote)) {
        setProducts(remote)
        setSource('api')
        setError(null)
      } else {
        throw new Error('Le catalogue reçu est invalide.')
      }
      return remote
    } catch (requestError) {
      setSource('static')
      setError(requestError)
      return STATIC_PRODUCTS
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(
    () => ({
      products,
      source,
      loading,
      error,
      refresh,
      findProduct(id) {
        return products.find((product) => product.id === id)
      },
      productsForCategory(id) {
        const categories = categoriesProduitPour(id)
        return categories
          ? products.filter((product) => categories.includes(product.category))
          : products
      },
    }),
    [error, loading, products, source],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts doit être utilisé dans ProductsProvider')
  }
  return context
}
