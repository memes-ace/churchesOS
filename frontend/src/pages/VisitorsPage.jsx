import { useState } from 'react'
import { Plus, Phone, MessageSquare, CheckCircle, X } from 'lucide-react'
const visitors = [
  { id: 1, name: 'Kofi Asiedu', phone: '+233 24 111 2233', date: '2025-04-13', source: 'Friend', followedUp: false, returned: false },
  { id: 2, name: 'Maame Esi Brew', phone: '+233 20 445 6677', date: '2025-04-13', source: 'Social Media', followedUp: true, returned: true },
  { id: 3, name: 'Bernard Tuffour', phone: '+233 55 889 0011', date: '2025-04-06', source: 'Walk-in', followedUp: true, returned: false },
  { id: 4, name: 'Akua Pokuaa', phone: '+233 27 334 5566', date: '2025-03-30', source: 'Family', followedUp: true, returned: true },
]
function AddModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{  }}>Add Visitor</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[{ label: 'Full Name', ph: 'Visitor name' },{ label: 'Phone Number', ph: '+233 24 000 0000' }].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type="text" placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How did they hear about us?</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {['Friend / Family','Social Media','Walk-in','Online Search','Flyer / Poster','Radio','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save & Send Welcome SMS</button>
        </div>
      </div>
    </div>
  )
}
export default function VisitorsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [list, setList] = useState(visitors)
  const convert = (id) => setList(prev => prev.filter(v => v.id !== id))
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Visitors</h1>
          <p className="text-gray-400 text-sm mt-1">{list.length} visitors • {list.filter(v => v.returned).length} returned</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Visitor
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
        {list.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1B4FD8' }}>
                {v.name.split(' ').map(w => w[0]).join('')}
              </div>
              {v.returned && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DBEAFE', color: '#1E40AF' }}>Returned</span>}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{v.name}</h3>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Phone size={10} /> {v.phone}</p>
            <p className="text-xs text-gray-400 mb-4">Visited {new Date(v.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {v.source}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                <MessageSquare size={11} /> Follow Up
              </button>
              <button onClick={() => convert(v.id)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 border border-gray-200 text-gray-600">
                <CheckCircle size={11} /> Convert
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
