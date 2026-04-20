import { useState, useEffect } from 'react'
import { Check, X, Store, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'
import { marketplaceAPI, adminAPI } from '../utils/api'

const statusConfig = {
  pending:  { bg: '#FEF9C3', text: '#854D0E' },
  approved: { bg: '#DCFCE7', text: '#166534' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function MarketplaceAdminPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [tab, setTab] = useState('subscriptions')

  useEffect(() => {
    Promise.allSettled([
      marketplaceAPI.getAll(),
      adminAPI.getChurches(),
    ]).then(([s, c]) => {
      if (s.status === 'fulfilled' && Array.isArray(s.value)) setSubscriptions(s.value)
      if (c.status === 'fulfilled' && Array.isArray(c.value)) setChurches(c.value)
    }).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await marketplaceAPI.approve(id)
      const sub = subscriptions.find(s => s.id === id)
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s))
      if (sub) setChurches(prev => prev.map(c => c.id === sub.church_id ? { ...c, marketplace_enabled: true } : c))
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await marketplaceAPI.reject(id)
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s))
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const handleToggle = async (churchId, current) => {
    setActionLoading(churchId)
    try {
      await marketplaceAPI.toggle(churchId, !current)
      setChurches(prev => prev.map(c => c.id === churchId ? { ...c, marketplace_enabled: !current } : c))
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const pending = subscriptions.filter(s => s.status === 'pending').length
  const filtered = filter === 'all' ? subscriptions : subscriptions.filter(s => s.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>
            Marketplace Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage marketplace subscriptions and vendor applications</p>
        </div>
        <a href="/vendor-apply" target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
          <ExternalLink size={14} /> Vendor Apply Link
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'subscriptions', label: 'Church Subscriptions' },
          { key: 'access', label: 'Access Control' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: tab === t.key ? '#1B4FD8' : 'white',
              color: tab === t.key ? 'white' : '#6B7280',
              border: '1px solid ' + (tab === t.key ? '#1B4FD8' : '#E5E7EB')
            }}>
            {t.label}
            {t.key === 'subscriptions' && pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#FEF9C3', color: '#854D0E' }}>
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'subscriptions' && (
        <>
          <div className="flex gap-2 mb-5">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition"
                style={{
                  background: filter === f ? '#1B4FD8' : 'white',
                  color: filter === f ? 'white' : '#6B7280',
                  border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB')
                }}>
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <Store size={40} className="mx-auto mb-3 text-gray-200" />
              <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                No subscriptions yet
              </h3>
              <p className="text-gray-400 text-sm">Churches will appear here when they subscribe to the marketplace</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Church', 'Amount', 'Transaction ID', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(s => {
                    const sc = statusConfig[s.status] || statusConfig.pending
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="text-sm font-semibold text-gray-800">{s.church_name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-bold" style={{ color: '#059669' }}>GHC {s.amount}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">{s.transaction_id}</p>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-400">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                            style={{ background: sc.bg, color: sc.text }}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {s.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id}
                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                                style={{ background: '#DCFCE7', color: '#166534' }}>
                                <Check size={12} /> Approve
                              </button>
                              <button onClick={() => handleReject(s.id)} disabled={actionLoading === s.id}
                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                                style={{ background: '#FEE2E2', color: '#991B1B' }}>
                                <X size={12} /> Reject
                              </button>
                            </div>
                          )}
                          {s.status !== 'pending' && (
                            <span className="text-xs text-gray-400 capitalize">{s.status}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'access' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Plan', 'Marketplace Access', 'Toggle'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {churches.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.pastor_name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                      {c.plan || 'trial'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: c.marketplace_enabled ? '#DCFCE7' : '#FEE2E2',
                        color: c.marketplace_enabled ? '#166534' : '#991B1B'
                      }}>
                      {c.marketplace_enabled ? '✓ Active' : '✗ No Access'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={() => handleToggle(c.id, c.marketplace_enabled)}
                      disabled={actionLoading === c.id}
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition disabled:opacity-50"
                      style={{
                        background: c.marketplace_enabled ? '#FEE2E2' : '#DCFCE7',
                        color: c.marketplace_enabled ? '#991B1B' : '#166634'
                      }}>
                      {c.marketplace_enabled
                        ? <><ToggleRight size={16} /> Revoke Access</>
                        : <><ToggleLeft size={16} /> Grant Access</>
                      }
                    </button>
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
