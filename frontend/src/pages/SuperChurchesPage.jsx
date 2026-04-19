import { adminAPI } from '../utils/api'
import { useState, useEffect } from 'react'
import { Search, Plus, X, Check, XCircle, Clock, Settings } from 'lucide-react'

const ALL_FEATURES = [
  { key: 'members', label: 'Members' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'finance', label: 'Finance' },
  { key: 'events', label: 'Events' },
  { key: 'communication', label: 'Communication' },
  { key: 'sermons', label: 'Sermons' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'prayer', label: 'Prayer Requests' },
  { key: 'ministries', label: 'Ministries' },
  { key: 'cell-groups', label: 'Cell Groups' },
  { key: 'counselling', label: 'Counselling' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'songs', label: 'Song Library' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'reports', label: 'Reports' },
  { key: 'roles', label: 'Roles & Access' },
]

const getSettings = () => {
  try { return JSON.parse(localStorage.getItem('cos_platform_settings') || '{}') }
  catch(e) { return {} }
}

const planConfig = {
  free:       { label: 'Free',       bg: '#F3F4F6', text: '#6B7280',  price: 0 },
  starter:    { label: 'Starter',    bg: '#DBEAFE', text: '#1E40AF',  price: 1800 },
  growth:     { label: 'Growth',     bg: '#EDE9FE', text: '#5B21B6',  price: 5400 },
  enterprise: { label: 'Enterprise', bg: '#FEF9C3', text: '#854D0E',  price: 10200 },
  trial:      { label: 'Trial',      bg: '#F3F4F6', text: '#6B7280',  price: 0 },
}

const statusConfig = {
  active:    { label: 'Active',    bg: '#DCFCE7', text: '#166534' },
  trial:     { label: 'Trial',     bg: '#DBEAFE', text: '#1E40AF' },
  suspended: { label: 'Suspended', bg: '#FEE2E2', text: '#991B1B' },
  pending:   { label: 'Pending',   bg: '#FEF9C3', text: '#854D0E' },
}

function FeatureControlModal({ church, onClose, onSave }) {
  const defaultFeatures = ALL_FEATURES.map(f => f.key)
  const current = (() => {
    try { return church.features ? JSON.parse(church.features) : defaultFeatures }
    catch(e) { return defaultFeatures }
  })()
  const [enabled, setEnabled] = useState(current)

  const toggle = (key) => {
    setEnabled(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const enableAll = () => setEnabled(ALL_FEATURES.map(f => f.key))
  const disableAll = () => setEnabled(['members'])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: "Cormorant Garamond", fontSize: "20px" }}>Feature Control</h2>
            <p className="text-xs text-gray-400 mt-0.5">{church.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="flex gap-2 px-5 pt-4 flex-shrink-0">
          <button onClick={enableAll} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#DCFCE7", color: "#166534" }}>Enable All</button>
          <button onClick={disableAll} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#FEE2E2", color: "#991B1B" }}>Disable All</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {ALL_FEATURES.map(f => (
            <div key={f.key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{f.label}</span>
              <button onClick={() => toggle(f.key)}
                className="w-10 h-6 rounded-full flex items-center transition flex-shrink-0"
                style={{ background: enabled.includes(f.key) ? "#1B4FD8" : "#E5E7EB", padding: "2px" }}>
                <div className="w-5 h-5 bg-white rounded-full shadow transition"
                  style={{ transform: enabled.includes(f.key) ? "translateX(16px)" : "translateX(0)" }}></div>
              </button>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { onSave(church.id, JSON.stringify(enabled)); onClose() }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: "#1B4FD8" }}>
            Save Feature Settings
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function SuperChurchesPage() {
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [featureChurch, setFeatureChurch] = useState(null)

  useEffect(() => {
    adminAPI.getChurches()
      .then(data => {
        console.log('Churches data:', data)
        if (Array.isArray(data)) {
          setChurches(data)
        } else {
          console.warn('Not an array:', data)
        }
      })
      .catch(e => console.warn("Churches load error:", e))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try { await adminAPI.updateChurch(id, { status }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const updatePlan = async (id, plan) => {
    try { await adminAPI.updateChurch(id, { plan }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, plan } : c))
  }

  const saveFeatures = async (id, features) => {
    try { await adminAPI.updateChurch(id, { features }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, features } : c))
  }

  const updateSenderId = async (id, sender_id) => {
    try { await adminAPI.updateChurch(id, { sender_id }) } catch(e) {}
    setChurches(prev => prev.map(c => c.id === id ? { ...c, sender_id } : c))
  }

  const filtered = churches.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.pastor_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatus = (s) => statusConfig[s?.toLowerCase()] || { label: s || "Trial", bg: "#F3F4F6", text: "#6B7280" }
  const getPlan = (p) => planConfig[p?.toLowerCase()] || { label: p || "Trial", bg: "#F3F4F6", text: "#6B7280", price: 0 }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>All Churches</h1>
          <p className="text-gray-400 text-sm mt-1">{churches.length} churches registered on the platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total", value: churches.length, color: "#1B4FD8" },
          { label: "Active", value: churches.filter(c => c.status === "active" || c.status === "Active").length, color: "#059669" },
          { label: "Trial", value: churches.filter(c => c.status === "trial" || c.status === "Trial").length, color: "#F59E0B" },
          { label: "Suspended", value: churches.filter(c => c.status === "suspended" || c.status === "Suspended").length, color: "#DC2626" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 fade-in">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search churches..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading churches...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">⛪</p>
          <p className="text-gray-500 font-medium">No churches found</p>
          <p className="text-gray-400 text-sm mt-1">Churches will appear here when they register</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Church", "Plan", "Sender ID", "Status", "Members", "Features", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const plan = getPlan(c.plan)
                const status = getStatus(c.status)
                const featCount = (() => {
                  try { return c.features ? JSON.parse(c.features).length : ALL_FEATURES.length }
                  catch(e) { return ALL_FEATURES.length }
                })()
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.pastor_name || ""} {c.location ? "• " + c.location : ""}</p>
                    </td>
                    <td className="py-4 px-4">
                      <select value={c.plan || "trial"} onChange={e => updatePlan(c.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg font-medium border-0 cursor-pointer focus:outline-none"
                        style={{ background: plan.bg, color: plan.text }}>
                        <option value="trial">Trial</option>
                        <option value="free">Free</option>
                        <option value="starter">Starter — GHC {(getSettings().starterPlan?.price || getSettings().starterPrice || 1800).toLocaleString()}/mo</option>
                        <option value="growth">Growth — GHC {(getSettings().growthPlan?.price || getSettings().growthPrice || 5400).toLocaleString()}/mo</option>
                        <option value="enterprise">Enterprise — GHC {(getSettings().enterprisePlan?.price || getSettings().enterprisePrice || 10200).toLocaleString()}/mo</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={c.sender_id || ''}
                        onChange={e => setChurches(prev => prev.map(ch => ch.id === c.id ? { ...ch, sender_id: e.target.value } : ch))}
                        onBlur={e => updateSenderId(c.id, e.target.value)}
                        placeholder="e.g. Tabscrow"
                        className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none w-28"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <select value={c.status || "trial"} onChange={e => updateStatus(c.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg font-medium border-0 cursor-pointer focus:outline-none"
                        style={{ background: status.bg, color: status.text }}>
                        <option value="trial">Trial</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{c.member_count || 0}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-500">{featCount}/{ALL_FEATURES.length} enabled</span>
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={() => setFeatureChurch(c)}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ background: "#EDE9FE", color: "#7C3AED" }}>
                        <Settings size={12} /> Features
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {featureChurch && (
        <FeatureControlModal
          church={featureChurch}
          onClose={() => setFeatureChurch(null)}
          onSave={saveFeatures}
        />
      )}
    </div>
  )
}
