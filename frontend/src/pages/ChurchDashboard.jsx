import { useState, useEffect } from 'react'
import { Users, DollarSign, Calendar, TrendingUp, Plus, ArrowRight, Bell } from 'lucide-react'
import { membersAPI, financeAPI, eventsAPI, attendanceAPI } from '../utils/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function ChurchDashboard() {
  const [stats, setStats] = useState({ members: 0, income: 0, events: 0, attendance: 0 })
  const [recentMembers, setRecentMembers] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendanceData] = useState([])
  const [financeData, setFinanceData] = useState([])

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('cos_user') || '{}') }
    catch(e) { return {} }
  })()

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [members, transactions, events, attendance] = await Promise.allSettled([
          membersAPI.getAll(),
          financeAPI.getAll(),
          eventsAPI.getAll(),
          attendanceAPI.getAll(),
        ])

        const membersData = members.status === 'fulfilled' && Array.isArray(members.value) ? members.value : []
        const transData = transactions.status === 'fulfilled' && Array.isArray(transactions.value) ? transactions.value : []
        const eventsData = events.status === 'fulfilled' && Array.isArray(events.value) ? events.value : []
        const attendanceRecords = attendance.status === 'fulfilled' && Array.isArray(attendance.value) ? attendance.value : []

        const totalIncome = transData.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0)
        const upcomingEvts = eventsData.filter(e => e.status === 'upcoming' || e.status === 'Upcoming')
        const totalAttendance = attendanceRecords.reduce((s, a) => s + Number(a.count || 0), 0)

        setStats({
          members: membersData.length,
          income: totalIncome,
          events: upcomingEvts.length,
          attendance: attendanceRecords.length > 0 ? Math.round(totalAttendance / attendanceRecords.length) : 0,
        })

        setRecentMembers(membersData.slice(0, 5).map(m => ({
          name: m.name,
          joined: new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          status: m.status || 'Member',
          avatar: m.name?.split(' ').map(w => w[0]).slice(0,2).join('') || '??',
        })))

        setUpcomingEvents(upcomingEvts.slice(0, 4))

        // Build attendance chart data from records
        const chartData = attendanceRecords.slice(-8).map(a => ({
          name: a.service_name || a.date,
          count: Number(a.count || 0),
        }))
        setAttendanceData(chartData)

        // Build finance chart data
        const months = {}
        transData.forEach(t => {
          const month = t.date ? t.date.substring(0, 7) : 'Unknown'
          if (!months[month]) months[month] = { month, tithe: 0, offering: 0 }
          if (t.category?.toLowerCase().includes('tithe')) months[month].tithe += Number(t.amount || 0)
          else months[month].offering += Number(t.amount || 0)
        })
        setFinanceData(Object.values(months).slice(-6).map(m => ({
          ...m,
          month: new Date(m.month + '-01').toLocaleDateString('en-GB', { month: 'short' })
        })))

      } catch(e) {
        console.warn('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>
            {getGreeting()}, Pastor
          </h1>
          <p className="text-gray-400 text-sm mt-1">{user.church_name || 'Welcome to ChurchesOS'}</p>
        </div>
        <a href="/church/members"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Member
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Members', value: loading ? '...' : stats.members.toLocaleString(), icon: Users, color: '#1B4FD8', bg: '#EEF2FF', sub: 'Registered members' },
          { label: 'Total Income', value: loading ? '...' : 'GHC ' + stats.income.toLocaleString(), icon: DollarSign, color: '#059669', bg: '#F0FDF4', sub: 'All time income' },
          { label: 'Upcoming Events', value: loading ? '...' : stats.events, icon: Calendar, color: '#7C3AED', bg: '#EDE9FE', sub: 'Scheduled events' },
          { label: 'Services Recorded', value: loading ? '...' : stats.attendance, icon: TrendingUp, color: '#F59E0B', bg: '#FEF9C3', sub: 'Attendance sessions' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8 fade-in">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Attendance Trend</h3>
          <p className="text-xs text-gray-400 mb-5">Recent services</p>
          {attendanceData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No attendance data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Area type="monotone" dataKey="count" stroke="#1B4FD8" strokeWidth={2} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Financial Overview</h3>
          <p className="text-xs text-gray-400 mb-5">Tithe vs Offering — GHC</p>
          {financeData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No financial data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Bar dataKey="tithe" fill="#1B4FD8" radius={[4,4,0,0]} name="Tithe" />
                <Bar dataKey="offering" fill="#93C5FD" radius={[4,4,0,0]} name="Offering" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Members + Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-6 fade-in">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Members</h3>
            <a href="/church/members" className="text-xs font-medium flex items-center gap-1" style={{ color: '#1B4FD8' }}>
              View all <ArrowRight size={12} />
            </a>
          </div>
          {recentMembers.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm text-gray-400">No members yet</p>
              <a href="/church/members" className="text-xs font-medium mt-2 block" style={{ color: '#1B4FD8' }}>Add your first member →</a>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: '#1B4FD8' }}>
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400">Joined {m.joined}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
            <a href="/church/events" className="text-xs font-medium flex items-center gap-1" style={{ color: '#1B4FD8' }}>
              View all <ArrowRight size={12} />
            </a>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm text-gray-400">No upcoming events</p>
              <a href="/church/events" className="text-xs font-medium mt-2 block" style={{ color: '#1B4FD8' }}>Create an event →</a>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingEvents.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{ background: '#7C3AED' }}>
                    <p className="text-xs font-bold leading-none">
                      {e.date ? new Date(e.date).toLocaleDateString('en-GB', { month: 'short' }) : ''}
                    </p>
                    <p className="text-lg font-bold leading-none">
                      {e.date ? new Date(e.date).getDate() : ''}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.name || e.title}</p>
                    <p className="text-xs text-gray-400">{e.time || ''} {e.location ? '• ' + e.location : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
