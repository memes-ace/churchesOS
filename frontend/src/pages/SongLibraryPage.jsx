import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Edit, Music, Play } from 'lucide-react'
import { songsAPI } from '../utils/api'

const categories = ['Worship', 'Praise', 'Hymn', 'Gospel', 'Contemporary', 'Special', 'Communion', 'Offertory', 'Other']
const keys = ['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab']
const tempos = ['Slow', 'Medium', 'Fast', 'Very Fast']
const languages = ['English', 'Twi', 'Ga', 'Ewe', 'Hausa', 'Pidgin', 'French', 'Other']

function SongModal({ song, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(song ? { ...song } : { title: '', artist: '', key: 'C', category: 'Worship', tempo: 'Medium', language: 'English', youtube_link: '', lyrics: '', notes: '' })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {song ? 'Edit Song' : 'Add Song'}
          </h2>
          <div className="flex gap-2">
            {song && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {[
            { label: 'Song Title *', field: 'title', ph: 'e.g. Amazing Grace' },
            { label: 'Artist / Writer', field: 'artist', ph: 'Artist or songwriter name' },
            { label: 'YouTube / Audio Link', field: 'youtube_link', ph: 'https://...' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Category', field: 'category', options: categories },
              { label: 'Key', field: 'key', options: keys },
              { label: 'Tempo', field: 'tempo', options: tempos },
              { label: 'Language', field: 'language', options: languages },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lyrics</label>
            <textarea rows={6} value={form.lyrics || ''} onChange={e => update('lyrics', e.target.value)}
              placeholder="Song lyrics..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
            <textarea rows={2} value={form.notes || ''} onChange={e => update('notes', e.target.value)}
              placeholder="Performance notes..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.title) { onSave(form); onClose() } }} disabled={!form.title}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {song ? 'Save Changes' : 'Add Song'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <h3 className="font-bold text-gray-900 mb-2">Delete Song?</h3>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { onDelete(song.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SongLibraryPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')

  useEffect(() => {
    songsAPI.getAll()
      .then(data => { if (Array.isArray(data)) setSongs(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await songsAPI.update(selected.id, form)
        setSongs(prev => prev.map(s => s.id === selected.id ? { ...s, ...form } : s))
      } else {
        const saved = await songsAPI.create(form)
        setSongs(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setSongs(prev => prev.map(s => s.id === selected.id ? { ...s, ...form } : s))
      else setSongs(prev => [{ ...form, id: Date.now() }, ...prev])
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await songsAPI.delete(id) } catch(e) {}
    setSongs(prev => prev.filter(s => s.id !== id))
    setSelected(null)
  }

  const filtered = songs.filter(s => {
    const ms = s.title?.toLowerCase().includes(search.toLowerCase()) || s.artist?.toLowerCase().includes(search.toLowerCase())
    const mf = filterCat === 'All' || s.category === filterCat
    return ms && mf
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Song Library</h1>
          <p className="text-gray-400 text-sm mt-1">{songs.length} songs in library</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Song
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap fade-in">
        <input type="text" placeholder="Search songs, artists..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filterCat === c ? '#1B4FD8' : 'white', color: filterCat === c ? 'white' : '#6B7280', border: '1px solid ' + (filterCat === c ? '#1B4FD8' : '#E5E7EB') }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div></div>
      ) : songs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No songs yet</h3>
          <p className="text-gray-400 text-sm mb-6">Build your church song library</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Song
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                  <Music size={18} style={{ color: '#1B4FD8' }} />
                </div>
                <button onClick={() => setSelected(s)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Edit size={14} className="text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-0.5" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{s.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{s.artist || 'Unknown Artist'}</p>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {s.category && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{s.category}</span>}
                {s.key && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Key: {s.key}</span>}
                {s.tempo && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.tempo}</span>}
                {s.language && s.language !== 'English' && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.language}</span>}
              </div>
              {s.youtube_link && (
                <a href={s.youtube_link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-white"
                  style={{ background: '#7C3AED' }}>
                  <Play size={11} /> Listen
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <SongModal song={selected} onClose={() => { setSelected(null); setShowAdd(false) }} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  )
}
