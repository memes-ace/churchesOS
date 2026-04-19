import { useState, useEffect } from 'react'
import { membersAPI, financeAPI, attendanceAPI, eventsAPI } from '../utils/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function ReportsPage() {
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [attendance, setAttendance] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      membersAPI.getAll(),
      financeAPI.getAll(),
      attendanceAPI.getAll(),
      eventsAPI.getAll(),
    ]).then(([m, f, a, e]) => {
      if (m.status === 'fulfilled' && Array.isArray(m.value)) setMembers(m.value)
      if (f.status === 'fulfilled' && Array.isArray(f.value)) setTransactions(f.value)
      if (a.status === 'fulfilled' && Array.isArray(a.value)) setAttendance(a.value)
      if (e.status === 'fulfilled' && Array.isArray(e.value)) setEvents(e.value)
    }).finally(() => setLoading(false))
  }, [])

  // Member growth by month
  const memberGrowth = (() => {
    const months = {}
    members.forEach(m => {
      const month = m.created_at ? m.created_at.substring(0, 7) : 'Unknown'
      months[month] = (months[month] || 0) + 1
    })
    return Object.entries(months).slice(-6).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      members: count
    }))
  })()

  // Finance by month
  const financeByMonth = (() => {
    const months = {}
    transactions.forEach(t => {
      const month = t.date ? t.date.substring(0, 7) : 'Unknown'
      if (!months[month]) months[month] = { income: 0, expense: 0 }
      if (t.type === 'income') months[month].income += Number(t.amount || 0)
      else months[month].expense += Number(t.amount || 0)
    })
    return Object.entries(months).slice(-6).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short' }),
      ...data
    }))
  })()

  // Member status breakdown
  const memberStatus = (() => {
    const counts = {}
    members.forEach(m => {
      const s = m.status || 'Member'
      counts[s] = (counts[s] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  })()

  // Attendance trend
  const attendanceTrend = attendance.slice(-8).map(a => ({
    name: a.service_name || a.date || 'Service',
    count: Number(a.count || 0)
  }))

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0)
  const COLORS = ['#1B4FD8', '#7C3AED', '#059669', '#F59E0B', '#DC2626']

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Church analytics and insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Members', value: members.length, color: '#1B4FD8', bg: '#EEF2FF', icon: '👥' },
          { label: 'Total Income', value: 'GHC ' + totalIncome.toLocaleString(), color: '#059669', bg: '#F0FDF4', icon: '💰' },
          { label: 'Total Expenses', value: 'GHC ' + totalExpense.toLocaleString(), color: '#DC2626', bg: '#FEF2F2', icon: '💸' },
          { label: 'Net Balance', value: 'GHC ' + (totalIncome - totalExpense).toLocaleString(), color: '#7C3AED', bg: '#EDE9FE', icon: '📊' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold my-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6 fade-in">
        {/* Member Growth */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Member Growth</h3>
          <p className="text-xs text-gray-400 mb-5">New members per month</p>
          {memberGrowth.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={memberGrowth}>
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Area type="monotone" dataKey="members" stroke="#1B4FD8" strokeWidth={2} fill="url(#mg)" name="New Members" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Finance Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Finance Overview</h3>
          <p className="text-xs text-gray-400 mb-5">Income vs Expenses (GHC)</p>
          {financeByMonth.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financeByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Bar dataKey="income" fill="#059669" radius={[4,4,0,0]} name="Income" />
                <Bar dataKey="expense" fill="#DC2626" radius={[4,4,0,0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Attendance Trend</h3>
          <p className="text-xs text-gray-400 mb-5">Recent services</p>
          {attendanceTrend.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No attendance data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="at" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Area type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} fill="url(#at)" name="Attendance" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Member Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Member Breakdown</h3>
          <p className="text-xs text-gray-400 mb-5">By status</p>
          {memberStatus.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No member data yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie data={memberStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {memberStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {memberStatus.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs text-gray-600">{s.name}</span>
                    <span className="text-xs font-bold text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
