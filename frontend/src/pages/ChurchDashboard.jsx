import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Users, DollarSign, Calendar, MessageSquare, TrendingUp, Bell, UserPlus, BookOpen, ArrowUpRight, CheckSquare } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const attendanceData = [
  { week: 'Jan W1', attendance: 142 },{ week: 'Jan W2', attendance: 158 },
  { week: 'Feb W1', attendance: 165 },{ week: 'Feb W2', attendance: 189 },
  { week: 'Mar W1', attendance: 198 },{ week: 'Mar W2', attendance: 223 },
  { week: 'Mar W3', attendance: 241 },{ week: 'Mar W4', attendance: 0 },
]
const givingData = [
  { month: 'Nov', tithe: 4800, offering: 2100 },
  { month: 'Dec', tithe: 6200, offering: 3400 },
  { month: 'Jan', tithe: 5100, offering: 2300 },
  { month: 'Feb', tithe: 5600, offering: 2700 },
  { month: 'Mar', tithe: 6100, offering: 3100 },
]
const recentMembers = [
  { name: 'Abena Asante', joined: '2 days ago', status: 'Member', avatar: 'AA' },
  { name: 'Kwame Boateng', joined: '5 days ago', status: 'Worker', avatar: 'KB' },
  { name: 'Gifty Mensah', joined: '1 week ago', status: 'Leader', avatar: 'GM' },
  { name: 'Emmanuel Darko', joined: '1 week ago', status: 'Leader', avatar: 'ED' },
]
const upcomingEvents = [
  { name: 'Sunday Service', date: 'Sun, Apr 14', type: 'Service', registered: 180 },
  { name: 'Youth Revival Night', date: 'Fri, Apr 19', type: 'Special', registered: 67 },
  { name: 'Easter Crusade', date: 'Sat, Apr 20', type: 'Crusade', registered: 312 },
]

function StatCard({ title, value, subtitle, icon: Icon, color, change }) {
  return (
    <div className="stat-card bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
            <TrendingUp size={11} /> {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mb-1" style={{  color: '#0F172A' }}>{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export default function ChurchDashboard() {
  const [greeting, setGreeting] = useState('')
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening')
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{  color: '#0F172A' }}>
            {greeting}, Pastor
          </h1>
          <p className="text-gray-400 text-sm mt-1">Grace Chapel International</p>
        </div>
        <a href="/church/members" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <UserPlus size={15} /> Add Member
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="fade-in fade-in-delay-1"><StatCard title="Total Members" value="0" subtitle="Active congregation" icon={Users} color="#1B4FD8" change="+0%" /></div>
        <div className="fade-in fade-in-delay-2"><StatCard title="This Sunday" value="0" subtitle="Attendance" icon={CheckSquare} color="#7C3AED" change="+0%" /></div>
        <div className="fade-in fade-in-delay-3"><StatCard title="Monthly Giving" value="GHC 0" subtitle="This Month" icon={DollarSign} color="#059669" change="+0%" /></div>
        <div className="fade-in fade-in-delay-4"><StatCard title="Upcoming Events" value="4" subtitle="Next 30 days" icon={Calendar} color="#F59E0B" /></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 fade-in">
          <h3 className="font-semibold text-gray-800 mb-1">Attendance Trend</h3>
          <p className="text-xs text-gray-400 mb-5">Weekly — 2025</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="attendance" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#attGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 fade-in">
          <h3 className="font-semibold text-gray-800 mb-1">Financial Overview</h3>
          <p className="text-xs text-gray-400 mb-5">Tithe vs Offering — GH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={givingData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="tithe" fill="#1B4FD8" radius={[4,4,0,0]} />
              <Bar dataKey="offering" fill="#93C5FD" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>New Members</h3>
            <a href="/church/members" className="text-xs font-medium" style={{ color: '#1B4FD8' }}>View all</a>
          </div>
          <div className="space-y-3">
            {recentMembers.map(m => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>{m.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.joined}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>Upcoming Events</h3>
            <a href="/church/events" className="text-xs font-medium" style={{ color: '#1B4FD8' }}>Manage</a>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(e => (
              <div key={e.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                  <Calendar size={18} style={{ color: '#1B4FD8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{e.registered}</p>
                  <p className="text-xs text-gray-400">registered</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
        {[
          { label: 'Send SMS Blast', icon: MessageSquare, href: '/church/communication', color: '#7C3AED' },
          { label: 'Record Attendance', icon: CheckSquare, href: '/church/attendance', color: '#1B4FD8' },
          { label: 'Add Transaction', icon: DollarSign, href: '/church/finance', color: '#059669' },
          { label: 'Upload Sermon', icon: BookOpen, href: '/church/sermons', color: '#F59E0B' },
        ].map(a => (
          <a key={a.label} href={a.href} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: a.color + '15' }}>
              <a.icon size={17} style={{ color: a.color }} />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
