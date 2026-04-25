import { LogOut, Phone, Mail } from 'lucide-react'

export default function SuspendedPage() {
  const handleLogout = () => {
    localStorage.removeItem('cos_token')
    localStorage.removeItem('cos_user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #7F1D1D 100%)' }}>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond' }}>
          Churches<span style={{ color: '#D4A853' }}>OS</span>
        </h1>
      </div>
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 p-8 text-center"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(220,38,38,0.15)', border: '2px solid rgba(220,38,38,0.3)' }}>
          <span style={{ fontSize: '2rem' }}>🚫</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
          Account Suspended
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Your church account has been suspended. This may be due to an outstanding payment or a policy violation.
          Please contact us to resolve this immediately.
        </p>
        <div className="rounded-2xl p-4 mb-5 text-left"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Contact Support</p>
          <div className="space-y-3">
            <a href="https://wa.me/233599001992" target="_blank" rel="noreferrer"
              className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition">
              <Phone size={14} style={{ color: '#34D399' }} />
              WhatsApp: 0599 001 992
            </a>
            <a href="mailto:admin@churchesos.com"
              className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition">
              <Mail size={14} style={{ color: '#60A5FA' }} />
              admin@churchesos.com
            </a>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white/60 text-sm hover:text-white transition"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )
}
