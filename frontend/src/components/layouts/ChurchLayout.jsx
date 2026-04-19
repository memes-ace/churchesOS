import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, CalendarDays, DollarSign, MessageSquare, BookOpen, Eye, Heart, ShoppingBag, BarChart3, Music, Wrench, Receipt, UserCheck, Handshake, LogOut, Menu, X, CheckSquare, Bell, Home, UserCog } from 'lucide-react'
import UpgradeModal from '../UpgradeModal'

const navItems = [
  { label: 'Dashboard', path: '/church/dashboard', icon: LayoutDashboard },
  { label: 'Members', path: '/church/members', icon: Users },
  { label: 'Attendance', path: '/church/attendance', icon: CheckSquare },
  { label: 'Finance', path: '/church/finance', icon: DollarSign },
  { label: 'Events', path: '/church/events', icon: CalendarDays },
  { label: 'Communication', path: '/church/communication', icon: MessageSquare },
  { label: 'Sermons', path: '/church/sermons', icon: BookOpen },
  { label: 'Visitors', path: '/church/visitors', icon: Eye },
  { label: 'Prayer Requests', path: '/church/prayer', icon: Heart },
  { label: 'Ministries', path: '/church/ministries', icon: Users },
  { label: 'Cell Groups', path: '/church/cell-groups', icon: Home },
  { label: 'Counselling', path: '/church/counselling', icon: Handshake },
  { label: 'Announcements', path: '/church/announcements', icon: Bell },
  { label: 'Volunteers', path: '/church/volunteers', icon: UserCheck },
  { label: 'Marketplace', path: '/church/marketplace', icon: ShoppingBag },
  { label: 'Song Library', path: '/church/songs', icon: Music },
  { label: 'Equipment', path: '/church/equipment', icon: Wrench },
  { label: 'Purchases', path: '/church/purchases', icon: Receipt },
  { label: 'Reports', path: '/church/reports', icon: BarChart3 },
  { label: 'Roles & Access', path: '/church/roles', icon: UserCog },
]

export default function ChurchLayout() {
  const [open, setOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0,2).join('') || 'PA'

  // Fetch latest church plan from API on load
  useEffect(() => {
    if (user?.church_id) {
      fetch(`/api/churches/${user.church_id}/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('cos_token')}` }
      })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const updated = { 
            ...user, 
            church_plan: data.plan || user.church_plan, 
            church_status: data.status || user.church_status,
            sender_id: data.sender_id || user.sender_id || 'Tabscrow'
          }
          localStorage.setItem('cos_user', JSON.stringify(updated))
          console.log('Stored sender_id:', updated.sender_id)
        }
      })
      .catch(() => {})
    }
  }, [])

  const [enabledFeatures, setEnabledFeatures] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('cos_token') || ''
    const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
    const plan = (user.church_plan || 'trial').toLowerCase()

    fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(s => {
        if (plan === 'trial') {
          // trial gets only basic features
          setEnabledFeatures(['Members', 'Attendance', 'Prayer Requests', 'Announcements'])
          return
        }
        const planKey = plan + 'Plan'
        const features = s[planKey]?.features || s[plan + 'PlanFeatures'] || null
        setEnabledFeatures(features)
      })
      .catch(() => {
        // fallback based on plan name
        const defaults = {
          trial: ['Members', 'Attendance', 'Prayer Requests', 'Announcements'],
          free: ['Members', 'Attendance', 'Prayer Requests', 'Announcements'],
          starter: ['Members', 'Attendance', 'Finance', 'Events', 'Sermons', 'Visitors', 'Prayer Requests', 'Announcements', 'Communication'],
          growth: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Song Library', 'Reports'],
          enterprise: null, // all features
        }
        setEnabledFeatures(defaults[plan] || null)
      })
  }, [])

  const filteredNav = navItems.map(item => {
    const key = item.label // use label to match plan features
    const alwaysAllowed = ['Dashboard']
    if (alwaysAllowed.includes(item.label)) return { ...item, locked: false }
    if (!enabledFeatures) return { ...item, locked: false }
    const isEnabled = enabledFeatures.some(f => 
      f.toLowerCase() === item.label.toLowerCase() ||
      item.path.includes(f.toLowerCase().replace(/\s+/g, '-'))
    )
    return { ...item, locked: !isEnabled }
  })
  const navRef = useRef(null)

  const handleNavClick = () => {
    // Save scroll position before navigation
    const scrollTop = navRef.current?.scrollTop || 0
    setOpen(false)
    // Restore scroll position after navigation
    setTimeout(() => {
      if (navRef.current) navRef.current.scrollTop = scrollTop
    }, 0)
  }

  const Nav = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1B4FD8' }}>
            <span className="text-white font-bold text-base">C</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">ChurchesOS</p>
            <p className="text-white/40 text-xs">Church Admin</p>
          </div>
        </div>
      </div>

      <nav ref={navRef} className="flex-1 px-2 py-3 overflow-y-auto" style={{ scrollbarWidth: 'none', overflowAnchor: 'none' }}>
        {filteredNav.map(({ label, path, icon: Icon, locked }) => (
          locked ? (
            <button key={path} onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium mb-0.5 w-full text-left transition text-white/25 hover:text-white/40">
              <Icon size={15} className="flex-shrink-0 opacity-40" />
              <span className="truncate flex-1">{label}</span>
              <span className="text-white/20 text-xs">🔒</span>
            </button>
          ) : (
            <NavLink key={path} to={path} onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium mb-0.5 transition ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                }`
              }>
              <Icon size={15} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          )
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'Church Admin'}</p>
            <p className="text-white/40 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        {/* Plan Badge + Upgrade */}
        {user && (
          <div className="mb-2 px-1">
            <div className="flex items-center justify-between px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="text-white/40 text-xs">Current Plan</p>
                <p className="text-white text-xs font-bold capitalize">{user.church_plan || 'trial'}</p>
              </div>
              {(user.church_plan || 'trial') !== 'enterprise' && (
                <button onClick={() => setShowUpgrade(true)}
                  className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: '#1B4FD8', color: 'white' }}>
                  Upgrade
                </button>
              )}
            </div>
          </div>
        )}
        <button onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-white/40 hover:bg-white/10 hover:text-white transition">
          <LogOut size={14} /><span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFF' }}>
      <aside className="hidden lg:flex w-56 flex-col flex-shrink-0 overflow-hidden" style={{ background: '#0F172A' }}>
        <Nav />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={handleNavClick} />
          <aside className="relative w-60 flex flex-col flex-shrink-0 overflow-hidden" style={{ background: '#0F172A' }}>
            <button onClick={handleNavClick} className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:bg-white/10 z-10">
              <X size={18} />
            </button>
            <Nav />
          </aside>
        </div>
      )}

      {showUpgrade && <UpgradeModal user={user} onClose={() => setShowUpgrade(false)} />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-800 text-sm">ChurchesOS</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
