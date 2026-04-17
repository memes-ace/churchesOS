import { useState } from 'react'
import { Eye, EyeOff, Check, X, Phone, Lock, Unlock, DollarSign, ChevronDown } from 'lucide-react'

const statusConfig = {
  Pending: { bg: '#FEF9C3', text: '#854D0E', label: 'Pending' },
  'Vendor Notified': { bg: '#DBEAFE', text: '#1E40AF', label: 'Vendor Notified' },
  'Quote Sent': { bg: '#EDE9FE', text: '#5B21B6', label: 'Quote Sent' },
  'Awaiting Payment': { bg: '#FFF7ED', text: '#9A3412', label: 'Awaiting Payment' },
  'Payment Confirmed': { bg: '#DCFCE7', text: '#166534', label: 'Payment Confirmed' },
  Completed: { bg: '#F0FDF4', text: '#166534', label: 'Completed' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
}

function RequestDetailModal({ request, vendors, onClose, onUpdate }) {
  const [status, setStatus] = useState(request.status)
  const [commission, setCommission] = useState(request.commission || '')
  const [totalAmount, setTotalAmount] = useState(request.totalAmount || '')
  const [showVendorContact, setShowVendorContact] = useState(false)
  const [releaseContact, setReleaseContact] = useState(request.contactReleased || false)

  const vendor = vendors.find(v => v.id === request.vendorId)
  const commissionAmount = totalAmount ? Math.round(Number(totalAmount) * 0.03) : 0
  const vendorReceives = totalAmount ? Number(totalAmount) - commissionAmount : 0

  const handleSave = () => {
    onUpdate({
      ...request,
      status,
      commission: commissionAmount,
      totalAmount,
      contactReleased: releaseContact,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Quote Request Details</h2>
            <p className="text-xs text-gray-400">#{request.id} • {new Date(request.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Church Info */}
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Church (Requesting Party)</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Church', value: request.churchName },
                { label: 'Contact Person', value: request.contactName },
                { label: 'Phone', value: request.contactPhone },
                { label: 'Event Type', value: request.eventType },
                { label: 'Event Date', value: request.eventDate },
                { label: 'Guest Count', value: request.guestCount || 'Not specified' },
                { label: 'Budget', value: request.budget || 'Not specified' },
              ].map(d => (
                <div key={d.label} className="p-2.5 rounded-xl bg-white">
                  <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                  <p className="text-sm font-medium text-gray-800">{d.value}</p>
                </div>
              ))}
            </div>
            {request.details && (
              <div className="mt-3 p-3 rounded-xl bg-white">
                <p className="text-xs text-gray-400 mb-1">Requirements</p>
                <p className="text-sm text-gray-700 leading-relaxed">{request.details}</p>
              </div>
            )}
          </div>

          {/* Vendor Info - visible to super admin only */}
          <div className="p-4 rounded-xl" style={{ background: '#EDE9FE' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#5B21B6' }}>Vendor (Supplier)</p>
              <button onClick={() => setShowVendorContact(!showVendorContact)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg"
                style={{ background: '#7C3AED', color: 'white' }}>
                {showVendorContact ? <EyeOff size={11} /> : <Eye size={11} />}
                {showVendorContact ? 'Hide' : 'Show'} Contact
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-white">
                <p className="text-xs text-gray-400 mb-0.5">Business</p>
                <p className="text-sm font-medium text-gray-800">{vendor?.businessName || request.vendorName}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white">
                <p className="text-xs text-gray-400 mb-0.5">Category</p>
                <p className="text-sm font-medium text-gray-800">{vendor?.category || '—'}</p>
              </div>
              {showVendorContact && vendor && (
                <>
                  <div className="p-2.5 rounded-xl bg-white">
                    <p className="text-xs text-gray-400 mb-0.5">Owner</p>
                    <p className="text-sm font-medium text-gray-800">{vendor.ownerName}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white">
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{vendor.ownerPhone}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">WhatsApp</p>
                    <p className="text-sm font-medium text-gray-800">{vendor.whatsapp || vendor.ownerPhone}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment & Commission */}
          <div className="p-4 rounded-xl" style={{ background: '#F0FDF4' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#166534' }}>Payment & Commission</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Total Job Amount (GHC)</label>
                <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Commission Rate</label>
                <div className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 font-medium" style={{ color: '#059669' }}>3%</div>
              </div>
            </div>
            {totalAmount && (
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl" style={{ background: '#DCFCE7' }}>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-sm font-bold text-gray-800">GHC {Number(totalAmount).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Your Commission</p>
                  <p className="text-sm font-bold" style={{ color: '#059669' }}>GHC {commissionAmount.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Vendor Gets</p>
                  <p className="text-sm font-bold text-gray-800">GHC {vendorReceives.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Update Status</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(statusConfig).map(([s, cfg]) => (
                <button key={s} onClick={() => setStatus(s)}
                  className="p-3 rounded-xl border-2 text-xs font-medium transition text-left"
                  style={{ borderColor: status === s ? cfg.text : '#E5E7EB', background: status === s ? cfg.bg : 'white', color: status === s ? cfg.text : '#6B7280' }}>
                  {status === s && '✓ '}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Release Contact Toggle */}
          <div className="p-4 rounded-xl border-2" style={{ borderColor: releaseContact ? '#059669' : '#E5E7EB', background: releaseContact ? '#F0FDF4' : '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {releaseContact ? <Unlock size={18} style={{ color: '#059669' }} /> : <Lock size={18} className="text-gray-400" />}
                <div>
                  <p className="text-sm font-bold text-gray-800">Release Vendor Contact to Church</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {releaseContact
                      ? 'Church can now see vendor phone number and contact them directly'
                      : 'Only release after payment is confirmed. Church cannot see vendor contact yet.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setReleaseContact(!releaseContact)}
                className="w-12 h-6 rounded-full flex items-center transition-all flex-shrink-0"
                style={{ background: releaseContact ? '#059669' : '#E5E7EB', padding: '2px' }}>
                <div className="w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ transform: releaseContact ? 'translateX(24px)' : 'translateX(0)' }}></div>
              </button>
            </div>
            {releaseContact && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: '#DCFCE7' }}>
                <p className="text-xs font-medium" style={{ color: '#166534' }}>
                  ✓ Church will now see: {vendor?.ownerPhone || 'Vendor phone'} and {vendor?.whatsapp || vendor?.ownerPhone || 'WhatsApp'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#1B4FD8' }}>
            Save Changes
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuoteRequestsPage() {
  const getRequests = () => {
    try { return JSON.parse(localStorage.getItem('cos_quote_requests') || '[]') }
    catch(e) { return [] }
  }
  const getVendors = () => {
    try { return JSON.parse(localStorage.getItem('cos_vendor_applications') || '[]') }
    catch(e) { return [] }
  }

  const [requests, setRequests] = useState(getRequests)
  const [vendors] = useState(getVendors)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const saveRequests = (list) => {
    setRequests(list)
    try { localStorage.setItem('cos_quote_requests', JSON.stringify(list)) } catch(e) {}
  }

  const handleUpdate = (updated) => {
    saveRequests(requests.map(r => r.id === updated.id ? updated : r))
    setSelected(null)
  }

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter)

  const totalCommission = requests
    .filter(r => r.status === 'Payment Confirmed' || r.status === 'Completed')
    .reduce((s, r) => s + Number(r.commission || 0), 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Quote Requests</h1>
          <p className="text-gray-400 text-sm mt-1">{requests.length} total • {requests.filter(r => r.status === 'Pending').length} new</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: '#DCFCE7' }}>
          <p className="text-xs font-bold mb-0.5" style={{ color: '#059669' }}>Commission Earned</p>
          <p className="text-xl font-bold" style={{ color: '#059669' }}>GHC {totalCommission.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6 fade-in">
        {Object.entries(statusConfig).map(([s, cfg]) => (
          <button key={s} onClick={() => setFilter(s === filter ? 'All' : s)}
            className="p-3 rounded-xl text-center transition border-2"
            style={{ background: filter === s ? cfg.bg : 'white', borderColor: filter === s ? cfg.text : '#E5E7EB' }}>
            <p className="text-lg font-bold" style={{ color: cfg.text }}>{requests.filter(r => r.status === s).length}</p>
            <p className="text-xs font-medium" style={{ color: cfg.text }}>{s}</p>
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No quote requests yet</h3>
          <p className="text-gray-400 text-sm">When churches request quotes from vendors it will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Vendor', 'Event', 'Date', 'Budget', 'Commission', 'Contact', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => {
                const cfg = statusConfig[r.status] || statusConfig.Pending
                return (
                  <tr key={r.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(r)}>
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-800">{r.churchName}</p>
                      <p className="text-xs text-gray-400">{r.contactName}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{r.vendorName}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{r.eventType}</td>
                    <td className="py-4 px-4 text-xs text-gray-500">{r.eventDate}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{r.budget || '—'}</td>
                    <td className="py-4 px-4 text-sm font-bold" style={{ color: '#059669' }}>
                      {r.commission ? 'GHC ' + Number(r.commission).toLocaleString() : '—'}
                    </td>
                    <td className="py-4 px-4">
                      {r.contactReleased ? (
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#059669' }}>
                          <Unlock size={11} /> Released
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                          <Lock size={11} /> Locked
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: cfg.bg, color: cfg.text }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={e => { e.stopPropagation(); setSelected(r) }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                        Manage
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <RequestDetailModal
          request={selected}
          vendors={vendors}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
