const BASE = '/api'

const token = () => localStorage.getItem('cos_token') || ''
const churchId = () => {
  try { return JSON.parse(localStorage.getItem('cos_user') || '{}').church_id || '' }
  catch(e) { return '' }
}

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token()}`
})

const api = {
  get: async (path) => {
    const r = await fetch(BASE + path, { headers: headers() })
    if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`)
    return r.json()
  },
  post: async (path, data) => {
    const r = await fetch(BASE + path, { method: 'POST', headers: headers(), body: JSON.stringify(data) })
    if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`)
    return r.json()
  },
  put: async (path, data) => {
    const r = await fetch(BASE + path, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })
    if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`)
    return r.json()
  },
  delete: async (path) => {
    const r = await fetch(BASE + path, { method: 'DELETE', headers: headers() })
    if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`)
    return r.json()
  },
}

const cId = () => churchId()

export const membersAPI = {
  getAll: () => api.get(`/churches/${cId()}/members`),
  create: (d) => api.post(`/churches/${cId()}/members`, d),
  update: (id, d) => api.put(`/churches/${cId()}/members/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/members/${id}`),
}

export const attendanceAPI = {
  getAll: () => api.get(`/churches/${cId()}/attendance`),
  create: (d) => api.post(`/churches/${cId()}/attendance`, d),
  getStats: () => api.get(`/churches/${cId()}/attendance/stats`),
}

export const financeAPI = {
  getAll: () => api.get(`/churches/${cId()}/finance/transactions`),
  create: (d) => api.post(`/churches/${cId()}/finance/transactions`, d),
  update: (id, d) => api.put(`/churches/${cId()}/finance/transactions/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/finance/transactions/${id}`),
  getSummary: () => api.get(`/churches/${cId()}/finance/summary`),
}

export const eventsAPI = {
  getAll: () => api.get(`/churches/${cId()}/events`),
  create: (d) => api.post(`/churches/${cId()}/events`, d),
  update: (id, d) => api.put(`/churches/${cId()}/events/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/events/${id}`),
}

export const visitorsAPI = {
  getAll: () => api.get(`/churches/${cId()}/visitors`),
  create: (d) => api.post(`/churches/${cId()}/visitors`, d),
  update: (id, d) => api.put(`/churches/${cId()}/visitors/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/visitors/${id}`),
}

export const prayerAPI = {
  getAll: () => api.get(`/churches/${cId()}/prayer`),
  create: (d) => api.post(`/churches/${cId()}/prayer`, d),
  update: (id, d) => api.put(`/churches/${cId()}/prayer/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/prayer/${id}`),
}

export const sermonsAPI = {
  getAll: () => api.get(`/churches/${cId()}/sermons`),
  create: (d) => api.post(`/churches/${cId()}/sermons`, d),
  update: (id, d) => api.put(`/churches/${cId()}/sermons/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/sermons/${id}`),
}

export const announcementsAPI = {
  getAll: () => api.get(`/churches/${cId()}/announcements`),
  create: (d) => api.post(`/churches/${cId()}/announcements`, d),
  update: (id, d) => api.put(`/churches/${cId()}/announcements/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/announcements/${id}`),
}

export const ministriesAPI = {
  getAll: () => api.get(`/churches/${cId()}/ministries`),
  create: (d) => api.post(`/churches/${cId()}/ministries`, d),
  update: (id, d) => api.put(`/churches/${cId()}/ministries/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/ministries/${id}`),
  getMembers: (ministryId) => api.get(`/churches/${cId()}/ministries/${ministryId}/members`),
  addMember: (ministryId, d) => api.post(`/churches/${cId()}/ministries/${ministryId}/members`, d),
  updateMember: (ministryId, memberId, d) => api.put(`/churches/${cId()}/ministries/${ministryId}/members/${memberId}`, d),
  deleteMember: (ministryId, memberId) => api.delete(`/churches/${cId()}/ministries/${ministryId}/members/${memberId}`),
}

export const cellGroupsAPI = {
  getAll: () => api.get(`/churches/${cId()}/cell-groups`),
  create: (d) => api.post(`/churches/${cId()}/cell-groups`, d),
  update: (id, d) => api.put(`/churches/${cId()}/cell-groups/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/cell-groups/${id}`),
  getMembers: (cellId) => api.get(`/churches/${cId()}/cell-groups/${cellId}/members`),
  addMember: (cellId, d) => api.post(`/churches/${cId()}/cell-groups/${cellId}/members`, d),
  updateMember: (cellId, memberId, d) => api.put(`/churches/${cId()}/cell-groups/${cellId}/members/${memberId}`, d),
  deleteMember: (cellId, memberId) => api.delete(`/churches/${cId()}/cell-groups/${cellId}/members/${memberId}`),
  getAttendance: (cellId) => api.get(`/churches/${cId()}/cell-groups/${cellId}/attendance`),
  addAttendance: (cellId, d) => api.post(`/churches/${cId()}/cell-groups/${cellId}/attendance`, d),
}

export const equipmentAPI = {
  getAll: () => api.get(`/churches/${cId()}/equipment`),
  create: (d) => api.post(`/churches/${cId()}/equipment`, d),
  update: (id, d) => api.put(`/churches/${cId()}/equipment/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/equipment/${id}`),
}

export const purchasesAPI = {
  getAll: () => api.get(`/churches/${cId()}/purchases`),
  create: (d) => api.post(`/churches/${cId()}/purchases`, d),
  update: (id, d) => api.put(`/churches/${cId()}/purchases/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/purchases/${id}`),
}

export const songsAPI = {
  getAll: () => api.get(`/churches/${cId()}/songs`),
  create: (d) => api.post(`/churches/${cId()}/songs`, d),
  update: (id, d) => api.put(`/churches/${cId()}/songs/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/songs/${id}`),
}

export const counsellingAPI = {
  getAll: () => api.get(`/churches/${cId()}/counselling`),
  create: (d) => api.post(`/churches/${cId()}/counselling`, d),
  update: (id, d) => api.put(`/churches/${cId()}/counselling/${id}`, d),
  delete: (id) => api.delete(`/churches/${cId()}/counselling/${id}`),
}

export const vendorsAPI = {
  getAll: () => api.get(`/vendors`),
  getApproved: () => api.get(`/vendors/approved`),
  apply: (d) => api.post(`/vendors`, d),
  update: (id, d) => api.put(`/vendors/${id}`, d),
  delete: (id) => api.delete(`/vendors/${id}`),
}

export const dashboardAPI = {
  getStats: () => api.get(`/churches/${cId()}/dashboard`),
}

export const adminAPI = {
  getChurches: () => api.get('/admin/churches'),
  getChurch: (id) => api.get(`/admin/churches/${id}`),
  updateChurch: (id, d) => api.put(`/admin/churches/${id}`, d),
  getStats: () => api.get('/admin/stats'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (d) => api.put('/admin/settings', d),
  getDashboard: () => api.get('/admin/dashboard'),
}

export const paymentsAPI = {
  submit: (d) => api.post('/admin/payments', d),
  getAll: () => api.get('/admin/payments'),
  approve: (id) => api.put(`/admin/payments/${id}/approve`, {}),
  reject: (id) => api.put(`/admin/payments/${id}/reject`, {}),
}
