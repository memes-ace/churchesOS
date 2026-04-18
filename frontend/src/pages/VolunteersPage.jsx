import { useState } from 'react'
import { Plus, Shield, Clock, Check, X, MessageSquare, Star } from 'lucide-react'

const teams = []

const schedule = []

function TeamModal({ team, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{team.emoji}</div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>{team.name}</h2>
              <p className="text-xs text-gray-400">Coordinator: {team.coordinator}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Members', value: team.members },
              { label: 'Hours This Month', value: team.hoursThisMonth },
              { label: 'Next Service', value: team.nextService },
              { label: 'Avg Hours/Member', value: Math.round(team.hoursThisMonth / team.members) + 'h' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: '#EEF2FF' }}>
                <p className="text-lg font-bold" style={{ color: '#1B4FD8' }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 mb-4">
            <p className="text-sm font-semibold text-gray-700">Edit Team Details</p>
            {[
              { label: 'Team Name', defaultValue: team.name },
              { label: 'Coordinator', defaultValue: team.coordinator },
              { label: 'Next Service', defaultValue: team.nextService },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                <input type="text" defaultValue={f.defaultValue}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              Save Changes
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 flex items-center justify-center gap-1">
              <MessageSquare size={14} /> Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VolunteersPage() {
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [scheduleList, setScheduleList] = useState(schedule)

  const toggleCheckIn = (name) => setScheduleList(prev => prev.map(v => v.volunteer === name ? { ...v, checkedIn: !v.checkedIn } : v))

  const topVolunteers = [...schedule].sort((a, b) => b.hours - a.hours).slice(0, 3)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Volunteer Management</h1>
          <p className="text-gray-400 text-sm mt-1">{teams.length} teams • {teams.reduce((s, t) => s + t.members, 0)} total volunteers</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Team
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 fade-in">
        {teams.map(t => (
          <div key={t.id} onClick={() => setSelected(t)}
            className="bg-white rounded-2xl border border-gray-100 p-5 stat-card cursor-pointer hover:border-blue-200 transition">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{t.members} members</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: "16px", letterSpacing: "-0.02em" }} style={{ fontSize: '15px' }}>{t.name}</h3>
            <p className="text-xs text-gray-400 mb-3">Coordinator: {t.coordinator}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={11} /> {t.hoursThisMonth}h this month</span>
              <span style={{ color: '#1B4FD8' }}>{t.nextService}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>Sunday Schedule — Apr 20</h3>
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ background: '#1B4FD8' }}>Send Reminders</button>
          </div>
          <div className="divide-y divide-gray-50">
            {scheduleList.map(v => (
              <div key={v.volunteer} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>{v.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{v.volunteer}</p>
                  <p className="text-xs text-gray-400">{v.team}</p>
                </div>
                <button onClick={() => toggleCheckIn(v.volunteer)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{ background: v.checkedIn ? '#DBEAFE' : '#F3F4F6', color: v.checkedIn ? '#1B4FD8' : '#6B7280' }}>
                  {v.checkedIn ? <><Check size={11} /> Checked In</> : 'Check In'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>Top Volunteers This Month</h3>
            <p className="text-xs text-gray-400 mt-0.5">Ranked by hours served</p>
          </div>
          <div className="p-5 space-y-4">
            {topVolunteers.map((v, i) => (
              <div key={v.volunteer} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: i === 0 ? '#FEF9C3' : i === 1 ? '#F3F4F6' : '#FEF3C7', color: i === 0 ? '#854D0E' : '#374151' }}>
                  {i + 1}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>{v.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{v.volunteer}</p>
                  <p className="text-xs text-gray-400">{v.team}</p>
                </div>
                <div className="flex items-center gap-1">
                  {i === 0 && <Star size={14} fill="#F59E0B" stroke="none" />}
                  <span className="text-sm font-bold" style={{ color: '#1B4FD8' }}>{v.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && <TeamModal team={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
