import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, CalendarDays, DollarSign, MessageSquare,
  BookOpen, Eye, Heart, ShoppingBag, BarChart3, Music, Wrench, Receipt, Shield, LogOut, Menu, X,
  CheckSquare, Settings, Home, Bell, Shield
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
  { label: 'Marketplace', path: '/church/marketplace', icon: ShoppingBag },
  { label: 'Cell Groups', path: '/church/cell-groups', icon: Home },
  { label: 'Counselling', path: '/church/counselling', icon: Heart },
  { label: 'Announcements', path: '/church/announcements', icon: Bell },
  { label: 'Volunteers', path: '/church/volunteers', icon: Shield },
  { label: 'Reports', path: '/church/reports', icon: BarChart3 },
  { label: 'Song Library', path: '/church/songs', icon: Music },
  { label: 'Equipment', path: '/church/equipment', icon: Wrench },
  { label: 'Purchases', path: '/church/purchases', icon: Receipt },
  { label: 'Roles & Access', path: '/church/roles', icon: Shield },
]

export default function ChurchLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0,2).join('') || 'PA'

  const Nav = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1B4FD8' }}>
            <span className="text-white font-bold text-base" style={{  }}>C</span>
          </div>
          <div>
            <p className="text-white font-bold leading-tight" style={{  }}>ChurchesOS</p>
            <p className="text-white/40 text-xs">Church Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'nav-item-active' : 'text-white/55 hover:bg-white/10 hover:text-white'}`
            }>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'Church Admin'}</p>
            <p className="text-white/40 text-xs">Administrator</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-white/40 hover:bg-white/10 hover:text-white transition">
          <LogOut size={15} /><span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFF' }}>
      <aside className="hidden lg:flex w-56 flex-col flex-shrink-0" style={{ background: '#0F172A' }}>
        <Nav />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-60 flex flex-col" style={{ background: '#0F172A' }}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:bg-white/10">
              <X size={18} />
            </button>
            <Nav />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-800" style={{  }}>ChurchesOS</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
