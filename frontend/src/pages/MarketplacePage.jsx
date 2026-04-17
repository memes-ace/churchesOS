import { useState } from 'react'
import { Search, X, Send, CheckCircle, Star, MapPin, Shield, Lock } from 'lucide-react'

const categoryLabels = {
  sound: '🎵 Sound & Audio', media: '🖨️ Media & Printing', catering: '🍽️ Catering',
  transport: '🚌 Transport', decor: '🎪 Decoration', instruments: '🎸 Instruments',
  tech: '💻 Technology', clothing: '👔 Clothing', books: '📚 Books', other: '✨ Other',
}

function RequestQuoteModal({ vendor, onClose }) {
  const [form, setForm] = useState({ eventDate: '', eventType: '', guestCount: '', details: '', budget: '', contactName: '', contactPhone: '' })
  const [submitted, setSubmitted] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = () => {
    const requests = JSON.parse(localStorage.getItem('cos_quote_requests') || '[]')
    requests.push({
      id: Date.now(),
      vendorId: vendor.id,
      vendorName: vendor.name,
      churchName: 'Grace Chapel International',
      ...form,
      status: 'Pending',
      date: new Date().toISOString(),
    })
    localStorage.setItem('cos_quote_requests', JSON.stringify(requests))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
            <CheckCircle size={32} style={{ color: '#059669' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>Quote Request Sent!</h3>
          <p className="text-sm text-gray-500 mb-2">Your request has been sent to <strong>{vendor.name}</strong> through ChurchesOS.</p>
          <p className="text-xs text-gray-400 mb-5">The vendor will respond within 24 hours. You will be notified here.</p>
          {(() => {
            const requests = JSON.parse(localStorage.getItem('cos_quote_requests') || '[]')
            const myRequest = requests.find(r => r.vendorId === vendor.id && r.contactReleased)
            return myRequest ? (
              <div className="p-3 rounded-xl mb-5" style={{ background: '#DCFCE7' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#166534' }}>✓ Payment Confirmed — Vendor Contact Released</p>
                <p className="text-sm font-medium" style={{ color: '#166534' }}>You can now contact the vendor directly.</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl mb-5" style={{ background: '#EEF2FF' }}>
                <p className="text-xs" style={{ color: '#1B4FD8' }}>🔒 Vendor contact details will be shared with you once payment is confirmed by ChurchesOS.</p>
              </div>
            )
          })()}
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Request a Quote</h2>
            <p className="text-xs text-gray-400">From: {vendor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EEF2FF' }}>
            <Lock size={13} style={{ color: '#1B4FD8', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: '#1B4FD8' }}>Your request goes through ChurchesOS. Vendor contact details are protected until booking is confirmed and payment is made.</p>
          </div>

          {[
            { label: 'Your Name *', field: 'contactName', type: 'text', ph: 'Pastor or coordinator name' },
            { label: 'Your Phone *', field: 'contactPhone', type: 'tel', ph: '+233 24 000 0000' },
            { label: 'Event Date *', field: 'eventDate', type: 'date' },
            { label: 'Event Type *', field: 'eventType', type: 'text', ph: 'e.g. Sunday Service, Crusade, Wedding' },
            { label: 'Expected Attendance', field: 'guestCount', type: 'number', ph: 'Number of people' },
            { label: 'Budget (GHC)', field: 'budget', type: 'text', ph: 'e.g. GHC 2,000' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph || ''}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Details & Requirements *</label>
            <textarea rows={4} value={form.details} onChange={e => update('details', e.target.value)}
              placeholder="Describe exactly what you need from this vendor..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={handleSubmit}
            disabled={!form.contactName || !form.contactPhone || !form.eventDate || !form.details}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Send size={15} /> Send Quote Request
          </button>
        </div>
      </div>
    </div>
  )
}

function VendorDetailModal({ vendor, onClose, onRequestQuote }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: '#1B4FD8' }}>
              {vendor.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{vendor.name}</h2>
                {vendor.verified && (
                  <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#166534' }}>
                    <Shield size={9} /> Verified
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">{categoryLabels[vendor.category]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">About</p>
            <p className="text-sm text-gray-700 leading-relaxed">{vendor.description}</p>
          </div>

          {vendor.services && (
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Services Offered</p>
              <p className="text-sm text-gray-700 leading-relaxed">{vendor.services}</p>
            </div>
          )}

          {vendor.priceRange && (
            <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#1B4FD8' }}>Price Range</p>
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>{vendor.priceRange}</p>
            </div>
          )}

          {vendor.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} style={{ color: '#1B4FD8' }} />
              <span>{vendor.location}</span>
            </div>
          )}

          {/* Contact details are HIDDEN - platform-only communication */}
          <div className="p-4 rounded-xl border-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} className="text-gray-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact Protected</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Vendor contact details are protected. Use the Request Quote button below to communicate through ChurchesOS. This ensures your payment is protected and the vendor is accountable.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={() => { onClose(); onRequestQuote(vendor) }}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Send size={15} /> Request a Quote
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  const getApprovedVendors = () => {
    try {
      const all = JSON.parse(localStorage.getItem('cos_vendor_applications') || '[]')
      return all.filter(v => v.status === 'Approved').map(v => ({
        id: v.id,
        name: v.businessName,
        category: v.category,
        description: v.description,
        location: v.city,
        services: v.servicesOffered,
        priceRange: v.priceRange,
        verified: true,
        rating: 4.8,
      }))
    } catch(e) { return [] }
  }

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [quoteVendor, setQuoteVendor] = useState(null)
  const vendors = getApprovedVendors()

  const filtered = vendors.filter(v => {
    const matchSearch = v.name?.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || v.category === filterCat
    return matchSearch && matchCat
  })

  const categories = [...new Set(vendors.map(v => v.category).filter(Boolean))]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Church Marketplace</h1>
          <p className="text-gray-400 text-sm mt-1">{vendors.length} verified vendors • All transactions protected by ChurchesOS</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl mb-6 flex items-start gap-3 fade-in" style={{ background: '#EEF2FF' }}>
        <Shield size={18} style={{ color: '#1B4FD8', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-bold mb-0.5" style={{ color: '#1B4FD8' }}>Protected Marketplace</p>
          <p className="text-xs text-gray-500">All vendor contact details are hidden. Use Request Quote to connect. Payments are processed through ChurchesOS, protecting both your church and the vendor.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vendors and services..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filterCat === c ? '#1B4FD8' : 'white', color: filterCat === c ? 'white' : '#6B7280', border: '1px solid ' + (filterCat === c ? '#1B4FD8' : '#E5E7EB') }}>
              {c === 'All' ? 'All' : categoryLabels[c] || c}
            </button>
          ))}
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-24 fade-in">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No vendors yet</h3>
          <p className="text-gray-400 text-sm">Vendors are being reviewed and will appear here once approved</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 fade-in">
          <p className="text-gray-400 text-sm">No vendors found for your search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: '#1B4FD8' }}>
                    {v.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '16px' }}>{v.name}</h3>
                      <Shield size={11} style={{ color: '#059669' }} />
                    </div>
                    <p className="text-xs text-gray-400">{categoryLabels[v.category] || v.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} fill="#F59E0B" stroke="none" />
                  <span className="text-xs font-bold text-gray-600">{v.rating}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{v.description}</p>

              {v.priceRange && (
                <p className="text-xs font-semibold mb-3" style={{ color: '#1B4FD8' }}>From {v.priceRange}</p>
              )}

              {v.location && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                  <MapPin size={10} /> {v.location}
                </p>
              )}

              {/* NO phone/email shown - completely hidden */}
              <div className="flex items-center gap-1.5 p-2 rounded-lg mb-4" style={{ background: '#F8FAFF' }}>
                <Lock size={10} className="text-gray-300 flex-shrink-0" />
                <span className="text-xs text-gray-300">Contact protected — use quote request</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedVendor(v)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                  View Details
                </button>
                <button onClick={() => setQuoteVendor(v)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1"
                  style={{ background: '#1B4FD8' }}>
                  <Send size={11} /> Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onRequestQuote={(v) => setQuoteVendor(v)}
        />
      )}
      {quoteVendor && (
        <RequestQuoteModal
          vendor={quoteVendor}
          onClose={() => setQuoteVendor(null)}
        />
      )}
    </div>
  )
}
