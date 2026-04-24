import { useState } from 'react'
import { Clock, Phone, Mail, LogOut, Copy, Check } from 'lucide-react'

export default function PendingApprovalPage({ user }) {
  const [copied, setCopied] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('cos_token')
    localStorage.removeItem('cos_user')
    window.location.href = '/login'
  }

  const copyMomo = () => {
    navigator.clipboard.writeText('0599001992')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A6E 100%)' }}>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: 'Cormorant Garamond' }}>
          Churches<span style={{ color: '#D4A853' }}>OS</span>
        </h1>
        <p className="text-white/40 text-sm">Church Management System</p>
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 p-8 mb-4 text-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}>

          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)' }}>
            <Clock size={36} style={{ color: '#F59E0B' }} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond' }}>
            Awaiting Approval
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Hi <strong className="text-white">{user?.name || 'Pastor'}</strong>, your church <strong className="text-white">{user?.church_name}</strong> has been registered successfully.
            <br /><br />
            To activate your account, please make payment via Mobile Money and send us your transaction ID.
          </p>

          <div className="rounded-2xl p-4 mb-4 text-left"
            style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.3)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4A853' }}>
              📱 Payment Details
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">MoMo Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">0599 001 992</span>
                  <button onClick={copyMomo} className="p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {copied ? <Check size={12} style={{ color: '#34D399' }} /> : <Copy size={12} className="text-white/50" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Account Name</span>
                <span className="text-white text-sm">Tabscrow Company Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Starter Plan</span>
                <span className="text-white text-sm font-bold">GHC 150/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Growth Plan</span>
                <span className="text-white text-sm font-bold">GHC 350/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Enterprise Plan</span>
                <span className="text-white text-sm font-bold">GHC 700/month</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">After Payment — Contact Us</p>
            <div className="space-y-2">
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
        </div>

        <div className="rounded-2xl border border-white/08 p-5 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">How It Works</p>
          {[
            { num: '1', text: 'Send payment to the MoMo number above' },
            { num: '2', text: 'WhatsApp or email us your transaction ID and church name' },
            { num: '3', text: 'We verify and activate your account within 2 hours' },
            { num: '4', text: 'Login at churches-os.vercel.app/login and start managing your church!' },
          ].map(s => (
            <div key={s.num} className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: '#1B4FD8' }}>
                {s.num}
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white/60 text-sm hover:text-white transition"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <LogOut size={15} /> Sign Out
        </button>

        <p className="text-center text-white/20 text-xs mt-4">
          Built by <span style={{ color: '#D4A853' }}>Tabscrow</span>
        </p>
      </div>
    </div>
  )
}
