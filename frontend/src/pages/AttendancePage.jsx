import { useState } from 'react'
import { Plus, Search, X, QrCode } from 'lucide-react'
const services = [
  { id: 1, name: 'Sunday Morning Service', date: '2025-04-13', count: 256, type: 'Sunday Service' },
  { id: 2, name: 'Midweek Prayer Meeting', date: '2025-04-09', count: 78, type: 'Prayer Meeting' },
  { id: 3, name: 'Sunday Morning Service', date: '2025-04-06', count: 241, type: 'Sunday Service' },
  { id: 4, name: 'Youth Meeting', date: '2025-04-05', count: 63, type: 'Ministry Meeting' },
]
const members = [
  { id: 1, name: 'Abena Asante', avatar: 'AA', checkedIn: true },
  { id: 2, name: 'Kwame Boateng', avatar: 'KB', checkedIn: true },
  { id: 3, name: 'Gifty Mensah', avatar: 'GM', checkedIn: false },
  { id: 4, name: 'Emmanuel Darko', avatar: 'ED', checkedIn: true },
  { id: 5, name: 'Adwoa Frimpong', avatar: 'AF', checkedIn: false },
  { id: 6, name: 'Kofi Asumadu', avatar: 'KA', checkedIn: true },
  { id: 7, name: 'Ama Owusu', avatar: 'AO', checkedIn: true },
  { id: 8, name: 'Yaw Oppong', avatar: 'YO', checkedIn: true },
]
export default function AttendancePage() {
  const [recording, setRecording] = useState(false)
  const [search, setSearch] = useState('')
  const [attendees, setAttendees] = useState(members)
  const toggle = (id) => setAttendees(prev => prev.map(m => m.id === id ? { ...m, checkedIn: !m.checkedIn } : m))
  const count = attendees.filter(m => m.checkedIn).length
  const filtered = attendees.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Attendance</h1>
          <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button onClick={() => setRecording(!recording)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: recording ? '#EF4444' : '#1B4FD8' }}>
          {recording ? <><X size={15} /> Stop</> : <><Plus size={15} /> Record Attendance</>}
        </button>
      </div>
      {recording && (
        <div className="bg-white rounded-2xl border-2 p-6 mb-8 fade-in" style={{ borderColor: '#1B4FD8' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-lg text-gray-800">Recording Attendance</h2>
              <p className="text-sm text-gray-400">Tap to mark present or absent</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: '#1B4FD8' }}>{count}</p>
              <p className="text-xs text-gray-400">present</p>
            </div>
          </div>
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search member..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {filtered.map(m => (
              <button key={m.id} onClick={() => toggle(m.id)}
                className="flex items-center gap-3 p-3 rounded-xl border-2 transition text-left"
                style={{ borderColor: m.checkedIn ? '#1B4FD8' : '#E5E7EB', background: m.checkedIn ? '#EEF2FF' : 'white' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: m.checkedIn ? '#1B4FD8' : '#D1D5DB' }}>
                  {m.checkedIn ? '✓' : m.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{m.name.split(' ')[0]}</p>
                  <p className="text-xs" style={{ color: m.checkedIn ? '#1B4FD8' : '#9CA3AF' }}>{m.checkedIn ? 'Present' : 'Absent'}</p>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setRecording(false)} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
            Save Attendance ({count} present)
          </button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-8 fade-in">
        {[{ label: 'Last Sunday', value: '256', sub: '+8% vs prior' },{ label: 'Monthly Avg', value: '237', sub: 'March 2025' },{ label: 'Yearly Avg', value: '201', sub: '2025 so far' }].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center stat-card">
            <p className="text-3xl font-bold mb-1" style={{ color: '#1B4FD8' }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Attendance History</h3></div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-50">
            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s.id} className="table-row">
                <td className="py-4 px-6 text-sm font-medium text-gray-800">{s.name}</td>
                <td className="py-4 px-4 hidden md:table-cell"><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{s.type}</span></td>
                <td className="py-4 px-4 text-sm text-gray-500">{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="py-4 px-6 text-right text-sm font-bold" style={{ color: '#1B4FD8' }}>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
