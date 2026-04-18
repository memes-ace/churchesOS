import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Bell, Edit, Users, Calendar, Repeat } from 'lucide-react'
import { announcementsAPI } from '../utils/api'

const audiences = ['All Members', 'Workers Only', 'Leaders Only', 'Youth Ministry', 'Choir', 'Cell Group Leaders']

function AnnouncementModal({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { ...item } : { title: '', message: '', audience: 'All Members', schedule_date: '', status: 'sent', recurring: false })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {item ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <div className="flex gap-2">
            {item && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
              placeholder="Announcement title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
            <textarea rows={5} value={form.message} onChange={e => update('message', e.target.value)}
              placeholder="Type your announcement here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Audience</label>
            <select value={form.audience} onChange={e => update('audience', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {audiences.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Schedule Date (optional)</label>
            <input type="datetime-local" value={form.schedule_date} onChange={e => update('schedule_date', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => update('recurring', !form.recurring)}
              className="w-10 h-6 rounded-full flex items-center transition"
              style={{ background: form.recurring ? '#1B4FD8' : '#E5E7EB', padding: '2px' }}>
              <div className="w-5 h-5 bg-white rounded-full shadow transition"
                style={{ transform: form.recurring ? 'translateX(16px)' : 'translateX(0)' }}></div>
            </button>
            <span className="text-sm text-gray-600">Recurring announcement</span>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.title && form.message) { onSave(form); onClose() } }}
            disabled={!form.title || !form.message}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {item ? 'Save Changes' : 'Post Announcement'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Delete Announcement?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently delete this announcement.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(item.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    announcementsAPI.getAll()
      .then(data => { if (Array.isArray(data)) setAnnouncements(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await announcementsAPI.update(selected.id, form)
        setAnnouncements(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a))
      } else {
        const saved = await announcementsAPI.create(form)
        setAnnouncements(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setAnnouncements(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a))
      else setAnnouncements(prev => [{ ...form, id: Date.now(), created_at: new Date().toISOString() }, ...prev])
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await announcementsAPI.delete(id) } catch(e) {}
    setAnnouncements(prev => prev.filter(a => a.id !== id))
    setSelected(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">{announcements.length} announcements</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No announcements yet</h3>
          <p className="text-gray-400 text-sm mb-6">Post your first church announcement</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Post First Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4 fade-in">
          {announcements.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                    <Bell size={18} style={{ color: '#1B4FD8' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={10} /> {a.audience || 'All Members'}</span>
                      {a.recurring && <span className="text-xs text-gray-400 flex items-center gap-1"><Repeat size={10} /> Recurring</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>
                    {a.status || 'sent'}
                  </span>
                  <button onClick={() => setSelected(a)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <Edit size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">{a.message}</p>
              <p className="text-xs text-gray-300">
                {a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <AnnouncementModal
          item={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
