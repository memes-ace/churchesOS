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

const churchId_old = () => churchId()

export const membersAPI = {
  getAll: () => api.get(`/churches/${churchId()}/members`),
  create: (d) => api.post(`/churches/${churchId()}/members`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/members/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/members/${id}`),
}

export const attendanceAPI = {
  getAll: () => api.get(`/churches/${churchId()}/attendance`),
  create: (d) => api.post(`/churches/${churchId()}/attendance`, d),
  getStats: () => api.get(`/churches/${churchId()}/attendance/stats`),
}

export const financeAPI = {
  getAll: () => api.get(`/churches/${churchId()}/finance/transactions`),
  create: (d) => api.post(`/churches/${churchId()}/finance/transactions`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/finance/transactions/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/finance/transactions/${id}`),
  getSummary: () => api.get(`/churches/${churchId()}/finance/summary`),
}

export const eventsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/events`),
  create: (d) => api.post(`/churches/${churchId()}/events`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/events/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/events/${id}`),
}

export const visitorsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/visitors`),
  create: (d) => api.post(`/churches/${churchId()}/visitors`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/visitors/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/visitors/${id}`),
}

export const prayerAPI = {
  getAll: () => api.get(`/churches/${churchId()}/prayer`),
  create: (d) => api.post(`/churches/${churchId()}/prayer`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/prayer/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/prayer/${id}`),
}

export const sermonsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/sermons`),
  create: (d) => api.post(`/churches/${churchId()}/sermons`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/sermons/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/sermons/${id}`),
}

export const announcementsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/announcements`),
  create: (d) => api.post(`/churches/${churchId()}/announcements`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/announcements/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/announcements/${id}`),
}

export const ministriesAPI = {
  getAll: () => api.get(`/churches/${churchId()}/ministries`),
  create: (d) => api.post(`/churches/${churchId()}/ministries`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/ministries/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/ministries/${id}`),
  getMembers: (ministryId) => api.get(`/churches/${churchId()}/ministries/${ministryId}/members`),
  addMember: (ministryId, d) => api.post(`/churches/${churchId()}/ministries/${ministryId}/members`, d),
  updateMember: (ministryId, memberId, d) => api.put(`/churches/${churchId()}/ministries/${ministryId}/members/${memberId}`, d),
  deleteMember: (ministryId, memberId) => api.delete(`/churches/${churchId()}/ministries/${ministryId}/members/${memberId}`),
}

export const cellGroupsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/cell-groups`),
  create: (d) => api.post(`/churches/${churchId()}/cell-groups`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/cell-groups/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/cell-groups/${id}`),
  getMembers: (cellId) => api.get(`/churches/${churchId()}/cell-groups/${cellId}/members`),
  addMember: (cellId, d) => api.post(`/churches/${churchId()}/cell-groups/${cellId}/members`, d),
  updateMember: (cellId, memberId, d) => api.put(`/churches/${churchId()}/cell-groups/${cellId}/members/${memberId}`, d),
  deleteMember: (cellId, memberId) => api.delete(`/churches/${churchId()}/cell-groups/${cellId}/members/${memberId}`),
  getAttendance: (cellId) => api.get(`/churches/${churchId()}/cell-groups/${cellId}/attendance`),
  addAttendance: (cellId, d) => api.post(`/churches/${churchId()}/cell-groups/${cellId}/attendance`, d),
}

export const equipmentAPI = {
  getAll: () => api.get(`/churches/${churchId()}/equipment`),
  create: (d) => api.post(`/churches/${churchId()}/equipment`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/equipment/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/equipment/${id}`),
}

export const purchasesAPI = {
  getAll: () => api.get(`/churches/${churchId()}/purchases`),
  create: (d) => api.post(`/churches/${churchId()}/purchases`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/purchases/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/purchases/${id}`),
}

export const songsAPI = {
  getAll: () => api.get(`/churches/${churchId()}/songs`),
  create: (d) => api.post(`/churches/${churchId()}/songs`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/songs/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/songs/${id}`),
}

export const counsellingAPI = {
  getAll: () => api.get(`/churches/${churchId()}/counselling`),
  create: (d) => api.post(`/churches/${churchId()}/counselling`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/counselling/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/counselling/${id}`),
}

export const vendorsAPI = {
  getAll: () => api.get(`/vendors`),
  getApproved: () => api.get(`/vendors/approved`),
  apply: (d) => api.post(`/vendors`, d),
  update: (id, d) => api.put(`/vendors/${id}`, d),
  delete: (id) => api.delete(`/vendors/${id}`),
}

export const dashboardAPI = {
  getStats: () => api.get(`/churches/${churchId()}/dashboard`),
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

export const smsAPI = {
  send: (d) => api.post('/admin/sms/send', d),
}

export const volunteersAPI = {
  getAll: () => api.get(`/churches/${churchId()}/volunteers`),
  create: (d) => api.post(`/churches/${churchId()}/volunteers`, d),
  update: (id, d) => api.put(`/churches/${churchId()}/volunteers/${id}`, d),
  delete: (id) => api.delete(`/churches/${churchId()}/volunteers/${id}`),
}
