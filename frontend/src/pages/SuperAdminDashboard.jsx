import { useState } from 'react'
import { Search, X, Shield, Bell, CheckCircle, XCircle, Clock, Eye, Wrench, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const GHC = 'GHC'

const revenueData = [
  { month: 'Oct', revenue: 14400 }, { month: 'Nov', revenue: 22200 },
  { month: 'Dec', revenue: 28800 }, { month: 'Jan', revenue: 25200 },
  { month: 'Feb', revenue: 33600 }, { month: 'Mar', revenue: 38400 },
  { month: 'Apr', revenue: 43200 },
]

const planData = [
  { name: 'Free', value: 45, color: '#E5E7EB' },
  { name: 'Starter', value: 28, color: '#93C5FD' },
  { name: 'Growth', value: 18, color: '#1B4FD8' },
  { name: 'Enterprise', value: 9, color: '#7C3AED' },
]

const churches = []

const planConfig = {
  Free: { bg: '#F3F4F6', text: '#6B7280', price: 0 },
  Starter: { bg: '#DBEAFE', text: '#1E40AF', price: 1800 },
  Growth: { bg: '#EDE9FE', text: '#5B21B6', price: 5400 },
  Enterprise: { bg: '#FEF9C3', text: '#854D0E', price: 10200 },
}

const statusConfig = {
  Active: { bg: '#DCFCE7', text: '#166534' },
  Suspended: { bg: '#FEE2E2', text: '#991B1B' },
  Pending: { bg: '#FEF9C3', text: '#854D0E' },
}

function ChurchDetailModal({ church, onClose, onStatusChange }) {
  const [status, setStatus] = useState(church.status)
  const [tab, setTab] = useState('overview')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg" style={{ background: '#1B4FD8' }}>
              {church.name.split(' ').map(w => w[0]).slice(0,2).join('')}
            </div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>{church.name}</h2>
              <p className="text-xs text-gray-400">{church.pastor} • {church.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          {['overview', 'billing', 'activity'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium capitalize transition"
              style={{ color: tab === t ? '#1B4FD8' : '#6B7280', borderBottom: tab === t ? '2px solid #1B4FD8' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Members', value: church.members.toLocaleString(), color: '#1B4FD8' },
                  { label: 'Monthly Revenue', value: church.revenue === 0 ? 'Free' : GHC + church.revenue.toLocaleString(), color: '#059669' },
                  { label: 'Days Active', value: Math.floor((Date.now() - new Date(church.joined)) / (1000*60*60*24)), color: '#7C3AED' },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 rounded-xl bg-gray-50">
                    <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Church Name', value: church.name },
                  { label: 'Senior Pastor', value: church.pastor },
                  { label: 'Location', value: church.location },
                  { label: 'Date Joined', value: new Date(church.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Current Plan', value: church.plan },
                  { label: 'Last Active', value: new Date(church.lastActive).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800">{d.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Active', 'Suspended', 'Pending'].map(s => (
                    <button key={s} onClick={() => setStatus(s)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition text-sm font-medium"
                      style={{ borderColor: status === s ? statusConfig[s].text : '#E5E7EB', background: status === s ? statusConfig[s].bg : 'white', color: status === s ? statusConfig[s].text : '#6B7280' }}>
                      {s === 'Active' ? <CheckCircle size={14} /> : s === 'Suspended' ? <XCircle size={14} /> : <Clock size={14} />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'billing' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl" style={{ background: '#EEF2FF' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Current Plan</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#1B4FD8' }}>{church.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Monthly</p>
                    <p className="text-2xl font-bold" style={{ color: '#1B4FD8' }}>
                      {church.revenue === 0 ? 'Free' : GHC + church.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-700">Change Plan</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(planConfig).map(([plan, cfg]) => (
                  <div key={plan} className="p-4 rounded-xl border-2 cursor-pointer"
                    style={{ borderColor: church.plan === plan ? '#1B4FD8' : '#E5E7EB', background: church.plan === plan ? '#EEF2FF' : 'white' }}>
                    <p className="font-bold text-gray-800">{plan}</p>
                    <p className="text-lg font-bold mt-1" style={{ color: '#1B4FD8' }}>
                      {cfg.price === 0 ? 'Free' : GHC + cfg.price.toLocaleString() + '/mo'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'activity' && (
            <div className="space-y-3">
              {[
                { event: 'Church registered on ChurchesOS', date: church.joined, icon: '⛪' },
                { event: 'First member added', date: church.joined, icon: '👤' },
                { event: 'Attendance module activated', date: church.joined, icon: '📋' },
                { event: 'Last login recorded', date: church.lastActive, icon: '🔐' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.event}</p>
                    <p className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { onStatusChange(church.id, status); onClose() }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#1B4FD8' }}>
            Save Changes
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SuperAdminDashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [churchList, setChurchList] = useState(churches)
  const [activeTab, setActiveTab] = useState('overview')

  const handleStatusChange = (id, status) => setChurchList(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const filtered = churchList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.pastor.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter || c.plan === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = churchList.reduce((s, c) => s + c.revenue, 0)
  const totalMembers = churchList.reduce((s, c) => s + c.members, 0)
  const activeChurches = churchList.filter(c => c.status === 'Active').length
  const pendingChurches = churchList.filter(c => c.status === 'Pending').length

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'churches', label: 'All Churches', icon: '⛪' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'plans', label: 'Plans', icon: '📋' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} style={{ color: '#1B4FD8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1B4FD8' }}>Super Admin</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>ChurchesOS Platform</h1>
          <p className="text-gray-400 text-sm mt-1">Managing {churchList.length} churches across Africa</p>
        </div>
        {pendingChurches > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#FEF9C3' }}>
            <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
            <span className="text-xs font-bold" style={{ color: '#854D0E' }}>{pendingChurches} pending approval</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100 fade-in">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition whitespace-nowrap"
            style={{ color: activeTab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: activeTab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Churches', value: churchList.length, sub: activeChurches + ' active', color: '#1B4FD8', icon: '⛪' },
              { label: 'Total Members', value: totalMembers.toLocaleString(), sub: 'Across all churches', color: '#7C3AED', icon: '👥' },
              { label: 'Monthly Revenue', value: 'GHC ' + totalRevenue.toLocaleString(), sub: 'All subscriptions', color: '#059669', icon: '💰' },
              { label: 'Pending Approval', value: pendingChurches, sub: 'Awaiting review', color: '#F59E0B', icon: '⏳' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-3xl font-bold my-2" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Platform Revenue — Monthly (GHC)</h3>
            <ResponsiveContainer width="100%" height={220}>
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
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-5">Plan Distribution</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={planData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                      {planData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {planData.map(p => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }}></div>
                        <span className="text-sm text-gray-600">{p.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{p.value} churches</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Pending Approvals</h3>
              {churchList.filter(c => c.status === 'Pending').length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                  <p className="text-sm text-gray-400">All churches approved</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {churchList.filter(c => c.status === 'Pending').map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FEF9C3' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: '#F59E0B' }}>
                        {c.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusChange(c.id, 'Active')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: '#059669' }}>Approve</button>
                        <button onClick={() => handleStatusChange(c.id, 'Suspended')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: '#DC2626' }}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'churches' && (
        <div className="space-y-5 fade-in">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search churches, pastors, locations..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Active', 'Pending', 'Suspended', 'Free', 'Starter', 'Growth', 'Enterprise'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition"
                  style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Church', 'Location', 'Members', 'Plan', 'Revenue', 'Status', 'Last Active', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(c)}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>
                          {c.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.pastor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{c.location}</td>
                    <td className="py-4 px-4 text-sm font-bold" style={{ color: '#1B4FD8' }}>{c.members.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: planConfig[c.plan]?.bg, color: planConfig[c.plan]?.text }}>{c.plan}</span>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold" style={{ color: '#059669' }}>{c.revenue === 0 ? 'Free' : GHC + c.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: statusConfig[c.status]?.bg, color: statusConfig[c.status]?.text }}>{c.status}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400">{new Date(c.lastActive).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td className="py-4 px-4">
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6 fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Monthly Recurring', value: 'GHC ' + totalRevenue.toLocaleString(), color: '#059669' },
              { label: 'Annual Run Rate', value: GHC + (totalRevenue * 12).toLocaleString(), color: '#1B4FD8' },
              { label: 'Paying Churches', value: churchList.filter(c => c.revenue > 0).length, color: '#7C3AED' },
              { label: 'Free Tier', value: churchList.filter(c => c.revenue === 0).length, color: '#6B7280' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
                <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-5">Revenue by Church</h3>
            <div className="space-y-3">
              {churchList.filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue).map(c => (
                <div key={c.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>
                    {c.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">{c.name}</p>
                      <p className="text-sm font-bold" style={{ color: '#059669' }}>{GHC}{c.revenue.toLocaleString()}/mo</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: (c.revenue / 10200 * 100) + '%', background: '#1B4FD8' }}></div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: planConfig[c.plan]?.bg, color: planConfig[c.plan]?.text }}>{c.plan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-in">
          {[
            { plan: 'Free', price: 0, features: ['Up to 100 members', 'Basic attendance', 'Member profiles', 'Prayer requests'], color: '#6B7280', bg: '#F3F4F6' },
            { plan: 'Starter', price: 1800, features: ['Up to 500 members', 'All Free features', 'Finance tracking', 'Events module', 'SMS 100/mo'], color: '#1B4FD8', bg: '#EEF2FF' },
            { plan: 'Growth', price: 5400, features: ['Up to 2000 members', 'All Starter features', 'Ministries and Cell Groups', 'Song Library', 'SMS 500/mo', 'Reports'], color: '#7C3AED', bg: '#EDE9FE' },
            { plan: 'Enterprise', price: 10200, features: ['Unlimited members', 'All Growth features', 'Custom branding', 'Priority support', 'Unlimited SMS', 'API access', 'Multi-branch'], color: '#F59E0B', bg: '#FEF9C3' },
          ].map(p => (
            <div key={p.plan} className="bg-white rounded-2xl border-2 p-5" style={{ borderColor: p.color + '40' }}>
              <p className="text-lg font-bold text-gray-800">{p.plan}</p>
              <p className="text-2xl font-bold mt-1 mb-1" style={{ color: p.color }}>
                {p.price === 0 ? 'Free' : GHC + p.price.toLocaleString() + '/mo'}
              </p>
              <p className="text-xs mb-4" style={{ color: p.color }}>{churchList.filter(c => c.plan === p.plan).length} churches</p>
              <div className="space-y-2">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: p.bg }}>
                      <span style={{ color: p.color, fontSize: 9 }}>✓</span>
                    </div>
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ChurchDetailModal church={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
    </div>
  )
}
