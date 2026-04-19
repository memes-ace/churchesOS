import { useState, useEffect } from 'react'
import { Check, X, Clock, DollarSign, Eye, ChevronDown } from 'lucide-react'
import { adminAPI } from '../utils/api'

const statusConfig = {
  pending:  { bg: '#FEF9C3', text: '#854D0E', label: 'Pending' },
  approved: { bg: '#DCFCE7', text: '#166534', label: 'Approved' },
  rejected: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
}

export default function QuoteRequestsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    adminAPI.getPayments()
      .then(data => { if (Array.isArray(data)) setPayments(data) })
      .catch(e => console.warn('Payments load error:', e))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await adminAPI.approvePayment(id)
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'approved' }))
    } catch(e) {
      console.warn('Approve error:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await adminAPI.rejectPayment(id)
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'rejected' }))
    } catch(e) {
      console.warn('Reject error:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const pending = payments.filter(p => p.status === 'pending').length
  const approved = payments.filter(p => p.status === 'approved').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>
            Payment Requests
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {pending} pending approval • {approved} approved
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 fade-in">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: filter === f.key ? '#1B4FD8' : 'white',
              color: filter === f.key ? 'white' : '#6B7280',
              border: '1px solid ' + (filter === f.key ? '#1B4FD8' : '#E5E7EB')
            }}>
            {f.label}
            {f.key === 'pending' && pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#FEF9C3', color: '#854D0E' }}>
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading payment requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: "Cormorant Garamond" }}>
            No payment requests
          </h3>
          <p className="text-gray-400 text-sm">
            {filter === 'all' ? 'Churches will appear here when they request a plan upgrade' : `No ${filter} payments`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Plan', 'Amount', 'Method', 'Reference', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const status = statusConfig[p.status] || statusConfig.pending
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-800">{p.church_name}</p>
                      <p className="text-xs text-gray-400">{p.church_id?.slice(0, 8)}...</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                        style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                        {p.plan_requested}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold" style={{ color: '#059669' }}>
                      GHC {Number(p.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{p.payment_method}</td>
                    <td className="py-4 px-4">
                      <p className="text-xs font-mono text-gray-700">{p.reference}</p>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                        style={{ background: status.bg, color: status.text }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {p.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(p.id)}
                            disabled={actionLoading === p.id}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                            style={{ background: '#DCFCE7', color: '#166534' }}>
                            <Check size={12} /> {actionLoading === p.id ? '...' : 'Approve'}
                          </button>
                          <button onClick={() => handleReject(p.id)}
                            disabled={actionLoading === p.id}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                            style={{ background: '#FEE2E2', color: '#991B1B' }}>
                            <X size={12} /> Reject
                          </button>
                        </div>
                      )}
                      {p.status !== 'pending' && (
                        <span className="text-xs text-gray-400 capitalize">{p.status}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
