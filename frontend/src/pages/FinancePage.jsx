import { useState } from 'react'
import { Plus, Download, DollarSign, X, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const transactions = [
  { id: 1, type: 'income', category: 'Tithe', member: 'Abena Asante', amount: 500, date: '2025-03-30', method: 'MoMo' },
  { id: 2, type: 'income', category: 'Sunday Offering', member: 'General', amount: 2300, date: '2025-03-30', method: 'Cash' },
  { id: 3, type: 'expense', category: 'Electricity Bill', member: 'ECG Ghana', amount: 450, date: '2025-03-28', method: 'Bank' },
  { id: 4, type: 'income', category: 'Tithe', member: 'Kwame Boateng', amount: 350, date: '2025-03-28', method: 'MoMo' },
  { id: 5, type: 'income', category: 'Event Income', member: 'Youth Revival', amount: 1800, date: '2025-03-25', method: 'Mixed' },
  { id: 6, type: 'expense', category: 'Equipment Repair', member: 'Sound Pros Ltd', amount: 780, date: '2025-03-24', method: 'Bank' },
  { id: 7, type: 'income', category: 'Seed Offering', member: 'General', amount: 1250, date: '2025-03-23', method: 'Cash' },
  { id: 8, type: 'expense', category: 'Staff Salary', member: 'Payroll', amount: 3200, date: '2025-03-22', method: 'Bank' },
]
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
  )
}

export default function FinancePage() {
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
  )
}
