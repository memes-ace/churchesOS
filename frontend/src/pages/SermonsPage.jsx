import { useState } from 'react'
import { Upload, Sparkles, Play, X, Send } from 'lucide-react'
const sermons = [
  { id: 1, title: 'Walking in Your Purpose', preacher: 'Rev. Samuel Mensah', date: '2025-04-13', scripture: 'Jeremiah 29:11', topic: 'Purpose', duration: '52 min', views: 89, summary: 'God has a specific plan for every believer. This sermon explores how to discover your divine purpose and walk faithfully in it.' },
  { id: 2, title: 'The Power of Persistent Prayer', preacher: 'Pastor Grace Mensah', date: '2025-04-06', scripture: 'Luke 18:1-8', topic: 'Prayer', duration: '45 min', views: 124, summary: 'Through the parable of the persistent widow, we learn that God honors consistent, fervent prayer.' },
  { id: 3, title: 'Faith That Moves Mountains', preacher: 'Rev. Samuel Mensah', date: '2025-03-30', scripture: 'Matthew 17:20', topic: 'Faith', duration: '58 min', views: 201, summary: 'Even faith the size of a mustard seed can accomplish the impossible. Trust God beyond your circumstances.' },
]
function UploadModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{  }}>Upload Sermon</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[{ label: 'Sermon Title', ph: 'e.g. Walking in Your Purpose' },{ label: 'Preacher', ph: 'Pastor name' },{ label: 'Scripture Reference', ph: 'e.g. Jeremiah 29:11' }].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type="text" placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube / Video Link</label>
            <input type="url" placeholder="https://youtube.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#EEF2FF' }}>
            <Sparkles size={15} style={{ color: '#1B4FD8' }} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: '#1E40AF' }}>AI will automatically generate a sermon summary and key points. You can then send it as an SMS to all members.</p>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Upload & Generate AI Summary</button>
        </div>
      </div>
    </div>
  )
}
export default function SermonsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [openAI, setOpenAI] = useState(null)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Sermon Archive</h1>
          <p className="text-gray-400 text-sm mt-1">{sermons.length} sermons • AI insights available</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Upload size={15} /> Upload Sermon
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
        {sermons.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden stat-card">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{s.topic}</span>
                <span className="text-xs text-gray-400">{s.duration}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 mb-1">{s.preacher}</p>
              <p className="text-xs font-medium mb-3" style={{ color: '#1B4FD8' }}>{s.scripture}</p>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{s.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}><Play size={11} /> Play</button>
                  <button onClick={() => setOpenAI(openAI === s.id ? null : s.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FEF9C3', color: '#854D0E' }}><Sparkles size={11} /> AI</button>
                </div>
                <span className="text-xs text-gray-400">{s.views} views</span>
              </div>
            </div>
            {openAI === s.id && (
              <div className="border-t border-gray-100 p-5" style={{ background: '#EEF2FF' }}>
                <div className="flex items-center gap-2 mb-2"><Sparkles size={13} style={{ color: '#1B4FD8' }} /><p className="text-xs font-bold" style={{ color: '#1E40AF' }}>AI Summary</p></div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#1E40AF' }}>{s.summary}</p>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white w-full justify-center" style={{ background: '#1B4FD8' }}>
                  <Send size={11} /> Send as SMS to All Members
                </button>
              </div>
            )}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        ))}
      </div>
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}
