import { useState, useEffect } from 'react'
import { Send, Users, MessageSquare, Phone, Mail, X, Check, AlertCircle, Copy } from 'lucide-react'
import { membersAPI, smsTopupAPI } from '../utils/api'

function SmsTopupModal({ onClose, onSubmit }) {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const [form, setForm] = useState({ amount: '100', transaction_id: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async () => {
    if (!form.transaction_id) return
    setLoading(true)
    try {
      await smsTopupAPI.submit({
        church_id: user.church_id,
        church_name: user.church_name || 'My Church',
        amount: form.amount,
        transaction_id: form.transaction_id,
        notes: form.notes,
      })
      setSubmitted(true)
    } catch(e) {
      console.warn(e)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
            Top Up SMS Bundle
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
                <Check size={24} style={{ color: '#166534' }} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Top Up Request Submitted!</h3>
              <p className="text-gray-500 text-sm">We will verify your payment and activate your SMS bundle within a few hours.</p>
              <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#1B4FD8' }}>
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment instructions */}
              <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-xs font-bold text-blue-700 mb-2">📱 Pay via Mobile Money</p>
                <p className="text-sm font-bold text-gray-800">Number: 0599001992</p>
                <p className="text-sm text-gray-600">Name: Tabscrow Company Limited</p>
                <p className="text-xs text-gray-400 mt-2">Minimum top up: GHC 100</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount (GHC)</label>
                <select value={form.amount} onChange={e => update('amount', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="100">GHC 100</option>
                  <option value="200">GHC 200</option>
                  <option value="500">GHC 500</option>
                  <option value="1000">GHC 1000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  MoMo Transaction ID *
                </label>
                <input type="text" value={form.transaction_id} onChange={e => update('transaction_id', e.target.value)}
                  placeholder="e.g. MOMO-1234567890"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Additional Notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)}
                  placeholder="Any extra info..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.transaction_id || loading}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  {loading ? 'Submitting...' : 'Submit Top Up Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommunicationPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [showTopup, setShowTopup] = useState(false)
  const [senderId, setSenderId] = useState('Tabscrow')
  const [form, setForm] = useState({ channel: 'sms', audience: 'all', subject: '', message: '' })
  const [sentMessages, setSentMessages] = useState([])

  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('cos_token') || ''
    
    membersAPI.getAll()
      .then(data => { if (Array.isArray(data)) setMembers(data) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))

    // Fetch SMS status and sender ID
    if (user.church_id) {
      fetch(`/api/churches/${user.church_id}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data?.sender_id) setSenderId(data.sender_id)
        if (data?.sms_enabled !== undefined) setSmsEnabled(data.sms_enabled)
      })
      .catch(() => {})
    }
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

    // Check SMS enabled
    if (form.channel === 'sms' && !smsEnabled) {
      setShowTopup(true)
      return
    }

    setSending(true)
    try {
      let targetMembers = members
      if (form.audience === 'workers') targetMembers = members.filter(m => m.status === 'Worker')
      if (form.audience === 'leaders') targetMembers = members.filter(m => m.status === 'Leader')

      const phones = targetMembers
        .map(m => m.phone || m.whatsapp)
        .filter(Boolean)
        .map(p => p.replace(/\s+/g, '').replace(/^0/, '233'))

      if (form.channel === 'sms' && phones.length > 0) {
        const token = localStorage.getItem('cos_token') || ''
        await fetch('/api/admin/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ recipients: phones, message: form.message, senderId })
        })
      }

      const record = {
        id: Date.now(),
        channel: form.channel,
        audience: form.audience,
        message: form.message,
        recipients: phones.length || getAudienceCount(),
        sentAt: new Date().toISOString(),
      }
      setSentMessages(prev => [record, ...prev])
      setSent(true)
      setForm(p => ({ ...p, message: '', subject: '' }))
      setTimeout(() => setSent(false), 3000)
    } catch(e) {
      console.warn(e)
    } finally {
      setSending(false)
    }
  }

  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const portalLink = `https://churches-os.vercel.app/member-portal?church=${user.church_id || ''}`
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(portalLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {showTopup && <SmsTopupModal onClose={() => setShowTopup(false)} />}

      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>Communication</h1>
        <p className="text-gray-400 text-sm mt-1">Send messages to your members</p>
      </div>

      {/* SMS Bundle Finished Banner */}
      {!smsEnabled && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between fade-in"
          style={{ background: '#FEF9C3', border: '1px solid #FDE68A' }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={20} style={{ color: '#92400E' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400E' }}>SMS Bundle Finished</p>
              <p className="text-xs" style={{ color: '#B45309' }}>Top up your SMS bundle to continue sending messages to your members.</p>
            </div>
          </div>
          <button onClick={() => setShowTopup(true)}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold flex-shrink-0"
            style={{ background: '#F59E0B' }}>
            Top Up
          </button>
        </div>
      )}

      {/* Member Portal Link */}
      <div className="mb-5 p-4 rounded-2xl border border-gray-100 bg-white fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-gray-800">📱 Member Portal Link</p>
            <p className="text-xs text-gray-400 mt-0.5">Share this link with your members via SMS</p>
            <p className="text-xs font-mono text-blue-600 mt-1 truncate max-w-xs">{portalLink}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{ background: copied ? '#DCFCE7' : '#EEF2FF', color: copied ? '#166534' : '#1B4FD8' }}>
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6 fade-in">
        {[
          { label: 'Total Members', value: members.length, color: '#1B4FD8', bg: '#EEF2FF' },
          { label: 'Messages Sent', value: sentMessages.length, color: '#059669', bg: '#F0FDF4' },
          { label: 'SMS Status', value: smsEnabled ? 'Active' : 'Bundle Finished', color: smsEnabled ? '#059669' : '#D97706', bg: smsEnabled ? '#F0FDF4' : '#FEF9C3' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        {/* Compose */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5">Compose Message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Channel</label>
              <div className="flex gap-2">
                {[{ key: 'sms', label: 'SMS', icon: Phone }, { key: 'email', label: 'Email', icon: Mail }].map(c => (
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

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Audience</label>
              <select value={form.audience} onChange={e => update('audience', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="all">All Members ({members.length})</option>
                <option value="workers">Workers ({members.filter(m => m.status === 'Worker').length})</option>
                <option value="leaders">Leaders ({members.filter(m => m.status === 'Leader').length})</option>
              </select>
            </div>

            {form.channel === 'email' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Subject</label>
                <input type="text" value={form.subject} onChange={e => update('subject', e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Message</label>
              <textarea rows={5} value={form.message} onChange={e => update('message', e.target.value)}
                placeholder={form.channel === 'sms' ? 'Type your SMS message...' : 'Type your email message...'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              {form.channel === 'sms' && form.message && (
                <p className="text-xs text-gray-400 mt-1">{form.message.length} chars</p>
              )}
            </div>

            <button onClick={handleSend} disabled={!form.message || sending}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: sent ? '#059669' : '#1B4FD8' }}>
              {sent ? '✓ Sent!' : sending ? 'Sending...' : <><Send size={15} /> Send to {getAudienceCount()} Members</>}
            </button>
          </div>
        </div>

        {/* History */}
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
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium uppercase"
                      style={{ background: m.channel === 'sms' ? '#EDE9FE' : '#DBEAFE', color: m.channel === 'sms' ? '#7C3AED' : '#1E40AF' }}>
                      {m.channel}
                    </span>
                    <span className="text-xs text-gray-300">
                      {new Date(m.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{m.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{m.recipients} recipients</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
