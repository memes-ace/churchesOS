import { useState, useEffect } from 'react'
import { Search, X, Phone, Mail, MessageSquare, MapPin, Star, Lock, Check } from 'lucide-react'
import { vendorsAPI } from '../utils/api'

const categoryLabels = {
  sound: '🎵 Sound & Audio', media: '🖨️ Media & Printing', catering: '🍽️ Catering',
  transport: '🚌 Transport', decor: '🎪 Decoration', instruments: '🎸 Instruments',
  tech: '💻 Technology', clothing: '👔 Clothing', books: '📚 Books', other: '✨ Other',
}

function MarketplaceSubscribeModal({ onClose }) {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const [form, setForm] = useState({ transaction_id: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!form.transaction_id) return
    setLoading(true)
    try {
      const token = localStorage.getItem('cos_token') || ''
      await fetch('/api/admin/marketplace-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          church_id: user.church_id,
          church_name: user.church_name || 'My Church',
          amount: '50',
          transaction_id: form.transaction_id,
          notes: form.notes,
        })
      })
      setSubmitted(true)
    } catch(e) {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
            Subscribe to Marketplace
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
                <Check size={24} style={{ color: '#166534' }} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Subscription Request Submitted!</h3>
              <p className="text-gray-500 text-sm">We will verify your payment and activate your marketplace access within a few hours.</p>
              <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#1B4FD8' }}>Close</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-xs font-bold text-blue-700 mb-2">📱 Pay via Mobile Money</p>
                <p className="text-sm font-bold text-gray-800">Number: 0599001992</p>
                <p className="text-sm text-gray-600">Name: Tabscrow Company Limited</p>
                <p className="text-sm font-bold mt-2" style={{ color: '#1B4FD8' }}>Amount: GHC 50/month</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Check size={14} style={{ color: '#059669' }} /> Access to all verified vendors</p>
                <p className="flex items-center gap-2"><Check size={14} style={{ color: '#059669' }} /> Full contact details (phone, email, WhatsApp)</p>
                <p className="flex items-center gap-2"><Check size={14} style={{ color: '#059669' }} /> Request services directly</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">MoMo Transaction ID *</label>
                <input type="text" value={form.transaction_id} onChange={e => setForm(p => ({ ...p, transaction_id: e.target.value }))}
                  placeholder="e.g. MOMO-1234567890"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.transaction_id || loading}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#1B4FD8' }}>
                  {loading ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VendorCard({ vendor, subscribed }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: '#EEF2FF' }}>
            {categoryLabels[vendor.category]?.split(' ')[0] || '🏪'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{vendor.business_name}</h3>
            <p className="text-xs text-gray-400">{categoryLabels[vendor.category] || vendor.category}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>
          ✓ Verified
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <MapPin size={12} className="text-gray-400" />
        <span className="text-xs text-gray-500">{vendor.city}{vendor.region ? `, ${vendor.region}` : ''}</span>
      </div>

      {vendor.price_range && (
        <p className="text-xs text-gray-500 mb-3">💰 {vendor.price_range}</p>
      )}

      {vendor.services_offered && (
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">🛠️ {vendor.services_offered}</p>
      )}

      {subscribed ? (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          {vendor.owner_phone && (
            <a href={`tel:${vendor.owner_phone}`}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl w-full"
              style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
              <Phone size={14} /> {vendor.owner_phone}
            </a>
          )}
          {vendor.whatsapp && (
            <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl w-full"
              style={{ background: '#DCFCE7', color: '#166534' }}>
              <MessageSquare size={14} /> WhatsApp
            </a>
          )}
          {vendor.owner_email && (
            <a href={`mailto:${vendor.owner_email}`}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl w-full"
              style={{ background: '#F3F4F6', color: '#374151' }}>
              <Mail size={14} /> {vendor.owner_email}
            </a>
          )}
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2 rounded-xl"
            style={{ background: '#F9FAFB' }}>
            <Lock size={12} /> Subscribe to view contact details
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [subscribed, setSubscribed] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)

  useEffect(() => {
    // Check marketplace subscription status
    const token = localStorage.getItem('cos_token') || ''
    const user = JSON.parse(localStorage.getItem('cos_user') || '{}')

    if (user.church_id) {
      fetch(`/api/churches/${user.church_id}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => { if (data?.marketplace_enabled) setSubscribed(true) })
      .catch(() => {})
    }

    // Load approved vendors
    vendorsAPI.getApproved()
      .then(data => { if (Array.isArray(data)) setVendors(data) })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
  }, [])

  const filtered = vendors.filter(v => {
    const matchSearch = !search ||
      v.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase()) ||
      v.services_offered?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'all' || v.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {showSubscribe && <MarketplaceSubscribeModal onClose={() => setShowSubscribe(false)} />}

      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>
            Marketplace
          </h1>
          <p className="text-gray-400 text-sm mt-1">Find trusted service providers for your church</p>
        </div>
        {!subscribed && (
          <button onClick={() => setShowSubscribe(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: '#1B4FD8' }}>
            Subscribe — GHC 50/mo
          </button>
        )}
        {subscribed && (
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: '#DCFCE7', color: '#166534' }}>
            <Check size={14} /> Active Subscription
          </span>
        )}
      </div>

      {!subscribed && (
        <div className="mb-6 p-5 rounded-2xl border-2 border-dashed fade-in"
          style={{ borderColor: '#1B4FD8', background: '#EEF2FF' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 mb-1">🔒 Subscribe to Access Full Contact Details</p>
              <p className="text-sm text-gray-600">Browse vendors for free. Subscribe at GHC 50/month to see phone numbers, emails and WhatsApp contacts.</p>
            </div>
            <button onClick={() => setShowSubscribe(true)}
              className="ml-4 px-5 py-3 rounded-xl text-white text-sm font-semibold flex-shrink-0"
              style={{ background: '#1B4FD8' }}>
              Subscribe Now
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">🏪</p>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
            No vendors yet
          </h3>
          <p className="text-gray-400 text-sm">Vendors will appear here once approved</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
          {filtered.map(v => (
            <VendorCard key={v.id} vendor={v} subscribed={subscribed} />
          ))}
        </div>
      )}
    </div>
  )
}
