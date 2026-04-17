const BASE_URL = '/api'

const getToken = () => {
  try {
    const user = localStorage.getItem('cos_token')
    return user || null
  } catch(e) { return null }
}

const getChurchId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
    return user.church_id || null
  } catch(e) { return null }
}

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

// ─── Members ──────────────────────────────────────────────────────────────────
export const membersAPI = {
  getAll: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/members`, { headers: headers() })
    return res.json()
  },
  create: async (data) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/members`, {
      method: 'POST', headers: headers(), body: JSON.stringify(data)
    })
    return res.json()
  },
  update: async (id, data) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/members/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(data)
    })
    return res.json()
  },
  delete: async (id) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/members/${id}`, {
      method: 'DELETE', headers: headers()
    })
    return res.json()
  }
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getAll: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/attendance`, { headers: headers() })
    return res.json()
  },
  create: async (data) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/attendance`, {
      method: 'POST', headers: headers(), body: JSON.stringify(data)
    })
    return res.json()
  },
  getStats: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/attendance/stats`, { headers: headers() })
    return res.json()
  }
}

// ─── Finance ──────────────────────────────────────────────────────────────────
export const financeAPI = {
  getAll: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/finance/transactions`, { headers: headers() })
    return res.json()
  },
  create: async (data) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/finance/transactions`, {
      method: 'POST', headers: headers(), body: JSON.stringify(data)
    })
    return res.json()
  },
  getSummary: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/finance/summary`, { headers: headers() })
    return res.json()
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/events`, { headers: headers() })
    return res.json()
  },
  create: async (data) => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/events`, {
      method: 'POST', headers: headers(), body: JSON.stringify(data)
    })
    return res.json()
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: async () => {
    const churchId = getChurchId()
    const res = await fetch(`${BASE_URL}/churches/${churchId}/dashboard`, { headers: headers() })
    return res.json()
  }
}

// ─── Generic local storage fallback ──────────────────────────────────────────
export const localDB = {
  get: (key) => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : [] }
    catch(e) { return [] }
  },
  set: (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)) } catch(e) {}
  }
}
