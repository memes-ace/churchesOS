import { useState } from 'react'
import { Plus, Calendar, Clock, User, X, Check, Phone, Lock } from 'lucide-react'

const appointments = []

const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM']

const counsellingTypes = ['Marriage Counselling', 'Family Issues', 'Spiritual Guidance', 'Career & Finance', 'Grief & Loss', 'Youth Issues', 'General Counselling', 'Pre-marital Counselling']

function AppointmentModal({ appt, onClose }) {
  const [notes, setNotes] = useState(appt.notes)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Appointment Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5 p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#1B4FD8' }}>{appt.avatar}</div>
            <div>
              <p className="font-semibold text-gray-900" style={{ fontSize: "16px", fontWeight: "700", fontFamily: "DM Sans, system-ui, sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}>{appt.member}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> {appt.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Date', value: new Date(appt.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }) },
              { label: 'Time', value: appt.time },
              { label: 'Type', value: appt.type },
              { label: 'Status', value: appt.status },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{value}</p>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={13} className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Private Pastor Notes</label>
            </div>
            <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add private notes after session (only visible to you)..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <div className="mb-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Edit Appointment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" defaultValue={appt.date} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                <input type="time" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Counselling Type</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-sm" defaultValue={appt.type}>
                {['Marriage Counselling','Family Issues','Spiritual Guidance','Career & Finance','Grief & Loss','General Counselling'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Changes</button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
              Send Reminder SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SetAvailabilityModal({ onClose }) {
  const [selected, setSelected] = useState(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'])
  const toggle = (slot) => setSelected(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Set Available Time Slots</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">Select times when you are available for counselling appointments</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {timeSlots.map(slot => (
              <button key={slot} onClick={() => toggle(slot)}
                className="py-2 rounded-xl text-xs font-medium transition"
                style={{
                  background: selected.includes(slot) ? '#1B4FD8' : '#F3F4F6',
                  color: selected.includes(slot) ? 'white' : '#6B7280'
                }}>
                {slot}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
            Save Availability ({selected.length} slots)
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CounsellingPage() {
  const [selected, setSelected] = useState(null)
  const [showAvailability, setShowAvailability] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)
  const todayAppts = appointments.filter(a => a.date === '2025-04-18').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Counselling & Appointments</h1>
          <p className="text-gray-400 text-sm mt-1">{appointments.length} appointments • {todayAppts} today</p>
        </div>
        <button onClick={() => setShowAvailability(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Clock size={15} /> Set Availability
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 fade-in">
        {[
          { label: 'Today', value: todayAppts, color: '#1B4FD8' },
          { label: 'This Week', value: appointments.length, color: '#7C3AED' },
          { label: 'Pending Confirm', value: appointments.filter(a => a.status === 'pending').length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center stat-card">
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 fade-in">
        {['all', 'confirmed', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium capitalize transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3 fade-in">
        {filtered.map(a => (
          <div key={a.id} onClick={() => setSelected(a)}
            className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-blue-200 transition stat-card">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>{a.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{a.member}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: a.status === 'confirmed' ? '#DBEAFE' : '#FEF9C3', color: a.status === 'confirmed' ? '#1E40AF' : '#854D0E' }}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{a.type}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <Calendar size={10} /> {new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  <Clock size={10} /> {a.time}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); setSelected(a) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: '#1B4FD8' }}>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && <AppointmentModal appt={selected} onClose={() => setSelected(null)} />}
      {showAvailability && <SetAvailabilityModal onClose={() => setShowAvailability(false)} />}
    </div>
  )
}
