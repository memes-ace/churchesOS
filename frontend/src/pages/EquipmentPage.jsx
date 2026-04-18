import { equipmentAPI } from '../utils/api'
import { useDB } from '../hooks/useDB'
import { useState } from 'react'
import { Plus, X, Save, Trash2, Upload, AlertTriangle, CheckCircle, Clock, Wrench, Eye } from 'lucide-react'

const urgencyLevels = ['Low', 'Medium', 'High', 'Critical']
const departments = ['Choir', 'Instrumentalists', 'Media Team', 'Ushering', 'Prayer Team', 'Youth Ministry', 'Sunday School', 'Security', 'General Church']
const statusOptions = ['Reported', 'Under Review', 'Repairing', 'Fixed']

const statusConfig = {
  Reported: { bg: '#FEE2E2', text: '#991B1B', icon: AlertTriangle, color: '#DC2626' },
  'Under Review': { bg: '#FEF9C3', text: '#854D0E', icon: Eye, color: '#F59E0B' },
  Repairing: { bg: '#DBEAFE', text: '#1E40AF', icon: Wrench, color: '#1B4FD8' },
  Fixed: { bg: '#DCFCE7', text: '#166534', icon: CheckCircle, color: '#059669' },
}

const urgencyConfig = {
  Low: { bg: '#F0FDF4', text: '#166534' },
  Medium: { bg: '#FEF9C3', text: '#854D0E' },
  High: { bg: '#FEE2E2', text: '#991B1B' },
  Critical: { bg: '#450A0A', text: '#FEF2F2' },
}

const emptyReport = {
  equipmentName: '', department: '', description: '', urgency: 'Medium',
  status: 'Reported', reportedBy: '', image: null, imagePreview: null, notes: '',
}

function ReportModal({ report, onClose, onSave, onDelete, onStatusChange }) {
  const [form, setForm] = useState(report ? { ...report } : { ...emptyReport, dateReported: new Date().toISOString().split('T')[0], reportId: 'EQ-' + Date.now() })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      update('image', file)
      const reader = new FileReader()
      reader.onload = ev => update('imagePreview', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
              {report ? form.equipmentName : 'Report Equipment Issue'}
            </h2>
            {report && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: statusConfig[form.status]?.bg, color: statusConfig[form.status]?.text }}>
                  {form.status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: urgencyConfig[form.urgency]?.bg, color: urgencyConfig[form.urgency]?.text }}>
                  {form.urgency} Priority
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {report && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Equipment Name *</label>
            <input type="text" value={form.equipmentName} onChange={e => update('equipmentName', e.target.value)}
              placeholder="e.g. Keyboard, Projector, Microphone"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Department</label>
              <select value={form.department} onChange={e => update('department', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select dept</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Urgency Level</label>
              <select value={form.urgency} onChange={e => update('urgency', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {urgencyLevels.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description of Problem *</label>
            <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reported By</label>
              <input type="text" value={form.reportedBy} onChange={e => update('reportedBy', e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Reported</label>
              <input type="date" value={form.dateReported} onChange={e => update('dateReported', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>

          {report && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map(s => {
                  const cfg = statusConfig[s]
                  const Icon = cfg.icon
                  return (
                    <button key={s} onClick={() => update('status', s)}
                      className="flex items-center gap-2 p-3 rounded-xl border-2 transition text-left"
                      style={{ borderColor: form.status === s ? cfg.color : '#E5E7EB', background: form.status === s ? cfg.bg : 'white' }}>
                      <Icon size={14} style={{ color: cfg.color }} />
                      <span className="text-xs font-medium" style={{ color: form.status === s ? cfg.text : '#6B7280' }}>{s}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Upload Image of Issue</label>
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-orange-300 transition">
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="" className="w-16 h-16 object-cover rounded-xl" />
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#FFF7ED' }}>
                  <Upload size={20} style={{ color: '#F59E0B' }} />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">{form.image ? 'Image uploaded' : 'Upload photo of issue'}</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Additional Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)}
              placeholder="Any other relevant information..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.equipmentName && form.description) { onSave(form); onClose() } }}
            disabled={!form.equipmentName || !form.description}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#F59E0B' }}>
            <Save size={15} /> {report ? 'Update Report' : 'Submit Report'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>

        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Report?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently remove this equipment report.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(report.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EquipmentPage() {
  const storageKey = 'cos_equipment'
  const getReports = () => { try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : [] } catch(e) { return [] } }
  const [reports, setReports] = useState(getReports)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  const saveReports = (list) => { setReports(list); try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {} }
  const handleSave = (form) => {
    if (selected) { saveReports(reports.map(r => r.id === selected.id ? { ...r, ...form } : r)) }
    else { saveReports([{ id: Date.now(), ...form }, ...reports]) }
    setSelected(null); setShowAdd(false)
  }
  const handleDelete = (id) => { saveReports(reports.filter(r => r.id !== id)) }

  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Equipment & Assets</h1>
          <p className="text-gray-400 text-sm mt-1">{reports.length} reports • {reports.filter(r => r.status !== 'Fixed').length} pending</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#F59E0B' }}>
          <Plus size={15} /> Report Issue
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {statusOptions.map(s => {
          const cfg = statusConfig[s]
          const count = reports.filter(r => r.status === s).length
          const Icon = cfg.icon
          return (
            <div key={s} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card cursor-pointer" onClick={() => setFilter(s === filter ? 'All' : s)}
              style={{ borderColor: filter === s ? cfg.color : '' }}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} style={{ color: cfg.color }} />
                <span className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{s}</p>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mb-6 fade-in">
        {['All', ...statusOptions].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#F59E0B' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#F59E0B' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No equipment reports</h3>
          <p className="text-gray-400 text-sm mb-6">Report a faulty or damaged equipment item</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#F59E0B' }}>
            <Plus size={15} /> Report First Issue
          </button>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {filtered.map(r => {
            const cfg = statusConfig[r.status]
            const Icon = cfg.icon
            return (
              <div key={r.id} onClick={() => { setSelected(r); setShowAdd(false) }}
                className="bg-white rounded-2xl border border-gray-100 p-5 stat-card cursor-pointer hover:border-orange-200 transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: '#FFF7ED' }}>
                    {r.imagePreview ? <img src={r.imagePreview} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">🔧</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{r.equipmentName}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: urgencyConfig[r.urgency]?.bg, color: urgencyConfig[r.urgency]?.text }}>
                        {r.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{r.department} • Reported by {r.reportedBy || 'Unknown'}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.dateReported ? new Date(r.dateReported).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: cfg.bg, color: cfg.text }}>
                      <Icon size={11} /> {r.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(selected || showAdd) && (
        <ReportModal
          report={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
