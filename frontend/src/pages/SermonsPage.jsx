import { sermonsAPI } from '../utils/api'
import { useDB } from '../hooks/useDB'
import { useState, useEffect } from 'react'
import { Plus, X, Save, Trash2, Upload, Play, Download, Edit } from 'lucide-react'


const emptySermon = { title: '', pastor: '', date: '', series: '', description: '', youtubeLink: '', duration: '', tags: '' }

function SermonModal({ sermon, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(sermon ? { ...sermon } : { ...emptySermon })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>{sermon ? 'Edit Sermon' : 'Upload Sermon'}</h2>
          <div className="flex items-center gap-2">
            {sermon && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[
            { label: 'Sermon Title *', field: 'title', ph: 'e.g. Walking in Purpose', type: 'text' },
            { label: 'Pastor / Speaker', field: 'pastor', ph: 'Speaker name', type: 'text' },
            { label: 'Date Preached', field: 'date', type: 'date' },
            { label: 'Sermon Series', field: 'series', ph: 'e.g. Living by Faith', type: 'text' },
            { label: 'Duration', field: 'duration', ph: 'e.g. 45 mins', type: 'text' },
            { label: 'YouTube / Audio Link', field: 'youtubeLink', ph: 'https://...', type: 'url' },
            { label: 'Tags', field: 'tags', ph: 'e.g. faith, prayer, healing', type: 'text' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph || ''}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description / Notes</label>
            <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Sermon description or key points..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.title) { onSave(form); onClose() } }} disabled={!form.title}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Save size={15} /> {sermon ? 'Save Changes' : 'Upload Sermon'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Delete Sermon?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently delete <strong>{form.title}</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(sermon.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState(getSermons)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  const save = (list) => { setSermons(list);  }
  const handleSave = (form) => {
    if (selected) save(sermons.map(s => s.id === selected.id ? { ...s, ...form } : s))
    else save([...sermons, { id: Date.now(), ...form, uploadedDate: new Date().toISOString() }])
    setSelected(null); setShowAdd(false)
  }
  const handleDelete = (id) => { save(sermons.filter(s => s.id !== id)); setSelected(null) }

  const filtered = sermons.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.pastor?.toLowerCase().includes(search.toLowerCase()) ||
    s.series?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Sermons</h1>
          <p className="text-gray-400 text-sm mt-1">{sermons.length} sermons uploaded</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Upload Sermon
        </button>
      </div>

      <div className="mb-6 fade-in">
        <input type="text" placeholder="Search sermons, pastors, series..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
      </div>

      {sermons.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🎙️</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No sermons yet</h3>
          <p className="text-gray-400 text-sm mb-6">Upload your first sermon to the archive</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Upload First Sermon
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#EDE9FE' }}>📖</div>
                <button onClick={() => { setSelected(s); setShowAdd(false) }} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Edit size={14} className="text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{s.title}</h3>
              <p className="text-xs text-gray-500 mb-1">{s.pastor}</p>
              {s.series && <p className="text-xs px-2 py-0.5 rounded-full inline-block mb-2" style={{ background: '#EDE9FE', color: '#5B21B6' }}>{s.series}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {s.date && new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {s.duration && ` • ${s.duration}`}
                </div>
                {s.youtubeLink && (
                  <a href={s.youtubeLink} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                    <Play size={10} /> Listen
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <SermonModal
          sermon={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
