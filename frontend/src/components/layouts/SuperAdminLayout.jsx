import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Building, DollarSign, ShoppingBag, LogOut, Menu, X, Shield } from 'lucide-react'

const navItems = [
  { label: 'Overview', path: '/super-admin', icon: LayoutDashboard, exact: true },
  { label: 'All Churches', path: '/super-admin/churches', icon: Building },
  { label: 'Vendors', path: '/super-admin/vendors', icon: '🏪' },
  { label: 'Revenue', path: '/super-admin/revenue', icon: DollarSign },
  { label: 'Marketplace', path: '/super-admin/marketplace', icon: ShoppingBag },
]

export default function SuperAdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const Nav = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1B4FD8' }}>
            <span className="text-white font-bold" style={{  }}>C</span>
          </div>
          <div>
            <p className="text-white font-bold" style={{  }}>ChurchesOS</p>
            <div className="flex items-center gap-1">
              <Shield size={9} className="text-yellow-400" />
              <p className="text-yellow-400 text-xs font-medium">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, path, icon: Icon, exact }) => (
          <NavLink key={path} to={path} end={exact} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'nav-item-active' : 'text-white/55 hover:bg-white/10 hover:text-white'}`
            }>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
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
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 text-white/40 hover:bg-white/10 rounded-lg"><X size={18} /></button>
            <Nav />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><Menu size={20} /></button>
          <span className="font-bold" style={{  }}>ChurchesOS Admin</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
