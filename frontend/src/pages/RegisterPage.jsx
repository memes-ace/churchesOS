import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Upload, Check } from 'lucide-react'

const steps = ['Church Info', 'Your Details', 'Branding', 'Done']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [form, setForm] = useState({
    churchName: '', location: '', denomination: '', serviceTime: '', phone: '',
    name: '', email: '', password: '', title: '',
    logo: null, primaryColor: '#1B4FD8', tagline: ''
  })
  const navigate = useNavigate()
  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (file) { update('logo', file); setLogoPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, churchName: form.churchName, location: form.location })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      localStorage.setItem('cos_token', data.access_token)
      localStorage.setItem('cos_user', JSON.stringify(data.user))
      setStep(3)
      setTimeout(() => navigate('/church/dashboard'), 2000)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8FAFF' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#1B4FD8' }}>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond' }}>C</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Register Your Church</h1>
          <p className="text-gray-500 text-sm mt-1">Get started free — no credit card needed</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: i <= step ? '#1B4FD8' : '#E2E8F0', color: i <= step ? 'white' : '#94A3B8' }}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? '#1B4FD8' : '#94A3B8' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="w-6 h-0.5 rounded" style={{ background: i < step ? '#1B4FD8' : '#E2E8F0' }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Tell us about your church</h2>
              {[
                { label: 'Church Name', field: 'churchName', placeholder: 'Your church name', type: 'text' },
                { label: 'City / Location', field: 'location', placeholder: 'e.g. Accra, Ghana', type: 'text' },
                { label: 'Phone Number', field: 'phone', placeholder: '+233 24 000 0000', type: 'tel' },
                { label: 'Service Time', field: 'serviceTime', placeholder: 'e.g. Sundays 9AM and 11AM', type: 'text' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                  <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Denomination</label>
                <select value={form.denomination} onChange={e => update('denomination', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select denomination</option>
                  {['Pentecostal','Charismatic','Baptist','Methodist','Anglican','Catholic','Assemblies of God','Church of Pentecost','Presbyterian','Non-denominational','Other'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={() => setStep(1)} disabled={!form.churchName || !form.location}
                className="w-full py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Your account details</h2>
              {[
                { label: 'Your Full Name', field: 'name', placeholder: '', type: 'text' },
                { label: 'Your Title', field: 'title', placeholder: 'e.g. Pastor, Reverend, Bishop', type: 'text' },
                { label: 'Email Address', field: 'email', placeholder: 'pastor@church.org', type: 'email' },
                { label: 'Password', field: 'password', placeholder: 'Min. 8 characters', type: 'password' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                  <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">Back</button>
                <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.password}
                  className="flex-1 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>Brand your church portal</h2>
              <p className="text-xs text-gray-400 mb-5">Your members will see your logo and colours on their portal</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Church Logo</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-blue-400"
                  style={{ borderColor: logoPreview ? '#1B4FD8' : '#CBD5E1', background: logoPreview ? '#EEF2FF' : '#F8FAFF' }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-24 object-contain rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <Upload size={28} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">Click to upload logo</p>
                      <p className="text-xs text-gray-400">PNG or JPG, max 2MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Church Tagline</label>
                <input type="text" value={form.tagline} onChange={e => update('tagline', e.target.value)}
                  placeholder="e.g. Transforming Lives, Building Nations"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Church Brand Colour</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)}
                    className="w-14 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <div className="flex gap-2">
                    {['#1B4FD8','#7C3AED','#059669','#DC2626','#D97706','#0891B2'].map(c => (
                      <button key={c} onClick={() => update('primaryColor', c)}
                        className="w-7 h-7 rounded-full border-2 transition-all"
                        style={{ background: c, borderColor: form.primaryColor === c ? '#0F172A' : 'transparent' }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  {loading ? <><Loader size={16} className="animate-spin" /> Creating...</> : 'Launch My Church'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DBEAFE' }}>
                <Check size={32} style={{ color: '#1B4FD8' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>You are all set!</h2>
              <p className="text-gray-500 text-sm mb-2">Your church is live on ChurchesOS.</p>
              <p className="text-gray-400 text-xs">Redirecting to your dashboard...</p>
              <div className="mt-4 w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </div>

        {step < 3 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered? <a href="/login" className="font-medium" style={{ color: '#1B4FD8' }}>Sign in</a>
          </p>
        )}
      </div>
    </div>
  )
}
