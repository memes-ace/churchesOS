import { useState } from 'react'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
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
        setError(data.message || 'Invalid email or password')
        setLoading(false)
        return
      }

      if (data.access_token && data.user) {
        // Fix super admin role
        if (data.user.email === 'churchesos97@gmail.com' || data.user.email === 'admin@churchesos.com') {
          data.user.role = 'super_admin'
        }
        // Save via AuthContext
        login(data.user, data.access_token)
        // Redirect
        if (data.user.role === 'super_admin') {
          window.location.href = '/super-admin'
        } else {
          window.location.href = '/church/dashboard'
        }
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0F172A' }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1B4FD8 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#1B4FD8', border: '2px solid rgba(255,255,255,0.3)' }}>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond' }}>C</span>
          </div>
          <span className="text-white text-xl font-semibold" style={{ fontFamily: 'Cormorant Garamond' }}>ChurchesOS</span>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
            The Complete Operating System For Every Church
          </h2>
          <p className="text-white/60 text-sm mb-8">Run your church. Grow your ministry. Built for Africa.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Member Management', icon: '👥' },
              { label: 'Finance Tracking', icon: '📊' },
              { label: 'Event Planning', icon: '📅' },
              { label: 'SMS Communication', icon: '💬' },
              { label: 'Sermon Archive', icon: '🎙️' },
              { label: 'Church Marketplace', icon: '🛒' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-lg">{f.icon}</span>
                <span className="text-white/80 text-xs font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">2025 ChurchesOS. Built for African Churches.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F8FAFF' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#1B4FD8' }}>
              <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>C</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to your ChurchesOS account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                placeholder="pastor@church.org" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm pr-12"
                  placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
              style={{ background: loading ? '#93B4FB' : '#1B4FD8' }}>
              {loading ? <><Loader size={16} className="animate-spin" /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New church? <a href="/register" className="font-medium" style={{ color: '#1B4FD8' }}>Register your church</a>
          </p>

          <div className="mt-8 p-4 rounded-xl border" style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#1B4FD8' }}>Demo Accounts</p>
            <p className="text-xs text-gray-600">Super Admin: churchesos97@gmail.com / Arielle@2025</p>
            <p className="text-xs text-gray-600">Church Admin: use credentials provided by your admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
