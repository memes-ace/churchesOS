import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, X, Check, Users, Phone, Mail } from 'lucide-react'
import { volunteersAPI } from '../utils/api'

const emptyVolunteer = {
  name: '', phone: '', email: '', role: '', ministry: '', 
  status: 'Active', availability: '', notes: ''
}

function VolunteerModal({ volunteer, onClose, onSave }) {
  const [form, setForm] = useState(volunteer || emptyVolunteer)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
            {volunteer ? 'Edit Volunteer' : 'Add Volunteer'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name *', field: 'name', type: 'text', col: 2 },
            { label: 'Phone', field: 'phone', type: 'tel' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Role / Position', field: 'role', type: 'text' },
            { label: 'Ministry', field: 'ministry', type: 'text' },
            { label: 'Availability', field: 'availability', type: 'text', ph: 'e.g. Weekends' },
          ].map(f => (
            <div key={f.field} className={f.col === 2 ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
            <textarea rows={2} value={form.notes || ''} onChange={e => update('notes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {volunteer ? 'Save Changes' : 'Add Volunteer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    volunteersAPI.getAll()
      .then(data => { if (Array.isArray(data)) setVolunteers(data) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (editing) {
        const updated = await volunteersAPI.update(editing.id, form)
        setVolunteers(prev => prev.map(v => v.id === editing.id ? { ...v, ...form } : v))
      } else {
        const saved = await volunteersAPI.create(form)
        setVolunteers(prev => [...prev, saved])
      }
      setShowModal(false)
      setEditing(null)
    } catch(e) { console.warn(e) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this volunteer?')) return
    try {
      await volunteersAPI.delete(id)
      setVolunteers(prev => prev.filter(v => v.id !== id))
    } catch(e) { console.warn(e) }
  }

  const filtered = volunteers.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.role?.toLowerCase().includes(search.toLowerCase()) ||
    v.ministry?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = { Active: { bg: '#DCFCE7', text: '#166534' }, Inactive: { bg: '#FEE2E2', text: '#991B1B' }, 'On Leave': { bg: '#FEF9C3', text: '#854D0E' } }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {showModal && <VolunteerModal volunteer={editing} onClose={() => { setShowModal(false); setEditing(null) }} onSave={handleSave} />}

      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Volunteers</h1>
          <p className="text-gray-400 text-sm mt-1">{volunteers.length} volunteers registered</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#1B4FD8' }}>
          <Plus size={16} /> Add Volunteer
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 fade-in">
        {[
          { label: 'Total', value: volunteers.length, color: '#1B4FD8' },
          { label: 'Active', value: volunteers.filter(v => v.status === 'Active').length, color: '#059669' },
          { label: 'Inactive', value: volunteers.filter(v => v.status !== 'Active').length, color: '#DC2626' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-5 fade-in">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search volunteers..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Users size={40} className="mx-auto mb-3 text-gray-200" />
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No volunteers yet</h3>
          <p className="text-gray-400 text-sm">Add your first volunteer to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Role', 'Ministry', 'Phone', 'Availability', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => {
                const sc = statusColor[v.status] || statusColor.Active
                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.email}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{v.role || '—'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{v.ministry || '—'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{v.phone || '—'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{v.availability || '—'}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: sc.bg, color: sc.text }}>{v.status}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(v); setShowModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-blue-50" style={{ color: '#1B4FD8' }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(v.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#DC2626' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
