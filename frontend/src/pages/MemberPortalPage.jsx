import { useState, useEffect } from 'react'
import { User, Phone, Mail, MapPin, Calendar, Heart, DollarSign, CheckSquare, LogOut } from 'lucide-react'

export default function MemberPortalPage() {
  const [member, setMember] = useState(null)
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [giving, setGiving] = useState([])
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ phone: '', memberId: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('cos_member')
    if (saved) {
      const m = JSON.parse(saved)
      setMember(m)
      loadMemberData(m)
    }
  }, [])

  const loadMemberData = async (m) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('cos_member_token')
      const headers = { 'Authorization': `Bearer ${token}` }
      
      // Load attendance
      const attRes = await fetch(`/api/churches/${m.church_id}/attendance`, { headers })
      if (attRes.ok) {
        const attData = await attRes.json()
        setAttendance(Array.isArray(attData) ? attData.slice(0, 10) : [])
      }

      // Load finance/giving
      const finRes = await fetch(`/api/churches/${m.church_id}/finance/transactions`, { headers })
      if (finRes.ok) {
        const finData = await finRes.json()
        // Filter transactions that might relate to this member
        setGiving(Array.isArray(finData) ? finData.filter(t => t.type === 'income').slice(0, 10) : [])
      }
    } catch(e) {
      console.warn(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/member-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('cos_member_token', data.access_token)
      localStorage.setItem('cos_member', JSON.stringify(data.member))
      setMember(data.member)
      loadMemberData(data.member)
    } catch(e) {
      setError(e.message || 'Invalid phone number or member ID')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('cos_member')
    localStorage.removeItem('cos_member_token')
    setMember(null)
    setAttendance([])
    setGiving([])
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#1B4FD8' }}>
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond' }}>
              Member Portal
            </h1>
            <p className="text-white/50 text-sm mt-1">Access your church profile</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Phone Number</label>
                <input type="tel" value={loginForm.phone} onChange={e => setLoginForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+233 24 000 0000" required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Member ID</label>
                <input type="text" value={loginForm.memberId} onChange={e => setLoginForm(p => ({ ...p, memberId: e.target.value }))}
                  placeholder="e.g. GCI-1234"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <p className="text-white/40 text-xs">Enter your phone number or member ID to login</p>
              <button type="submit" disabled={loading || (!loginForm.phone && !loginForm.memberId)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                style={{ background: '#1B4FD8' }}>
                {loading ? 'Logging in...' : 'Access My Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      {/* Header */}
      <div style={{ background: '#0F172A' }} className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: '#1B4FD8' }}>
              {member.name?.charAt(0) || 'M'}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{member.name}</p>
              <p className="text-white/40 text-xs">{member.member_id || member.phone}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'profile', label: 'My Profile', icon: User },
            { key: 'attendance', label: 'Attendance', icon: CheckSquare },
            { key: 'giving', label: 'Giving', icon: DollarSign },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{
                background: tab === t.key ? '#1B4FD8' : 'white',
                color: tab === t.key ? 'white' : '#6B7280',
                border: '1px solid ' + (tab === t.key ? '#1B4FD8' : '#E5E7EB')
              }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
            <h3 className="font-bold text-gray-800 mb-5" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
              My Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: member.name, icon: User },
                { label: 'Phone', value: member.phone, icon: Phone },
                { label: 'Email', value: member.email, icon: Mail },
                { label: 'Member ID', value: member.member_id, icon: Calendar },
                { label: 'Status', value: member.status, icon: Heart },
                { label: 'Ministry', value: member.ministry, icon: Heart },
              ].map(f => (
                <div key={f.label} className="p-4 rounded-xl" style={{ background: '#F8FAFF' }}>
                  <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{f.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {tab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
            <h3 className="font-bold text-gray-800 mb-5" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
              Attendance History
            </h3>
            {attendance.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No attendance records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: '#F8FAFF' }}>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.service_name || 'Service'}</p>
                      <p className="text-xs text-gray-400">{a.date ? new Date(a.date).toLocaleDateString('en-GB') : '—'}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: '#DCFCE7', color: '#166534' }}>Present</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Giving Tab */}
        {tab === 'giving' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
            <h3 className="font-bold text-gray-800 mb-5" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
              Giving History
            </h3>
            {giving.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No giving records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giving.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: '#F8FAFF' }}>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{g.category || g.description || 'Offering'}</p>
                      <p className="text-xs text-gray-400">{g.date ? new Date(g.date).toLocaleDateString('en-GB') : '—'}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: '#059669' }}>
                      GHC {Number(g.amount || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
