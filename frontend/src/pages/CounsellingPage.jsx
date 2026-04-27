import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Edit, Heart, Clock } from 'lucide-react'
import { counsellingAPI } from '../utils/api'

const counsellingTypes = ['Pre-Marital', 'Marital', 'Grief', 'Family', 'Personal', 'Financial', 'Career', 'Youth', 'Other']
const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show']

function CounsellingModal({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { ...item } : { member_name: '', member_phone: '', date: '', time: '', type: 'Personal', status: 'Pending', notes: '' })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {item ? 'Edit Appointment' : 'Book Appointment'}
          </h2>
          <div className="flex gap-2">
            {item && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {[
            { label: 'Member Name *', field: 'member_name', ph: 'Full name' },
            { label: 'Phone Number', field: 'member_phone', ph: '+233 24 000 0000' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date *</label>
              <input type="date" value={form.date || ''} onChange={e => update('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Time *</label>
              <input type="time" value={form.time || ''} onChange={e => update('time', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
              <select value={form.type || 'Personal'} onChange={e => update('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {counsellingTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status || 'Pending'} onChange={e => update('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes (Confidential)</label>
            <textarea rows={4} value={form.notes || ''} onChange={e => update('notes', e.target.value)}
              placeholder="Session notes (confidential)..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.member_name && form.date && form.time) { onSave(form); onClose() } }}
            disabled={!form.member_name || !form.date || !form.time}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {item ? 'Save Changes' : 'Book Appointment'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <h3 className="font-bold text-gray-900 mb-2">Delete Appointment?</h3>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { onDelete(item.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CounsellingPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    counsellingAPI.getAll()
      .then(data => { if (Array.isArray(data)) setAppointments(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await counsellingAPI.update(selected.id, form)
        setAppointments(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a))
      } else {
        const saved = await counsellingAPI.create(form)
        setAppointments(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setAppointments(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a))
      // API failed - don't add fake data
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await counsellingAPI.delete(id) } catch(e) {}
    setAppointments(prev => prev.filter(a => a.id !== id))
    setSelected(null)
  }

  const statusColors = { Pending: { bg: '#FEF9C3', text: '#854D0E' }, Confirmed: { bg: '#DBEAFE', text: '#1E40AF' }, Completed: { bg: '#DCFCE7', text: '#166534' }, Cancelled: { bg: '#FEE2E2', text: '#991B1B' }, 'No Show': { bg: '#F3F4F6', text: '#6B7280' } }
  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Counselling</h1>
          <p className="text-gray-400 text-sm mt-1">{appointments.length} appointments • {appointments.filter(a => a.status === 'Pending').length} pending</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Book Appointment
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap fade-in">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div></div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No appointments yet</h3>
          <p className="text-gray-400 text-sm mb-6">Book your first counselling appointment</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Book First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDE9FE' }}>
                <Heart size={18} style={{ color: '#7C3AED' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{a.member_name}</h3>
                    <p className="text-xs text-gray-400">{a.type} • {a.member_phone || ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: statusColors[a.status]?.bg || '#F3F4F6', color: statusColors[a.status]?.text || '#374151' }}>
                      {a.status}
                    </span>
                    <button onClick={() => setSelected(a)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Edit size={13} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {a.date} {a.time ? '• ' + a.time : ''}</p>
                </div>
                {a.notes && <p className="text-xs text-gray-400 mt-1 italic">Note: {a.notes.substring(0, 80)}{a.notes.length > 80 ? '...' : ''}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <CounsellingModal item={selected} onClose={() => { setSelected(null); setShowAdd(false) }} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  )
}
