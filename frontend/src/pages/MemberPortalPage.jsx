import { useState, useEffect } from 'react'
import { User, Phone, Mail, Calendar, Heart, DollarSign, CheckSquare, LogOut, BookOpen, Bell, ChevronRight, Home, Users, MessageCircle, Download, Copy, Check } from 'lucide-react'

let deferredPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

export default function MemberPortalPage() {
  const [member, setMember] = useState(null)
  const [churchBranding, setChurchBranding] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [giving, setGiving] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [sermons, setSermons] = useState([])
  const [tab, setTab] = useState('home')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [copiedMethod, setCopiedMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [brandingLoading, setBrandingLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ phone: '' })
  const [error, setError] = useState('')
  const [showInstall, setShowInstall] = useState(false)
  const [prayerForm, setPrayerForm] = useState({ request: '' })
  const [prayerSent, setPrayerSent] = useState(false)

  useEffect(() => {
    // Check for church ID in URL
    const params = new URLSearchParams(window.location.search)
    const churchId = params.get('church')

    if (churchId) {
      // Fetch church branding from public endpoint
      setBrandingLoading(true)
      fetch(`/api/admin/public/${churchId}/branding`)
        .then(r => r.json())
        .then(data => {
          if (!data.error) {
            setChurchBranding(data)
            localStorage.setItem('cos_portal_church', JSON.stringify(data))
          }
        })
        .catch(() => {})
        .finally(() => setBrandingLoading(false))
    } else {
      // Try to load from localStorage (previous visit)
      const saved = localStorage.getItem('cos_portal_church')
      if (saved) {
        try { setChurchBranding(JSON.parse(saved)) } catch {}
      }
    }

    // Check if already logged in
    const savedMember = localStorage.getItem('cos_member')
    if (savedMember) {
      const m = JSON.parse(savedMember)
      setMember(m)
      // Set branding from member data
      if (m.church_name) {
        setChurchBranding({
          name: m.church_name,
          logo_url: m.church_logo || '',
          primary_color: m.church_color || '#1B4FD8',
          tagline: m.church_tagline || '',
          phone: m.church_phone || '',
        })
      }
      loadMemberData(m)
    }

    setTimeout(() => {
      if (deferredPrompt) setShowInstall(true)
    }, 3000)
  }, [])

  const loadMemberData = async (m) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('cos_member_token') || ''
      const headers = { 'Authorization': `Bearer ${token}` }
      const churchId = m.church_id

      const [attRes, finRes, annRes, evtRes, serRes] = await Promise.allSettled([
        fetch(`/api/churches/${churchId}/attendance`, { headers }),
        fetch(`/api/churches/${churchId}/finance/transactions`, { headers }),
        fetch(`/api/churches/${churchId}/announcements`, { headers }),
        fetch(`/api/churches/${churchId}/events`, { headers }),
        fetch(`/api/churches/${churchId}/sermons`, { headers }),
      ])

      if (attRes.status === 'fulfilled' && attRes.value.ok) {
        const data = await attRes.value.json()
        setAttendance(Array.isArray(data) ? data.slice(0, 10) : [])
      }
      if (finRes.status === 'fulfilled' && finRes.value.ok) {
        const data = await finRes.value.json()
        setGiving(Array.isArray(data) ? data.filter(t => t.type === 'income').slice(0, 10) : [])
      }
      if (annRes.status === 'fulfilled' && annRes.value.ok) {
        const data = await annRes.value.json()
        setAnnouncements(Array.isArray(data) ? data.slice(0, 5) : [])
      }
      if (evtRes.status === 'fulfilled' && evtRes.value.ok) {
        const data = await evtRes.value.json()
        setEvents(Array.isArray(data) ? data.slice(0, 5) : [])
      }
      if (serRes.status === 'fulfilled' && serRes.value.ok) {
        const data = await serRes.value.json()
        setSermons(Array.isArray(data) ? data.slice(0, 5) : [])
      }
    } catch(e) { console.warn(e) }
    finally { setLoading(false) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/member-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginForm.phone, memberId: '' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('cos_member_token', data.access_token)
      localStorage.setItem('cos_member', JSON.stringify(data.member))
      setMember(data.member)
      setChurchBranding({
        name: data.member.church_name,
        logo_url: data.member.church_logo || '',
        primary_color: data.member.church_color || '#1B4FD8',
        tagline: data.member.church_tagline || '',
        phone: data.member.church_phone || '',
      })
      loadMemberData(data.member)
    } catch(e) {
      setError(e.message || 'Invalid phone number. Please check and try again.')
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('cos_member')
    localStorage.removeItem('cos_member_token')
    setMember(null)
    setAttendance([])
    setGiving([])
    setAnnouncements([])
    setEvents([])
    setSermons([])
    setTab('home')
    // Fetch church payment methods
    if (data.church_id) {
      fetch(`/api/admin/churches/${data.church_id}/payment-methods`)
        .then(r => r.json())
        .then(methods => { if (Array.isArray(methods)) setPaymentMethods(methods) })
        .catch(() => {})
    }
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      deferredPrompt = null
      setShowInstall(false)
    }
  }

  const handlePrayerSubmit = async () => {
    if (!prayerForm.request) return
    try {
      const token = localStorage.getItem('cos_member_token') || ''
      await fetch(`/api/churches/${member.church_id}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: member.name, phone: member.phone, request: prayerForm.request, status: 'Pending' })
      })
      setPrayerSent(true)
      setPrayerForm({ request: '' })
      setTimeout(() => setPrayerSent(false), 3000)
    } catch(e) { console.warn(e) }
  }

  const totalGiving = giving.reduce((s, g) => s + Number(g.amount || 0), 0)
  const thisYear = new Date().getFullYear()
  const yearGiving = giving.filter(g => g.date?.startsWith(String(thisYear))).reduce((s, g) => s + Number(g.amount || 0), 0)
  const brandColor = churchBranding?.primary_color || '#1B4FD8'

  // LOGIN SCREEN
  if (!member) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A6E 50%, #0F172A 100%)' }}>
        {showInstall && (
          <div className="fixed top-0 left-0 right-0 z-50 p-3" style={{ background: brandColor }}>
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <p className="text-white text-sm font-medium">📱 Install app for quick access</p>
              <button onClick={handleInstall} className="text-white text-xs px-3 py-1 rounded-lg border border-white/30">Install</button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {brandingLoading ? (
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <span className="text-white/30 text-4xl font-bold">C</span>
            </div>
          ) : churchBranding?.logo_url ? (
            <img src={churchBranding.logo_url} alt="Church Logo"
              className="w-20 h-20 rounded-3xl object-cover mb-6 shadow-2xl" />
          ) : (
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${brandColor}, #3B82F6)` }}>
              <span className="text-white text-4xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>
                {churchBranding?.name?.charAt(0) || 'C'}
              </span>
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>
            {churchBranding?.name || 'Member Portal'}
          </h1>
          <p className="text-white/50 text-sm mb-10">
            {churchBranding?.tagline || 'Access your church profile'}
          </p>

          <div className="w-full max-w-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl text-sm text-center" style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Phone Number</label>
                <input type="tel" value={loginForm.phone}
                  onChange={e => setLoginForm({ phone: e.target.value })}
                  placeholder="e.g. 0244000000" required
                  className="w-full px-5 py-4 rounded-2xl text-white text-base placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${brandColor}, #3B82F6)` }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-white/30 text-xs mt-8">Contact your church admin if you cannot log in</p>
          </div>
        </div>
        <div className="text-center pb-8">
          <p className="text-white/20 text-xs">Powered by ChurchesOS</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'attendance', label: 'Attendance', icon: CheckSquare },
    { key: 'giving', label: 'Giving', icon: DollarSign },
    { key: 'pay', label: 'Pay', icon: CreditCard },
    { key: 'prayer', label: 'Prayer', icon: Heart },
    { key: 'more', label: 'More', icon: Users },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F4FF', paddingBottom: '80px' }}>
      {showInstall && (
        <div className="p-3" style={{ background: brandColor }}>
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">📱 Install for quick access</p>
            <div className="flex gap-2">
              <button onClick={() => setShowInstall(false)} className="text-white/60 text-xs px-2 py-1">Later</button>
              <button onClick={handleInstall} className="text-white text-xs px-3 py-1 rounded-lg border border-white/30">Install</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: `linear-gradient(135deg, #0F172A, ${brandColor})` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {churchBranding?.logo_url ? (
              <img src={churchBranding.logo_url} alt="Church" className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {churchBranding?.name?.charAt(0) || 'C'}
              </div>
            )}
            <p className="text-white/70 text-xs font-medium">{churchBranding?.name}</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            {member.name?.charAt(0) || 'M'}
          </div>
        </div>
        <p className="text-white/50 text-xs uppercase tracking-widest">Welcome back</p>
        <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>
          {member.name?.split(' ')[0]}
        </h1>

        {/* Member Card */}
        <div className="rounded-2xl p-4 mt-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs">Member ID</p>
              <p className="text-white font-bold text-sm">{member.member_id || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">Status</p>
              <p className="text-green-400 font-bold text-sm">{member.status || 'Active'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4">
        {tab === 'home' && (
          <div className="space-y-4 fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400">This Year Giving</p>
                <p className="text-lg font-bold mt-1" style={{ color: '#059669' }}>GHC {yearGiving.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400">Services Attended</p>
                <p className="text-lg font-bold mt-1" style={{ color: brandColor }}>{attendance.length}</p>
              </div>
            </div>

            {announcements.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={16} style={{ color: '#F59E0B' }} />
                  <h3 className="font-bold text-gray-800 text-sm">Announcements</h3>
                </div>
                <div className="space-y-2">
                  {announcements.slice(0, 3).map((a, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: '#FFFBEB' }}>
                      <p className="text-sm font-medium text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} style={{ color: brandColor }} />
                  <h3 className="font-bold text-gray-800 text-sm">Upcoming Events</h3>
                </div>
                <div className="space-y-2">
                  {events.slice(0, 3).map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#EEF2FF' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: brandColor }}>
                        <Calendar size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{e.title || e.name}</p>
                        <p className="text-xs text-gray-500">{e.date ? new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sermons.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} style={{ color: '#7C3AED' }} />
                  <h3 className="font-bold text-gray-800 text-sm">Recent Sermons</h3>
                </div>
                <div className="space-y-2">
                  {sermons.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F5F3FF' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#7C3AED' }}>
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                        <p className="text-xs text-gray-500">{s.preacher || s.speaker}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {tab === 'attendance' && (
          <div className="fade-in">
            <h2 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: 22 }}>Attendance History</h2>
            {attendance.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <CheckSquare size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No attendance records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map((a, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{a.service_name || 'Service'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.date ? new Date(a.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>Present</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'giving' && (
          <div className="fade-in">
            <h2 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: 22 }}>Giving History</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                <p className="text-green-100 text-xs">This Year</p>
                <p className="text-white font-bold text-lg mt-1">GHC {yearGiving.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl p-4 shadow-sm" style={{ background: `linear-gradient(135deg, ${brandColor}, #3B82F6)` }}>
                <p className="text-blue-100 text-xs">Total Given</p>
                <p className="text-white font-bold text-lg mt-1">GHC {totalGiving.toLocaleString()}</p>
              </div>
            </div>
            {giving.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <DollarSign size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No giving records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giving.map((g, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{g.category || g.description || 'Offering'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{g.date ? new Date(g.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                    </div>
                    <p className="text-base font-bold" style={{ color: '#059669' }}>GHC {Number(g.amount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'prayer' && (
          <div className="fade-in">
            <h2 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: 22 }}>Prayer Request</h2>
            <p className="text-gray-400 text-sm mb-5">Submit a prayer request to your church</p>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              {prayerSent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
                    <Heart size={24} style={{ color: '#166534' }} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Prayer Request Sent!</h3>
                  <p className="text-gray-500 text-sm">Your church will be praying for you.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea rows={5} value={prayerForm.request}
                    onChange={e => setPrayerForm({ request: e.target.value })}
                    placeholder="Share your prayer request here..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none text-sm resize-none" />
                  <button onClick={handlePrayerSubmit} disabled={!prayerForm.request}
                    className="w-full py-4 rounded-2xl text-white font-bold text-sm disabled:opacity-50 active:scale-95 transition-all"
                    style={{ background: `linear-gradient(135deg, ${brandColor}, #3B82F6)` }}>
                    🙏 Submit Prayer Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'pay' && (
          <div className="fade-in space-y-3">
            <h2 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: 22 }}>Make Payment</h2>
            <p className="text-xs text-gray-400 mb-4">Pay your tithes, offerings and donations using the methods below</p>
            {paymentMethods.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-3">💳</div>
                <p className="font-medium text-gray-600 mb-1">No payment methods yet</p>
                <p className="text-xs text-gray-400">Your church has not set up payment methods yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: '#F0F4FF' }}>
                        {m.type === 'Mobile Money' ? '📲' : m.type === 'Bank Transfer' ? '🏦' : '💳'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-400 mb-2">{m.type}</p>
                        <div className="p-3 rounded-xl mb-2" style={{ background: '#F8FAFF' }}>
                          <p className="text-xs text-gray-400">Number / Account</p>
                          <p className="font-bold text-lg" style={{ color: brandColor }}>{m.number}</p>
                          {m.account_name && <p className="text-xs text-gray-500">{m.account_name}</p>}
                        </div>
                        {m.instructions && (
                          <p className="text-xs text-gray-400 italic mb-3">📝 {m.instructions}</p>
                        )}
                        <button onClick={() => {
                          navigator.clipboard.writeText(m.number)
                          setCopiedMethod(m.id)
                          setTimeout(() => setCopiedMethod(null), 2000)
                        }}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold transition active:scale-95"
                          style={{ background: copiedMethod === m.id ? '#DCFCE7' : brandColor, color: copiedMethod === m.id ? '#166534' : 'white' }}>
                          {copiedMethod === m.id ? '✓ Copied!' : 'Copy Number'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'more' && (
          <div className="fade-in space-y-3">
            <h2 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: 22 }}>My Profile</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #3B82F6)` }}>
                  {member.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.member_id || 'Member'}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Phone', value: member.phone, icon: Phone },
                  { label: 'Email', value: member.email, icon: Mail },
                  { label: 'Status', value: member.status, icon: User },
                  { label: 'Ministry', value: member.ministry, icon: Users },
                ].filter(f => f.value).map(f => (
                  <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFF' }}>
                    <f.icon size={16} style={{ color: brandColor }} />
                    <div>
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="text-sm font-medium text-gray-800">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {churchBranding?.phone && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Contact Church</h3>
                <div className="space-y-2">
                  <a href={`tel:${churchBranding.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl active:scale-95 transition-all"
                    style={{ background: '#EEF2FF' }}>
                    <Phone size={16} style={{ color: brandColor }} />
                    <span className="text-sm font-medium text-gray-800">Call Church Office</span>
                    <ChevronRight size={14} className="ml-auto text-gray-400" />
                  </a>
                  <a href={`https://wa.me/${churchBranding.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl active:scale-95 transition-all"
                    style={{ background: '#DCFCE7' }}>
                    <MessageCircle size={16} style={{ color: '#059669' }} />
                    <span className="text-sm font-medium text-gray-800">WhatsApp Church</span>
                    <ChevronRight size={14} className="ml-auto text-gray-400" />
                  </a>
                </div>
              </div>
            )}

            {deferredPrompt && (
              <button onClick={handleInstall}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-all">
                <Download size={18} style={{ color: brandColor }} />
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800">Install App</p>
                  <p className="text-xs text-gray-400">Add to your home screen</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-gray-400" />
              </button>
            )}

            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-all">
              <LogOut size={18} style={{ color: '#DC2626' }} />
              <span className="text-sm font-bold text-red-600">Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="flex">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 flex flex-col items-center gap-1 py-1 transition-all active:scale-95">
              <t.icon size={20} style={{ color: tab === t.key ? brandColor : '#9CA3AF' }} />
              <span className="text-xs" style={{ color: tab === t.key ? brandColor : '#9CA3AF', fontWeight: tab === t.key ? '700' : '400' }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
