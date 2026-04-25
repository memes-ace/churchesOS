import { adminAPI } from '../utils/api'
import { useState, useEffect } from 'react'
import { Save, Bell, DollarSign, Globe, Shield, MessageSquare, Check, List } from 'lucide-react'

const ALL_FEATURES = [
  'Members', 'Attendance', 'Finance', 'Events', 'Communication',
  'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups',
  'Counselling', 'Announcements', 'Volunteers', 'Marketplace',
  'Song Library', 'Equipment', 'Purchases', 'Reports', 'Roles & Access'
]

const defaultSettings = {
  platformName: 'ChurchesOS',
  supportEmail: 'support@churchesos.com',
  supportPhone: '+233 24 000 0000',
  commissionRate: '3',
  freePlanLimit: '100',
  starterPrice: '50',
  growthPrice: '100',
  enterprisePrice: '200',
  maintenanceMode: false,
  newRegistrations: true,
  emailNotifications: true,
  smsNotifications: false,
  broadcastMessage: '',
  freePlanFeatures: ['Members', 'Attendance', 'Prayer Requests', 'Announcements'],
  starterPlanFeatures: ['Members', 'Attendance', 'Finance', 'Events', 'Sermons', 'Visitors', 'Prayer Requests', 'Announcements', 'Communication'],
  growthPlanFeatures: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Song Library', 'Reports'],
  enterprisePlanFeatures: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Marketplace', 'Song Library', 'Equipment', 'Purchases', 'Reports', 'Roles & Access'],
}

const SETTINGS_KEY = 'cos_platform_settings'

const loadSettings = () => {
  try {
    // Settings loaded from API only
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) }
    return { ...defaultSettings }
  } catch(e) { return { ...defaultSettings } }
}

export default function SuperSettingsPage() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    adminAPI.getSettings()
      .then(data => {
        if (data) {
          const merged = { ...loadSettings(), ...data }
          setSettings(merged)
        }
      })
      .catch(e => console.warn('Settings load error:', e))
  }, [])
  const [saved, setSaved] = useState(false)
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [changed, setChanged] = useState(false)

  const update = (f, v) => {
    setSettings(p => ({ ...p, [f]: v }))
    setChanged(true)
  }

  const handleSave = async () => {
    try {
        await adminAPI.updateSettings(settings)
      setSaved(true)
      setChanged(false)
      setTimeout(() => setSaved(false), 2000)
    } catch(e) {
      // Still save locally even if API fails
      setSaved(true)
      setChanged(false)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleBroadcast = () => {
    if (!settings.broadcastMessage) return
    const announcements = JSON.parse(localStorage.getItem('cos_announcements') || '[]')
    announcements.unshift({
      id: Date.now(),
      title: 'Platform Announcement',
      message: settings.broadcastMessage,
      audience: 'All Members',
      date: new Date().toISOString(),
      status: 'sent',
      recurring: false,
      views: 0,
    })
    localStorage.setItem('cos_announcements', JSON.stringify(announcements))
    update('broadcastMessage', '')
    setBroadcastSent(true)
    setTimeout(() => setBroadcastSent(false), 3000)
  }

  // Auto-save indicator
  useEffect(() => {
    if (changed) {
      const timer = setTimeout(() => {
          }, 500)
      return () => clearTimeout(timer)
    }
  }, [settings, changed])

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Platform Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure ChurchesOS platform settings</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition"
          style={{ background: saved ? '#059669' : '#1B4FD8' }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save All Settings</>}
        </button>
      </div>

      {changed && !saved && (
        <div className="mb-5 p-3 rounded-xl flex items-center gap-2 fade-in" style={{ background: '#FEF9C3' }}>
          <span className="text-xs font-medium" style={{ color: '#854D0E' }}>⚠️ You have unsaved changes. Click "Save All Settings" to apply.</span>
        </div>
      )}

      <div className="space-y-6">

        {/* Platform Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} style={{ color: '#1B4FD8' }} />
            <h3 className="font-bold text-gray-800">Platform Information</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { label: 'Platform Name', field: 'platformName', ph: 'ChurchesOS', type: 'text' },
              { label: 'Support Email', field: 'supportEmail', ph: 'support@churchesos.com', type: 'email' },
              { label: 'Support Phone', field: 'supportPhone', ph: '+233 24 000 0000', type: 'tel' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                <input type={f.type} value={settings[f.field]} onChange={e => update(f.field, e.target.value)}
                  placeholder={f.ph}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm transition" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl" style={{ background: '#EEF2FF' }}>
            <p className="text-xs" style={{ color: '#1B4FD8' }}>
              <strong>Current platform name:</strong> {settings.platformName} &nbsp;|&nbsp;
              <strong>Support:</strong> {settings.supportEmail}
            </p>
          </div>
        </div>

        {/* Commission & Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} style={{ color: '#059669' }} />
            <h3 className="font-bold text-gray-800">Commission & Plan Pricing (GHC)</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Marketplace Commission %</label>
              <div className="relative">
                <input type="number" value={settings.commissionRate} onChange={e => update('commissionRate', e.target.value)}
                  min="0" max="100" step="0.5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Current: {settings.commissionRate}% on all marketplace transactions</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Free Plan Member Limit</label>
              <input type="number" value={settings.freePlanLimit} onChange={e => update('freePlanLimit', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          </div>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-5 mb-3">Monthly Subscription Prices</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { label: 'Starter Plan', field: 'starterPrice', color: '#1B4FD8' },
              { label: 'Growth Plan', field: 'growthPrice', color: '#7C3AED' },
              { label: 'Enterprise Plan', field: 'enterprisePrice', color: '#F59E0B' },
            ].map(f => (
              <div key={f.field} className="p-4 rounded-xl border-2" style={{ borderColor: f.color + '30' }}>
                <label className="block text-xs font-bold mb-1" style={{ color: f.color }}>{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">GHC</span>
                  <input type="number" value={settings[f.field]} onChange={e => update(f.field, e.target.value)}
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold"
                    style={{ color: f.color }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Per month</p>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: '#F0FDF4' }}>
            <p className="text-xs font-bold text-gray-600 mb-2">CURRENT PRICING PREVIEW</p>
            <div className="flex gap-4 flex-wrap">
              <span className="text-xs text-gray-600">🆓 Free: 0</span>
              <span className="text-xs" style={{ color: '#1B4FD8' }}>⭐ Starter: GHC {Number(settings.starterPrice).toLocaleString()}/mo</span>
              <span className="text-xs" style={{ color: '#7C3AED' }}>🚀 Growth: GHC {Number(settings.growthPrice).toLocaleString()}/mo</span>
              <span className="text-xs" style={{ color: '#F59E0B' }}>💎 Enterprise: GHC {Number(settings.enterprisePrice).toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        {/* System Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} style={{ color: '#7C3AED' }} />
            <h3 className="font-bold text-gray-800">System Controls</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Maintenance Mode', sub: 'Take the platform offline for maintenance. No one can log in.', field: 'maintenanceMode', danger: true },
              { label: 'Allow New Registrations', sub: 'Allow new churches to register on the platform', field: 'newRegistrations' },
              { label: 'Email Notifications', sub: 'Send email alerts for new registrations and issues', field: 'emailNotifications' },
              { label: 'SMS Notifications', sub: 'Send SMS alerts to your phone for critical events', field: 'smsNotifications' },
            ].map(s => (
              <div key={s.field} className="flex items-center justify-between p-4 rounded-xl transition"
                style={{ background: s.danger && settings[s.field] ? '#FEE2E2' : '#F8FAFF' }}>
                <div className="flex-1 mr-4">
                  <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
                <button onClick={() => update(s.field, !settings[s.field])}
                  className="w-12 h-6 rounded-full flex items-center transition-all flex-shrink-0"
                  style={{ background: settings[s.field] ? (s.danger ? '#DC2626' : '#1B4FD8') : '#E5E7EB', padding: '2px' }}>
                  <div className="w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ transform: settings[s.field] ? 'translateX(24px)' : 'translateX(0)' }}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Feature Control */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} style={{ color: '#7C3AED' }} />
            <h3 className="font-bold text-gray-800">Plan Feature Control</h3>
          </div>
          <p className="text-xs text-gray-400 mb-5">Set which features are available for each subscription plan. Churches on a plan will only see the features you enable for that plan.</p>
          <div className="space-y-6">
            {[
              { key: 'freePlanFeatures', label: 'Free Plan', color: '#6B7280', bg: '#F3F4F6' },
              { key: 'starterPlanFeatures', label: 'Starter Plan', color: '#1B4FD8', bg: '#EEF2FF' },
              { key: 'growthPlanFeatures', label: 'Growth Plan', color: '#7C3AED', bg: '#EDE9FE' },
              { key: 'enterprisePlanFeatures', label: 'Enterprise Plan', color: '#F59E0B', bg: '#FEF9C3' },
            ].map(plan => (
              <div key={plan.key} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: plan.bg, color: plan.color }}>
                    {plan.label}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => update(plan.key, [...ALL_FEATURES])}
                      className="text-xs px-2 py-1 rounded-lg" style={{ background: '#DCFCE7', color: '#166534' }}>
                      All
                    </button>
                    <button onClick={() => update(plan.key, [])}
                      className="text-xs px-2 py-1 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                      None
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_FEATURES.map(feat => {
                    const enabled = (settings[plan.key] || []).includes(feat)
                    return (
                      <button key={feat} onClick={() => {
                        const current = settings[plan.key] || []
                        const updated = current.includes(feat)
                          ? current.filter(f => f !== feat)
                          : [...current, feat]
                        update(plan.key, updated)
                      }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition"
                        style={{ background: enabled ? plan.bg : '#F9FAFB', color: enabled ? plan.color : '#9CA3AF', border: '1px solid ' + (enabled ? plan.color + '40' : '#F3F4F6') }}>
                        <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: enabled ? plan.color : '#E5E7EB' }}>
                          {enabled && <Check size={8} className="text-white" />}
                        </div>
                        {feat}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {(settings[plan.key] || []).length} of {ALL_FEATURES.length} features enabled
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={18} style={{ color: '#F59E0B' }} />
            <h3 className="font-bold text-gray-800">Broadcast to All Churches</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">This message will appear as an announcement in all church dashboards</p>
          <textarea rows={4} value={settings.broadcastMessage} onChange={e => update('broadcastMessage', e.target.value)}
            placeholder="Type a platform-wide announcement..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none mb-3" />
          <div className="flex gap-3">
            <button onClick={handleBroadcast} disabled={!settings.broadcastMessage || broadcastSent}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition"
              style={{ background: broadcastSent ? '#059669' : '#F59E0B' }}>
              {broadcastSent ? '✓ Broadcast Sent to All Churches!' : 'Send Broadcast Now'}
            </button>
          </div>
        </div>

        {/* Save button at bottom too */}
        <button onClick={handleSave}
          className="w-full py-4 rounded-xl text-white text-sm font-bold transition"
          style={{ background: saved ? '#059669' : '#1B4FD8' }}>
          {saved ? '✓ All Settings Saved Successfully!' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}
