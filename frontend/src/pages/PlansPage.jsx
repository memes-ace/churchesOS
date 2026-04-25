import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { Save, Check, Users, DollarSign } from 'lucide-react'

const ALL_FEATURES = [
  'Members', 'Attendance', 'Finance', 'Events', 'Communication',
  'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups',
  'Counselling', 'Announcements', 'Volunteers', 'Marketplace',
  'Song Library', 'Equipment', 'Purchases', 'Reports', 'Roles & Access', 'Church Settings'
]

const defaultPlans = {
  free:       { label: 'Free',       price: 0,     memberLimit: 100,   color: '#6B7280', bg: '#F3F4F6', features: ['Members', 'Attendance', 'Prayer Requests', 'Announcements', 'Church Settings'] },
  starter:    { label: 'Starter',    price: 50,  memberLimit: 500,   color: '#1B4FD8', bg: '#EEF2FF', features: ['Members', 'Attendance', 'Finance', 'Events', 'Sermons', 'Visitors', 'Prayer Requests', 'Announcements', 'Communication', 'Church Settings'] },
  growth:     { label: 'Growth',     price: 100,  memberLimit: 2000,  color: '#7C3AED', bg: '#EDE9FE', features: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Song Library', 'Reports', 'Church Settings'] },
  enterprise: { label: 'Enterprise', price: 200, memberLimit: 999999, color: '#F59E0B', bg: '#FEF9C3', features: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Marketplace', 'Song Library', 'Equipment', 'Purchases', 'Reports', 'Roles & Access', 'Church Settings'] },
}

export default function PlansPage() {
  const [plans, setPlans] = useState({
    free:       { ...defaultPlans.free },
    starter:    { ...defaultPlans.starter },
    growth:     { ...defaultPlans.growth },
    enterprise: { ...defaultPlans.enterprise },
  })
  const [saved, setSaved] = useState(false)
  const [activeEdit, setActiveEdit] = useState('free')

  useEffect(() => {
    adminAPI.getSettings()
      .then(s => {
        if (s) {
          setPlans({
            free:       { ...defaultPlans.free,       ...(s.freePlan || {}) },
            starter:    { ...defaultPlans.starter,    ...(s.starterPlan || {}), price: Number(s.starterPlan?.price || s.starterPrice || 50) },
            growth:     { ...defaultPlans.growth,     ...(s.growthPlan || {}), price: Number(s.growthPlan?.price || s.growthPrice || 100) },
            enterprise: { ...defaultPlans.enterprise, ...(s.enterprisePlan || {}), price: Number(s.enterprisePlan?.price || s.enterprisePrice || 200) },
          })
        }
      })
      .catch(e => console.warn('Settings load error:', e))
  }, [])

  const updatePlan = (planKey, field, value) => {
    setPlans(prev => ({ ...prev, [planKey]: { ...prev[planKey], [field]: value } }))
  }

  const toggleFeature = (planKey, feat) => {
    setPlans(prev => {
      const current = prev[planKey].features || []
      const updated = current.includes(feat) ? current.filter(f => f !== feat) : [...current, feat]
      return { ...prev, [planKey]: { ...prev[planKey], features: updated } }
    })
  }

  const handleSave = async () => {
    const planData = {
      freePlan: plans.free,
      starterPlan: plans.starter,
      growthPlan: plans.growth,
      enterprisePlan: plans.enterprise,
      starterPrice: String(plans.starter.price),
      growthPrice: String(plans.growth.price),
      enterprisePrice: String(plans.enterprise.price),
      freePlanFeatures: plans.free.features,
      starterPlanFeatures: plans.starter.features,
      growthPlanFeatures: plans.growth.features,
      enterprisePlanFeatures: plans.enterprise.features,
    }
    //     const existing = loadSettings()

    // Save to API so churches can read it
    try {
      await adminAPI.updateSettings(planData)
      console.log('Plan settings saved to API')
    } catch(e) {
      console.warn('API save error:', e)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const planKeys = ['free', 'starter', 'growth', 'enterprise']

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Plan Management</h1>
          <p className="text-gray-400 text-sm mt-1">Control pricing, member limits and features for each plan</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition"
          style={{ background: saved ? '#059669' : '#1B4FD8' }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save All Plans</>}
        </button>
      </div>

      {/* Plan selector tabs */}
      <div className="flex gap-2 mb-6 fade-in">
        {planKeys.map(key => (
          <button key={key} onClick={() => setActiveEdit(key)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={{
              background: activeEdit === key ? plans[key].color : 'white',
              color: activeEdit === key ? 'white' : '#6B7280',
              border: '2px solid ' + (activeEdit === key ? plans[key].color : '#E5E7EB')
            }}>
            {plans[key].label}
          </button>
        ))}
      </div>

      {planKeys.map(key => {
        if (activeEdit !== key) return null
        const plan = plans[key]
        return (
          <div key={key} className="grid lg:grid-cols-2 gap-6 fade-in">
            {/* Left - Pricing & Limits */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign size={18} style={{ color: plan.color }} />
                  <h3 className="font-bold text-gray-800">{plan.label} Plan — Pricing & Limits</h3>
                </div>
                <div className="space-y-4">
                  {key !== 'free' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        Monthly Price (GHC)
                      </label>
                      <input type="number" value={plan.price}
                        onChange={e => updatePlan(key, 'price', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold"
                        style={{ color: plan.color }} />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Member Limit {key === 'enterprise' ? '(set 999999 for unlimited)' : ''}
                    </label>
                    <input type="number" value={plan.memberLimit === 999999 ? '' : plan.memberLimit}
                      placeholder={key === 'enterprise' ? 'Unlimited' : ''}
                      onChange={e => updatePlan(key, 'memberLimit', e.target.value === '' ? 999999 : Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                    <p className="text-xs text-gray-400 mt-1">
                      Currently: {plan.memberLimit === 999999 ? 'Unlimited' : plan.memberLimit.toLocaleString() + ' members max'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview card */}
              <div className="rounded-2xl border-2 p-5" style={{ borderColor: plan.color + '40', background: plan.bg + '40' }}>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Preview</p>
                <p className="text-xl font-bold text-gray-800">{plan.label}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: plan.color }}>
                  {key === 'free' ? 'Free' : 'GHC ' + Number(plan.price).toLocaleString() + '/mo'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.memberLimit === 999999 ? 'Unlimited members' : 'Up to ' + plan.memberLimit.toLocaleString() + ' members'}
                </p>
                <div className="mt-3 space-y-1">
                  {(plan.features || []).slice(0, 5).map(f => (
                    <p key={f} className="text-xs text-gray-600 flex items-center gap-1">
                      <Check size={10} style={{ color: plan.color }} /> {f}
                    </p>
                  ))}
                  {(plan.features || []).length > 5 && (
                    <p className="text-xs text-gray-400">+{(plan.features || []).length - 5} more features</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Features */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} style={{ color: plan.color }} />
                  <h3 className="font-bold text-gray-800">Features Included</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPlans(prev => ({ ...prev, [key]: { ...prev[key], features: [...ALL_FEATURES] } }))}
                    className="text-xs px-2 py-1 rounded-lg" style={{ background: '#DCFCE7', color: '#166534' }}>
                    All
                  </button>
                  <button onClick={() => setPlans(prev => ({ ...prev, [key]: { ...prev[key], features: [] } }))}
                    className="text-xs px-2 py-1 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                    None
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                {(plan.features || []).length} of {ALL_FEATURES.length} features enabled
              </p>
              <div className="space-y-2">
                {ALL_FEATURES.map(feat => {
                  const enabled = (plan.features || []).includes(feat)
                  return (
                    <button key={feat} onClick={() => toggleFeature(key, feat)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition"
                      style={{
                        background: enabled ? plan.bg : '#F9FAFB',
                        border: '1px solid ' + (enabled ? plan.color + '50' : '#F3F4F6'),
                        color: enabled ? plan.color : '#6B7280'
                      }}>
                      <span className="font-medium">{feat}</span>
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: enabled ? plan.color : '#E5E7EB' }}>
                        {enabled && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
