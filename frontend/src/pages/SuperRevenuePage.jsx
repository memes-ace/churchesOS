import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function SuperRevenuePage() {
  const [churches, setChurches] = useState([])
  const [stats, setStats] = useState({ totalRevenue: 0, totalChurches: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getChurches()
      .then(data => { if (Array.isArray(data)) setChurches(data) })
      .catch(e => console.warn(e))
    adminAPI.getStats()
      .then(data => { if (data) setStats(data) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
  }, [])

  const planCounts = churches.reduce((acc, c) => {
    const plan = c.plan || 'starter'
    acc[plan] = (acc[plan] || 0) + 1
    return acc
  }, {})

  const planPrices = { starter: 50, growth: 100, enterprise: 200, free: 0, trial: 0 }

  const planRevenue = Object.entries(planCounts).map(([plan, count]) => ({
    plan: plan.charAt(0).toUpperCase() + plan.slice(1),
    churches: count,
    revenue: (planPrices[plan.toLowerCase()] || 0) * count,
  }))

  const totalRevenue = planRevenue.reduce((s, p) => s + p.revenue, 0)
  const activeChurches = churches.filter(c => c.status === 'active' || c.status === 'Active').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>Revenue Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Platform subscription revenue — live data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: "Total Churches", value: churches.length, color: "#1B4FD8", icon: "⛪" },
          { label: "Active Churches", value: activeChurches, color: "#059669", icon: "✅" },
          { label: "Est. Monthly Revenue", value: "GHC " + totalRevenue.toLocaleString(), color: "#7C3AED", icon: "💰" },
          { label: "Annual Run Rate", value: "GHC " + (totalRevenue * 12).toLocaleString(), color: "#F59E0B", icon: "📈" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold my-2" style={{ color: s.color }}>{loading ? "..." : s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Revenue by Plan (GHC)</h3>
          {planRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={planRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="plan" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Bar dataKey="revenue" fill="#1B4FD8" radius={[4,4,0,0]} name="Revenue (GHC)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Churches by Plan</h3>
          {planRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={planRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="plan" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Bar dataKey="churches" fill="#7C3AED" radius={[4,4,0,0]} name="Churches" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {churches.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6 fade-in">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Church Breakdown</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Church", "Plan", "Status", "Est. Monthly Revenue"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {churches.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.location || ""}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
                      {c.plan || "starter"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: c.status === "active" || c.status === "Active" ? "#DCFCE7" : "#FEF9C3",
                               color: c.status === "active" || c.status === "Active" ? "#166534" : "#854D0E" }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-700">
                    GHC {(planPrices[c.plan?.toLowerCase()] || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
