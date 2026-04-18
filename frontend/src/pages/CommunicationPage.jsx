import { useState } from 'react'
import { Plus, X, Save, Trash2, Send, MessageSquare, Clock, Users, Check } from 'lucide-react'

const storageKey = 'cos_messages'
const getMessages = () => { try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch(e) { return [] } }

const templates = [
  { label: 'Sunday Reminder', text: 'Dear church family, reminder that Sunday service is tomorrow. Service starts at 9AM. God bless you!' },
  { label: 'Event Reminder', text: 'Dear church family, reminder about our upcoming event. Please plan to attend. God bless!' },
  { label: 'Tithe Reminder', text: 'Dear church family, as you prepare for Sunday, remember to prepare your tithes and offerings. God loves a cheerful giver!' },
  { label: 'Emergency Notice', text: 'URGENT: Please note the following important update from church leadership.' },
]

export default function CommunicationPage() {
  const [messages, setMessages] = useState(getMessages)
  const [showCompose, setShowCompose] = useState(false)
  const [form, setForm] = useState({ recipient: 'All Members', message: '', scheduled: false, scheduleDate: '', scheduleTime: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const save = (list) => { setMessages(list); try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {} }

  const handleSend = () => {
    if (!form.message) return
    setSending(true)
    setTimeout(() => {
      save([{
        id: Date.now(),
        ...form,
        status: form.scheduled ? 'Scheduled' : 'Sent',
        date: new Date().toISOString(),
        deliveredCount: form.recipient === 'All Members' ? 0 : 0,
      }, ...messages])
      setSending(false)
      setSent(true)
      setTimeout(() => { setSent(false); setShowCompose(false); setForm({ recipient: 'All Members', message: '', scheduled: false, scheduleDate: '', scheduleTime: '' }) }, 2000)
    }, 1500)
  }

  const deleteMessage = (id) => save(messages.filter(m => m.id !== id))

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Communication</h1>
          <p className="text-gray-400 text-sm mt-1">{messages.length} messages sent</p>
        </div>
        <button onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <MessageSquare size={15} /> Compose SMS
        </button>
      </div>

      {showCompose && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 mb-6 fade-in">
          <h3 className="font-bold text-gray-800 mb-5" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>New SMS Message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Send To</label>
              <select value={form.recipient} onChange={e => setForm(p => ({...p, recipient: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {['All Members', 'Active Members Only', 'Workers Only', 'Leaders Only', 'Youth Ministry', 'Choir', 'Prayer Team', 'Ushering'].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Quick Templates</label>
              <div className="flex gap-2 flex-wrap">
                {templates.map(t => (
                  <button key={t.label} onClick={() => setForm(p => ({...p, message: t.text}))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
              <textarea rows={5} value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))}
                placeholder="Type your SMS message..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length} characters</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setForm(p => ({...p, scheduled: !p.scheduled}))}
                className="w-10 h-6 rounded-full flex items-center transition"
                style={{ background: form.scheduled ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
                <div className="w-5 h-5 bg-white rounded-full shadow transition" style={{ transform: form.scheduled ? 'translateX(16px)' : 'translateX(0)' }}></div>
              </button>
              <span className="text-sm text-gray-600">Schedule for later</span>
            </div>

            {form.scheduled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                  <input type="date" value={form.scheduleDate} onChange={e => setForm(p => ({...p, scheduleDate: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Time</label>
                  <input type="time" value={form.scheduleTime} onChange={e => setForm(p => ({...p, scheduleTime: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleSend} disabled={!form.message || sending}
                className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: sent ? '#059669' : '#1B4FD8' }}>
                {sent ? <><Check size={15} /> Sent!</> : sending ? 'Sending...' : <><Send size={15} /> {form.scheduled ? 'Schedule SMS' : 'Send SMS Now'}</>}
              </button>
              <button onClick={() => setShowCompose(false)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No messages sent yet</h3>
          <p className="text-gray-400 text-sm mb-6">Send your first SMS to church members</p>
          <button onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <MessageSquare size={15} /> Compose First SMS
          </button>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {messages.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                    <MessageSquare size={18} style={{ color: '#1B4FD8' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">To: {m.recipient}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: m.status === 'Sent' ? '#DCFCE7' : '#FEF9C3', color: m.status === 'Sent' ? '#166534' : '#854D0E' }}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <button onClick={() => deleteMessage(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
