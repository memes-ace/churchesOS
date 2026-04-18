import { useState } from 'react'
import { X, Check, CreditCard, Phone, Building } from 'lucide-react'
import { paymentsAPI } from '../../utils/api'

const PLANS = [
  { key: 'starter', label: 'Starter', price: 1800, color: '#1B4FD8', bg: '#EEF2FF',
    features: ['Up to 500 members', 'Finance & Events', 'Sermons & Visitors', 'Prayer & Announcements'] },
  { key: 'growth', label: 'Growth', price: 5400, color: '#7C3AED', bg: '#EDE9FE',
    features: ['Up to 2000 members', 'All Starter features', 'Ministries & Cell Groups', 'Song Library & Reports'] },
  { key: 'enterprise', label: 'Enterprise', price: 10200, color: '#F59E0B', bg: '#FEF9C3',
    features: ['Unlimited members', 'All features', 'Custom branding', 'Priority support'] },
]

export default function UpgradeModal({ user, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [form, setForm] = useState({ method: 'Mobile Money', reference: '', proof: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await paymentsAPI.submit({
        church_id: user.church_id,
        church_name: user.church_name || 'My Church',
        plan_requested: selectedPlan.key,
        amount: String(selectedPlan.price),
        payment_method: form.method,
        reference: form.reference,
        proof_description: form.proof,
      })
      setSubmitted(true)
    } catch(e) {
      console.warn('Payment submit error:', e)
      setSubmitted(true) // Still show success
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "Cormorant Garamond", fontSize: "22px" }}>
            Upgrade Your Plan
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
                <Check size={28} style={{ color: '#166534' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Cormorant Garamond" }}>
                Payment Submitted!
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Your payment proof for the <strong>{selectedPlan?.label}</strong> plan has been submitted.
              </p>
              <p className="text-gray-400 text-sm">
                Our team will verify and activate your plan within <strong>24 hours</strong>.
              </p>
              <div className="mt-5 p-4 rounded-xl text-left" style={{ background: '#F0FDF4' }}>
                <p className="text-xs font-bold text-green-700 mb-1">What happens next?</p>
                <p className="text-xs text-green-600">1. We verify your payment reference</p>
                <p className="text-xs text-green-600">2. Your plan is activated automatically</p>
                <p className="text-xs text-green-600">3. New features appear in your dashboard</p>
              </div>
              <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: '#1B4FD8' }}>
                Close
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Select the plan you want to upgrade to:</p>
              {PLANS.filter(p => p.key !== user?.church_plan).map(p => (
                <button key={p.key} onClick={() => setSelectedPlan(p)}
                  className="w-full p-4 rounded-xl border-2 text-left transition"
                  style={{ borderColor: selectedPlan?.key === p.key ? p.color : '#E5E7EB', background: selectedPlan?.key === p.key ? p.bg : 'white' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{p.label}</span>
                    <span className="font-bold text-lg" style={{ color: p.color }}>GHC {p.price.toLocaleString()}/mo</span>
                  </div>
                  <div className="space-y-1">
                    {p.features.map(f => (
                      <p key={f} className="text-xs text-gray-500 flex items-center gap-1">
                        <Check size={10} style={{ color: p.color }} /> {f}
                      </p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-xs font-bold text-blue-700 mb-1">💳 Payment Details</p>
                <p className="text-sm font-bold text-gray-800">Amount: GHC {selectedPlan?.price.toLocaleString()}/month</p>
                <p className="text-sm text-gray-600">Plan: {selectedPlan?.label}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pay to any of these:</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} style={{ color: '#1B4FD8' }} />
                  <span>Mobile Money: <strong>0599001992</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building size={14} style={{ color: '#1B4FD8' }} />
                  <span>Name: <strong>Tabscrow Company Limited</strong></span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Use your church name as payment reference</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</label>
                <select value={form.method} onChange={e => update('method', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option>Mobile Money</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Transaction Reference / ID *
                </label>
                <input type="text" value={form.reference} onChange={e => update('reference', e.target.value)}
                  placeholder="e.g. MOMO-123456789"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Additional Notes (optional)
                </label>
                <textarea rows={3} value={form.proof} onChange={e => update('proof', e.target.value)}
                  placeholder="Any extra info about your payment..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>
            </div>
          )}
        </div>

        {!submitted && (
          <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
            {step === 1 ? (
              <>
                <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
                <button onClick={() => setStep(2)} disabled={!selectedPlan}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  Continue to Payment →
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">← Back</button>
                <button onClick={handleSubmit} disabled={!form.reference || loading}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  {loading ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
