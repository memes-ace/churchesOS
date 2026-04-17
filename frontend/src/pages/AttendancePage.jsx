import { useState, useEffect } from 'react'
import { Plus, Search, X, Save, Users, Calendar, TrendingUp, Eye, Edit, Trash2, QrCode, UserPlus, ChevronDown, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react'
import { attendanceAPI } from '../utils/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const serviceTypes = ['Sunday Service', 'Midweek Service', 'Prayer Meeting', 'Youth Meeting', 'Cell Meeting', 'Special Program']

const weeklyData = [
  { week: 'Jan W1', count: 142 }, { week: 'Jan W2', count: 158 },
  { week: 'Feb W1', count: 165 }, { week: 'Feb W2', count: 189 },
  { week: 'Mar W1', count: 198 }, { week: 'Mar W2', count: 223 },
  { week: 'Mar W3', count: 241 }, { week: 'Mar W4', count: 256 },
]

const monthlyData = [
  { month: 'Oct', count: 198 }, { month: 'Nov', count: 212 },
  { month: 'Dec', count: 245 }, { month: 'Jan', count: 221 },
  { month: 'Feb', count: 235 }, { month: 'Mar', count: 248 },
]

const ministryAttendance = [
  { name: 'Choir', present: 18, total: 24, color: '#7C3AED' },
  { name: 'Ushering', present: 12, total: 15, color: '#1B4FD8' },
  { name: 'Media Team', present: 6, total: 8, color: '#0891B2' },
  { name: 'Youth Ministry', present: 35, total: 45, color: '#F59E0B' },
  { name: 'Prayer Team', present: 22, total: 30, color: '#059669' },
  { name: 'Sunday School', present: 14, total: 18, color: '#DC2626' },
]

// Load real members from localStorage
const getRealMembers = () => {
  try {
    const saved = localStorage.getItem('cos_members')
    if (!saved) return []
    return JSON.parse(saved).map(m => ({
      id: m.id,
      name: m.fullName,
      avatar: m.fullName ? m.fullName.split(' ').map(w => w[0]).slice(0,2).join('') : '?',
      ministry: m.ministry || 'None',
      cellGroup: m.cellGroup || '—',
    }))
  } catch(e) { return [] }
}

const mockMembers = getRealMembers()

const storageKey = 'cos_attendance'

const getHistory = () => {
  try { const s = localStorage.getItem('cos_attendance_db'); return s ? JSON.parse(s) : [] }
  catch(e) { return [] }
}

// ─── Recording Panel ───────────────────────────────────────────────────────────
function RecordingPanel({ onSave, onCancel }) {
  const [step, setStep] = useState('select') // select | record
  const [serviceType, setServiceType] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [search, setSearch] = useState('')
  const [attendance, setAttendance] = useState(
    mockMembers.map(m => ({ ...m, status: 'absent' }))
  )
  const [visitors, setVisitors] = useState([])
  const [showAddVisitor, setShowAddVisitor] = useState(false)
  const [visitorForm, setVisitorForm] = useState({ name: '', phone: '', invitedBy: '', firstTime: true })

  const toggle = (id) => {
    setAttendance(prev => prev.map(m => {
      if (m.id !== id) return m
      const next = m.status === 'absent' ? 'present' : m.status === 'present' ? 'excused' : 'absent'
      return { ...m, status: next }
    }))
  }

  const presentCount = attendance.filter(m => m.status === 'present').length
  const absentCount = attendance.filter(m => m.status === 'absent').length
  const excusedCount = attendance.filter(m => m.status === 'excused').length
  const filtered = attendance.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  const statusColor = {
    present: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', icon: '✓' },
    absent: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', icon: '✗' },
    excused: { bg: '#FEF9C3', text: '#854D0E', border: '#FDE68A', icon: '~' },
  }

  const addVisitor = () => {
    if (!visitorForm.name) return
    setVisitors(prev => [...prev, { id: Date.now(), ...visitorForm }])
    setVisitorForm({ name: '', phone: '', invitedBy: '', firstTime: true })
    setShowAddVisitor(false)
  }

  const handleSave = () => {
    onSave({
      id: Date.now(),
      serviceName: serviceName || serviceType,
      serviceType,
      date: new Date().toISOString().split('T')[0],
      members: attendance,
      visitors,
      present: presentCount,
      absent: absentCount,
      excused: excusedCount,
      visitorsCount: visitors.length,
      total: presentCount + visitors.length,
      recordedBy: 'Admin',
    })
  }

  if (step === 'select') {
    return (
      <div className="bg-white rounded-2xl border-2 p-6 mb-8 fade-in" style={{ borderColor: '#1B4FD8' }}>
        <h2 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Record Attendance</h2>
        <p className="text-sm text-gray-400 mb-5">Select the service type to begin</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {serviceTypes.map(type => (
            <button key={type} onClick={() => { setServiceType(type); setServiceName(type) }}
              className="p-4 rounded-xl border-2 text-sm font-medium text-left transition"
              style={{ borderColor: serviceType === type ? '#1B4FD8' : '#E5E7EB', background: serviceType === type ? '#EEF2FF' : 'white', color: serviceType === type ? '#1B4FD8' : '#374151' }}>
              <span className="block text-xl mb-1">
                {type === 'Sunday Service' ? '⛪' : type === 'Midweek Service' ? '📖' : type === 'Prayer Meeting' ? '🙏' : type === 'Youth Meeting' ? '🔥' : type === 'Cell Meeting' ? '🏠' : '⭐'}
              </span>
              {type}
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Service Name (optional)</label>
          <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)}
            placeholder="e.g. Easter Sunday Service"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => serviceType && setStep('record')} disabled={!serviceType}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50" style={{ background: '#1B4FD8' }}>
            Start Recording →
          </button>
          <button onClick={onCancel} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border-2 p-6 mb-8 fade-in" style={{ borderColor: '#1B4FD8' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>{serviceName}</h2>
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#059669' }}>{presentCount}</p>
            <p className="text-xs text-gray-400">Present</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#EF4444' }}>{absentCount}</p>
            <p className="text-xs text-gray-400">Absent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>{excusedCount}</p>
            <p className="text-xs text-gray-400">Excused</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400"></span> Present</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400"></span> Absent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-300"></span> Excused</span>
        <span className="text-gray-400 ml-2">Tap card to cycle through statuses</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search member..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {filtered.map(m => {
          const s = statusColor[m.status]
          return (
            <button key={m.id} onClick={() => toggle(m.id)}
              className="flex items-center gap-2 p-3 rounded-xl border-2 transition text-left"
              style={{ borderColor: s.border, background: s.bg }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: m.status === 'present' ? '#059669' : m.status === 'excused' ? '#D97706' : '#9CA3AF' }}>
                {m.status !== 'absent' ? s.icon : m.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: s.text }}>{m.name.split(' ')[0]}</p>
                <p className="text-xs truncate" style={{ color: s.text, opacity: 0.7 }}>{m.ministry}</p>
                <p className="text-xs font-medium capitalize" style={{ color: s.text }}>{m.status}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Visitors Section */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Visitors ({visitors.length})</p>
          <button onClick={() => setShowAddVisitor(!showAddVisitor)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
            <UserPlus size={12} /> Add Visitor
          </button>
        </div>

        {showAddVisitor && (
          <div className="bg-blue-50 rounded-xl p-4 mb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Visitor Name *</label>
                <input type="text" value={visitorForm.name} onChange={e => setVisitorForm(p => ({...p, name: e.target.value}))}
                  placeholder="Full name" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                <input type="tel" value={visitorForm.phone} onChange={e => setVisitorForm(p => ({...p, phone: e.target.value}))}
                  placeholder="+233 24 000 0000" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Invited By</label>
                <input type="text" value={visitorForm.invitedBy} onChange={e => setVisitorForm(p => ({...p, invitedBy: e.target.value}))}
                  placeholder="Member name" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => setVisitorForm(p => ({...p, firstTime: !p.firstTime}))}
                  className="w-8 h-5 rounded-full flex items-center transition"
                  style={{ background: visitorForm.firstTime ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
                  <div className="w-4 h-4 bg-white rounded-full shadow transition" style={{ transform: visitorForm.firstTime ? 'translateX(12px)' : 'translateX(0)' }}></div>
                </button>
                <span className="text-xs text-gray-600">First time visitor</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addVisitor} className="flex-1 py-2 rounded-xl text-white text-xs font-medium" style={{ background: '#1B4FD8' }}>Add Visitor</button>
              <button onClick={() => setShowAddVisitor(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {visitors.length > 0 && (
          <div className="space-y-2">
            {visitors.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#7C3AED' }}>
                  {v.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.phone} {v.firstTime ? '• First Time' : ''}</p>
                </div>
                <button onClick={() => setVisitors(prev => prev.filter(x => x.id !== v.id))} className="p-1 hover:bg-red-50 rounded">
                  <X size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={handleSave}
          className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: '#1B4FD8' }}>
          <Save size={15} /> Save Attendance ({presentCount} present, {visitors.length} visitors)
        </button>
        <button onClick={onCancel} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Attendance Detail Modal ───────────────────────────────────────────────────
function AttendanceDetailModal({ record, onClose }) {
  const [tab, setTab] = useState('members')
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>{record.serviceName}</h2>
            <p className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 p-5 border-b border-gray-100 flex-shrink-0">
          {[
            { label: 'Present', value: record.present, color: '#059669', bg: '#DCFCE7' },
            { label: 'Absent', value: record.absent, color: '#EF4444', bg: '#FEE2E2' },
            { label: 'Excused', value: record.excused, color: '#F59E0B', bg: '#FEF9C3' },
            { label: 'Visitors', value: record.visitorsCount, color: '#7C3AED', bg: '#EDE9FE' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: s.bg }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          {['members', 'visitors'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-xs font-medium capitalize transition"
              style={{ color: tab === t ? '#1B4FD8' : '#6B7280', borderBottom: tab === t ? '2px solid #1B4FD8' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'members' && (
            <div className="space-y-2">
              {record.members?.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: m.status === 'present' ? '#F0FDF4' : m.status === 'excused' ? '#FEFCE8' : '#FEF2F2' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: m.status === 'present' ? '#059669' : m.status === 'excused' ? '#D97706' : '#EF4444' }}>
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.ministry} • {m.cellGroup}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                    style={{ background: m.status === 'present' ? '#DCFCE7' : m.status === 'excused' ? '#FEF9C3' : '#FEE2E2', color: m.status === 'present' ? '#166534' : m.status === 'excused' ? '#854D0E' : '#991B1B' }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          {tab === 'visitors' && (
            <div className="space-y-2">
              {record.visitors?.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No visitors recorded</p>
              ) : record.visitors?.map(v => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#7C3AED' }}>
                    {v.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.phone} • Invited by {v.invitedBy || 'Unknown'}</p>
                  </div>
                  {v.firstTime && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EDE9FE', color: '#5B21B6' }}>First Time</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Attendance Page ──────────────────────────────────────────────────────
export default function AttendancePage() {
  const [recording, setRecording] = useState(false)
  const [history, setHistory] = useState(getHistory)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const saveHistory = (list) => {
    setHistory(list)
    try { localStorage.setItem('cos_attendance_db', JSON.stringify(list)) } catch(e) {}
  }

  const handleSave = async (record) => {
    saveHistory([record, ...history])
    setRecording(false)
    try {
      await attendanceAPI.create({
        service_name: record.serviceName,
        service_type: record.serviceType,
        date: record.date,
        present_count: record.present,
        absent_count: record.absent,
        visitor_count: record.visitorsCount,
        total_count: record.total,
      })
    } catch(e) {}
  }

  const handleDelete = (id) => saveHistory(history.filter(r => r.id !== id))

  const lastSunday = history.find(r => r.serviceType === 'Sunday Service')
  const monthlyAvg = history.length ? Math.round(history.reduce((s, r) => s + r.present, 0) / history.length) : 0
  const totalPresent = history.reduce((s, r) => s + r.present, 0)
  const totalVisitors = history.reduce((s, r) => s + (r.visitorsCount || 0), 0)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'ministry', label: 'By Ministry', icon: '🎵' },
    { id: 'history', label: 'History', icon: '📋' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Attendance</h1>
          <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setRecording(!recording)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: recording ? '#EF4444' : '#1B4FD8' }}>
          {recording ? <><X size={15} /> Stop Recording</> : <><Plus size={15} /> Record Attendance</>}
        </button>
      </div>

      {/* Recording Panel */}
      {recording && <RecordingPanel onSave={handleSave} onCancel={() => setRecording(false)} />}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 fade-in">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition whitespace-nowrap"
            style={{ color: activeTab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: activeTab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Last Sunday', value: lastSunday?.present || 0, sub: lastSunday?.date ? new Date(lastSunday.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No records', color: '#1B4FD8', icon: '⛪' },
              { label: 'Monthly Average', value: monthlyAvg, sub: 'This month', color: '#7C3AED', icon: '📅' },
              { label: 'Yearly Average', value: monthlyAvg, sub: '2025 so far', color: '#059669', icon: '📊' },
              { label: 'Total Members', value: (() => { try { const s = localStorage.getItem('cos_members'); return s ? JSON.parse(s).length : 0 } catch(e) { return 0 } })(), sub: 'Registered', color: '#F59E0B', icon: '👥' },
              { label: 'Services Recorded', value: history.length, sub: 'All time', color: '#0891B2', icon: '📋' },
              { label: 'Total Visitors', value: totalVisitors, sub: 'All services', color: '#EC4899', icon: '👋' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Records */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Records</h3>
              <button onClick={() => setActiveTab('history')} className="text-xs font-medium" style={{ color: '#1B4FD8' }}>View All →</button>
            </div>
            {history.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-400 text-sm mb-2">No attendance records yet</p>
                <p className="text-gray-300 text-xs">Click "Record Attendance" to get started</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Members</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Visitors</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-right py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.slice(0, 5).map(r => (
                    <tr key={r.id} className="table-row">
                      <td className="py-4 px-5 text-sm font-medium text-gray-800">{r.serviceName}</td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{r.serviceType}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-sm font-bold" style={{ color: '#059669' }}>{r.present}</span>
                        <span className="text-xs text-gray-400 ml-1">present</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 hidden lg:table-cell">{r.visitorsCount || 0}</td>
                      <td className="py-4 px-4 text-sm font-bold" style={{ color: '#1B4FD8' }}>{r.total}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedRecord(r)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="View">
                            <Eye size={14} style={{ color: '#1B4FD8' }} />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 fade-in">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">Weekly Attendance Trend</h3>
              <p className="text-xs text-gray-400 mb-5">Last 8 weeks</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="count" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#wGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">Monthly Attendance</h3>
              <p className="text-xs text-gray-400 mb-5">Last 6 months</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Bar dataKey="count" fill="#1B4FD8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-5">Growth Insights</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'vs Last Month', value: '+8%', positive: true },
                { label: 'vs Last Year', value: '+23%', positive: true },
                { label: 'Best Month', value: 'Dec 2024', positive: true },
              ].map(s => (
                <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: '#1B4FD8' }}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ministry Tab */}
      {activeTab === 'ministry' && (
        <div className="space-y-4 fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Ministry Attendance — Last Service</h3>
              <p className="text-xs text-gray-400 mt-0.5">Present count by ministry</p>
            </div>
            <div className="p-5 space-y-4">
              {ministryAttendance.map(m => (
                <div key={m.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: m.color }}>{m.present}</span>
                      <span className="text-xs text-gray-400">/ {m.total}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: m.color + '15', color: m.color }}>
                        {Math.round((m.present / m.total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: (m.present / m.total * 100) + '%', background: m.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full History Tab */}
      {activeTab === 'history' && (
        <div className="fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Complete Attendance History</h3>
              <p className="text-xs text-gray-400 mt-0.5">{history.length} records</p>
            </div>
            {history.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-400 text-sm">No attendance records yet</p>
                <button onClick={() => setRecording(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
                  <Plus size={14} /> Record First Attendance
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Present</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Absent</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Visitors</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-right py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map(r => (
                    <tr key={r.id} className="table-row">
                      <td className="py-4 px-5 text-sm font-medium text-gray-800">{r.serviceName}</td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{r.serviceType}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-4 hidden lg:table-cell text-sm font-bold" style={{ color: '#059669' }}>{r.present}</td>
                      <td className="py-4 px-4 hidden lg:table-cell text-sm font-medium" style={{ color: '#EF4444' }}>{r.absent}</td>
                      <td className="py-4 px-4 hidden lg:table-cell text-sm text-gray-500">{r.visitorsCount || 0}</td>
                      <td className="py-4 px-4 text-sm font-bold" style={{ color: '#1B4FD8' }}>{r.total}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedRecord(r)} className="p-1.5 hover:bg-blue-50 rounded-lg">
                            <Eye size={14} style={{ color: '#1B4FD8' }} />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {selectedRecord && <AttendanceDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  )
}
