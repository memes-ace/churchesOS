import { useState } from 'react'
import { Send, Clock, Users, MessageSquare, CheckCircle, X } from 'lucide-react'
const sentMessages = [
  { id: 1, message: 'Dear church family, Sunday service starts at 9AM. Come prepared for a Spirit-filled worship!', recipients: 'All Members (1,247)', sent: '2025-04-13 07:00', type: 'Announcement', delivered: 1189, status: 'sent' },
  { id: 2, message: 'Reminder: Youth Revival Night is THIS FRIDAY at 7PM. Bring a friend!', recipients: 'Youth Ministry (134)', sent: '2025-04-10 06:00', type: 'Event Reminder', delivered: 127, status: 'sent' },
  { id: 3, message: 'Easter Crusade TOMORROW at Independence Square, 6PM. Buses depart from church at 5PM.', recipients: 'All Members (1,247)', sent: '2025-04-17 08:00', type: 'Event Reminder', delivered: null, status: 'scheduled' },
]
const templates = [
  { name: 'Sunday Reminder', text: 'Dear church family, reminder that Sunday service starts at [TIME]. We look forward to worshipping with you. God bless you!' },
  { name: 'Birthday Greeting', text: 'Happy Birthday [NAME]! Wishing you God\'s abundant blessings today and always. With love, Pastor & [CHURCH] family.' },
  { name: 'Absentee Follow-up', text: 'Dear [NAME], we noticed you weren\'t at Sunday service and we miss you. Please let us know if you need anything. God loves you!' },
  { name: 'Event Reminder', text: 'Reminder: [EVENT] is on [DATE] at [TIME], [LOCATION]. Don\'t miss this special program!' },
  { name: 'New Convert Welcome', text: 'Welcome to [CHURCH], [NAME]! We are so glad you\'re part of our family. God bless you!' },
]
function SendModal({ onClose }) {
  const [message, setMessage] = useState('')
  const [recipients, setRecipients] = useState('All Members (1,247)')
  const [schedule, setSchedule] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{  }}>Send SMS</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Templates</p>
            <div className="flex gap-2 flex-wrap">
              {templates.map(t => (
                <button key={t.name} onClick={() => { setMessage(t.text); setSelectedTemplate(t.name) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                  style={{ background: selectedTemplate === t.name ? '#1B4FD8' : 'white', color: selectedTemplate === t.name ? 'white' : '#4B5563', borderColor: selectedTemplate === t.name ? '#1B4FD8' : '#E5E7EB' }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
            <select value={recipients} onChange={e => setRecipients(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {['All Members (1,247)','Active Members (1,102)','Workers Only (248)','Leaders Only (67)','Youth Ministry (134)','Choir (52)','Absentees Last Sunday (23)','New Members This Month (18)'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
              placeholder="Type your message here... Use [NAME] for member name personalization."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Use [NAME] for personalization</span>
              <span className="text-xs text-gray-400">{message.length} chars</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSchedule(!schedule)}
              className="w-10 h-6 rounded-full transition-all flex items-center"
              style={{ background: schedule ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
              <div className="w-5 h-5 bg-white rounded-full shadow transition-all" style={{ transform: schedule ? 'translateX(16px)' : 'translateX(0)' }}></div>
            </button>
            <span className="text-sm font-medium text-gray-700">Schedule for later</span>
          </div>
          {schedule && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Date</label><input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Time</label><input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" /></div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2" style={{ background: '#1B4FD8' }}>
              {schedule ? <><Clock size={15} /> Schedule SMS</> : <><Send size={15} /> Send Now</>}
            </button>
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function CommunicationPage() {
  const [showSend, setShowSend] = useState(false)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Communication</h1>
          <p className="text-gray-400 text-sm mt-1">SMS, Email & Announcements</p>
        </div>
        <button onClick={() => setShowSend(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Send size={15} /> Send SMS
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Messages Sent', value: '2,341', icon: MessageSquare, color: '#1B4FD8' },
          { label: 'Delivery Rate', value: '96.8%', icon: CheckCircle, color: '#059669' },
          { label: 'Scheduled', value: '3', icon: Clock, color: '#7C3AED' },
          { label: 'SMS Credits', value: '4,820', icon: Users, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + '15' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold mb-1" style={{  }}>{s.value}</p>
            <p className="text-xs font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Message History</h3></div>
        <div className="divide-y divide-gray-50">
          {sentMessages.map(msg => (
            <div key={msg.id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: msg.status === 'sent' ? '#DBEAFE' : '#FEF9C3', color: msg.status === 'sent' ? '#1E40AF' : '#854D0E' }}>
                  {msg.status === 'sent' ? '✓ Sent' : 'Scheduled'}
                </span>
                <span className="text-xs text-gray-400">{msg.type}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{msg.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span><Users size={11} className="inline mr-1" />{msg.recipients}</span>
                <span><Clock size={11} className="inline mr-1" />{msg.sent}</span>
                {msg.delivered && <span><CheckCircle size={11} className="inline mr-1" style={{ color: '#1B4FD8' }} />{msg.delivered} delivered</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showSend && <SendModal onClose={() => setShowSend(false)} />}
    </div>
  )
}
