import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const monthlyData = [
  { month: 'Oct', revenue: 14400, churches: 45 },
  { month: 'Nov', revenue: 22200, churches: 52 },
  { month: 'Dec', revenue: 28800, churches: 61 },
  { month: 'Jan', revenue: 25200, churches: 68 },
  { month: 'Feb', revenue: 33600, churches: 74 },
  { month: 'Mar', revenue: 38400, churches: 82 },
  { month: 'Apr', revenue: 43200, churches: 91 },
]

export default function SuperRevenuePage() {
  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0)
  const thisMonth = monthlyData[monthlyData.length - 1].revenue
  const lastMonth = monthlyData[monthlyData.length - 2].revenue
  const growth = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Revenue Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Platform subscription revenue overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'This Month', value: 'GHC ' + thisMonth.toLocaleString(), color: '#1B4FD8', icon: '💰' },
          { label: 'Total Revenue', value: 'GHC ' + totalRevenue.toLocaleString(), color: '#059669', icon: '📈' },
          { label: 'Growth vs Last Month', value: '+' + growth + '%', color: '#7C3AED', icon: '🚀' },
          { label: 'Annual Run Rate', value: 'GHC ' + (thisMonth * 12).toLocaleString(), color: '#F59E0B', icon: '🏦' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold my-2" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Monthly Revenue (GHC)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Area type="monotone" dataKey="revenue" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Churches Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="churches" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
