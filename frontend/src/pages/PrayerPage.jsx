import { useState, useEffect } from 'react'
import { Plus, X, Save, Trash2, Heart, Check } from 'lucide-react'
import { prayerAPI } from '../utils/api'


export default function PrayerPage() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', request: '', anonymous: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    prayerAPI.getAll()
      .then(data => {
        if (Array.isArray(data)) setRequests(data)
      })
      .catch(() => {
        try {
          if (cached) setRequests(JSON.parse(cached))
        } catch(e) {}
      })
      .finally(() => setLoading(false))
  }, [])

  const save = (list) => {
    setRequests(list)
  }

  const handleAdd = async () => {
    if (!form.request) return
    const newRequest = {
      name: form.anonymous ? 'Anonymous' : (form.name || 'Anonymous'),
      request: form.request,
      anonymous: form.anonymous,
      status: 'Pending',
      date: new Date().toISOString(),
    }
    try {
      const saved = await prayerAPI.create(newRequest)
      save([saved, ...requests])
    } catch(e) {
      save([{ ...newRequest, id: Date.now() }, ...requests])
    }
    setForm({ name: '', request: '', anonymous: false })
    setShowAdd(false)
  }

  const updateStatus = async (id, status) => {
    try { await prayerAPI.update(id, { status }) } catch(e) {}
    save(requests.map(r => r.id === id ? { ...r, status } : r))
  }

  const deleteRequest = async (id) => {
    try { await prayerAPI.delete(id) } catch(e) {}
    save(requests.filter(r => r.id !== id))
  }

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter)

  const statusColors = {
    Pending: { bg: '#FEF9C3', text: '#854D0E' },
    Prayed: { bg: '#DBEAFE', text: '#1E40AF' },
    Answered: { bg: '#DCFCE7', text: '#166534' },
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Prayer Requests</h1>
          <p className="text-gray-400 text-sm mt-1">{requests.filter(r => r.status === 'Pending').length} awaiting prayer</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Request
        </button>
      </div>

      <div className="flex gap-2 mb-6 fade-in">
        {['All', 'Pending', 'Prayed', 'Answered'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 mb-5 fade-in">
          <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>New Prayer Request</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setForm(p => ({ ...p, anonymous: !p.anonymous }))}
                className="w-9 h-5 rounded-full flex items-center transition"
                style={{ background: form.anonymous ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
                <div className="w-4 h-4 bg-white rounded-full shadow transition"
                  style={{ transform: form.anonymous ? 'translateX(16px)' : 'translateX(0)' }}></div>
              </button>
              <span className="text-sm text-gray-600">Submit anonymously</span>
            </div>
            {!form.anonymous && (
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            )}
            <textarea rows={4} value={form.request} onChange={e => setForm(p => ({ ...p, request: e.target.value }))}
              placeholder="Share your prayer request..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={!form.request}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                style={{ background: '#1B4FD8' }}>
                Submit Request
              </button>
              <button onClick={() => setShowAdd(false)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading prayer requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🙏</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No prayer requests yet</h3>
          <p className="text-gray-400 text-sm mb-6">Be the first to submit a prayer request</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto"
            style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Request
          </button>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#1B4FD8' }}>
                    {r.anonymous ? '?' : (r.name?.split(' ').map(w => w[0]).slice(0,2).join('') || '?')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: statusColors[r.status]?.bg, color: statusColors[r.status]?.text }}>
                    {r.status}
                  </span>
                  <button onClick={() => deleteRequest(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{r.request}</p>
              {r.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, 'Prayed')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                    style={{ background: '#1B4FD8' }}>
                    <Heart size={12} /> Mark as Prayed
                  </button>
                  <button onClick={() => updateStatus(r.id, 'Answered')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600">
                    <Check size={12} /> Mark as Answered
                  </button>
                </div>
              )}
              {r.status === 'Prayed' && (
                <button onClick={() => updateStatus(r.id, 'Answered')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600">
                  <Check size={12} /> Mark as Answered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
