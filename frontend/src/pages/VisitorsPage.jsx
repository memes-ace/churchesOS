import { useState } from 'react'
import { Plus, X, Save, Trash2, Phone, Mail, MapPin, Calendar, User, ArrowLeft } from 'lucide-react'

const emptyVisitor = {
  // Basic Personal
  fullName: '', gender: '', phone: '', email: '',
  homeAddress: '', location: '', dateOfBirth: '',
  // Visit Info
  dateOfFirstVisit: '', serviceAttended: '', invitedBy: '',
  invitedByName: '', timesVisited: '1',
  // Church Interest
  wantsToBecomeMember: '', interestedInMinistry: [],
  interestedInBaptism: '', interestedInDiscipleship: '',
  // Family
  maritalStatus: '', spouseName: '', numberOfChildren: '', cameWithFamily: '',
  // Follow-up
  preferredContact: '', followUpAssignedTo: '', followUpStatus: 'Pending',
  // Notes
  prayerRequest: '', specialNeeds: '', comments: '',
  // Status
  visitorStatus: 'First-Time Visitor',
}

const statusColors = {
  'First-Time Visitor': { bg: '#EEF2FF', text: '#1B4FD8' },
  'Returning Visitor': { bg: '#FEF9C3', text: '#854D0E' },
  'Converted to Member': { bg: '#DCFCE7', text: '#166534' },
}

const followUpColors = {
  'Pending': { bg: '#FEE2E2', text: '#991B1B' },
  'Contacted': { bg: '#FEF9C3', text: '#854D0E' },
  'Visited': { bg: '#DCFCE7', text: '#166534' },
}

function VisitorModal({ visitor, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(visitor ? { ...visitor } : { ...emptyVisitor, visitorId: 'VIS-' + Date.now() })
  const [tab, setTab] = useState('basic')
  const [showDelete, setShowDelete] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const toggleMinistry = (m) => {
    const list = form.interestedInMinistry || []
    setForm(p => ({ ...p, interestedInMinistry: list.includes(m) ? list.filter(x => x !== m) : [...list, m] }))
  }

  const tabs = [
    { id: 'basic', label: 'Personal', icon: '👤' },
    { id: 'visit', label: 'Visit Info', icon: '⛪' },
    { id: 'interest', label: 'Church Interest', icon: '✝️' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    { id: 'followup', label: 'Follow-up', icon: '📞' },
    { id: 'notes', label: 'Notes', icon: '📝' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: '#1B4FD8' }}>
              {form.fullName ? form.fullName.split(' ').map(w => w[0]).slice(0, 2).join('') : '?'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
                {form.fullName || 'New Visitor'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: statusColors[form.visitorStatus]?.bg, color: statusColors[form.visitorStatus]?.text }}>
                  {form.visitorStatus}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: followUpColors[form.followUpStatus]?.bg, color: followUpColors[form.followUpStatus]?.text }}>
                  {form.followUpStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {visitor && (
              <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={17} className="text-red-400" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto flex-shrink-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition flex-shrink-0"
              style={{ color: tab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: tab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {tab === 'basic' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                  placeholder="Visitor full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+233 24 000 0000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="visitor@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Home Address</label>
                <input type="text" value={form.homeAddress} onChange={e => update('homeAddress', e.target.value)}
                  placeholder="Full home address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Area / Location</label>
                <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                  placeholder="e.g. Achimota, Kasoa, Tema"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            </div>
          )}

          {tab === 'visit' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date of First Visit *</label>
                <input type="date" value={form.dateOfFirstVisit} onChange={e => update('dateOfFirstVisit', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Number of Times Visited</label>
                <input type="number" value={form.timesVisited} onChange={e => update('timesVisited', e.target.value)}
                  min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Service Attended</label>
                <select value={form.serviceAttended} onChange={e => update('serviceAttended', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select service</option>
                  <option>Sunday Service</option>
                  <option>Midweek Service</option>
                  <option>Special Program</option>
                  <option>Crusade</option>
                  <option>Youth Program</option>
                  <option>Prayer Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">How Did They Hear About Us</label>
                <select value={form.invitedBy} onChange={e => update('invitedBy', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Church Member</option>
                  <option>Friend</option>
                  <option>Social Media</option>
                  <option>Walk-in</option>
                  <option>Online Search</option>
                  <option>Flyer / Poster</option>
                  <option>Radio</option>
                  <option>Family</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Invited By (Name)</label>
                <input type="text" value={form.invitedByName} onChange={e => update('invitedByName', e.target.value)}
                  placeholder="Member who invited them"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Visitor Status</label>
                <select value={form.visitorStatus} onChange={e => update('visitorStatus', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option>First-Time Visitor</option>
                  <option>Returning Visitor</option>
                  <option>Converted to Member</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'interest' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Would you like to become a member?</label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Maybe'].map(o => (
                    <button key={o} onClick={() => update('wantsToBecomeMember', o)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
                      style={{ background: form.wantsToBecomeMember === o ? '#1B4FD8' : '#F3F4F6', color: form.wantsToBecomeMember === o ? 'white' : '#6B7280' }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Interested in Joining a Ministry?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Choir', 'Ushering', 'Media Team', "Children's Ministry", 'Youth Ministry', 'Prayer Team', 'Evangelism', 'Welfare'].map(m => (
                    <button key={m} onClick={() => toggleMinistry(m)}
                      className="py-2.5 px-3 rounded-xl text-sm font-medium transition text-left"
                      style={{ background: form.interestedInMinistry?.includes(m) ? '#EEF2FF' : '#F3F4F6', color: form.interestedInMinistry?.includes(m) ? '#1B4FD8' : '#6B7280', border: form.interestedInMinistry?.includes(m) ? '1.5px solid #1B4FD8' : '1.5px solid transparent' }}>
                      {form.interestedInMinistry?.includes(m) ? '✓ ' : ''}{m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Interested in Baptism?</label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Already Baptised'].map(o => (
                    <button key={o} onClick={() => update('interestedInBaptism', o)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
                      style={{ background: form.interestedInBaptism === o ? '#1B4FD8' : '#F3F4F6', color: form.interestedInBaptism === o ? 'white' : '#6B7280' }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Interested in Discipleship Classes?</label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map(o => (
                    <button key={o} onClick={() => update('interestedInDiscipleship', o)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
                      style={{ background: form.interestedInDiscipleship === o ? '#1B4FD8' : '#F3F4F6', color: form.interestedInDiscipleship === o ? 'white' : '#6B7280' }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'family' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Marital Status</label>
                <select value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Spouse Name</label>
                <input type="text" value={form.spouseName} onChange={e => update('spouseName', e.target.value)}
                  placeholder="Spouse full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Number of Children</label>
                <input type="number" value={form.numberOfChildren} onChange={e => update('numberOfChildren', e.target.value)}
                  min="0" placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Came With Family?</label>
                <select value={form.cameWithFamily} onChange={e => update('cameWithFamily', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'followup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Preferred Contact Method</label>
                <select value={form.preferredContact} onChange={e => update('preferredContact', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Phone Call</option><option>WhatsApp</option><option>Email</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Follow-up Status</label>
                <select value={form.followUpStatus} onChange={e => update('followUpStatus', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option>Pending</option><option>Contacted</option><option>Visited</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Follow-up Assigned To</label>
                <input type="text" value={form.followUpAssignedTo} onChange={e => update('followUpAssignedTo', e.target.value)}
                  placeholder="Pastor or leader name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2 p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#1B4FD8' }}>Visitor ID</p>
                <p className="text-sm font-mono text-gray-700">{form.visitorId || 'Will be generated on save'}</p>
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              {[
                { label: 'Prayer Request', field: 'prayerRequest', ph: 'Any prayer requests from the visitor...' },
                { label: 'Special Needs', field: 'specialNeeds', ph: 'Any special needs or requirements...' },
                { label: 'Comments / Remarks', field: 'comments', ph: 'Additional comments from welcoming team...' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <textarea rows={3} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => onSave(form)}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Save size={15} /> Save Visitor
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
            Cancel
          </button>
        </div>

        {/* Delete Confirm */}
        {showDelete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-2xl w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Visitor?</h3>
              <p className="text-sm text-gray-500 mb-5">This will permanently remove <strong>{form.fullName}</strong> from the visitors list.</p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(visitor.id); onClose() }}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>
                  Yes, Delete
                </button>
                <button onClick={() => setShowDelete(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VisitorsPage() {
  const storageKey = 'cos_visitors'

  const getVisitors = () => {
    try {
      const saved = sessionStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch(e) { return [] }
  }

  const [visitors, setVisitors] = useState(getVisitors)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  const saveVisitors = (list) => {
    setVisitors(list)
    try { sessionStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {}
  }

  const handleSave = (form) => {
    if (selected) {
      saveVisitors(visitors.map(v => v.id === selected.id ? { ...v, ...form } : v))
    } else {
      saveVisitors([...visitors, { id: Date.now(), ...form }])
    }
    setSelected(null)
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    saveVisitors(visitors.filter(v => v.id !== id))
  }

  const convertToMember = (id) => {
    saveVisitors(visitors.map(v => v.id === id ? { ...v, visitorStatus: 'Converted to Member' } : v))
  }

  const filters = ['All', 'First-Time Visitor', 'Returning Visitor', 'Converted to Member']
  const filtered = filter === 'All' ? visitors : visitors.filter(v => v.visitorStatus === filter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Visitors</h1>
          <p className="text-gray-400 text-sm mt-1">
            {visitors.length} total •{' '}
            {visitors.filter(v => v.visitorStatus === 'First-Time Visitor').length} first-time •{' '}
            {visitors.filter(v => v.visitorStatus === 'Returning Visitor').length} returning •{' '}
            {visitors.filter(v => v.visitorStatus === 'Converted to Member').length} converted
          </p>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Visitor
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap fade-in">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
            {f}
          </button>
        ))}
      </div>

      {visitors.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">👋</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No visitors yet</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first visitor to start tracking</p>
          <button onClick={() => { setSelected(null); setShowAdd(true) }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Visitor
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No visitors in this category</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: '#1B4FD8' }}>
                    {v.fullName ? v.fullName.split(' ').map(w => w[0]).slice(0, 2).join('') : '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '16px' }}>{v.fullName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {v.phone || 'No phone'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: statusColors[v.visitorStatus]?.bg, color: statusColors[v.visitorStatus]?.text }}>
                  {v.visitorStatus}
                </span>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: followUpColors[v.followUpStatus]?.bg, color: followUpColors[v.followUpStatus]?.text }}>
                  {v.followUpStatus}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {v.location && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {v.location}</p>}
                {v.dateOfFirstVisit && <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} /> {new Date(v.dateOfFirstVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                {v.serviceAttended && <p className="text-xs text-gray-500 flex items-center gap-1"><User size={10} /> {v.serviceAttended}</p>}
                {v.invitedBy && <p className="text-xs text-gray-500">Via: {v.invitedBy}{v.invitedByName ? ' — ' + v.invitedByName : ''}</p>}
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setSelected(v); setShowAdd(false) }}
                  className="flex-1 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#1B4FD8' }}>
                  View / Edit
                </button>
                {v.visitorStatus !== 'Converted to Member' && (
                  <button onClick={() => convertToMember(v.id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    Convert
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(selected || showAdd) && (
        <VisitorModal
          visitor={selected}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
