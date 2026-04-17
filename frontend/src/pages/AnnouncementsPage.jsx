import { useState } from 'react'
import { Plus, Bell, Calendar, Users, Clock, X, Repeat } from 'lucide-react'

const announcements = [
  { id: 1, title: 'Easter Crusade Reminder', message: 'Dear church family, our Easter Crusade begins this Friday at Independence Square. Buses depart from the church at 5PM. Come with family and friends!', audience: 'All Members', date: '2025-04-17', time: '08:00 AM', status: 'sent', recurring: false, views: 1189 },
  { id: 2, title: 'Sunday Service Change', message: 'Please note that this Sunday service will begin at 8:00 AM instead of 9:00 AM due to the special Easter program. See you there!', audience: 'All Members', date: '2025-04-19', time: '07:00 AM', status: 'scheduled', recurring: false, views: 0 },
  { id: 3, title: 'Weekly Tithes Reminder', message: 'As you prepare for Sunday service, remember to prepare your tithes and offerings. God bless your faithful giving!', audience: 'All Members', date: '2025-04-20', time: '06:00 AM', status: 'scheduled', recurring: true, views: 0 },
  { id: 4, title: 'Youth Meeting This Saturday', message: 'Attention all youth! Our monthly meeting is this Saturday at 3PM. Topic: Walking in Purpose. Refreshments will be served. Do not miss it!', audience: 'Youth Ministry (134)', date: '2025-04-15', time: '09:00 AM', status: 'sent', recurring: false, views: 127 },
  { id: 5, title: 'Choir Practice', message: 'All choir members are reminded of practice this Friday at 5PM. Please come with your song books. Attendance is compulsory.', audience: 'Choir (52)', date: '2025-04-16', time: '10:00 AM', status: 'sent', recurring: true, views: 49 },
]

function CreateModal({ onClose }) {
  const [form, setForm] = useState({ title: '', message: '', audience: 'All Members', date: '', time: '', recurring: false, recurringType: 'weekly' })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Create Announcement</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
              placeholder="Announcement title" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea rows={4} value={form.message} onChange={e => update('message', e.target.value)}
              placeholder="Type your announcement message..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length} characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
            <select value={form.audience} onChange={e => update('audience', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {['All Members', 'Active Members Only', 'Workers Only', 'Leaders Only', 'Youth Ministry', 'Choir', 'Prayer Team', 'Ushering'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send Date</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send Time</label>
              <input type="time" value={form.time} onChange={e => update('time', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => update('recurring', !form.recurring)}
              className="w-10 h-6 rounded-full transition-all flex items-center"
              style={{ background: form.recurring ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
              <div className="w-5 h-5 bg-white rounded-full shadow transition-all" style={{ transform: form.recurring ? 'translateX(16px)' : 'translateX(0)' }}></div>
            </button>
            <span className="text-sm font-medium text-gray-700">Recurring announcement</span>
          </div>
          {form.recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
              <select value={form.recurringType} onChange={e => update('recurringType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {['weekly', 'biweekly', 'monthly'].map(r => <option key={r} className="capitalize">{r}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              Schedule Announcement
            </button>
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnnouncementsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? announcements : announcements.filter(a => a.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">{announcements.filter(a => a.status === 'scheduled').length} scheduled • {announcements.filter(a => a.recurring).length} recurring</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Announcement
        </button>
      </div>

      <div className="flex gap-2 mb-6 fade-in">
        {['all', 'scheduled', 'sent'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium capitalize transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4 fade-in">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                  <Bell size={18} style={{ color: '#1B4FD8' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: "16px", fontWeight: "700", fontFamily: "DM Sans, system-ui, sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}>{a.title}</h3>
                    {a.recurring && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9FE', color: '#5B21B6' }}>
                        <Repeat size={9} /> Recurring
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: a.status === 'sent' ? '#DBEAFE' : '#FEF9C3', color: a.status === 'sent' ? '#1E40AF' : '#854D0E' }}>
                      {a.status === 'sent' ? 'Sent' : 'Scheduled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{a.message}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users size={11} /> {a.audience}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {a.time}</span>
                {a.status === 'sent' && <span className="flex items-center gap-1" style={{ color: '#1B4FD8' }}>{a.views} delivered</span>}
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
