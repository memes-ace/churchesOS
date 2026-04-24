import { useState, useEffect } from 'react'
import { Save, Check, Globe, Phone, Mail, Type, BarChart2, Plus, Trash2 } from 'lucide-react'
import { adminAPI } from '../utils/api'

export default function LandingEditorPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('hero')

  useEffect(() => {
    adminAPI.getSettings()
      .then(s => { if (s) setSettings(s) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
  }, [])

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  const updateStat = (i, field, value) => {
    const stats = [...(settings.landing_stats || [])]
    stats[i] = { ...stats[i], [field]: value }
    update('landing_stats', stats)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminAPI.updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch(e) { console.warn(e) }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  const tabs = [
    { key: 'hero', label: 'Hero Section', icon: Type },
    { key: 'stats', label: 'Stats', icon: BarChart2 },
    { key: 'payment', label: 'Payment & Contact', icon: Phone },
    { key: 'cta', label: 'Call to Action', icon: Globe },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>
            Landing Page Editor
          </h1>
          <p className="text-gray-400 text-sm mt-1">Changes appear on the website immediately</p>
        </div>
        <div className="flex gap-3">
          <a href="https://churches-os.vercel.app" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            <Globe size={14} /> Preview Site
          </a>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: saved ? '#059669' : '#1B4FD8' }}>
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: tab === t.key ? '#1B4FD8' : 'white',
              color: tab === t.key ? 'white' : '#6B7280',
              border: '1px solid ' + (tab === t.key ? '#1B4FD8' : '#E5E7EB')
            }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">

        {/* HERO TAB */}
        {tab === 'hero' && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-800 mb-4">Hero Section</h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Badge Text</label>
              <input type="text" value={settings.landing_hero_badge || ''}
                onChange={e => update('landing_hero_badge', e.target.value)}
                placeholder="e.g. Built for African Churches"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              <p className="text-xs text-gray-400 mt-1">The small badge above the main title</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Hero Title</label>
              <input type="text" value={settings.landing_hero_title || ''}
                onChange={e => update('landing_hero_title', e.target.value)}
                placeholder="e.g. Run Your Church"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              <p className="text-xs text-gray-400 mt-1">Main headline on the hero section</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Hero Subtitle</label>
              <textarea rows={3} value={settings.landing_hero_subtitle || ''}
                onChange={e => update('landing_hero_subtitle', e.target.value)}
                placeholder="Describe what ChurchesOS does..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              <p className="text-xs text-gray-400 mt-1">Description text below the main title</p>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 mb-4">Statistics Section</h3>
            <p className="text-sm text-gray-400 mb-4">These numbers show on the landing page to build trust</p>
            {(settings.landing_stats || []).map((stat, i) => (
              <div key={i} className="flex gap-3 items-center p-4 rounded-xl" style={{ background: '#F8FAFF', border: '1px solid #E5E7EB' }}>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Number / Value</label>
                  <input type="text" value={stat.number || ''}
                    onChange={e => updateStat(i, 'number', e.target.value)}
                    placeholder="e.g. 500+"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Label</label>
                  <input type="text" value={stat.label || ''}
                    onChange={e => updateStat(i, 'label', e.target.value)}
                    placeholder="e.g. Churches"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none text-sm" />
                </div>
                <button onClick={() => {
                  const stats = settings.landing_stats.filter((_, idx) => idx !== i)
                  update('landing_stats', stats)
                }} className="p-2 rounded-lg hover:bg-red-50 text-red-400 mt-5">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button onClick={() => update('landing_stats', [...(settings.landing_stats || []), { number: '', label: '' }])}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 w-full justify-center">
              <Plus size={14} /> Add Stat
            </button>
          </div>
        )}

        {/* PAYMENT TAB */}
        {tab === 'payment' && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-800 mb-4">Payment & Contact Details</h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">MoMo Number</label>
              <input type="text" value={settings.landing_momo_number || ''}
                onChange={e => update('landing_momo_number', e.target.value)}
                placeholder="e.g. 0599 001 992"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">MoMo Account Name</label>
              <input type="text" value={settings.landing_momo_name || ''}
                onChange={e => update('landing_momo_name', e.target.value)}
                placeholder="e.g. Tabscrow Company Limited"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">WhatsApp Number (with country code, no +)</label>
              <input type="text" value={settings.landing_whatsapp || ''}
                onChange={e => update('landing_whatsapp', e.target.value)}
                placeholder="e.g. 233599001992"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Contact Email</label>
              <input type="email" value={settings.landing_email || ''}
                onChange={e => update('landing_email', e.target.value)}
                placeholder="e.g. admin@churchesos.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
        )}

        {/* CTA TAB */}
        {tab === 'cta' && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-800 mb-4">Call to Action Section</h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">CTA Title</label>
              <input type="text" value={settings.landing_cta_title || ''}
                onChange={e => update('landing_cta_title', e.target.value)}
                placeholder="e.g. Ready to transform your church?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">CTA Subtitle</label>
              <textarea rows={2} value={settings.landing_cta_subtitle || ''}
                onChange={e => update('landing_cta_subtitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            </div>
          </div>
        )}

      </div>

      {/* Save reminder */}
      <div className="mt-4 p-3 rounded-xl text-sm text-center" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
        💡 Changes are saved to the database and appear on the landing page immediately after saving.
      </div>
    </div>
  )
}
