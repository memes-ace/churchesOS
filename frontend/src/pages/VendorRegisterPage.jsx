import { useState } from 'react'
import { vendorsAPI } from '../utils/api'
import { Check, Upload, ChevronRight, Store } from 'lucide-react'

const categories = [
  { id: 'sound', label: 'Sound & Audio', icon: '🎵' },
  { id: 'media', label: 'Media & Printing', icon: '🖨️' },
  { id: 'catering', label: 'Catering & Food', icon: '🍽️' },
  { id: 'transport', label: 'Transport & Logistics', icon: '🚌' },
  { id: 'decor', label: 'Decoration & Events', icon: '🎪' },
  { id: 'instruments', label: 'Musical Instruments', icon: '🎸' },
  { id: 'tech', label: 'Technology & IT', icon: '💻' },
  { id: 'clothing', label: 'Clothing & Uniforms', icon: '👔' },
  { id: 'books', label: 'Books & Resources', icon: '📚' },
  { id: 'other', label: 'Other Services', icon: '✨' },
]

const steps = ['Business Info', 'Contact Details', 'Services', 'Payment Info', 'Done']

const emptyForm = {
  businessName: '', businessType: '', category: '', description: '',
  ownerName: '', ownerPhone: '', ownerEmail: '', whatsapp: '',
  businessAddress: '', city: '', region: '',
  website: '', instagram: '', facebook: '',
  servicesOffered: '', priceRange: '', churchesServed: '',
  momoNumber: '', momoName: '', bankName: '', accountNumber: '', accountName: '',
  logo: null, logoPreview: null,
  agreeToTerms: false, agreeToCommission: false,
}

export default function VendorRegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ ...emptyForm })
  const [submitted, setSubmitted] = useState(false)
  const [refNumber] = useState('VND-' + Date.now().toString().slice(-6))
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (file) {
      update('logo', file)
      const reader = new FileReader()
      reader.onload = ev => update('logoPreview', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // Save via API
    vendors.push({
      id: Date.now(),
      refNumber,
      ...form,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      logo: null,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8FAFF' }}>
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#DCFCE7' }}>
            <Check size={36} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            Thank you for applying to the ChurchesOS Marketplace. Your application is under review and you will be notified within 2-3 business days.
          </p>
          <div className="p-4 rounded-xl mb-5" style={{ background: '#EEF2FF' }}>
            <p className="text-xs text-gray-500 mb-1">Your Reference Number</p>
            <p className="text-xl font-bold font-mono" style={{ color: '#1B4FD8' }}>{refNumber}</p>
          </div>
          <p className="text-xs text-gray-400">Keep this reference number. We will contact you at {form.ownerEmail} once your application is reviewed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#F8FAFF' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#1B4FD8' }}>C</div>
            <span className="text-xl font-bold text-gray-800">ChurchesOS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Vendor Marketplace Application</h1>
          <p className="text-gray-500 text-sm">Join the ChurchesOS Marketplace and reach hundreds of churches across Ghana</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: i <= step ? '#1B4FD8' : '#E2E8F0', color: i <= step ? 'white' : '#94A3B8' }}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? '#1B4FD8' : '#94A3B8' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="w-4 h-0.5 rounded mx-1" style={{ background: i < step ? '#1B4FD8' : '#E2E8F0' }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">

          {/* Step 0 — Business Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Business Information</h2>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {form.logoPreview ? <img src={form.logoPreview} alt="" className="w-full h-full object-cover" /> : <Store size={28} className="text-gray-400" />}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition">
                  <Upload size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Business Logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </label>
              </div>

              {[
                { label: 'Business Name *', field: 'businessName', ph: 'Your registered business name', col: 2 },
                { label: 'Business Type', field: 'businessType', ph: 'e.g. Sole Proprietor, Limited Company' },
              ].map(f => (
                <div key={f.field} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input type="text" value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Business Category *</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => update('category', cat.id)}
                      className="flex items-center gap-2 p-3 rounded-xl border-2 transition text-left text-sm"
                      style={{ borderColor: form.category === cat.id ? '#1B4FD8' : '#E5E7EB', background: form.category === cat.id ? '#EEF2FF' : 'white', color: form.category === cat.id ? '#1B4FD8' : '#374151' }}>
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Business Description *</label>
                <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)}
                  placeholder="Describe what your business offers to churches..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>

              <button onClick={() => setStep(1)} disabled={!form.businessName || !form.category || !form.description}
                className="w-full py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 1 — Contact Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Contact Details</h2>
              {[
                { label: 'Owner / Manager Name *', field: 'ownerName', ph: 'Full name', type: 'text' },
                { label: 'Phone Number *', field: 'ownerPhone', ph: '+233 24 000 0000', type: 'tel' },
                { label: 'WhatsApp Number', field: 'whatsapp', ph: '+233 24 000 0000', type: 'tel' },
                { label: 'Email Address *', field: 'ownerEmail', ph: 'business@email.com', type: 'email' },
                { label: 'Business Address *', field: 'businessAddress', ph: 'Street address', type: 'text' },
                { label: 'City', field: 'city', ph: 'e.g. Accra, Kumasi, Takoradi', type: 'text' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Region</label>
                <select value={form.region} onChange={e => update('region', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select region</option>
                  {['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Oti', 'Bono East', 'Ahafo', 'Western North', 'North East', 'Savannah'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">Back</button>
                <button onClick={() => setStep(2)} disabled={!form.ownerName || !form.ownerPhone || !form.ownerEmail}
                  className="flex-1 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Services */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Cormorant Garamond' }}>Services Offered</h2>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Services Offered *</label>
                <textarea rows={4} value={form.servicesOffered} onChange={e => update('servicesOffered', e.target.value)}
                  placeholder="List all services you offer to churches e.g. PA system rental, live sound engineering, microphone supply..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Price Range</label>
                <input type="text" value={form.priceRange} onChange={e => update('priceRange', e.target.value)}
                  placeholder="e.g. GHC 500 - GHC 5,000 per event"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Churches You Have Served (optional)</label>
                <textarea rows={3} value={form.churchesServed} onChange={e => update('churchesServed', e.target.value)}
                  placeholder="List churches you have worked with before..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>
              {[
                { label: 'Website (optional)', field: 'website', ph: 'https://yourwebsite.com' },
                { label: 'Instagram (optional)', field: 'instagram', ph: '@yourbusiness' },
                { label: 'Facebook (optional)', field: 'facebook', ph: 'facebook.com/yourbusiness' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input type="text" value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">Back</button>
                <button onClick={() => setStep(3)} disabled={!form.servicesOffered}
                  className="flex-1 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Payment & Terms */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Payment & Terms</h2>
              <p className="text-xs text-gray-400 mb-4">We collect payments on your behalf and transfer to you after deducting platform commission</p>

              <div className="p-4 rounded-xl border-2 border-blue-200" style={{ background: '#EEF2FF' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#1B4FD8' }}>Platform Commission Structure</p>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p>✓ Monthly listing fee: <strong>GHC 200 - 500/month</strong> (based on plan)</p>
                  <p>✓ Transaction commission: <strong>3% per booking</strong> made through ChurchesOS</p>
                  <p>✓ Payments transferred within <strong>48 hours</strong> of service completion</p>
                </div>
              </div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mobile Money (Primary)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">MoMo Number *</label>
                  <input type="tel" value={form.momoNumber} onChange={e => update('momoNumber', e.target.value)}
                    placeholder="+233 24 000 0000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Account Name *</label>
                  <input type="text" value={form.momoName} onChange={e => update('momoName', e.target.value)}
                    placeholder="Name on MoMo" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bank Account (Optional)</p>
              <div className="space-y-3">
                {[
                  { label: 'Bank Name', field: 'bankName', ph: 'e.g. GCB, Ecobank, Fidelity' },
                  { label: 'Account Number', field: 'accountNumber', ph: 'Account number' },
                  { label: 'Account Name', field: 'accountName', ph: 'Name on account' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <input type="text" value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                      placeholder={f.ph} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { field: 'agreeToTerms', label: 'I agree to the ChurchesOS Vendor Terms & Conditions' },
                  { field: 'agreeToCommission', label: 'I agree to the 3% platform commission on all transactions made through ChurchesOS' },
                ].map(a => (
                  <div key={a.field} className="flex items-start gap-3">
                    <button onClick={() => update(a.field, !form[a.field])}
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition border-2"
                      style={{ background: form[a.field] ? '#1B4FD8' : 'white', borderColor: form[a.field] ? '#1B4FD8' : '#D1D5DB' }}>
                      {form[a.field] && <Check size={11} className="text-white" />}
                    </button>
                    <span className="text-xs text-gray-600 leading-relaxed">{a.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">Back</button>
                <button onClick={handleSubmit}
                  disabled={!form.momoNumber || !form.momoName || !form.agreeToTerms || !form.agreeToCommission}
                  className="flex-1 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: '#1B4FD8' }}>
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already approved? <a href="/login" className="font-medium" style={{ color: '#1B4FD8' }}>Sign in to your vendor portal</a>
        </p>
      </div>
    </div>
  )
}
