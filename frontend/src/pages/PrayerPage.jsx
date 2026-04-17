import { useState } from 'react'
import { Heart, Lock } from 'lucide-react'
const requests = [
  { id: 1, member: 'Abena Asante', request: 'Please pray for my job interview next week. I need God\'s favour and direction.', date: '2025-04-12', confidential: false, prayed: false, answered: false },
  { id: 2, member: 'Anonymous', request: 'Praying for healing in my family. There\'s been a lot of sickness.', date: '2025-04-11', confidential: true, prayed: true, answered: false },
  { id: 3, member: 'Kwame Boateng', request: 'Thanksgiving! My father was discharged from hospital after 3 weeks. God is good!', date: '2025-04-10', confidential: false, prayed: true, answered: true },
  { id: 4, member: 'Gifty Mensah', request: 'Please pray for my marriage. We are going through a difficult season.', date: '2025-04-09', confidential: false, prayed: false, answered: false },
]
export default function PrayerPage() {
  const [list, setList] = useState(requests)
  const [filter, setFilter] = useState('all')
  const markPrayed = (id) => setList(prev => prev.map(r => r.id === id ? { ...r, prayed: true } : r))
  const filtered = filter === 'all' ? list : filter === 'prayed' ? list.filter(r => r.prayed) : list.filter(r => !r.prayed)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Prayer Requests</h1>
          <p className="text-gray-400 text-sm mt-1">{list.filter(r => !r.prayed).length} awaiting prayer</p>
        </div>
        <div className="flex gap-2">
          {['all','pending','prayed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-2 rounded-lg text-xs font-medium capitalize transition"
              style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4 fade-in">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: r.answered ? '#BFDBFE' : r.prayed ? '#E5E7EB' : '#FDE68A' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>
                  {r.confidential ? '?' : r.member.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{r.member}</p>
                    {r.confidential && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}><Lock size={9} /> Confidential</span>}
                  </div>
                  <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {r.answered && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DBEAFE', color: '#1E40AF' }}>Answered</span>}
                {r.prayed && !r.answered && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>Prayed</span>}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{r.request}</p>
            {!r.prayed && (
              <button onClick={() => markPrayed(r.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                <Heart size={13} /> Mark as Prayed For
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
