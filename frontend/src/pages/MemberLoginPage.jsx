import { useState } from 'react'
import { Eye, EyeOff, Loader, Phone } from 'lucide-react'

export default function MemberLoginPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ phone: '', password: '', name: '', email: '', memberId: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleLogin = async () => {
    if (!form.phone || !form.password) { setError('Please enter your phone and password'); return }
    setLoading(true); setError('')
    setTimeout(() => {
      // Check against registered members
      const members = JSON.parse(localStorage.getItem('cos_member_accounts') || '[]')
      const member = members.find(m => m.phone === form.phone && m.password === form.password)
      if (member) {
        localStorage.setItem('cos_member_session', JSON.stringify(member))
        window.location.href = '/member-portal'
      } else {
        setError('Invalid phone number or password. Contact your church admin.')
      }
      setLoading(false)
    }, 1000)
  }

  const handleRegister = async () => {
    if (!form.name || !form.phone || !form.password) { setError('Please fill all required fields'); return }
    setLoading(true); setError('')
    setTimeout(() => {
      const members = JSON.parse(localStorage.getItem('cos_member_accounts') || '[]')
      if (members.find(m => m.phone === form.phone)) {
        setError('An account with this phone number already exists')
        setLoading(false); return
      }
      const newMember = {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        email: form.email,
        memberId: form.memberId,
        password: form.password,
        photo: null,
        joinedPortal: new Date().toISOString(),
      }
      localStorage.setItem('cos_member_accounts', JSON.stringify([...members, newMember]))
      localStorage.setItem('cos_member_session', JSON.stringify(newMember))
      window.location.href = '/member-portal'
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1B4FD8 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <span className="text-white text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>C</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>Member Portal</h1>
          <p className="text-white/60 text-sm">Your personal church dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className="flex-1 py-4 text-sm font-semibold capitalize transition"
                style={{ color: tab === t ? '#1B4FD8' : '#6B7280', borderBottom: tab === t ? '2px solid #1B4FD8' : '2px solid transparent' }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+233 24 000 0000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
              </div>
            </div>

            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Member ID (optional)</label>
                  <input type="text" value={form.memberId} onChange={e => update('memberId', e.target.value)}
                    placeholder="e.g. GCI-001 (ask your church admin)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#1B4FD8' }}>
              {loading ? <><Loader size={15} className="animate-spin" /> Please wait...</> : tab === 'login' ? 'Sign In to Portal' : 'Create My Account'}
            </button>

            {tab === 'login' && (
              <p className="text-center text-xs text-gray-400">
                Don't have an account? <button onClick={() => setTab('register')} className="font-medium" style={{ color: '#1B4FD8' }}>Create one</button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">Powered by ChurchesOS</p>
      </div>
    </div>
  )
}
