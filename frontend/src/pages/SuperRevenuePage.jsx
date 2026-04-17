import { DollarSign, TrendingUp, Building, CreditCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
const monthly = [
  { month: 'Nov', subs: 2800, website: 600, total: 3580 },
  { month: 'Dec', subs: 3200, website: 600, total: 4040 },
  { month: 'Jan', subs: 4100, website: 900, total: 5310 },
  { month: 'Feb', subs: 5400, website: 900, total: 6720 },
  { month: 'Mar', subs: 6350, website: 1200, total: 8130 },
  { month: 'Apr', subs: 7200, website: 1200, total: 9050 },
]
export default function SuperRevenuePage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Revenue</h1>
        <p className="text-gray-400 text-sm mt-1">Platform financial overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Subscription MRR', value: 'GH7,200', icon: DollarSign, color: '#1B4FD8' },
          { label: 'Total Revenue', value: 'GH9,050', icon: TrendingUp, color: '#059669' },
          { label: 'Paying Churches', value: '4', icon: Building, color: '#7C3AED' },
          { label: 'Marketplace', value: 'GH650', icon: CreditCard, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="stat-card bg-white rounded-2xl p-5 border border-gray-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + '15' }}><s.icon size={17} style={{ color: s.color }} /></div>
            <p className="text-2xl font-bold mb-1" style={{  }}>{s.value}</p>
            <p className="text-xs font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Revenue by Stream</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="subs" name="Subscriptions" fill="#1B4FD8" radius={[3,3,0,0]} />
              <Bar dataKey="website" name="Website Add-ons" fill="#93C5FD" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Total Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Line type="monotone" dataKey="total" stroke="#1B4FD8" strokeWidth={2.5} dot={{ fill: '#1B4FD8', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
