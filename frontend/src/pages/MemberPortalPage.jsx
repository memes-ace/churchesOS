import { useState, useEffect, useRef } from 'react'
import { Home, User, DollarSign, BookOpen, Bell, Heart, LogOut, Calendar, Phone, Mail, MapPin, CheckCircle, Edit, Save, X, Download, Upload, Loader, Users } from 'lucide-react'

// Get logged in member
const getMemberSession = () => {
  try { return JSON.parse(localStorage.getItem('cos_member_session') || 'null') }
  catch(e) { return null }
}

const getChurchData = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch(e) { return [] }
}

// ─── Giving Statement PDF ─────────────────────────────────────────────────────
const downloadGivingStatement = (member, giving) => {
  const total = giving.reduce((s, g) => s + Number(g.amount || 0), 0)
  const byType = giving.reduce((acc, g) => {
    acc[g.type] = (acc[g.type] || 0) + Number(g.amount || 0)
    return acc
  }, {})

  const html = `
    <html>
    <head><title>Giving Statement - ${member.name}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      .header { text-align: center; border-bottom: 2px solid #1B4FD8; padding-bottom: 20px; margin-bottom: 30px; }
      .church-name { font-size: 24px; font-weight: bold; color: #1B4FD8; }
      .member-info { background: #f8faff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { background: #1B4FD8; color: white; padding: 10px; text-align: left; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      .total { font-weight: bold; font-size: 18px; color: #059669; margin-top: 20px; }
      .summary { display: flex; gap: 20px; margin: 20px 0; }
      .summary-item { background: #EEF2FF; padding: 15px; border-radius: 8px; flex: 1; text-align: center; }
    </style>
    </head>
    <body>
      <div class="header">
        <div class="church-name">ChurchesOS</div>
        <div>Official Giving Statement</div>
        <div style="color:#666; font-size:12px">Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="member-info">
        <strong>Member Name:</strong> ${member.name}<br/>
        <strong>Member ID:</strong> ${member.memberId || 'N/A'}<br/>
        <strong>Phone:</strong> ${member.phone || 'N/A'}<br/>
        <strong>Period:</strong> ${new Date().getFullYear()}
      </div>
      <div class="summary">
        ${Object.entries(byType).map(([type, amount]) => `
          <div class="summary-item">
            <div style="font-size:20px;font-weight:bold;color:#1B4FD8">GHC ${Number(amount).toLocaleString()}</div>
            <div style="color:#666;font-size:12px">${type}</div>
          </div>
        `).join('')}
      </div>
      <table>
        <tr><th>Date</th><th>Type</th><th>Amount (GHC)</th></tr>
        ${giving.map(g => `<tr><td>${new Date(g.date).toLocaleDateString('en-GB')}</td><td>${g.type}</td><td>${Number(g.amount).toLocaleString()}</td></tr>`).join('')}
      </table>
      <div class="total">Total Giving: GHC ${total.toLocaleString()}</div>
      <div style="margin-top:40px; border-top:1px solid #eee; padding-top:20px; font-size:11px; color:#999; text-align:center">
        This is an official giving statement from ChurchesOS. Thank you for your faithful giving.
      </div>
    </body>
    </html>
  `
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Giving-Statement-${member.name}-${new Date().getFullYear()}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export default function MemberPortalPage() {
  const [member, setMember] = useState(getMemberSession)
  const [tab, setTab] = useState('home')
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [prayerText, setPrayerText] = useState('')
  const [prayerSubmitted, setPrayerSubmitted] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [registering, setRegistering] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const fileRef = useRef()

  // Redirect if not logged in
  useEffect(() => {
    if (!member) window.location.href = '/member-login'
  }, [member])

  // Load notifications from announcements
  useEffect(() => {
    const announcements = getChurchData('cos_announcements')
    setNotifications(announcements.slice(0, 5))
  }, [])

  if (!member) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFF' }}>
      <div className="text-center">
        <Loader size={32} className="animate-spin mx-auto mb-3" style={{ color: '#1B4FD8' }} />
        <p className="text-gray-400 text-sm">Loading your portal...</p>
      </div>
    </div>
  )

  // Get dynamic data
  const sermons = getChurchData('cos_sermons')
  const events = getChurchData('cos_events').filter(e => e.status === 'Upcoming')
  const announcements = getChurchData('cos_announcements')
  const allRequests = getChurchData('cos_prayer_requests')
  const myPrayers = allRequests.filter(r => r.phone === member.phone || r.name === member.name)

  // Get my giving from finance
  const allTransactions = getChurchData('cos_finance_db')
  const myGiving = allTransactions.filter(t => t.memberPhone === member.phone || t.memberName === member.name || t.type === 'income')

  // My attendance
  const allAttendance = getChurchData('cos_attendance_db')
  const myAttendance = allAttendance.slice(0, 10)

  const totalGiving = myGiving.reduce((s, g) => s + Number(g.amount || 0), 0)

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => {
        setPhotoPreview(ev.target.result)
        setProfileForm(p => ({ ...p, photo: ev.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const startEdit = () => {
    setProfileForm({ ...member })
    setPhotoPreview(member.photo)
    setEditing(true)
  }

  const saveProfile = () => {
    setSavingProfile(true)
    setTimeout(() => {
      const updated = { ...member, ...profileForm, photo: photoPreview || member.photo }
      localStorage.setItem('cos_member_session', JSON.stringify(updated))
      // Also update in accounts
      const accounts = JSON.parse(localStorage.getItem('cos_member_accounts') || '[]')
      const updatedAccounts = accounts.map(a => a.id === updated.id ? updated : a)
      localStorage.setItem('cos_member_accounts', JSON.stringify(updatedAccounts))
      setMember(updated)
      setSavingProfile(false)
      setProfileSaved(true)
      setEditing(false)
      setTimeout(() => setProfileSaved(false), 2000)
    }, 1000)
  }

  const submitPrayer = () => {
    if (!prayerText) return
    const requests = getChurchData('cos_prayer_requests')
    const newRequest = {
      id: Date.now(),
      name: member.name,
      phone: member.phone,
      request: prayerText,
      status: 'Pending',
      date: new Date().toISOString(),
    }
    localStorage.setItem('cos_prayer_requests', JSON.stringify([...requests, newRequest]))
    setPrayerSubmitted(true)
    setPrayerText('')
  }

  const registerForEvent = (eventId) => {
    setRegistering(eventId)
    const registrations = JSON.parse(localStorage.getItem('cos_event_registrations') || '[]')
    registrations.push({ eventId, memberId: member.id, memberName: member.name, memberPhone: member.phone, date: new Date().toISOString() })
    localStorage.setItem('cos_event_registrations', JSON.stringify(registrations))
    setTimeout(() => setRegistering(null), 1500)
  }

  const isRegistered = (eventId) => {
    const regs = JSON.parse(localStorage.getItem('cos_event_registrations') || '[]')
    return regs.some(r => r.eventId === eventId && r.memberId === member.id)
  }

  const logout = () => {
    localStorage.removeItem('cos_member_session')
    window.location.href = '/member-login'
  }

  const unreadCount = notifications.length

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'giving', label: 'Giving', icon: DollarSign },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'sermons', label: 'Sermons', icon: BookOpen },
    { id: 'prayer', label: 'Prayer', icon: Heart },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      {/* Top Header */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1B4FD8' }}>C</div>
            <div>
              <p className="text-xs font-bold text-gray-800">ChurchesOS</p>
              <p className="text-xs text-gray-400">Member Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#DC2626', fontSize: 9 }}>
                  {unreadCount}
                </div>
              )}
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: member.photo ? 'transparent' : '#1B4FD8' }}>
              {member.photo ? <img src={member.photo} alt="" className="w-full h-full object-cover" /> : member.name?.split(' ').map(w => w[0]).slice(0,2).join('')}
            </div>
            <button onClick={logout} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <LogOut size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowNotifications(false)}>
          <div className="absolute top-16 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="p-4">
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{n.date ? new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-24 pt-5">

        {/* HOME */}
        {tab === 'home' && (
          <div className="space-y-5 fade-in">
            {/* Welcome Card */}
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1B4FD8 0%, #7C3AED 100%)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ background: member.photo ? 'transparent' : 'rgba(255,255,255,0.2)' }}>
                  {member.photo ? <img src={member.photo} alt="" className="w-full h-full object-cover" /> : member.name?.split(' ').map(w => w[0]).slice(0,2).join('')}
                </div>
                <div>
                  <p className="text-sm opacity-80">Welcome back 👋</p>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>{member.name}</h2>
                  <p className="text-sm opacity-70">{member.memberId || 'Member'} {member.ministry ? '• ' + member.ministry : ''}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div className="text-center">
                  <p className="text-2xl font-bold">{myAttendance.filter(a => a.members?.some(m => m.name === member.name && m.status === 'present')).length}</p>
                  <p className="text-xs opacity-70">Services</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">GHC {totalGiving.toLocaleString()}</p>
                  <p className="text-xs opacity-70">Total Giving</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{myPrayers.length}</p>
                  <p className="text-xs opacity-70">Prayers</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'My Profile', icon: User, color: '#1B4FD8', tab: 'profile' },
                { label: 'My Giving', icon: DollarSign, color: '#059669', tab: 'giving' },
                { label: 'Events', icon: Calendar, color: '#7C3AED', tab: 'events' },
                { label: 'Sermons', icon: BookOpen, color: '#F59E0B', tab: 'sermons' },
                { label: 'Prayer', icon: Heart, color: '#EC4899', tab: 'prayer' },
                { label: 'Cell Group', icon: Users, color: '#0891B2', tab: 'profile' },
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
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Church Announcements</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{announcements.length}</span>
              </div>
              {announcements.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No announcements yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {announcements.slice(0, 3).map((a, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                          <Bell size={14} style={{ color: '#1B4FD8' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            {events.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Upcoming Events</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {events.slice(0, 3).map(e => (
                    <div key={e.id} className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#EDE9FE' }}>📅</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                        <p className="text-xs text-gray-400">{e.date ? new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} {e.time ? '• ' + e.time : ''}</p>
                      </div>
                      <button onClick={() => setTab('events')} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 fade-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>My Profile</h3>
                {!editing ? (
                  <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                    <Edit size={13} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={saveProfile} disabled={savingProfile}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                      style={{ background: profileSaved ? '#059669' : '#1B4FD8' }}>
                      {savingProfile ? <Loader size={12} className="animate-spin" /> : <Save size={13} />}
                      {profileSaved ? 'Saved!' : savingProfile ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600">
                      <X size={13} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Photo */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gray-50">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ background: (photoPreview || member.photo) ? 'transparent' : '#1B4FD8' }}>
                  {(photoPreview || member.photo) ? <img src={photoPreview || member.photo} alt="" className="w-full h-full object-cover" /> : member.name?.split(' ').map(w => w[0]).slice(0,2).join('')}
                </div>
                {editing && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    <button onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 transition">
                      <Upload size={14} /> Upload Photo
                    </button>
                  </div>
                )}
                {!editing && (
                  <div>
                    <p className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Cormorant Garamond' }}>{member.name}</p>
                    <p className="text-xs text-gray-400">{member.memberId || 'Member'}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>Active Member</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', field: 'name', type: 'text' },
                  { label: 'Phone Number', field: 'phone', type: 'tel' },
                  { label: 'Email Address', field: 'email', type: 'email' },
                  { label: 'Home Address', field: 'address', type: 'text' },
                  { label: 'Area / Location', field: 'location', type: 'text' },
                  { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
                  { label: 'Gender', field: 'gender', type: 'select', options: ['Male', 'Female'] },
                  { label: 'Marital Status', field: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
                  { label: 'Occupation', field: 'occupation', type: 'text' },
                  { label: 'Emergency Contact', field: 'emergencyName', type: 'text' },
                  { label: 'Emergency Phone', field: 'emergencyPhone', type: 'tel' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                    {editing ? (
                      f.type === 'select' ? (
                        <select value={profileForm?.[f.field] || ''} onChange={e => setProfileForm(p => ({...p, [f.field]: e.target.value}))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                          <option value="">Select</option>
                          {f.options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} value={profileForm?.[f.field] || ''} onChange={e => setProfileForm(p => ({...p, [f.field]: e.target.value}))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                      )
                    ) : (
                      <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-800">{member[f.field] || '—'}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Church Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Church Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Member ID', value: member.memberId || '—' },
                  { label: 'Ministry', value: member.ministry || '—' },
                  { label: 'Cell Group', value: member.cellGroup || '—' },
                  { label: 'Baptism Status', value: member.baptismStatus || '—' },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GIVING */}
        {tab === 'giving' && (
          <div className="space-y-4 fade-in">
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)' }}>
              <p className="text-sm opacity-80 mb-1">Total Giving — {new Date().getFullYear()}</p>
              <p className="text-4xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>GHC {totalGiving.toLocaleString()}</p>
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
                {['Tithe', 'Offering', 'Pledge', 'Donation'].map(type => {
                  const amount = myGiving.filter(g => g.type === type).reduce((s, g) => s + Number(g.amount || 0), 0)
                  return amount > 0 ? (
                    <div key={type}>
                      <p className="text-lg font-bold">GHC {amount.toLocaleString()}</p>
                      <p className="text-xs opacity-70">{type}</p>
                    </div>
                  ) : null
                })}
              </div>
            </div>

            <button onClick={() => downloadGivingStatement(member, myGiving)}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: '#059669' }}>
              <Download size={15} /> Download Giving Statement (PDF)
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Giving History</h3>
              </div>
              {myGiving.length === 0 ? (
                <div className="py-12 text-center">
                  <DollarSign size={28} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No giving records yet</p>
                  <p className="text-xs text-gray-300 mt-1">Your contributions will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {myGiving.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                          <DollarSign size={16} style={{ color: '#059669' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{g.type}</p>
                          <p className="text-xs text-gray-400">{g.date ? new Date(g.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold" style={{ color: '#059669' }}>GHC {Number(g.amount).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EVENTS */}
        {tab === 'events' && (
          <div className="space-y-4 fade-in">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond' }}>Upcoming Events</h2>
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">📅</div>
                <p className="font-bold text-gray-700 mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>No upcoming events</p>
                <p className="text-sm text-gray-400">Check back soon for new events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(e => {
                  const registered = isRegistered(e.id)
                  return (
                    <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                          style={{ background: '#1B4FD8' }}>
                          <p className="text-xs font-bold">{e.date ? new Date(e.date).toLocaleDateString('en-GB', { month: 'short' }) : ''}</p>
                          <p className="text-xl font-bold leading-none">{e.date ? new Date(e.date).getDate() : ''}</p>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{e.title}</h3>
                          <p className="text-xs text-gray-500 mb-1">{e.type}</p>
                          {e.time && <p className="text-xs text-gray-400">⏰ {e.time}</p>}
                          {e.location && <p className="text-xs text-gray-400">📍 {e.location}</p>}
                          {e.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{e.description}</p>}
                        </div>
                      </div>
                      <button onClick={() => !registered && registerForEvent(e.id)}
                        disabled={registered || registering === e.id}
                        className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                        style={{ background: registered ? '#DCFCE7' : '#1B4FD8', color: registered ? '#166534' : 'white' }}>
                        {registering === e.id ? <><Loader size={14} className="animate-spin" /> Registering...</> :
                         registered ? <><CheckCircle size={14} /> Registered</> : 'Register for This Event'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* SERMONS */}
        {tab === 'sermons' && (
          <div className="space-y-4 fade-in">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond' }}>Sermon Archive</h2>
            {sermons.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">🎙️</div>
                <p className="font-bold text-gray-700 mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>No sermons uploaded yet</p>
                <p className="text-sm text-gray-400">Sermons will appear here when uploaded by your pastor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sermons.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#EDE9FE' }}>📖</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.pastor}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {s.series && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9FE', color: '#5B21B6' }}>{s.series}</span>}
                        {s.duration && <span className="text-xs text-gray-400">{s.duration}</span>}
                        {s.date && <span className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                      </div>
                    </div>
                    {s.youtubeLink && (
                      <a href={s.youtubeLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-xl text-white flex-shrink-0"
                        style={{ background: '#7C3AED' }}>
                        ▶ Listen
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRAYER */}
        {tab === 'prayer' && (
          <div className="space-y-4 fade-in">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond' }}>Prayer Requests</h2>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-1">Submit a Prayer Request</h3>
              <p className="text-xs text-gray-400 mb-4">Your request will be seen by the pastoral team</p>

              {prayerSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-3" style={{ color: '#059669' }} />
                  <p className="font-bold text-gray-800 mb-1">Request Submitted!</p>
                  <p className="text-sm text-gray-400 mb-4">The pastoral team will pray for you.</p>
                  <button onClick={() => setPrayerSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <>
                  <textarea rows={5} value={prayerText} onChange={e => setPrayerText(e.target.value)}
                    placeholder="Share your prayer request here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none mb-3" />
                  <button onClick={submitPrayer} disabled={!prayerText}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: '#EC4899' }}>
                    <Heart size={15} /> Submit Prayer Request
                  </button>
                </>
              )}
            </div>

            {/* My prayer history */}
            {myPrayers.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>My Prayer Requests</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {myPrayers.map(p => (
                    <div key={p.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: p.status === 'Answered' ? '#DCFCE7' : p.status === 'Prayed' ? '#DBEAFE' : '#FEF9C3', color: p.status === 'Answered' ? '#166534' : p.status === 'Prayed' ? '#1E40AF' : '#854D0E' }}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.request}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white">
        <div className="flex items-center max-w-4xl mx-auto">
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
