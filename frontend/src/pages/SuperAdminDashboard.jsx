import { Building, Users, DollarSign, TrendingUp, MoreVertical, Plus } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const churches = [
  { id: 1, name: 'Grace Chapel International', pastor: 'Rev. Samuel Mensah', plan: 'Church', members: 1247, location: 'Accra', status: 'active', mrr: 700 },
  { id: 2, name: 'Christ Assemblies of God', pastor: 'Bishop Kwame Osei', plan: 'Growth', members: 342, location: 'Kumasi', status: 'active', mrr: 350 },
  { id: 3, name: 'Harvest Chapel Takoradi', pastor: 'Pastor Ama Quaye', plan: 'Starter', members: 87, location: 'Takoradi', status: 'active', mrr: 150 },
  { id: 4, name: 'Divine Victory Ministry', pastor: 'Apostle John Aidoo', plan: 'Church', members: 612, location: 'Tema', status: 'active', mrr: 700 },
  { id: 5, name: 'Living Faith Chapel', pastor: 'Rev. Abena Boateng', plan: 'Growth', members: 198, location: 'Cape Coast', status: 'trial', mrr: 0 },
]
const revenueData = [
  { month: 'Nov', revenue: 2800 },{ month: 'Dec', revenue: 3200 },
  { month: 'Jan', revenue: 4100 },{ month: 'Feb', revenue: 5400 },
  { month: 'Mar', revenue: 6850 },{ month: 'Apr', revenue: 7200 },
]
const planColors = { Starter: { bg: '#EEF2FF', text: '#1B4FD8' }, Growth: { bg: '#FEF9C3', text: '#854D0E' }, Church: { bg: '#EDE9FE', text: '#5B21B6' }, Diocese: { bg: '#FCE7F3', text: '#9D174D' } }
const statusColors = { active: { bg: '#DBEAFE', text: '#1E40AF', label: 'Active' }, trial: { bg: '#FEF9C3', text: '#854D0E', label: 'Trial' }, suspended: { bg: '#FEE2E2', text: '#991B1B', label: 'Suspended' } }

export default function SuperAdminDashboard() {
  const totalMRR = churches.filter(c => c.status === 'active').reduce((s, c) => s + c.mrr, 0)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Platform Overview</h1>
          <p className="text-gray-400 text-sm mt-1">ChurchesOS Super Admin</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Onboard Church
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Churches', value: churches.length, icon: Building, color: '#1B4FD8' },
          { label: 'Monthly Revenue', value: 'GH' + totalMRR.toLocaleString(), icon: DollarSign, color: '#059669' },
          { label: 'Total Members', value: churches.reduce((s,c) => s+c.members, 0).toLocaleString(), icon: Users, color: '#7C3AED' },
          { label: 'New This Month', value: '+3', icon: TrendingUp, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card bg-white rounded-2xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + '15' }}><s.icon size={19} style={{ color: s.color }} /></div>
            <p className="text-2xl font-bold mb-1" style={{  }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8 fade-in">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Platform Revenue Growth (GH)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={v => 'GH' + v} />
              <Area type="monotone" dataKey="revenue" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Plan Distribution</h3>
          {[{ plan: 'Starter', count: 8, pct: 28 },{ plan: 'Growth', count: 14, pct: 48 },{ plan: 'Church', count: 6, pct: 21 },{ plan: 'Diocese', count: 1, pct: 3 }].map(p => (
            <div key={p.plan} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{p.plan}</span><span className="text-gray-500">{p.count} churches</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="h-2 rounded-full" style={{ width: p.pct + '%', background: '#1B4FD8' }}></div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>All Churches</h3></div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-50">
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Church</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Plan</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Members</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">MRR</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {churches.map(c => (
              <tr key={c.id} className="table-row cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>
                      {c.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.pastor} • {c.location}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell"><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: planColors[c.plan]?.bg, color: planColors[c.plan]?.text }}>{c.plan}</span></td>
                <td className="py-4 px-4 text-sm text-gray-600 hidden lg:table-cell">{c.members.toLocaleString()}</td>
                <td className="py-4 px-4"><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: statusColors[c.status]?.bg, color: statusColors[c.status]?.text }}>{statusColors[c.status]?.label}</span></td>
                <td className="py-4 px-6 text-right text-sm font-semibold text-gray-700">{c.mrr > 0 ? 'GH' + c.mrr : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
