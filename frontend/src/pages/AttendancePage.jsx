import { useState, useEffect } from 'react'
import { Plus, X, Users, Calendar, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react'
import { attendanceAPI, membersAPI } from '../utils/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const serviceTypes = ['Sunday Service', 'Midweek Service', 'Prayer Meeting', 'Youth Meeting', 'Cell Meeting', 'Special Program']

function RecordModal({ members, onClose, onSave }) {
  const [form, setForm] = useState({
    service_type: 'Sunday Service',
    date: new Date().toISOString().split('T')[0],
    count: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.count || !form.date) return
    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch(e) { console.warn(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Cormorant Garamond" }}>Record Attendance</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select value={form.service_type} onChange={e => setForm(p => ({...p, service_type: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {serviceTypes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Count *</label>
            <input type="number" value={form.count} onChange={e => setForm(p => ({...p, count: e.target.value}))}
              placeholder="e.g. 150" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))}
              rows={2} placeholder="Any notes about this service..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <button onClick={handleSave} disabled={loading || !form.count}
            className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const [records, setRecords] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [stats, setStats] = useState({ total: 0, average: 0, highest: 0, services: 0 })

  useEffect(() => {
    Promise.all([
      attendanceAPI.getAll(),
      membersAPI.getAll(),
    ]).then(([attendance, memberList]) => {
      const recs = Array.isArray(attendance) ? attendance : []
      setRecords(recs)
      setMembers(Array.isArray(memberList) ? memberList : [])
      
      if (recs.length > 0) {
        const counts = recs.map(r => Number(r.count || 0))
        setStats({
          total: counts.reduce((a, b) => a + b, 0),
          average: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length),
          highest: Math.max(...counts),
          services: recs.length,
        })
      }
    }).catch(e => console.warn(e))
    .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    const saved = await attendanceAPI.create(form)
    const newRecord = saved || { ...form, id: Date.now().toString() }
    setRecords(prev => [newRecord, ...prev])
    const allRecords = [newRecord, ...records]
    const counts = allRecords.map(r => Number(r.count || 0))
    setStats({
      total: counts.reduce((a, b) => a + b, 0),
      average: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length),
      highest: Math.max(...counts),
      services: allRecords.length,
    })
  }

  // Build chart data from records
  const chartData = records.slice(0, 12).reverse().map(r => ({
    name: r.service_type?.split(' ')[0] + ' ' + (r.date ? new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''),
    count: Number(r.count || 0)
  }))

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Attendance</h1>
          <p className="text-gray-400 text-sm mt-1">Track service attendance records</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#1B4FD8' }}>
          <Plus size={16} /> Record Attendance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Members', value: members.length, color: '#1B4FD8', bg: '#EEF2FF', icon: Users },
          { label: 'Services Recorded', value: stats.services, color: '#7C3AED', bg: '#EDE9FE', icon: Calendar },
          { label: 'Average Attendance', value: stats.average || 0, color: '#059669', bg: '#F0FDF4', icon: TrendingUp },
          { label: 'Highest Count', value: stats.highest || 0, color: '#F59E0B', bg: '#FEF9C3', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{s.label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-8 fade-in">
          <h3 className="font-bold text-gray-800 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#1B4FD8" fill="#EEF2FF" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records */}
      <div className="bg-white rounded-2xl border border-gray-100 fade-in">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Attendance Records</h3>
        </div>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No attendance records yet</p>
            <p className="text-sm mt-1">Click "Record Attendance" to add your first record</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {records.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                    <Users size={16} style={{ color: '#1B4FD8' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.service_type || 'Service'}</p>
                    <p className="text-xs text-gray-400">{r.date ? new Date(r.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                    {r.notes && <p className="text-xs text-gray-400 italic">{r.notes}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#1B4FD8' }}>{r.count}</p>
                  <p className="text-xs text-gray-400">attendees</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <RecordModal members={members} onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  )
}
