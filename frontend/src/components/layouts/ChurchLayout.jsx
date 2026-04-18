import { useState, useRef } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, CalendarDays, DollarSign, MessageSquare, BookOpen,
  Eye, Heart, ShoppingBag, BarChart3, Music, Wrench, Receipt, UserCheck,
  Handshake, LogOut, Menu, X, CheckSquare, Bell, Home, UserCog
} from 'lucide-react'

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
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0,2).join('') || 'PA'

  // Get enabled features for this church from localStorage (set by super admin)
  const getEnabledFeatures = () => {
    try {
      const churchData = JSON.parse(localStorage.getItem('cos_church_features') || 'null')
      return churchData || null // null means all features enabled
    } catch(e) { return null }
  }

  const enabledFeatures = getEnabledFeatures()

  const filteredNav = enabledFeatures
    ? navItems.filter(item => {
        const key = item.path.replace('/church/', '')
        if (key === 'dashboard') return true // always show dashboard
        return enabledFeatures.includes(key)
      })
    : navItems
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
        {filteredNav.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium mb-0.5 transition ${
                isActive ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
              }`
            }>
            <Icon size={15} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
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
