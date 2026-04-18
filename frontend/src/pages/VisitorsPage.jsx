import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Edit, User, Phone, Mail, MapPin, Calendar, Search } from 'lucide-react'
import { visitorsAPI } from '../utils/api'

const emptyVisitor = {
  full_name: '', phone: '', email: '', gender: '', location: '',
  date_of_first_visit: '', service_attended: '', invited_by: '',
  visitor_status: 'First-Time Visitor', follow_up_status: 'Pending',
  follow_up_assigned_to: '', notes: '',
}

function VisitorModal({ visitor, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(visitor ? { ...visitor } : { ...emptyVisitor })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {visitor ? 'Edit Visitor' : 'Add Visitor'}
          </h2>
          <div className="flex gap-2">
            {visitor && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {[
            { label: 'Full Name *', field: 'full_name', type: 'text', ph: 'Visitor full name' },
            { label: 'Phone', field: 'phone', type: 'tel', ph: '+233 24 000 0000' },
            { label: 'Email', field: 'email', type: 'email', ph: 'visitor@email.com' },
            { label: 'Location / Area', field: 'location', type: 'text', ph: 'Where they live' },
            { label: 'Date of First Visit', field: 'date_of_first_visit', type: 'date' },
            { label: 'Service Attended', field: 'service_attended', type: 'text', ph: 'e.g. Sunday Service' },
            { label: 'Invited By', field: 'invited_by', type: 'text', ph: 'Member who invited them' },
            { label: 'Follow Up Assigned To', field: 'follow_up_assigned_to', type: 'text', ph: 'Pastor or leader name' },
            { label: 'Notes', field: 'notes', type: 'text', ph: 'Additional notes' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{f.label}</label>
              <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Gender</label>
              <select value={form.gender || ''} onChange={e => update('gender', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select</option>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <select value={form.visitor_status || 'First-Time Visitor'} onChange={e => update('visitor_status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option>First-Time Visitor</option>
                <option>Returning Visitor</option>
                <option>Converted to Member</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Follow Up Status</label>
              <select value={form.follow_up_status || 'Pending'} onChange={e => update('follow_up_status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option>Pending</option>
                <option>Contacted</option>
                <option>Visited</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.full_name) { onSave(form); onClose() } }}
            disabled={!form.full_name}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {visitor ? 'Save Changes' : 'Add Visitor'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Delete Visitor?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently delete <strong>{form.full_name}</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(visitor.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    visitorsAPI.getAll()
      .then(data => { if (Array.isArray(data)) setVisitors(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await visitorsAPI.update(selected.id, form)
        setVisitors(prev => prev.map(v => v.id === selected.id ? { ...v, ...form } : v))
      } else {
        const saved = await visitorsAPI.create(form)
        setVisitors(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setVisitors(prev => prev.map(v => v.id === selected.id ? { ...v, ...form } : v))
      else setVisitors(prev => [{ ...form, id: Date.now() }, ...prev])
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await visitorsAPI.delete(id) } catch(e) {}
    setVisitors(prev => prev.filter(v => v.id !== id))
    setSelected(null)
  }

  const filtered = visitors.filter(v => {
    const ms = v.full_name?.toLowerCase().includes(search.toLowerCase()) || v.phone?.includes(search)
    const mf = filter === 'All' || v.visitor_status === filter || v.follow_up_status === filter
    return ms && mf
  })

  const statusColors = {
    'First-Time Visitor': { bg: '#EEF2FF', text: '#1B4FD8' },
    'Returning Visitor': { bg: '#EDE9FE', text: '#5B21B6' },
    'Converted to Member': { bg: '#DCFCE7', text: '#166534' },
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Visitors</h1>
          <p className="text-gray-400 text-sm mt-1">{visitors.length} visitors recorded</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Visitor
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap fade-in">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search visitors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        {['All', 'First-Time Visitor', 'Returning Visitor', 'Converted to Member'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading visitors...</p>
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">👋</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No visitors yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start recording visitors who come to your church</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Visitor
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Visitor', 'Phone', 'Location', 'First Visit', 'Status', 'Follow Up', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(v)}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>
                        {v.full_name?.split(' ').map(w => w[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{v.full_name}</p>
                        <p className="text-xs text-gray-400">{v.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.phone || '—'}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.location || '—'}</td>
                  <td className="py-4 px-4 text-xs text-gray-400">
                    {v.date_of_first_visit ? new Date(v.date_of_first_visit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: statusColors[v.visitor_status]?.bg || '#F3F4F6', color: statusColors[v.visitor_status]?.text || '#374151' }}>
                      {v.visitor_status || 'First-Time Visitor'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: v.follow_up_status === 'Completed' ? '#DCFCE7' : '#FEF9C3', color: v.follow_up_status === 'Completed' ? '#166534' : '#854D0E' }}>
                      {v.follow_up_status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={e => { e.stopPropagation(); setSelected(v) }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(selected || showAdd) && (
        <VisitorModal
          visitor={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
