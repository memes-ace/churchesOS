import { purchasesAPI } from '../utils/api'
import { useDB } from '../hooks/useDB'
import { useState } from 'react'
import { Plus, X, Save, Trash2, Upload, DollarSign, Search, Filter } from 'lucide-react'

const departments = ['Choir', 'Instrumentalists', 'Media Team', 'Ushering', 'Prayer Team', 'Youth Ministry', 'Sunday School', 'Security', 'General Church', 'Administration']
const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Cheque', 'Card']

const emptyPurchase = {
  itemName: '', department: '', amount: '', currency: 'GHS',
  purchasedBy: '', datePurchased: '', paymentMethod: 'Cash',
  vendor: '', receiptImage: null, receiptPreview: null, notes: '', approved: false,
}

function PurchaseModal({ purchase, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(purchase ? { ...purchase } : { ...emptyPurchase, purchaseId: 'PUR-' + Date.now(), datePurchased: new Date().toISOString().split('T')[0] })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleReceipt = (e) => {
    const file = e.target.files[0]
    if (file) {
      update('receiptImage', file.name)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = ev => update('receiptPreview', ev.target.result)
        reader.readAsDataURL(file)
      } else {
        update('receiptPreview', 'pdf')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
              {purchase ? 'Edit Purchase' : 'Record Purchase'}
            </h2>
            {purchase && <p className="text-xs text-gray-400">{purchase.purchaseId}</p>}
          </div>
          <div className="flex items-center gap-2">
            {purchase && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Item Name *</label>
            <input type="text" value={form.itemName} onChange={e => update('itemName', e.target.value)}
              placeholder="e.g. Microphone, Projector bulb, Chairs"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Department</label>
              <select value={form.department} onChange={e => update('department', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select dept</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">GHC</span>
                <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)}
                  placeholder="0.00" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Purchased By</label>
              <input type="text" value={form.purchasedBy} onChange={e => update('purchasedBy', e.target.value)}
                placeholder="Person who bought it"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Purchased</label>
              <input type="date" value={form.datePurchased} onChange={e => update('datePurchased', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => update('paymentMethod', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {paymentMethods.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Vendor / Shop</label>
              <input type="text" value={form.vendor} onChange={e => update('vendor', e.target.value)}
                placeholder="Where it was bought"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Upload Receipt</label>
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-green-300 transition">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: '#F0FDF4' }}>
                {form.receiptPreview && form.receiptPreview !== 'pdf'
                  ? <img src={form.receiptPreview} alt="" className="w-full h-full object-cover" />
                  : form.receiptPreview === 'pdf'
                    ? <span className="text-2xl">📄</span>
                    : <Upload size={22} style={{ color: '#059669' }} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{form.receiptImage ? 'Receipt uploaded ✓' : 'Upload receipt'}</p>
                <p className="text-xs text-gray-400">Image or PDF up to 10MB</p>
              </div>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleReceipt} />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)}
              placeholder="Any additional notes about this purchase..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F0FDF4' }}>
            <button onClick={() => update('approved', !form.approved)}
              className="w-10 h-6 rounded-full flex items-center transition"
              style={{ background: form.approved ? '#059669' : '#E5E7EB', padding: '2px' }}>
              <div className="w-5 h-5 bg-white rounded-full shadow transition" style={{ transform: form.approved ? 'translateX(16px)' : 'translateX(0)' }}></div>
            </button>
            <span className="text-sm font-medium" style={{ color: form.approved ? '#059669' : '#6B7280' }}>
              {form.approved ? '✓ Approved by Pastor/Admin' : 'Mark as approved'}
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.itemName && form.amount) { onSave(form); onClose() } }}
            disabled={!form.itemName || !form.amount}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#059669' }}>
            <Save size={15} /> {purchase ? 'Update Purchase' : 'Record Purchase'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>

        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Purchase?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently remove this purchase record.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(purchase.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PurchasesPage() {
  const storageKey = 'cos_purchases'
  const getPurchases = () => { try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : [] } catch(e) { return [] } }
  const [purchases, setPurchases] = useState(getPurchases)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')

  const savePurchases = (list) => { setPurchases(list); try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {} }
  const handleSave = (form) => {
    if (selected) { savePurchases(purchases.map(p => p.id === selected.id ? { ...p, ...form } : p)) }
    else { savePurchases([{ id: Date.now(), ...form }, ...purchases]) }
    setSelected(null); setShowAdd(false)
  }
  const handleDelete = (id) => { savePurchases(purchases.filter(p => p.id !== id)) }

  const filtered = purchases.filter(p => {
    const matchSearch = p.itemName?.toLowerCase().includes(search.toLowerCase()) || p.purchasedBy?.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'All' || p.department === filterDept
    return matchSearch && matchDept
  })

  const totalSpent = purchases.reduce((s, p) => s + Number(p.amount || 0), 0)
  const approvedTotal = purchases.filter(p => p.approved).reduce((s, p) => s + Number(p.amount || 0), 0)
  const depts = [...new Set(purchases.map(p => p.department).filter(Boolean))]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Purchases & Receipts</h1>
          <p className="text-gray-400 text-sm mt-1">{purchases.length} records • GHC{totalSpent.toLocaleString()} total</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#059669' }}>
          <Plus size={15} /> Record Purchase
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Spent', value: 'GHC' + totalSpent.toLocaleString(), color: '#1B4FD8', bg: '#EEF2FF' },
          { label: 'Approved', value: 'GHC' + approvedTotal.toLocaleString(), color: '#059669', bg: '#DCFCE7' },
          { label: 'Pending Approval', value: purchases.filter(p => !p.approved).length, color: '#F59E0B', bg: '#FEF9C3' },
          { label: 'Departments', value: depts.length, color: '#7C3AED', bg: '#EDE9FE' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 border border-gray-100 stat-card" style={{ background: s.bg }}>
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search purchases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...depts].map(d => (
            <button key={d} onClick={() => setFilterDept(d)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filterDept === d ? '#059669' : 'white', color: filterDept === d ? 'white' : '#6B7280', border: '1px solid ' + (filterDept === d ? '#059669' : '#E5E7EB') }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🧾</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No purchases recorded</h3>
          <p className="text-gray-400 text-sm mb-6">Start tracking church purchases and expenses</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#059669' }}>
            <Plus size={15} /> Record First Purchase
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Item', 'Department', 'Amount', 'Purchased By', 'Date', 'Receipt', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="table-row cursor-pointer" onClick={() => { setSelected(p); setShowAdd(false) }}>
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-800">{p.itemName}</p>
                    {p.vendor && <p className="text-xs text-gray-400">{p.vendor}</p>}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{p.department || '—'}</td>
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: '#059669' }}>GHC{Number(p.amount).toLocaleString()}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{p.purchasedBy || '—'}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{p.datePurchased ? new Date(p.datePurchased).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</td>
                  <td className="py-4 px-4">
                    {p.receiptPreview ? (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>✓ Uploaded</span>
                    ) : (
                      <span className="text-xs text-gray-300">No receipt</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: p.approved ? '#DCFCE7' : '#FEF9C3', color: p.approved ? '#166534' : '#854D0E' }}>
                      {p.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-xs font-medium" style={{ color: '#1B4FD8' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(selected || showAdd) && (
        <PurchaseModal
          purchase={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
