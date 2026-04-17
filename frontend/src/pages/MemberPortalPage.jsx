import { useState } from 'react'
import { Home, User, DollarSign, BookOpen, Bell, Heart, LogOut, Calendar, Phone, Mail, MapPin, ChevronRight, CheckCircle } from 'lucide-react'

const memberData = {
  name: 'Abena Asante',
  memberId: 'GCI-001',
  photo: null,
  role: 'Member',
  status: 'Active',
  phone: '+233 24 123 4567',
  email: 'abena@email.com',
  location: 'Osu, Accra',
  dateJoined: '2022-03-15',
  ministry: 'Choir',
  cellGroup: 'Grace Cell - East Legon',
  attendance: 92,
  baptismStatus: 'Baptised',
}

const myGiving = [
  { id: 1, date: '2025-04-13', type: 'Tithe', amount: 200, status: 'Confirmed' },
  { id: 2, date: '2025-04-13', type: 'Offering', amount: 50, status: 'Confirmed' },
  { id: 3, date: '2025-03-30', type: 'Tithe', amount: 200, status: 'Confirmed' },
  { id: 4, date: '2025-03-16', type: 'Pledge', amount: 500, status: 'Confirmed' },
  { id: 5, date: '2025-03-02', type: 'Tithe', amount: 200, status: 'Confirmed' },
]

const announcements = [
  { id: 1, title: 'Easter Crusade', message: 'Our Easter Crusade begins this Friday at Independence Square. Buses depart from church at 5PM.', date: '2025-04-17', urgent: true },
  { id: 2, title: 'Sunday Service Change', message: 'This Sunday service will begin at 8AM instead of 9AM due to the special Easter program.', date: '2025-04-16', urgent: false },
  { id: 3, title: 'Choir Practice', message: 'All choir members are reminded of practice this Friday at 5PM. Attendance is compulsory.', date: '2025-04-15', urgent: false },
]

const sermons = [
  { id: 1, title: 'Walking in Purpose', pastor: 'Rev. Samuel Mensah', date: '2025-04-13', duration: '52 mins', series: 'Living by Faith' },
  { id: 2, title: 'The Power of Prayer', pastor: 'Rev. Samuel Mensah', date: '2025-04-06', duration: '48 mins', series: 'Living by Faith' },
  { id: 3, title: 'Grace and Mercy', pastor: 'Rev. Samuel Mensah', date: '2025-03-30', duration: '55 mins', series: 'God\'s Promises' },
]

const attendanceHistory = [
  { date: '2025-04-13', service: 'Sunday Service', status: 'Present' },
  { date: '2025-04-09', service: 'Prayer Meeting', status: 'Present' },
  { date: '2025-04-06', service: 'Sunday Service', status: 'Present' },
  { date: '2025-04-02', service: 'Midweek Service', status: 'Absent' },
  { date: '2025-03-30', service: 'Sunday Service', status: 'Present' },
]

export default function MemberPortalPage() {
  const [tab, setTab] = useState('home')
  const [prayerText, setPrayerText] = useState('')
  const [prayerSubmitted, setPrayerSubmitted] = useState(false)

  const totalGiving = myGiving.reduce((s, g) => s + g.amount, 0)

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'giving', label: 'Giving', icon: DollarSign },
    { id: 'sermons', label: 'Sermons', icon: BookOpen },
    { id: 'prayer', label: 'Prayer', icon: Heart },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      {/* Top Header */}
      <div className="sticky top-0 z-40 border-b border-gray-100" style={{ background: 'white' }}>
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1B4FD8' }}>C</div>
            <div>
              <p className="text-xs font-bold text-gray-800">ChurchesOS</p>
              <p className="text-xs text-gray-400">Member Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={20} className="text-gray-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#DC2626', fontSize: 9 }}>2</div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1B4FD8' }}>AA</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-24 pt-4">

        {/* Home Tab */}
        {tab === 'home' && (
          <div className="space-y-5 fade-in">
            {/* Welcome Card */}
            <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1B4FD8 0%, #7C3AED 100%)' }}>
              <p className="text-sm opacity-80">Welcome back 👋</p>
              <h2 className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'Cormorant Garamond' }}>{memberData.name}</h2>
              <p className="text-sm opacity-70 mt-1">{memberData.memberId} • {memberData.ministry}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{memberData.attendance}%</p>
                  <p className="text-xs opacity-70">Attendance</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">GHC{totalGiving.toLocaleString()}</p>
                  <p className="text-xs opacity-70">Total Giving</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{myGiving.length}</p>
                  <p className="text-xs opacity-70">Transactions</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'My Profile', icon: User, color: '#1B4FD8', tab: 'profile' },
                { label: 'My Giving', icon: DollarSign, color: '#059669', tab: 'giving' },
                { label: 'Sermons', icon: BookOpen, color: '#7C3AED', tab: 'sermons' },
                { label: 'Prayer', icon: Heart, color: '#EC4899', tab: 'prayer' },
              ].map(a => (
                <button key={a.label} onClick={() => setTab(a.tab)}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.color + '15' }}>
                    <a.icon size={18} style={{ color: a.color }} />
                  </div>
                  <p className="text-xs font-medium text-gray-600 text-center leading-tight">{a.label}</p>
                </button>
              ))}
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>Announcements</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{announcements.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {announcements.map(a => (
                  <div key={a.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.urgent ? '#FEE2E2' : '#EEF2FF' }}>
                        <Bell size={14} style={{ color: a.urgent ? '#DC2626' : '#1B4FD8' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                          {a.urgent && <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#FEE2E2', color: '#DC2626' }}>Urgent</span>}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{a.message}</p>
                        <p className="text-xs text-gray-300 mt-1">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>My Recent Attendance</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {attendanceHistory.slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.service}</p>
                      <p className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: a.status === 'Present' ? '#DCFCE7' : '#FEE2E2', color: a.status === 'Present' ? '#166534' : '#991B1B' }}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="space-y-4 fade-in">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>
                  AA
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond' }}>{memberData.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{memberData.memberId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{memberData.role}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>{memberData.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Phone, label: memberData.phone, color: '#1B4FD8' },
                  { icon: Mail, label: memberData.email, color: '#7C3AED' },
                  { icon: MapPin, label: memberData.location, color: '#059669' },
                  { icon: Calendar, label: 'Joined ' + new Date(memberData.dateJoined).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), color: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFF' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15' }}>
                      <item.icon size={15} style={{ color: item.color }} />
                    </div>
                    <p className="text-sm text-gray-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Church Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>Church Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Ministry', value: memberData.ministry },
                  { label: 'Cell Group', value: memberData.cellGroup },
                  { label: 'Baptism Status', value: memberData.baptismStatus },
                  { label: 'Attendance Rate', value: memberData.attendance + '%' },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFF' }}>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{d.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Giving Tab */}
        {tab === 'giving' && (
          <div className="space-y-4 fade-in">
            {/* Summary */}
            <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)' }}>
              <p className="text-sm opacity-80">Total Giving</p>
              <p className="text-4xl font-bold mt-1" style={{ fontFamily: 'Cormorant Garamond' }}>GHC{totalGiving.toLocaleString()}</p>
              <p className="text-xs opacity-70 mt-1">All time contributions</p>
              <div className="flex gap-4 mt-4">
                <div>
                  <p className="text-lg font-bold">GHC{myGiving.filter(g => g.type === 'Tithe').reduce((s,g) => s+g.amount, 0).toLocaleString()}</p>
                  <p className="text-xs opacity-70">Tithes</p>
                </div>
                <div className="w-px bg-white/20"></div>
                <div>
                  <p className="text-lg font-bold">GHC{myGiving.filter(g => g.type === 'Offering').reduce((s,g) => s+g.amount, 0).toLocaleString()}</p>
                  <p className="text-xs opacity-70">Offerings</p>
                </div>
                <div className="w-px bg-white/20"></div>
                <div>
                  <p className="text-lg font-bold">GHC{myGiving.filter(g => g.type === 'Pledge').reduce((s,g) => s+g.amount, 0).toLocaleString()}</p>
                  <p className="text-xs opacity-70">Pledges</p>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>Giving History</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {myGiving.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                        <DollarSign size={16} style={{ color: '#059669' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{g.type}</p>
                        <p className="text-xs text-gray-400">{new Date(g.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#059669' }}>GHC{g.amount.toLocaleString()}</p>
                      <span className="text-xs text-gray-400">{g.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sermons Tab */}
        {tab === 'sermons' && (
          <div className="space-y-4 fade-in">
            <div className="space-y-3">
              {sermons.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#EDE9FE' }}>📖</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.pastor}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9FE', color: '#5B21B6' }}>{s.series}</span>
                        <span className="text-xs text-gray-400">{s.duration}</span>
                        <span className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#7C3AED' }}>
                    ▶ Listen to Sermon
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prayer Tab */}
        {tab === 'prayer' && (
          <div className="space-y-4 fade-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Submit Prayer Request</h3>
              <p className="text-xs text-gray-400 mb-4">Your prayer request will be seen by the pastoral team</p>

              {prayerSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-3" style={{ color: '#059669' }} />
                  <p className="font-bold text-gray-800 mb-1">Prayer Request Submitted!</p>
                  <p className="text-sm text-gray-400">The pastoral team will pray for you.</p>
                  <button onClick={() => { setPrayerSubmitted(false); setPrayerText('') }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <>
                  <textarea rows={5} value={prayerText} onChange={e => setPrayerText(e.target.value)}
                    placeholder="Share your prayer request here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none mb-3" />
                  <button onClick={() => { if(prayerText) setPrayerSubmitted(true) }}
                    disabled={!prayerText}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: '#EC4899' }}>
                    <Heart size={15} /> Submit Prayer Request
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100" style={{ background: 'white' }}>
        <div className="flex items-center max-w-lg mx-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition">
              <item.icon size={20} style={{ color: tab === item.id ? '#1B4FD8' : '#9CA3AF' }} />
              <span className="text-xs font-medium" style={{ color: tab === item.id ? '#1B4FD8' : '#9CA3AF' }}>{item.label}</span>
              {tab === item.id && <div className="w-1 h-1 rounded-full" style={{ background: '#1B4FD8' }}></div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
