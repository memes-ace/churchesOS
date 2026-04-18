import { useState } from 'react'
import { Eye, EyeOff, Loader, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SuperLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError('Invalid credentials. Access denied.')
        setLoading(false)
        return
      }

      if (data.user.role !== 'super_admin') {
        setError('Access denied. This portal is for Super Admin only.')
        setLoading(false)
        return
      }

      login(data.user, data.access_token)
      window.location.href = '/super-admin'
    } catch(err) {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}>
      
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" style={{ background: '#1B4FD8' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ background: '#7C3AED' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #1B4FD8, #7C3AED)' }}>
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>
            Super Admin Portal
          </h1>
          <p className="text-white/50 text-sm">ChurchesOS Platform Control Centre</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                Admin Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@churchesos.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                required />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm pr-12"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                  required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1B4FD8, #7C3AED)' }}>
              {loading
                ? <><Loader size={16} className="animate-spin" /> Authenticating...</>
                : <><Shield size={16} /> Access Admin Portal</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs">
              🔒 Restricted access — Authorised personnel only
            </p>
            <a href="/login" className="text-white/40 text-xs hover:text-white/70 transition mt-1 block">
              ← Back to Church Login
            </a>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          ChurchesOS © {new Date().getFullYear()} — Platform Administration
        </p>
      </div>
    </div>
  )
}
