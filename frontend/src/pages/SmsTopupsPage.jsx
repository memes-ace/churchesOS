import { useState, useEffect } from 'react'
import { Check, X, Phone, ToggleLeft, ToggleRight } from 'lucide-react'
import { smsTopupAPI, adminAPI } from '../utils/api'

const statusConfig = {
  pending:  { bg: '#FEF9C3', text: '#854D0E' },
  approved: { bg: '#DCFCE7', text: '#166534' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function SmsTopupsPage() {
  const [topups, setTopups] = useState([])
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [tab, setTab] = useState('requests')

  useEffect(() => {
    Promise.allSettled([
      smsTopupAPI.getAll(),
      adminAPI.getChurches(),
    ]).then(([t, c]) => {
      if (t.status === 'fulfilled' && Array.isArray(t.value)) setTopups(t.value)
      if (c.status === 'fulfilled' && Array.isArray(c.value)) setChurches(c.value)
    }).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await smsTopupAPI.approve(id)
      setTopups(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t))
      // Update church sms_enabled in churches list
      const topup = topups.find(t => t.id === id)
      if (topup) {
        setChurches(prev => prev.map(c => c.id === topup.church_id ? { ...c, sms_enabled: true } : c))
      }
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await smsTopupAPI.reject(id)
      setTopups(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t))
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const handleToggleSms = async (churchId, currentStatus) => {
    setActionLoading(churchId)
    try {
      await smsTopupAPI.toggleSms(churchId, !currentStatus)
      setChurches(prev => prev.map(c => c.id === churchId ? { ...c, sms_enabled: !currentStatus } : c))
    } catch(e) { console.warn(e) }
    finally { setActionLoading(null) }
  }

  const pending = topups.filter(t => t.status === 'pending').length
  const filtered = filter === 'all' ? topups : topups.filter(t => t.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>
            SMS Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage SMS bundles and top up requests</p>
        </div>
        {pending > 0 && (
          <div className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: '#FEF9C3', color: '#854D0E' }}>
            {pending} pending request{pending > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'requests', label: 'Top Up Requests' },
          { key: 'churches', label: 'SMS Control' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: tab === t.key ? '#1B4FD8' : 'white',
              color: tab === t.key ? 'white' : '#6B7280',
              border: '1px solid ' + (tab === t.key ? '#1B4FD8' : '#E5E7EB')
            }}>
            {t.label}
            {t.key === 'requests' && pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#FEF9C3', color: '#854D0E' }}>
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'requests' && (
        <>
          {/* Filter */}
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

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <Phone size={40} className="mx-auto mb-3 text-gray-200" />
              <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                No top up requests
              </h3>
              <p className="text-gray-400 text-sm">Churches will appear here when they submit SMS top up requests</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Church', 'Amount', 'Transaction ID', 'Notes', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(t => {
                    const sc = statusConfig[t.status] || statusConfig.pending
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="text-sm font-semibold text-gray-800">{t.church_name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-bold" style={{ color: '#059669' }}>GHC {t.amount}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">{t.transaction_id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs text-gray-500">{t.notes || '—'}</p>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-400">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                            style={{ background: sc.bg, color: sc.text }}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {t.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(t.id)}
                                disabled={actionLoading === t.id}
                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                                style={{ background: '#DCFCE7', color: '#166534' }}>
                                <Check size={12} /> Approve & Enable
                              </button>
                              <button onClick={() => handleReject(t.id)}
                                disabled={actionLoading === t.id}
                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                                style={{ background: '#FEE2E2', color: '#991B1B' }}>
                                <X size={12} /> Reject
                              </button>
                            </div>
                          )}
                          {t.status !== 'pending' && (
                            <span className="text-xs text-gray-400 capitalize">{t.status}</span>
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

      {tab === 'churches' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Church', 'Plan', 'SMS Status', 'Toggle SMS'].map(h => (
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
                        background: c.sms_enabled ? '#DCFCE7' : '#FEF9C3',
                        color: c.sms_enabled ? '#166534' : '#854D0E'
                      }}>
                      {c.sms_enabled ? '✓ Active' : 'Bundle Finished'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleSms(c.id, c.sms_enabled)}
                      disabled={actionLoading === c.id}
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition disabled:opacity-50"
                      style={{
                        background: c.sms_enabled ? '#FEE2E2' : '#DCFCE7',
                        color: c.sms_enabled ? '#991B1B' : '#166534'
                      }}>
                      {c.sms_enabled
                        ? <><ToggleRight size={16} /> Block SMS</>
                        : <><ToggleLeft size={16} /> Enable SMS</>
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
