import { useState } from 'react'
import { Plus, Calendar, MapPin, X } from 'lucide-react'
const events = [
  { id: 1, name: 'Easter Crusade 2025', type: 'Crusade', date: '2025-04-18', time: '6:00 PM', location: 'Independence Square, Accra', registered: 312, capacity: 500, status: 'upcoming', banner: '✝️' },
  { id: 2, name: 'Youth Revival Night', type: 'Special Program', date: '2025-04-19', time: '7:00 PM', location: 'Grace Chapel Main Auditorium', registered: 67, capacity: 200, status: 'upcoming', banner: '🔥' },
  { id: 3, name: 'Annual General Retreat', type: 'Retreat', date: '2025-05-09', time: '8:00 AM', location: 'Aburi Gardens', registered: 89, capacity: 120, status: 'upcoming', banner: '⛺' },
  { id: 4, name: 'Sunday Service', type: 'Service', date: '2025-04-13', time: '9:00 AM', location: 'Grace Chapel', registered: 256, capacity: 400, status: 'ongoing', banner: '🙏' },
  { id: 5, name: 'Women Conference 2025', type: 'Conference', date: '2025-04-26', time: '9:00 AM', location: 'Kempinski Hotel', registered: 145, capacity: 300, status: 'upcoming', banner: '👑' },
]
function CreateModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Create New Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[{ label: 'Event Name', ph: 'e.g. Easter Sunday Service' },{ label: 'Location', ph: 'Venue name and address' }].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type="text" placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {['Service','Crusade','Conference','Retreat','Prayer','Special Program','Fundraiser','Outreach','Youth Program'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
            <input type="number" placeholder="Max attendees" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Create Event</button>
        </div>
      </div>
    </div>
  )
}
export default function EventsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('All')
  const types = ['All','Service','Crusade','Conference','Retreat','Special Program']
  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Events</h1>
          <p className="text-gray-400 text-sm mt-1">{events.length} events • {events.filter(e => e.status === 'upcoming').length} upcoming</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Event
        </button>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap fade-in">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === t ? '#1B4FD8' : 'white', color: filter === t ? 'white' : '#6B7280', border: '1px solid ' + (filter === t ? '#1B4FD8' : '#E5E7EB') }}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
        {filtered.map(e => {
          const pct = Math.round((e.registered / e.capacity) * 100)
          return (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden stat-card cursor-pointer">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{e.banner}</span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{e.type}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-3">{e.name}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={11} style={{ color: '#1B4FD8' }} />{new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })} • {e.time}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={11} style={{ color: '#1B4FD8' }} />{e.location}</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{e.registered} registered</span><span>{pct}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: pct + '%', background: '#1B4FD8' }}></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: e.status === 'ongoing' ? '#DBEAFE' : '#FEF9C3', color: e.status === 'ongoing' ? '#1E40AF' : '#854D0E' }}>
                  {e.status === 'ongoing' ? '● Live Now' : 'Upcoming'}
                </span>
                <button onClick={e => { e.stopPropagation(); setEditing(true) }} className="text-xs font-medium" style={{ color: '#1B4FD8' }}>Edit →</button>
              </div>
            </div>
          )
        })}
      </div>
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
