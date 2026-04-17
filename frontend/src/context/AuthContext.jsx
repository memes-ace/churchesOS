import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const roles = {
  SUPER_ADMIN: 'super_admin',
  PASTOR: 'pastor',
  CHURCH_ADMIN: 'church_admin',
  MINISTRY_LEADER: 'ministry_leader',
  CELL_LEADER: 'cell_leader',
  FINANCE_OFFICER: 'finance_officer',
  MEMBER: 'member',
}

export const permissions = {
  super_admin: ['*'],
  pastor: ['view_all', 'view_finance', 'view_members', 'view_attendance', 'view_ministries', 'view_cells', 'view_reports'],
  church_admin: ['manage_members', 'manage_attendance', 'manage_ministries', 'manage_events', 'manage_visitors', 'view_finance', 'manage_announcements'],
  ministry_leader: ['manage_own_ministry', 'manage_ministry_members', 'post_announcements', 'upload_files', 'view_own_ministry'],
  cell_leader: ['manage_own_cell', 'add_cell_members', 'record_cell_attendance', 'add_meeting_notes', 'view_own_cell'],
  finance_officer: ['manage_finance', 'view_finance', 'manage_purchases', 'view_reports'],
  member: ['view_own_profile', 'view_announcements', 'view_sermons', 'submit_prayer_request'],
}

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
    } catch(e) {}
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
  }

  const hasPermission = (permission) => {
    if (!user) return false
    const userRole = user.role || 'member'
    const userPerms = permissions[userRole] || []
    return userPerms.includes('*') || userPerms.includes(permission)
  }

  const hasRole = (role) => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }

  const canAccess = (module) => {
    if (!user) return false
    const userRole = user.role || 'member'
    const userPerms = permissions[userRole] || []
    if (userPerms.includes('*')) return true

    const modulePermMap = {
      members: ['manage_members', 'view_all'],
      attendance: ['manage_attendance', 'view_all'],
      finance: ['manage_finance', 'view_finance', 'view_all'],
      ministries: ['manage_ministries', 'manage_own_ministry', 'view_all'],
      cells: ['manage_own_cell', 'view_all'],
      events: ['manage_events', 'view_all'],
      reports: ['view_reports', 'view_all'],
      equipment: ['manage_members', 'view_all', 'manage_own_ministry'],
      purchases: ['manage_finance', 'view_finance', 'view_all'],
      songs: ['manage_own_ministry', 'view_all', 'manage_ministries'],
    }

    const required = modulePermMap[module] || []
    return required.some(p => userPerms.includes(p))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, hasRole, canAccess, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
