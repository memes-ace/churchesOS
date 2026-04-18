import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Edit, ShoppingCart, Check } from 'lucide-react'
import { purchasesAPI } from '../utils/api'

const departments = ['Sound & Media', 'Sanctuary', 'Children', 'Youth', 'Kitchen', 'Office', 'Security', 'Other']
const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Cheque', 'Credit Card']

function PurchaseModal({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { ...item } : { item_name: '', department: '', amount: '', purchased_by: '', date_purchased: new Date().toISOString().split('T')[0], payment_method: 'Cash', vendor: '', approved: false, notes: '' })
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
            {item ? 'Edit Purchase' : 'Record Purchase'}
          </h2>
          <div className="flex gap-2">
            {item && <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {[
            { label: 'Item Name *', field: 'item_name', ph: 'What was purchased' },
            { label: 'Purchased By', field: 'purchased_by', ph: 'Name of buyer' },
            { label: 'Vendor / Supplier', field: 'vendor', ph: 'Where it was bought from' },
            { label: 'Notes', field: 'notes', ph: 'Additional notes' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount (GHC) *</label>
              <input type="number" value={form.amount || ''} onChange={e => update('amount', e.target.value)}
                placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Department</label>
              <select value={form.department || ''} onChange={e => update('department', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</label>
              <select value={form.payment_method || 'Cash'} onChange={e => update('payment_method', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {paymentMethods.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Purchased</label>
              <input type="date" value={form.date_purchased || ''} onChange={e => update('date_purchased', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => update('approved', !form.approved)}
              className="w-5 h-5 rounded flex items-center justify-center border-2 transition"
              style={{ background: form.approved ? '#1B4FD8' : 'white', borderColor: form.approved ? '#1B4FD8' : '#D1D5DB' }}>
              {form.approved && <Check size={11} className="text-white" />}
            </button>
            <span className="text-sm text-gray-600">Approved by leadership</span>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { if(form.item_name && form.amount) { onSave(form); onClose() } }}
            disabled={!form.item_name || !form.amount}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            {item ? 'Save Changes' : 'Record Purchase'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
        </div>
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center w-full max-w-sm">
              <h3 className="font-bold text-gray-900 mb-2">Delete Purchase?</h3>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { onDelete(item.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#DC2626' }}>Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    purchasesAPI.getAll()
      .then(data => { if (Array.isArray(data)) setPurchases(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (form) => {
    try {
      if (selected) {
        await purchasesAPI.update(selected.id, form)
        setPurchases(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p))
      } else {
        const saved = await purchasesAPI.create(form)
        setPurchases(prev => [saved, ...prev])
      }
    } catch(e) {
      if (selected) setPurchases(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p))
      else setPurchases(prev => [{ ...form, id: Date.now() }, ...prev])
    }
    setSelected(null); setShowAdd(false)
  }

  const handleDelete = async (id) => {
    try { await purchasesAPI.delete(id) } catch(e) {}
    setPurchases(prev => prev.filter(p => p.id !== id))
    setSelected(null)
  }

  const total = purchases.reduce((s, p) => s + Number(p.amount || 0), 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Purchases</h1>
          <p className="text-gray-400 text-sm mt-1">{purchases.length} purchases • Total: GHC {total.toLocaleString()}</p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Record Purchase
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div></div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No purchases recorded</h3>
          <p className="text-gray-400 text-sm mb-6">Record your first church purchase</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Record First Purchase
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Item', 'Department', 'Amount', 'Purchased By', 'Date', 'Method', 'Approved', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {purchases.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(p)}>
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-800">{p.item_name}</p>
                    <p className="text-xs text-gray-400">{p.vendor || ''}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{p.department || '—'}</td>
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: '#DC2626' }}>GHC {Number(p.amount).toLocaleString()}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{p.purchased_by || '—'}</td>
                  <td className="py-4 px-4 text-xs text-gray-400">{p.date_purchased || '—'}</td>
                  <td className="py-4 px-4 text-xs text-gray-500">{p.payment_method || '—'}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: p.approved ? '#DCFCE7' : '#FEF9C3', color: p.approved ? '#166534' : '#854D0E' }}>
                      {p.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={e => { e.stopPropagation(); setSelected(p) }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(selected || showAdd) && (
        <PurchaseModal item={selected} onClose={() => { setSelected(null); setShowAdd(false) }} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  )
}
