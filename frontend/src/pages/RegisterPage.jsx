import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Check, Copy, Phone, Mail } from 'lucide-react'

const steps = ['Church Info', 'Your Details', 'Create Account', 'Make Payment', 'Done']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('growth')
  const [plans, setPlans] = useState([
    { key: 'starter', name: 'Starter', price: 'GHC 200', desc: 'Up to 100 members' },
    { key: 'growth', name: 'Growth', price: 'GHC 459', desc: 'Up to 500 members', popular: true },
    { key: 'enterprise', name: 'Enterprise', price: 'GHC 859', desc: 'Unlimited members' },
  ])
  const [momoNumber, setMomoNumber] = useState('0599 001 992')
  const [momoName, setMomoName] = useState('Tabscrow Company Limited')
  const [whatsapp, setWhatsapp] = useState('233599001992')
  const [contactEmail, setContactEmail] = useState('admin@churchesos.com')
  const [form, setForm] = useState({
    churchName: '', location: '', denomination: '', serviceTime: '', phone: '',
    name: '', email: '', password: '', confirmPassword: '',
    primaryColor: '#1B4FD8', tagline: ''
  })
  const [registeredUser, setRegisteredUser] = useState(null)
  const navigate = useNavigate()
  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  useEffect(() => {
    // Fetch live prices and contact details
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(s => {
        if (s) {
          setPlans([
            { key: 'starter', name: 'Starter', price: `GHC ${s.starterPlan?.price || s.starterPrice || 200}`, desc: 'Up to 100 members' },
            { key: 'growth', name: 'Growth', price: `GHC ${s.growthPlan?.price || s.growthPrice || 459}`, desc: 'Up to 500 members', popular: true },
            { key: 'enterprise', name: 'Enterprise', price: `GHC ${s.enterprisePlan?.price || s.enterprisePrice || 859}`, desc: 'Unlimited members' },
          ])
          if (s.landing_momo_number) setMomoNumber(s.landing_momo_number)
          if (s.landing_momo_name) setMomoName(s.landing_momo_name)
          if (s.landing_whatsapp) setWhatsapp(s.landing_whatsapp)
          if (s.landing_email) setContactEmail(s.landing_email)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          churchName: form.churchName,
          location: form.location,
          denomination: form.denomination,
          phone: form.phone,
          tagline: form.tagline,
          primaryColor: form.primaryColor,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      localStorage.setItem('cos_token', data.access_token)
      localStorage.setItem('cos_user', JSON.stringify(data.user))
      setRegisteredUser(data.user)
      setStep(3) // Go to payment step
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const copyMomo = () => {
    navigator.clipboard.writeText(momoNumber.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedPlanData = plans.find(p => p.key === selectedPlan)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A6E 100%)' }}>

      {/* Logo */}
      <div className="mb-8 text-center">
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond' }}>
            Churches<span style={{ color: '#D4A853' }}>OS</span>
          </h1>
        </a>
        <p className="text-white/40 text-xs mt-1">Church Management System</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: i < step ? '#059669' : i === step ? '#1B4FD8' : 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs whitespace-nowrap"
                style={{ color: i === step ? 'white' : i < step ? '#34D399' : 'rgba(255,255,255,0.3)' }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        {/* STEP 0 - Church Info */}
        {step === 0 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Church Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Church Name *</label>
                <input type="text" value={form.churchName} onChange={e => update('churchName', e.target.value)}
                  placeholder="e.g. Grace Chapel International"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Location / City *</label>
                <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                  placeholder="e.g. Accra, Ghana"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Denomination</label>
                <input type="text" value={form.denomination} onChange={e => update('denomination', e.target.value)}
                  placeholder="e.g. Pentecostal, Catholic, Baptist"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Church Phone</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="e.g. 0244000000"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <button onClick={() => { if (!form.churchName || !form.location) { setError('Church name and location are required'); return; } setError(''); setStep(1) }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: '#1B4FD8' }}>
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 - Admin Details */}
        {step === 1 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Pastor / Admin name"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(0) }}
                  className="px-5 py-3 rounded-xl text-sm text-white/60 border border-white/15">← Back</button>
                <button onClick={() => { if (!form.name || !form.email) { setError('Name and email are required'); return; } setError(''); setStep(2) }}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: '#1B4FD8' }}>
                  Next: Create Account →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 - Password + Plan */}
        {step === 2 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Create Account & Choose Plan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-2">Select Your Plan</label>
                <div className="space-y-2">
                  {plans.map(p => (
                    <div key={p.key} onClick={() => setSelectedPlan(p.key)}
                      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition"
                      style={{
                        background: selectedPlan === p.key ? 'rgba(27,79,216,0.25)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selectedPlan === p.key ? 'rgba(27,79,216,0.6)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: selectedPlan === p.key ? '#1B4FD8' : 'rgba(255,255,255,0.3)' }}>
                          {selectedPlan === p.key && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{p.name} {p.popular && <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ background: '#1B4FD8', color: 'white' }}>Popular</span>}</div>
                          <div className="text-xs text-white/40">{p.desc}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: '#D4A853' }}>{p.price}/mo</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(1) }}
                  className="px-5 py-3 rounded-xl text-sm text-white/60 border border-white/15">← Back</button>
                <button onClick={handleSubmit} disabled={loading || !form.password}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 - Payment */}
        {step === 3 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Make Payment</h2>
            <p className="text-white/50 text-sm mb-5">Your account is ready. Complete payment to activate it.</p>

            {/* Selected Plan */}
            <div className="p-3 rounded-xl mb-5 flex justify-between items-center"
              style={{ background: 'rgba(27,79,216,0.15)', border: '1px solid rgba(27,79,216,0.3)' }}>
              <div>
                <p className="text-xs text-white/50">Selected Plan</p>
                <p className="text-white font-bold">{selectedPlanData?.name}</p>
              </div>
              <p className="font-bold text-lg" style={{ color: '#D4A853' }}>{selectedPlanData?.price}/mo</p>
            </div>

            {/* MoMo Details */}
            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.3)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4A853' }}>📲 Pay via Mobile Money</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">MoMo Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{momoNumber}</span>
                    <button onClick={copyMomo} className="p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {copied ? <Check size={12} style={{ color: '#34D399' }} /> : <Copy size={12} className="text-white/50" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Account Name</span>
                  <span className="text-white text-sm">{momoName}</span>
                </div>
              </div>
            </div>

            {/* What to send */}
            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">After Payment — Send Us:</p>
              {[
                `Church Name: ${form.churchName}`,
                `Plan: ${selectedPlanData?.name} (${selectedPlanData?.price}/mo)`,
                'Your MoMo Transaction ID',
                `Email: ${form.email}`,
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 text-sm" style={{ color: 'rgba(203,213,225,0.8)' }}>
                  <span style={{ color: '#D4A853', flexShrink: 0 }}>•</span> {item}
                </div>
              ))}
            </div>

            {/* Contact buttons */}
            <div className="flex gap-3 mb-4 flex-wrap">
              <a href={`https://wa.me/${whatsapp}?text=Hi, I just registered ${form.churchName} on ChurchesOS. Plan: ${selectedPlanData?.name}. Email: ${form.email}. Transaction ID: `}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399', textDecoration: 'none' }}>
                <Phone size={14} /> WhatsApp Us
              </a>
              <a href={`mailto:${contactEmail}?subject=ChurchesOS Payment - ${form.churchName}&body=Church: ${form.churchName}%0APlan: ${selectedPlanData?.name}%0AEmail: ${form.email}%0ATransaction ID: `}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60A5FA', textDecoration: 'none' }}>
                <Mail size={14} /> Email Us
              </a>
            </div>

            <button onClick={() => navigate('/pending')}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              I have paid — Check Status →
            </button>

            <p className="text-center text-white/30 text-xs mt-3">
              We verify and activate within 2 hours of confirmed payment
            </p>
          </div>
        )}

        {/* Already have account */}
        {step < 3 && (
          <p className="text-center text-white/30 text-xs mt-5">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign in
            </button>
          </p>
        )}

        <p className="text-center text-white/20 text-xs mt-4">
          Built by <span style={{ color: '#D4A853' }}>Tabscrow</span>
        </p>
      </div>
    </div>
  )
}
