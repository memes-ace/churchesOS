import { useState } from 'react'
import { ArrowLeft, Mail, Shield } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send code')
      setStep(2)
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed')
      setSuccess(true)
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#1B4FD8' }}>
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond" }}>
            Reset Password
          </h1>
          <p className="text-white/50 text-sm mt-1">ChurchesOS Account Recovery</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {success ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-white/60 text-sm mb-6">Your password has been updated successfully.</p>
              <a href="/login" className="block w-full py-3 rounded-xl text-white text-sm font-semibold text-center"
                style={{ background: '#1B4FD8' }}>
                Back to Login
              </a>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-white/70 text-sm mb-4">
                Enter your email address and we will send you a reset code.
              </p>
              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                style={{ background: '#1B4FD8' }}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              <a href="/login" className="flex items-center justify-center gap-2 text-white/40 text-sm hover:text-white/70 transition mt-2">
                <ArrowLeft size={14} /> Back to Login
              </a>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-white/70 text-sm mb-4">
                Enter the 6-digit code sent to <strong className="text-white">{email}</strong> and your new password.
              </p>
              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Reset Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                  placeholder="6-digit code" required maxLength={6}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm text-center tracking-widest font-bold text-lg"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters" required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                style={{ background: '#1B4FD8' }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button type="button" onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 w-full text-white/40 text-sm hover:text-white/70 transition">
                <ArrowLeft size={14} /> Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
