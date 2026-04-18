import { songsAPI } from '../utils/api'
import { useDB } from '../hooks/useDB'
import { useState } from 'react'
import { Plus, Music, Youtube, FileText, X, Save, Search, Play, Download, Edit, Trash2 } from 'lucide-react'

const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm']

const categories = ['Worship', 'Praise', 'Hymn', 'Gospel', 'Special Number', 'Offertory', 'Choir Special']

const emptySong = {
  title: '', artist: '', key: '', category: 'Worship', lyrics: '',
  youtubeLink: '', notes: '', tempo: '', language: 'English',
  audioFile: null, sheetMusic: null,
}

function SongModal({ song, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(song ? { ...song } : { ...emptySong })
  const [tab, setTab] = useState('details')
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const tabs = [
    { id: 'details', label: 'Details', icon: '🎵' },
    { id: 'lyrics', label: 'Lyrics', icon: '📝' },
    { id: 'files', label: 'Files', icon: '📁' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#EDE9FE' }}>🎵</div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
                {form.title || 'New Song'}
              </h2>
              <p className="text-xs text-gray-400">{form.artist || 'Unknown artist'} {form.key ? `• Key of ${form.key}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {song && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition"
              style={{ color: tab === t.id ? '#7C3AED' : '#6B7280', borderBottom: tab === t.id ? '2px solid #7C3AED' : '2px solid transparent' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'details' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Song Title *</label>
                <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Amazing Grace"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Artist / Composer</label>
                <input type="text" value={form.artist} onChange={e => update('artist', e.target.value)}
                  placeholder="Artist name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Musical Key</label>
                <select value={form.key} onChange={e => update('key', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select key</option>
                  {musicalKeys.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={form.category} onChange={e => update('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tempo</label>
                <select value={form.tempo} onChange={e => update('tempo', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select tempo</option>
                  {['Slow', 'Medium', 'Fast', 'Very Fast'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Language</label>
                <select value={form.language} onChange={e => update('language', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  {['English', 'Twi', 'Ga', 'Ewe', 'French', 'Pidgin', 'Other'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">YouTube Link</label>
                <div className="relative">
                  <Youtube size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input type="url" value={form.youtubeLink} onChange={e => update('youtubeLink', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes for Choir</label>
                <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)}
                  placeholder="Special instructions, cues, arrangement notes..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>
            </div>
          )}

          {tab === 'lyrics' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Song Lyrics</label>
              <textarea rows={18} value={form.lyrics} onChange={e => update('lyrics', e.target.value)}
                placeholder="Paste or type the full lyrics here...&#10;&#10;Verse 1:&#10;...&#10;&#10;Chorus:&#10;..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none font-mono" />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.lyrics.length} characters</p>
            </div>
          )}

          {tab === 'files' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Audio File</label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-purple-300 transition">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDE9FE' }}>
                    <Music size={18} style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{form.audioFile ? form.audioFile.name || 'Audio uploaded' : 'Upload audio file'}</p>
                    <p className="text-xs text-gray-400">MP3, WAV, M4A up to 50MB</p>
                  </div>
                  <input type="file" accept="audio/*" className="hidden" onChange={e => update('audioFile', e.target.files[0])} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sheet Music</label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-purple-300 transition">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDE9FE' }}>
                    <FileText size={18} style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{form.sheetMusic ? form.sheetMusic.name || 'Sheet music uploaded' : 'Upload sheet music'}</p>
                    <p className="text-xs text-gray-400">PDF, PNG, JPG up to 20MB</p>
                  </div>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => update('sheetMusic', e.target.files[0])} />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.title) { onSave(form); onClose() } }} disabled={!form.title}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#7C3AED' }}>
            <Save size={15} /> Save Song
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>

        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Song?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently remove <strong>{form.title}</strong> from the library.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(song.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SongLibraryPage() {
  const storageKey = 'cos_songs'
  const getSongs = () => { try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : [] } catch(e) { return [] } }
  const [songs, setSongs] = useState(getSongs)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const saveSongs = (list) => { setSongs(list); try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {} }
  const handleSave = (form) => {
    if (selected) { saveSongs(songs.map(s => s.id === selected.id ? { ...s, ...form } : s)) }
    else { saveSongs([...songs, { id: Date.now(), ...form, addedDate: new Date().toISOString() }]) }
    setSelected(null); setShowAdd(false)
  }
  const handleDelete = (id) => { saveSongs(songs.filter(s => s.id !== id)) }

  const filtered = songs.filter(s => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase()) || s.artist?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || s.category === filterCat
    return matchSearch && matchCat
  })

  const categoryColors = {
    Worship: { bg: '#EDE9FE', text: '#5B21B6' },
    Praise: { bg: '#DBEAFE', text: '#1E40AF' },
    Hymn: { bg: '#FEF9C3', text: '#854D0E' },
    Gospel: { bg: '#DCFCE7', text: '#166534' },
    'Special Number': { bg: '#FEE2E2', text: '#991B1B' },
    Offertory: { bg: '#FFF7ED', text: '#9A3412' },
    'Choir Special': { bg: '#F0FDF4', text: '#166534' },
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Choir Song Library</h1>
          <p className="text-gray-400 text-sm mt-1">{songs.length} songs • {[...new Set(songs.map(s => s.category))].length} categories</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#7C3AED' }}>
          <Plus size={15} /> Add Song
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search songs or artist..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filterCat === c ? '#7C3AED' : 'white', color: filterCat === c ? 'white' : '#6B7280', border: '1px solid ' + (filterCat === c ? '#7C3AED' : '#E5E7EB') }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No songs yet</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first song to the choir library</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#7C3AED' }}>
            <Plus size={15} /> Add First Song
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 fade-in">
          {filtered.map(song => (
            <div key={song.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card cursor-pointer hover:border-purple-200 transition"
              onClick={() => { setSelected(song); setShowAdd(false) }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#EDE9FE' }}>🎵</div>
                <div className="flex items-center gap-1">
                  {song.youtubeLink && <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}><Youtube size={12} style={{ color: '#DC2626' }} /></div>}
                  {song.lyrics && <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#EEF2FF' }}><FileText size={12} style={{ color: '#1B4FD8' }} /></div>}
                  {song.audioFile && <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#EDE9FE' }}><Music size={12} style={{ color: '#7C3AED' }} /></div>}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-0.5" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{song.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{song.artist || 'Unknown artist'}</p>
              <div className="flex flex-wrap gap-1.5">
                {song.key && (
                  <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: '#EDE9FE', color: '#5B21B6' }}>Key of {song.key}</span>
                )}
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: categoryColors[song.category]?.bg || '#F3F4F6', color: categoryColors[song.category]?.text || '#374151' }}>
                  {song.category}
                </span>
                {song.tempo && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#F3F4F6', color: '#6B7280' }}>{song.tempo}</span>}
              </div>
              {song.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{song.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <SongModal
          song={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
