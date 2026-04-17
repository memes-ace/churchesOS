import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('cos_token')
      const savedUser = localStorage.getItem('cos_user')
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch(e) {
      console.error('Auth load error:', e)
    }
    setLoading(false)
  }, [])

  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('cos_token', accessToken)
    localStorage.setItem('cos_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cos_token')
    localStorage.removeItem('cos_user')
    window.location.href = '/login'
  }

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    return true // Allow all for now during development
  }

  const canAccess = () => true

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, canAccess, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
