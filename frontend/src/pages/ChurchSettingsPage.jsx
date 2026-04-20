import { useState, useEffect } from 'react'
import { Save, Check, Building, Phone, Mail, MapPin, User } from 'lucide-react'
import { adminAPI } from '../utils/api'

export default function ChurchSettingsPage() {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const [form, setForm] = useState({
    name: '', pastor_name: '', email: '', phone: '',
    location: '', address: '', website: '', description: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user.church_id) {
      fetch(`/api/admin/churches/${user.church_id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('cos_token')}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data) setForm({
          name: data.name || '',
          pastor_name: data.pastor_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          address: data.address || '',
          website: data.website || '',
          description: data.description || '',
        })
      })
      .catch(e => console.warn(e))
      .finally(() => setLoading(false))
    }
  }, [])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    try {
      await fetch(`/api/admin/churches/${user.church_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cos_token')}`
        },
        body: JSON.stringify(form)
      })
      // Update localStorage
      const updated = { ...user, church_name: form.name }
      localStorage.setItem('cos_user', JSON.stringify(updated))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch(e) {
      console.warn('Save error:', e)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond", color: "#0F172A" }}>
            Church Profile
          </h1>
          <p className="text-gray-400 text-sm mt-1">Update your church information</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: saved ? '#059669' : '#1B4FD8' }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-6 fade-in">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building size={18} style={{ color: '#1B4FD8' }} />
            <h3 className="font-bold text-gray-800">Church Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Church Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Pastor Name</label>
              <input type="text" value={form.pastor_name} onChange={e => update('pastor_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Website</label>
              <input type="text" value={form.website} onChange={e => update('website', e.target.value)}
                placeholder="https://yourchurch.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Location / City</label>
              <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Address</label>
              <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Church Description</label>
              <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Brief description of your church..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
