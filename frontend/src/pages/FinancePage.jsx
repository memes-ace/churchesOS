import { financeAPI } from '../utils/api'
import { useState, useEffect } from 'react'
import { Plus, X, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const trendData = [
  { month: 'Oct', income: 6000, expenses: 3200 },
  { month: 'Nov', income: 6900, expenses: 3800 },
  { month: 'Dec', income: 9600, expenses: 4200 },
  { month: 'Jan', income: 7400, expenses: 3600 },
  { month: 'Feb', income: 8300, expenses: 3900 },
  { month: 'Mar', income: 9200, expenses: 4550 },
]

function PaymentMethodsTab({ churchId, token }) {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Mobile Money', number: '', account_name: '', instructions: '' })

  useEffect(() => {
    fetch(`/api/admin/churches/${churchId}/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => { setMethods(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])

  const save = async (newMethods) => {
    await fetch(`/api/admin/churches/${churchId}/payment-methods`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ methods: newMethods })
    })
  }

  const addMethod = () => {
    if (!form.name || !form.number) return
    const newMethods = [...methods, { ...form, id: Date.now().toString() }]
    setMethods(newMethods)
    save(newMethods)
    setForm({ name: '', type: 'Mobile Money', number: '', account_name: '', instructions: '' })
    setShowAdd(false)
  }

  const deleteMethod = (id) => {
    const newMethods = methods.filter(m => m.id !== id)
    setMethods(newMethods)
    save(newMethods)
  }

  if (loading) return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-800">Payment Methods</h3>
          <p className="text-xs text-gray-400 mt-0.5">These appear in the Member Portal so members can pay tithes, offerings and donations</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: '#1B4FD8' }}>
          <Plus size={14} /> Add Method
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">💳</div>
          <p className="font-medium text-gray-600 mb-1">No payment methods yet</p>
          <p className="text-sm">Add MoMo, bank account or other payment methods for your members</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map(m => (
            <div key={m.id} className="p-4 rounded-2xl border border-gray-100 bg-white flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: '#EEF2FF' }}>
                  {m.type === 'Mobile Money' ? '📲' : m.type === 'Bank Transfer' ? '🏦' : '💳'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.type}</p>
                  <p className="text-sm font-mono font-bold mt-1" style={{ color: '#1B4FD8' }}>{m.number}</p>
                  {m.account_name && <p className="text-xs text-gray-500">{m.account_name}</p>}
                  {m.instructions && <p className="text-xs text-gray-400 mt-1 italic">{m.instructions}</p>}
                </div>
              </div>
              <button onClick={() => deleteMethod(m.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Add Payment Method</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Method Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                  placeholder="e.g. Tithe & Offering, General Donation"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Type *</label>
                <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option>Mobile Money</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Number / Account *</label>
                <input type="text" value={form.number} onChange={e => setForm(p => ({...p, number: e.target.value}))}
                  placeholder="e.g. 0244000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Account Name</label>
                <input type="text" value={form.account_name} onChange={e => setForm(p => ({...p, account_name: e.target.value}))}
                  placeholder="e.g. Grace Chapel International"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Instructions (optional)</label>
                <input type="text" value={form.instructions} onChange={e => setForm(p => ({...p, instructions: e.target.value}))}
                  placeholder="e.g. Use your name as reference"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
              <button onClick={addMethod}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: '#1B4FD8' }}>
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddModal({ onClose }) {
  const [type, setType] = useState('income')
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const [form, setForm] = useState({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], payment_method: 'Cash', notes: '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.description || !form.amount) return
    setLoading(true)
    try {
      await financeAPI.addTransaction({
        type, description: form.description, amount: Number(form.amount),
        category: form.category, date: form.date,
        payment_method: form.payment_method, notes: form.notes
      })
      onClose()
      window.location.reload()
    } catch(e) { console.warn(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">Record Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['income','expense'].map(t => (
              <button key={t} onClick={() => setType(t)} className="py-3 rounded-xl text-sm font-medium capitalize transition"
                style={{ background: type === t ? (t === 'income' ? '#1B4FD8' : '#EF4444') : '#F3F4F6', color: type === t ? 'white' : '#6B7280' }}>
                {t === 'income' ? '+ Income' : '− Expense'}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
              placeholder="e.g. Sunday Tithe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GHC) *</label>
            <input type="number" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))}
              placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {type === 'income'
                ? ['Tithe','Sunday Offering','Seed Offering','Building Fund','Donation','Other Income'].map(c => <option key={c}>{c}</option>)
                : ['Salaries','Utilities','Maintenance','Events','Outreach','Equipment','Other Expense'].map(c => <option key={c}>{c}</option>)
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <button onClick={handleSave} disabled={loading}
            className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FinancePage() {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const token = localStorage.getItem('cos_token') || ''
  const [activeTab, setActiveTab] = useState('overview')
  const [showAdd, setShowAdd] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    financeAPI.getAll()
      .then(data => { setTransactions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0)
  const balance = income - expenses

  const pieData = Object.entries(
    transactions.filter(t => t.type === 'income').reduce((acc, t) => {
      const cat = t.category || 'Other'
      acc[cat] = (acc[cat] || 0) + Number(t.amount || 0)
      return acc
    }, {})
  ).map(([name, value], i) => ({ name, value, color: ['#1B4FD8','#3B82F6','#93C5FD','#BFDBFE','#60A5FA'][i % 5] }))

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'payment-methods', label: '💳 Payment Methods' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{ background: activeTab === t.key ? '#1B4FD8' : '#F1F5F9', color: activeTab === t.key ? 'white' : '#64748B' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'payment-methods' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <PaymentMethodsTab churchId={user.church_id} token={token} />
        </div>
      )}

      {activeTab === 'overview' && (
        <div>
          <div className="flex items-center justify-between mb-8 fade-in">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Finance</h1>
              <p className="text-gray-400 text-sm mt-1">Track income and expenses</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: '#1B4FD8' }}>
              <Plus size={16} /> Add Transaction
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8 fade-in">
            {[
              { label: 'Total Income', value: income, color: '#059669', bg: '#F0FDF4', icon: ArrowUpRight },
              { label: 'Total Expenses', value: expenses, color: '#DC2626', bg: '#FEF2F2', icon: ArrowDownRight },
              { label: 'Net Balance', value: balance, color: balance >= 0 ? '#059669' : '#DC2626', bg: balance >= 0 ? '#F0FDF4' : '#FEF2F2', icon: DollarSign },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 fade-in">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>GHC {s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 fade-in">
              <h3 className="font-bold text-gray-800 mb-4">Income Breakdown</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `GHC ${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-300">No income data yet</div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 fade-in">
              <h3 className="font-bold text-gray-800 mb-4">6-Month Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#1B4FD8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 fade-in">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Recent Transactions</h3>
            </div>
            {loading ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <DollarSign size={40} className="mx-auto mb-3 opacity-30" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {transactions.slice(0, 20).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: t.type === 'income' ? '#F0FDF4' : '#FEF2F2' }}>
                        {t.type === 'income' ? <ArrowUpRight size={16} style={{ color: '#059669' }} /> : <ArrowDownRight size={16} style={{ color: '#DC2626' }} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t.description}</p>
                        <p className="text-xs text-gray-400">{t.category} • {t.date ? new Date(t.date).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm" style={{ color: t.type === 'income' ? '#059669' : '#DC2626' }}>
                      {t.type === 'income' ? '+' : '-'}GHC {Number(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
