import { adminAPI } from '../utils/api'
import { useState, useEffect } from 'react'
import { Search, Plus, X, Save, Check, XCircle, Clock, Eye } from 'lucide-react'

const planConfig = {
  Free: { bg: '#F3F4F6', text: '#6B7280', price: 0 },
  Starter: { bg: '#DBEAFE', text: '#1E40AF', price: 1800 },
  Growth: { bg: '#EDE9FE', text: '#5B21B6', price: 5400 },
  Enterprise: { bg: '#FEF9C3', text: '#854D0E', price: 10200 },
}

const statusConfig = {
  Active: { bg: '#DCFCE7', text: '#166534' },
  Suspended: { bg: '#FEE2E2', text: '#991B1B' },
  Pending: { bg: '#FEF9C3', text: '#854D0E' },
}

function AddChurchModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', pastor: '', location: '', phone: '', email: '',
    plan: 'Free', status: 'Active', members: 0,
  })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Add New Church</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Church Name *', field: 'name', ph: 'Church name' },
            { label: 'Senior Pastor *', field: 'pastor', ph: 'Rev. / Ps. Full Name' },
            { label: 'Location', field: 'location', ph: 'City, Region' },
            { label: 'Phone Number', field: 'phone', ph: '+233 24 000 0000' },
            { label: 'Email Address', field: 'email', ph: 'pastor@church.org' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Plan</label>
              <select value={form.plan} onChange={e => update('plan', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {Object.keys(planConfig).map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => update('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => { if(form.name && form.pastor) { onSave({ id: Date.now(), ...form, joined: new Date().toISOString(), lastActive: new Date().toISOString(), revenue: planConfig[form.plan].price }); onClose() } }}
            disabled={!form.name || !form.pastor}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50" style={{ background: '#1B4FD8' }}>
            Add Church
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SuperChurchesPage() {
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getChurches()
      .then(data => { if (Array.isArray(data)) setChurches(data) })
      .catch(e => console.warn('Churches load error:', e))
      .finally(() => setLoading(false))
  }, [])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)

  const updateStatus = async (id, status) => {
    try { await adminAPI.updateChurch(id, { status }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }
  const updatePlan = async (id, plan) => {
    try { await adminAPI.updateChurch(id, { plan }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, plan } : c))
  }

  const filtered = churches.filter(c => {
    const ms = c.name?.toLowerCase().includes(search.toLowerCase()) || c.pastor?.toLowerCase().includes(search.toLowerCase()) || c.location?.toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'All' || c.status === filter || c.plan === filter
    return ms && mf
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>All Churches</h1>
          <p className="text-gray-400 text-sm mt-1">{churches.length} registered • {churches.filter(c => c.status === 'Active').length} active</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Church
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search churches, pastors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Active', 'Pending', 'Suspended', 'Free', 'Starter', 'Growth', 'Enterprise'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {churches.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">⛪</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No churches yet</h3>
          <p className="text-gray-400 text-sm mb-6">Churches will appear here when they register or you add them manually</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Church
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Location', 'Members', 'Plan', 'Revenue', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>
                        {c.name?.split(' ').map(w => w[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.pastor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{c.location || '—'}</td>
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: '#1B4FD8' }}>{c.members?.toLocaleString() || 0}</td>
                  <td className="py-4 px-4">
                    <select value={c.plan} onChange={e => updatePlan(c.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none"
                      style={{ background: planConfig[c.plan]?.bg, color: planConfig[c.plan]?.text }}>
                      {Object.keys(planConfig).map(p => <option key={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: '#059669' }}>
                    {c.revenue ? 'GHC ' + Number(c.revenue).toLocaleString() : 'Free'}
                  </td>
                  <td className="py-4 px-4">
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none"
                      style={{ background: statusConfig[c.status]?.bg, color: statusConfig[c.status]?.text }}>
                      {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={() => save(churches.filter(ch => ch.id !== c.id))}
                      className="p-1.5 hover:bg-red-50 rounded-lg">
                      <X size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddChurchModal onClose={() => setShowAdd(false)} onSave={(c) => save([...churches, c])} />}
    </div>
  )
}
