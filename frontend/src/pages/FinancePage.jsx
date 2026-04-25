import { financeAPI } from '../utils/api'
import { useState, useEffect } from 'react'
import { Plus, Download, DollarSign, X, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const transactions = []
const pieData = [
  { name: 'Tithe', value: 5100, color: '#1B4FD8' },
  { name: 'Sunday Offering', value: 2300, color: '#3B82F6' },
  { name: 'Event Income', value: 1800, color: '#93C5FD' },
  { name: 'Seed Offering', value: 1250, color: '#BFDBFE' },
]
const trendData = [
  { month: 'Oct', income: 6000, expenses: 3200 },{ month: 'Nov', income: 6900, expenses: 3800 },
  { month: 'Dec', income: 9600, expenses: 4200 },{ month: 'Jan', income: 7400, expenses: 3600 },
  { month: 'Feb', income: 8300, expenses: 3900 },{ month: 'Mar', income: 9200, expenses: 4550 },
]


// Payment Methods Tab Component
function PaymentMethodsTab({ churchId, token }) {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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
    setSaving(true)
    await fetch(`/api/admin/churches/${churchId}/payment-methods`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ methods: newMethods })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: '#EEF2FF' }}>
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
              <button onClick={() => deleteMethod(m.id)}
                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
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
                  placeholder="e.g. 0244000000 or Account number"
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
      )}
    </div>
  )
}

function AddModal({ onClose }) {
  const [type, setType] = useState('income')
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{  }}>Record Transaction</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {type === 'income'
                ? ['Tithe','Sunday Offering','Seed Offering','Donation','Event Income'].map(c => <option key={c}>{c}</option>)
                : ['Rent','Electricity','Staff Salary','Equipment','Event Expenses'].map(c => <option key={c}>{c}</option>)
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GH)</label>
            <input type="number" placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{type === 'income' ? 'From' : 'To'}</label>
            <input type="text" placeholder={type === 'income' ? 'Member name or General' : 'Vendor / payee'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {['MoMo','Cash','Bank Transfer','Card'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Transaction</button>
        </div>
      </div>
    </div>
      )}
    </div>
  )
}

export default function FinancePage() {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const token = localStorage.getItem('cos_token') || ''
  const [activeTab, setActiveTab] = useState('overview')
  const [showAdd, setShowAdd] = useState(false)
  const [tab, setTab] = useState('all')
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const filtered = tab === 'all' ? transactions : transactions.filter(t => t.type === tab)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Finance</h1>
          <p className="text-gray-400 text-sm mt-1">March 2025</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"><Download size={15} /> Export</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}><Plus size={15} /> Add Transaction</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Income', value: 'GH' + totalIncome.toLocaleString(), icon: ArrowUpRight, color: '#059669', bg: '#D1FAE5' },
          { label: 'Total Expenses', value: 'GH' + totalExpenses.toLocaleString(), icon: ArrowDownRight, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Net Balance', value: 'GH' + (totalIncome - totalExpenses).toLocaleString(), icon: DollarSign, color: '#1B4FD8', bg: '#DBEAFE' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><s.icon size={17} style={{ color: s.color }} /></div>
              <span className="text-sm font-medium text-gray-600">{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8 fade-in">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Income vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Line type="monotone" dataKey="income" stroke="#1B4FD8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Income Breakdown</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></div><span className="text-xs text-gray-600">{d.name}</span></div>
                <span className="text-xs font-medium">GH{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>Transactions</h3>
          <div className="flex gap-2">
            {['all','income','expense'].map(t => (
              <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition"
                style={{ background: tab === t ? '#1B4FD8' : '#F3F4F6', color: tab === t ? 'white' : '#6B7280' }}>
                {t === 'all' ? 'All' : t === 'income' ? '+ Income' : '- Expense'}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">From / To</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(t => (
              <tr key={t.id} className="table-row">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.type === 'income' ? '#DBEAFE' : '#FEE2E2' }}>
                      {t.type === 'income' ? <ArrowUpRight size={14} style={{ color: '#1B4FD8' }} /> : <ArrowDownRight size={14} style={{ color: '#EF4444' }} />}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{t.category}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 hidden md:table-cell">{t.member}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold" style={{ color: t.type === 'income' ? '#1B4FD8' : '#EF4444' }}>
                      {t.type === 'income' ? '+' : '-'}GH{t.amount.toLocaleString()}
                    </span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
      )}
    </div>
  )
}
