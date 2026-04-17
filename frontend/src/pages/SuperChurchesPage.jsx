import { useState } from 'react'
import { Search, Plus, MoreVertical } from 'lucide-react'
const churches = [
  { id: 1, name: 'Grace Chapel International', pastor: 'Rev. Samuel Mensah', plan: 'Church', members: 1247, location: 'Accra', status: 'active', mrr: 700 },
  { id: 2, name: 'Christ Assemblies of God', pastor: 'Bishop Kwame Osei', plan: 'Growth', members: 342, location: 'Kumasi', status: 'active', mrr: 350 },
  { id: 3, name: 'Harvest Chapel Takoradi', pastor: 'Pastor Ama Quaye', plan: 'Starter', members: 87, location: 'Takoradi', status: 'active', mrr: 150 },
  { id: 4, name: 'Divine Victory Ministry', pastor: 'Apostle John Aidoo', plan: 'Church', members: 612, location: 'Tema', status: 'active', mrr: 700 },
  { id: 5, name: 'Living Faith Chapel', pastor: 'Rev. Abena Boateng', plan: 'Growth', members: 198, location: 'Cape Coast', status: 'trial', mrr: 0 },
  { id: 6, name: 'Word of Life Church', pastor: 'Pastor Emmanuel Tetteh', plan: 'Starter', members: 74, location: 'Ho', status: 'suspended', mrr: 0 },
]
const planColors = { Starter: { bg: '#EEF2FF', text: '#1B4FD8' }, Growth: { bg: '#FEF9C3', text: '#854D0E' }, Church: { bg: '#EDE9FE', text: '#5B21B6' } }
const statusColors = { active: { bg: '#DBEAFE', text: '#1E40AF', label: 'Active' }, trial: { bg: '#FEF9C3', text: '#854D0E', label: 'Trial' }, suspended: { bg: '#FEE2E2', text: '#991B1B', label: 'Suspended' } }
export default function SuperChurchesPage() {
  const [search, setSearch] = useState('')
  const filtered = churches.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>All Churches</h1>
          <p className="text-gray-400 text-sm mt-1">{churches.length} total • {churches.filter(c => c.status === 'active').length} active</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}><Plus size={15} /> Onboard Church</button>
      </div>
      <div className="relative mb-6 fade-in">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search churches..." value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none w-80" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <table className="w-full">
          <thead><tr className="border-b border-gray-50">
            {['Church','Plan','Members','Status','MRR',''].map(h => <th key={h} className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider first:px-6 last:text-right last:px-6">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="table-row cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>{c.name.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                    <div><p className="text-sm font-medium text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.pastor} • {c.location}</p></div>
                  </div>
                </td>
                <td className="py-4 px-4"><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: planColors[c.plan]?.bg, color: planColors[c.plan]?.text }}>{c.plan}</span></td>
                <td className="py-4 px-4 text-sm text-gray-600">{c.members.toLocaleString()}</td>
                <td className="py-4 px-4"><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: statusColors[c.status]?.bg, color: statusColors[c.status]?.text }}>{statusColors[c.status]?.label}</span></td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-700">{c.mrr > 0 ? 'GH' + c.mrr : '—'}</td>
                <td className="py-4 px-6 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical size={15} className="text-gray-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
