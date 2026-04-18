import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Edit, Wrench, AlertTriangle } from 'lucide-react'
import { equipmentAPI } from '../utils/api'

const urgencies = ['Low', 'Medium', 'High', 'Critical']
const departments = ['Sound & Media', 'Sanctuary', 'Children', 'Youth', 'Kitchen', 'Office', 'Security', 'Other']
const statuses = ['Reported', 'Under Review', 'Being Fixed', 'Fixed', 'Replaced', 'Written Off']

function EquipmentModal({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { ...item } : { equipment_name: '', department: '', description: '', urgency: 'Medium', status: 'Reported', reported_by: '', date_reported: new Date().toISOString().split('T')[0], notes: '' })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {item ? 'Edit Report' : 'Report Equipment Issue'}
          </h2>
          <div className="flex gap-2">
            {item && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {[
            { label: 'Equipment Name *', field: 'equipment_name', ph: 'e.g. Main PA System, Projector' },
            { label: 'Reported By', field: 'reported_by', ph: 'Your name' },
            { label: 'Description of Problem *', field: 'description', ph: 'Describe the issue in detail' },
            { label: 'Notes', field: 'notes', ph: 'Additional notes or repair history' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              {f.field === 'description' || f.field === 'notes' ? (
                <textarea rows={3} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                  placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              ) : (
                <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                  placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Department', field: 'department', options: departments },
              { label: 'Urgency', field: 'urgency', options: urgencies },
              { label: 'Status', field: 'status', options: statuses },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Reported</label>
              <input type="date" value={form.date_reported || ''} onChange={e => update('date_reported', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.equipment_name && form.description) { onSave(form); onClose() } }}
            disabled={!form.equipment_name || !form.description}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {item ? 'Save Changes' : 'Submit Report'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <h3 className="font-bold text-gray-900 mb-2">Delete Report?</h3>
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

export default function EquipmentPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    equipmentAPI.getAll()
      .then(data => { if (Array.isArray(data)) setReports(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await equipmentAPI.update(selected.id, form)
        setReports(prev => prev.map(r => r.id === selected.id ? { ...r, ...form } : r))
      } else {
        const saved = await equipmentAPI.create(form)
        setReports(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setReports(prev => prev.map(r => r.id === selected.id ? { ...r, ...form } : r))
      else setReports(prev => [{ ...form, id: Date.now() }, ...prev])
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await equipmentAPI.delete(id) } catch(e) {}
    setReports(prev => prev.filter(r => r.id !== id))
    setSelected(null)
  }

  const urgencyColors = { Low: { bg: '#DCFCE7', text: '#166534' }, Medium: { bg: '#FEF9C3', text: '#854D0E' }, High: { bg: '#FEE2E2', text: '#991B1B' }, Critical: { bg: '#DC2626', text: 'white' } }
  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter || r.urgency === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Equipment Reports</h1>
          <p className="text-gray-400 text-sm mt-1">{reports.length} reports • {reports.filter(r => r.status === 'Reported').length} open</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Report Issue
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap fade-in">
        {['All', 'Reported', 'Being Fixed', 'Fixed', 'Critical', 'High'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No equipment reports</h3>
          <p className="text-gray-400 text-sm mb-6">Report a faulty or damaged equipment</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Report First Issue
          </button>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                <Wrench size={18} style={{ color: '#DC2626' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.equipment_name}</h3>
                    <p className="text-xs text-gray-400">{r.department} • Reported by {r.reported_by || 'Unknown'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: urgencyColors[r.urgency]?.bg || '#F3F4F6', color: urgencyColors[r.urgency]?.text || '#374151' }}>
                      {r.urgency}
                    </span>
                    <button onClick={() => setSelected(r)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Edit size={13} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: r.status === 'Fixed' ? '#DCFCE7' : '#F3F4F6', color: r.status === 'Fixed' ? '#166534' : '#6B7280' }}>{r.status}</span>
                  <span className="text-xs text-gray-300">{r.date_reported}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <EquipmentModal item={selected} onClose={() => { setSelected(null); setShowAdd(false) }} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  )
}
