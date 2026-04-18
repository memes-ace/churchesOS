import { useState } from 'react'
import { Plus, X, Save, Trash2, Calendar, MapPin, Users, Edit } from 'lucide-react'

const eventTypes = ['Sunday Service', 'Midweek Service', 'Crusade', 'Conference', 'Youth Program', 'Wedding', 'Funeral', 'Special Program', 'Fundraising', 'Retreat', 'Other']

const emptyEvent = {
  title: '', type: 'Sunday Service', date: '', time: '', endTime: '',
  location: '', description: '', expectedAttendance: '', organizer: '',
  notes: '', status: 'Upcoming',
}

function EventModal({ event, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(event ? { ...event } : { ...emptyEvent })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <div className="flex items-center gap-2">
            {event && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Event Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
              placeholder="e.g. Easter Sunday Service"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Event Type</label>
              <select value={form.type} onChange={e => update('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {eventTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => update('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Time</label>
              <input type="time" value={form.time} onChange={e => update('time', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Location / Venue</label>
            <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
              placeholder="Event venue or address"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Expected Attendance</label>
            <input type="number" value={form.expectedAttendance} onChange={e => update('expectedAttendance', e.target.value)}
              placeholder="Number of people expected"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Organizer</label>
            <input type="text" value={form.organizer} onChange={e => update('organizer', e.target.value)}
              placeholder="Person organizing this event"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Event description..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.title && form.date) { onSave(form); onClose() } }}
            disabled={!form.title || !form.date}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Save size={15} /> {event ? 'Save Changes' : 'Create Event'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Delete Event?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently delete <strong>{form.title}</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(event.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const storageKey = 'cos_events'
  const getEvents = () => { try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch(e) { return [] } }
  const [events, setEvents] = useState(getEvents)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  const save = (list) => { setEvents(list); try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {} }
  const handleSave = (form) => {
    if (selected) save(events.map(e => e.id === selected.id ? { ...e, ...form } : e))
    else save([...events, { id: Date.now(), ...form }])
    setSelected(null); setShowAdd(false)
  }
  const handleDelete = (id) => { save(events.filter(e => e.id !== id)); setSelected(null) }

  const filtered = filter === 'All' ? events : events.filter(e => e.status === filter || e.type === filter)

  const statusColors = {
    Upcoming: { bg: '#EEF2FF', text: '#1B4FD8' },
    Ongoing: { bg: '#DCFCE7', text: '#166534' },
    Completed: { bg: '#F3F4F6', text: '#6B7280' },
    Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Events</h1>
          <p className="text-gray-400 text-sm mt-1">{events.length} events • {events.filter(e => e.status === 'Upcoming').length} upcoming</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Event
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap fade-in">
        {['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No events yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first church event</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Create First Event
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {filtered.map(e => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: statusColors[e.status]?.bg || '#F3F4F6', color: statusColors[e.status]?.text || '#374151' }}>
                  {e.status}
                </span>
                <button onClick={() => { setSelected(e); setShowAdd(false) }} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Edit size={14} className="text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{e.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{e.type}</p>
              <div className="space-y-1.5">
                {e.date && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={11} style={{ color: '#1B4FD8' }} />{new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} {e.time}</p>}
                {e.location && <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin size={11} style={{ color: '#1B4FD8' }} />{e.location}</p>}
                {e.expectedAttendance && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Users size={11} style={{ color: '#1B4FD8' }} />{Number(e.expectedAttendance).toLocaleString()} expected</p>}
              </div>
              {e.description && <p className="text-xs text-gray-400 mt-3 line-clamp-2">{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <EventModal
          event={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
