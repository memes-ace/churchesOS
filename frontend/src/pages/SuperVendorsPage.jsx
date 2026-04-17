import { useState } from 'react'
import { Search, Check, X, Eye, Store, Phone, Mail, MapPin, DollarSign } from 'lucide-react'

const categoryLabels = {
  sound: '🎵 Sound & Audio', media: '🖨️ Media & Printing', catering: '🍽️ Catering',
  transport: '🚌 Transport', decor: '🎪 Decoration', instruments: '🎸 Instruments',
  tech: '💻 Technology', clothing: '👔 Clothing', books: '📚 Books', other: '✨ Other',
}

const statusConfig = {
  Pending: { bg: '#FEF9C3', text: '#854D0E' },
  Approved: { bg: '#DCFCE7', text: '#166534' },
  Rejected: { bg: '#FEE2E2', text: '#991B1B' },
  Suspended: { bg: '#F3F4F6', text: '#6B7280' },
}

function VendorDetailModal({ vendor, onClose, onApprove, onReject, onSuspend }) {
  const [tab, setTab] = useState('details')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: '#1B4FD8' }}>
              {vendor.businessName?.charAt(0) || 'V'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>{vendor.businessName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: statusConfig[vendor.status]?.bg, color: statusConfig[vendor.status]?.text }}>
                  {vendor.status}
                </span>
                <span className="text-xs text-gray-400">{categoryLabels[vendor.category] || vendor.category}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          {['details', 'services', 'payment'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium capitalize transition"
              style={{ color: tab === t ? '#1B4FD8' : '#6B7280', borderBottom: tab === t ? '2px solid #1B4FD8' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Business Name', value: vendor.businessName },
                  { label: 'Business Type', value: vendor.businessType || 'Not specified' },
                  { label: 'Owner Name', value: vendor.ownerName },
                  { label: 'Phone', value: vendor.ownerPhone },
                  { label: 'WhatsApp', value: vendor.whatsapp || vendor.ownerPhone },
                  { label: 'Email', value: vendor.ownerEmail },
                  { label: 'Address', value: vendor.businessAddress },
                  { label: 'City', value: vendor.city },
                  { label: 'Region', value: vendor.region },
                  { label: 'Reference', value: vendor.refNumber },
                  { label: 'Applied Date', value: vendor.appliedDate ? new Date(vendor.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800">{d.value || '—'}</p>
                  </div>
                ))}
              </div>
              {vendor.description && (
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-1">Business Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{vendor.description}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'services' && (
            <div className="space-y-4">
              {vendor.servicesOffered && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Services Offered</p>
                  <p className="text-sm text-gray-700 leading-relaxed p-4 rounded-xl bg-gray-50">{vendor.servicesOffered}</p>
                </div>
              )}
              {vendor.priceRange && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
                  <p className="text-sm text-gray-700 p-4 rounded-xl bg-gray-50">{vendor.priceRange}</p>
                </div>
              )}
              {vendor.churchesServed && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Churches Previously Served</p>
                  <p className="text-sm text-gray-700 leading-relaxed p-4 rounded-xl bg-gray-50">{vendor.churchesServed}</p>
                </div>
              )}
              {(vendor.website || vendor.instagram || vendor.facebook) && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Online Presence</p>
                  <div className="space-y-2">
                    {vendor.website && <p className="text-sm text-blue-600">{vendor.website}</p>}
                    {vendor.instagram && <p className="text-sm text-gray-600">Instagram: {vendor.instagram}</p>}
                    {vendor.facebook && <p className="text-sm text-gray-600">Facebook: {vendor.facebook}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'payment' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-sm font-bold mb-1" style={{ color: '#1B4FD8' }}>Commission Agreement</p>
                <p className="text-xs text-gray-600">Agreed to 3% platform commission: <strong>{vendor.agreeToCommission ? 'Yes' : 'No'}</strong></p>
                <p className="text-xs text-gray-600 mt-1">Agreed to terms: <strong>{vendor.agreeToTerms ? 'Yes' : 'No'}</strong></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'MoMo Number', value: vendor.momoNumber },
                  { label: 'MoMo Name', value: vendor.momoName },
                  { label: 'Bank Name', value: vendor.bankName || 'Not provided' },
                  { label: 'Account Number', value: vendor.accountNumber || 'Not provided' },
                  { label: 'Account Name', value: vendor.accountName || 'Not provided' },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800">{d.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {vendor.status === 'Pending' && (
            <>
              <button onClick={() => { onApprove(vendor.id); onClose() }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: '#059669' }}>
                <Check size={15} /> Approve Vendor
              </button>
              <button onClick={() => { onReject(vendor.id); onClose() }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: '#DC2626' }}>
                <X size={15} /> Reject
              </button>
            </>
          )}
          {vendor.status === 'Approved' && (
            <button onClick={() => { onSuspend(vendor.id); onClose() }}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#F59E0B' }}>
              Suspend Vendor
            </button>
          )}
          {(vendor.status === 'Rejected' || vendor.status === 'Suspended') && (
            <button onClick={() => { onApprove(vendor.id); onClose() }}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: '#059669' }}>
              Re-activate Vendor
            </button>
          )}
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function SuperVendorsPage() {
  const [vendors, setVendors] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cos_vendor_applications') || '[]') }
    catch(e) { return [] }
  })
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const saveVendors = (list) => {
    setVendors(list)
    try { localStorage.setItem('cos_vendor_applications', JSON.stringify(list)) } catch(e) {}
  }

  const updateStatus = (id, status) => saveVendors(vendors.map(v => v.id === id ? { ...v, status, approvedDate: status === 'Approved' ? new Date().toISOString() : v.approvedDate } : v))
  const approve = (id) => updateStatus(id, 'Approved')
  const reject = (id) => updateStatus(id, 'Rejected')
  const suspend = (id) => updateStatus(id, 'Suspended')

  const filtered = vendors.filter(v => {
    const matchSearch = v.businessName?.toLowerCase().includes(search.toLowerCase()) || v.ownerName?.toLowerCase().includes(search.toLowerCase()) || v.city?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || v.status === filter
    return matchSearch && matchFilter
  })

  const stats = {
    total: vendors.length,
    pending: vendors.filter(v => v.status === 'Pending').length,
    approved: vendors.filter(v => v.status === 'Approved').length,
    rejected: vendors.filter(v => v.status === 'Rejected').length,
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Vendor Management</h1>
          <p className="text-gray-400 text-sm mt-1">{stats.total} applications • {stats.pending} pending review</p>
        </div>
        <a href="/vendor-register" target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <Store size={15} /> View Registration Page
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Applications', value: stats.total, color: '#1B4FD8', bg: '#EEF2FF' },
          { label: 'Pending Review', value: stats.pending, color: '#F59E0B', bg: '#FEF9C3' },
          { label: 'Approved Vendors', value: stats.approved, color: '#059669', bg: '#DCFCE7' },
          { label: 'Rejected', value: stats.rejected, color: '#DC2626', bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 stat-card" style={{ background: s.bg }}>
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected', 'Suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-24 fade-in">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No vendor applications yet</h3>
          <p className="text-gray-400 text-sm mb-6">Share the vendor registration link with businesses that serve churches</p>
          <div className="p-4 rounded-xl inline-block" style={{ background: '#EEF2FF' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#1B4FD8' }}>Vendor Registration Link</p>
            <p className="text-sm font-mono" style={{ color: '#1B4FD8' }}>/vendor-register</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Vendor', 'Category', 'Location', 'Contact', 'Applied', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(v)}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>
                        {v.businessName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{v.businessName}</p>
                        <p className="text-xs text-gray-400">{v.ownerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500">{categoryLabels[v.category] || v.category}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.city}{v.region ? ', ' + v.region : ''}</td>
                  <td className="py-4 px-4">
                    <p className="text-xs text-gray-600">{v.ownerPhone}</p>
                    <p className="text-xs text-gray-400">{v.ownerEmail}</p>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-400">
                    {v.appliedDate ? new Date(v.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: statusConfig[v.status]?.bg, color: statusConfig[v.status]?.text }}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {v.status === 'Pending' && (
                        <>
                          <button onClick={e => { e.stopPropagation(); approve(v.id) }}
                            className="p-1.5 hover:bg-green-50 rounded-lg" title="Approve">
                            <Check size={14} style={{ color: '#059669' }} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); reject(v.id) }}
                            className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject">
                            <X size={14} style={{ color: '#DC2626' }} />
                          </button>
                        </>
                      )}
                      <button onClick={e => { e.stopPropagation(); setSelected(v) }}
                        className="p-1.5 hover:bg-blue-50 rounded-lg" title="View Details">
                        <Eye size={14} style={{ color: '#1B4FD8' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <VendorDetailModal
          vendor={selected}
          onClose={() => setSelected(null)}
          onApprove={approve}
          onReject={reject}
          onSuspend={suspend}
        />
      )}
    </div>
  )
}

export function QuoteRequestsPage() {
  const getRequests = () => {
    try { return JSON.parse(localStorage.getItem('cos_quote_requests') || '[]') }
    catch(e) { return [] }
  }
  const [requests, setRequests] = useState(getRequests)
  const [filter, setFilter] = useState('All')

  const updateStatus = (id, status) => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r)
    setRequests(updated)
    try { localStorage.setItem('cos_quote_requests', JSON.stringify(updated)) } catch(e) {}
  }

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter)

  const statusConfig = {
    Pending: { bg: '#FEF9C3', text: '#854D0E' },
    Responded: { bg: '#DBEAFE', text: '#1E40AF' },
    Booked: { bg: '#DCFCE7', text: '#166634' },
    Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Quote Requests</h1>
          <p className="text-gray-400 text-sm mt-1">{requests.length} total • {requests.filter(r => r.status === 'Pending').length} pending</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {['All', 'Pending', 'Responded', 'Booked', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400 text-sm">No quote requests yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Vendor', 'Event', 'Date', 'Budget', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-800">{r.churchName}</p>
                    <p className="text-xs text-gray-400">{r.contactName} • {r.contactPhone}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{r.vendorName}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{r.eventType}</td>
                  <td className="py-4 px-4 text-xs text-gray-500">{r.eventDate}</td>
                  <td className="py-4 px-4 text-sm font-semibold" style={{ color: '#059669' }}>{r.budget || '—'}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: statusConfig[r.status]?.bg, color: statusConfig[r.status]?.text }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none">
                      <option>Pending</option>
                      <option>Responded</option>
                      <option>Booked</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
