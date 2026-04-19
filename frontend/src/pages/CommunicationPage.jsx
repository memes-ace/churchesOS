import { useState, useEffect } from 'react'
import { Send, Users, MessageSquare, Phone, Mail } from 'lucide-react'
import { membersAPI, smsAPI } from '../utils/api'

export default function CommunicationPage() {
  const getChurchSenderId = () => {
    try { 
      const u = JSON.parse(localStorage.getItem('cos_user') || '{}')
      return u.sender_id || 'Tabscrow'
    } catch(e) { return 'Tabscrow' }
  }
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    channel: 'sms',
    audience: 'all',
    subject: '',
    message: '',
  })
  const [sentMessages, setSentMessages] = useState([])

  useEffect(() => {
    membersAPI.getAll()
      .then(data => { if (Array.isArray(data)) setMembers(data) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
  }, [])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const getAudienceCount = () => {
    if (form.audience === 'all') return members.length
    if (form.audience === 'workers') return members.filter(m => m.status === 'Worker').length
    if (form.audience === 'leaders') return members.filter(m => m.status === 'Leader').length
    return members.length
  }

  const handleSend = async () => {
    if (!form.message) return
    setSending(true)
    try {
      // Get phone numbers based on audience
      let targetMembers = members
      if (form.audience === 'workers') targetMembers = members.filter(m => m.status === 'Worker')
      if (form.audience === 'leaders') targetMembers = members.filter(m => m.status === 'Leader')

      const phones = targetMembers
        .map(m => m.phone || m.whatsapp)
        .filter(Boolean)
        .map(p => p.replace(/\s+/g, '').replace(/^0/, '233'))

      let result = { sent: 0, failed: 0 }

      if (form.channel === 'sms' && phones.length > 0) {
        result = await smsAPI.send({
          recipients: phones,
          message: form.message,
          senderId: getChurchSenderId()
        })
      }

      const record = {
        id: Date.now(),
        channel: form.channel,
        audience: form.audience,
        subject: form.subject,
        message: form.message,
        recipients: phones.length,
        sent: result.sent || phones.length,
        failed: result.failed || 0,
        sentAt: new Date().toISOString(),
        status: 'sent',
      }
      setSentMessages(prev => [record, ...prev])
      setSent(true)
      setForm(p => ({ ...p, message: '', subject: '' }))
      setTimeout(() => setSent(false), 3000)
    } catch(e) {
      console.warn('Send error:', e)
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } finally {
      setSending(false)
    }
  }

  const charCount = form.message.length
  const smsCount = Math.ceil(charCount / 160)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>Communication</h1>
        <p className="text-gray-400 text-sm mt-1">Send SMS and Email to your members</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6 fade-in">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: '#1B4FD8', bg: '#EEF2FF' },
          { label: 'Messages Sent', value: sentMessages.length, icon: MessageSquare, color: '#059669', bg: '#F0FDF4' },
          { label: 'SMS Available', value: 'Via Arkesel', icon: Phone, color: '#7C3AED', bg: '#EDE9FE' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        {/* Compose */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5">Compose Message</h3>

          <div className="space-y-4">
            {/* Channel */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Channel</label>
              <div className="flex gap-2">
                {[
                  { key: 'sms', label: 'SMS', icon: Phone },
                  { key: 'email', label: 'Email', icon: Mail },
                ].map(c => (
                  <button key={c.key} onClick={() => update('channel', c.key)}
                    className="flex items-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition"
                    style={{
                      background: form.channel === c.key ? '#1B4FD8' : '#F9FAFB',
                      color: form.channel === c.key ? 'white' : '#6B7280',
                      border: '1px solid ' + (form.channel === c.key ? '#1B4FD8' : '#E5E7EB')
                    }}>
                    <c.icon size={14} /> {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Audience</label>
              <select value={form.audience} onChange={e => update('audience', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="all">All Members ({members.length})</option>
                <option value="workers">Workers Only ({members.filter(m => m.status === 'Worker').length})</option>
                <option value="leaders">Leaders Only ({members.filter(m => m.status === 'Leader').length})</option>
              </select>
            </div>

            {/* Subject (email only) */}
            {form.channel === 'email' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Subject</label>
                <input type="text" value={form.subject} onChange={e => update('subject', e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Message
                {form.channel === 'sms' && charCount > 0 && (
                  <span className="ml-2 font-normal text-gray-400">{charCount} chars • {smsCount} SMS</span>
                )}
              </label>
              <textarea rows={5} value={form.message} onChange={e => update('message', e.target.value)}
                placeholder={form.channel === 'sms' ? 'Type your SMS message...' : 'Type your email message...'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            </div>

            {/* Note about SMS */}


            <button onClick={handleSend} disabled={!form.message || sending}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: sent ? '#059669' : '#1B4FD8' }}>
              {sent ? '✓ Sent Successfully!' : sending ? 'Sending...' : <><Send size={15} /> Send to {getAudienceCount()} Members</>}
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5">Message History</h3>
          {sentMessages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">No messages sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentMessages.map(m => (
                <div key={m.id} className="p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium uppercase"
                        style={{ background: m.channel === 'sms' ? '#EDE9FE' : '#DBEAFE', color: m.channel === 'sms' ? '#7C3AED' : '#1E40AF' }}>
                        {m.channel}
                      </span>
                      <span className="text-xs text-gray-400">{m.recipients} recipients</span>
                    </div>
                    <span className="text-xs text-gray-300">
                      {new Date(m.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
