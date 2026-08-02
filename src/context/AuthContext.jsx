import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest, fetchSession } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(true)
  const [serviceError, setServiceError] = useState(false)
  const [installed, setInstalled] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const session = await fetchSession({ force: true })
      setUser(session.user || null)
      setAvailable(Boolean(session.configured))
      setInstalled(Boolean(session.installed))
      setServiceError(false)
      return session
    } catch {
      setAvailable(false)
      setServiceError(true)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      available,
      serviceError,
      installed,
      refresh,
      async login(credentials) {
        const result = await apiRequest('/auth/login', {
          method: 'POST',
          body: credentials,
        })
        setUser(result.user)
        return result.user
      },
      async register(profile) {
        const result = await apiRequest('/auth/register', {
          method: 'POST',
          body: profile,
        })
        setUser(result.user)
        return result
      },
      async logout() {
        await apiRequest('/auth/logout', { method: 'POST', body: {} })
        setUser(null)
      },
      async updateProfile(profile) {
        const result = await apiRequest('/me', {
          method: 'PATCH',
          body: profile,
        })
        setUser(result.user)
        return result.user
      },
      async updatePassword(passwords) {
        return apiRequest('/me/password', {
          method: 'PATCH',
          body: passwords,
        })
      },
      async claimOrder(claimToken) {
        return apiRequest('/orders/claim', {
          method: 'POST',
          body: { claimToken },
        })
      },
    }),
    [available, installed, loading, serviceError, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
