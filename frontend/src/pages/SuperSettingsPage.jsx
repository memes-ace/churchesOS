import { useState } from 'react'
import { Save, Bell, DollarSign, Globe, Shield, MessageSquare } from 'lucide-react'

export default function SuperSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'ChurchesOS',
    supportEmail: 'support@churchesos.com',
    supportPhone: '+233 24 000 0000',
    commissionRate: '3',
    freePlanLimit: '100',
    starterPrice: '1800',
    growthPrice: '5400',
    enterprisePrice: '10200',
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
  })
  const [saved, setSaved] = useState(false)
  const update = (f, v) => setSettings(p => ({ ...p, [f]: v }))

  const handleSave = () => {
    try { localStorage.setItem('cos_platform_settings', JSON.stringify(settings)) } catch(e) {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Platform Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure ChurchesOS platform settings</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition"
          style={{ background: saved ? '#059669' : '#1B4FD8' }}>
          <Save size={15} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Platform Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} style={{ color: '#1B4FD8' }} />
            <h3 className="font-bold text-gray-800">Platform Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Platform Name', field: 'platformName' },
              { label: 'Support Email', field: 'supportEmail' },
              { label: 'Support Phone', field: 'supportPhone' },
            ].map(f => (
              <div key={f.field} className={f.field === 'platformName' ? '' : ''}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                <input type="text" value={settings[f.field]} onChange={e => update(f.field, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Commission & Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} style={{ color: '#059669' }} />
            <h3 className="font-bold text-gray-800">Commission & Pricing (GHC)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Marketplace Commission %', field: 'commissionRate', ph: '3' },
              { label: 'Free Plan Member Limit', field: 'freePlanLimit', ph: '100' },
              { label: 'Starter Plan Price/mo', field: 'starterPrice', ph: '1800' },
              { label: 'Growth Plan Price/mo', field: 'growthPrice', ph: '5400' },
              { label: 'Enterprise Plan Price/mo', field: 'enterprisePrice', ph: '10200' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                <input type="number" value={settings[f.field]} onChange={e => update(f.field, e.target.value)}
                  placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            ))}
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
              { label: 'Maintenance Mode', sub: 'Take the platform offline for maintenance', field: 'maintenanceMode', danger: true },
              { label: 'Allow New Registrations', sub: 'Allow new churches to register on the platform', field: 'newRegistrations' },
              { label: 'Email Notifications', sub: 'Send email alerts for new registrations and issues', field: 'emailNotifications' },
              { label: 'SMS Notifications', sub: 'Send SMS alerts to your phone for critical events', field: 'smsNotifications' },
            ].map(s => (
              <div key={s.field} className="flex items-center justify-between p-4 rounded-xl" style={{ background: s.danger && settings[s.field] ? '#FEE2E2' : '#F8FAFF' }}>
                <div>
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

        {/* Broadcast Message */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={18} style={{ color: '#F59E0B' }} />
            <h3 className="font-bold text-gray-800">Broadcast to All Churches</h3>
          </div>
          <textarea rows={4} placeholder="Type a platform-wide announcement to send to all churches..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none mb-3" />
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#F59E0B' }}>
              Send to All Churches ({/* count */}0 churches)
            </button>
            <button className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
              Schedule for Later
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">
          <h3 className="font-bold text-gray-800 mb-4">Recent Platform Activity</h3>
          {[
            { event: 'Platform settings accessed', time: 'Just now', icon: '⚙️' },
            { event: 'Super Admin logged in', time: '2 mins ago', icon: '🔐' },
            { event: 'System check completed', time: '1 hour ago', icon: '✅' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{a.event}</p>
              </div>
              <p className="text-xs text-gray-400">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
