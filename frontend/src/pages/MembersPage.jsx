import { useState } from 'react'
import { Search, Plus, Download, MoreVertical, X, Save, Trash2, ArrowLeft, Upload, Phone, Mail, MapPin, Calendar, Users, Edit, MessageSquare, Clock, DollarSign, FileText, Heart, Star } from 'lucide-react'

const initialMembers = []

const statusStyle = { Member: { bg: '#EEF2FF', text: '#1B4FD8' }, Worker: { bg: '#FEF9C3', text: '#854D0E' }, Leader: { bg: '#EDE9FE', text: '#5B21B6' } }
const membershipStyle = { Active: { bg: '#DBEAFE', text: '#1E40AF' }, Inactive: { bg: '#FEE2E2', text: '#991B1B' } }

const emptyMember = {
  memberId: '', fullName: '', photo: null, photoPreview: null, gender: '',
  dateOfBirth: '', phone: '', whatsapp: '', email: '', homeAddress: '',
  location: '', emergencyName: '', emergencyPhone: '', dateJoined: '',
  status: 'Member', membership: 'Active', ministry: '', cellGroup: '',
  baptismStatus: '', baptismDate: '', confirmedMember: 'No',
  maritalStatus: '', spouseName: '', numberOfChildren: '', occupation: '',
  educationLevel: '', nationality: 'Ghanaian', voicePart: '', instrumentPlayed: '',
  cellGroupRole: '', discipleshipClass: '', bibleStudyGroup: '', mentorAssigned: '',
  healthIssues: '', counsellingNotes: '', prayerRequests: '', generalRemarks: '',
  attendance: 0, lastSeen: '',
}

// ─── Full Member Profile Page ──────────────────────────────────────────────────
function MemberProfile({ member, onBack, onSave, onDelete }) {
  const [form, setForm] = useState({ ...member })
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [contributions] = useState([
    { id: 1, date: '2025-04-13', type: 'Tithe', amount: 200 },
    { id: 2, date: '2025-04-13', type: 'Offering', amount: 50 },
    { id: 3, date: '2025-03-30', type: 'Tithe', amount: 200 },
    { id: 4, date: '2025-03-16', type: 'Pledge', amount: 500 },
  ])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => update('photoPreview', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const calcAge = (dob) => {
    if (!dob) return ''
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const totalContributions = contributions.reduce((s, c) => s + c.amount, 0)

  const timeline = [
    { date: form.dateJoined, event: 'Joined Church', icon: '⛪' },
    { date: form.baptismDate, event: 'Baptised', icon: '💧' },
    { date: '2024-01-01', event: `Joined ${form.ministry}`, icon: '✨' },
  ].filter(t => t.date).sort((a, b) => new Date(b.date) - new Date(a.date))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'personal', label: 'Personal', icon: '📋' },
    { id: 'church', label: 'Church', icon: '⛪' },
    { id: 'ministry', label: 'Ministry', icon: '🎵' },
    { id: 'attendance', label: 'Attendance', icon: '📊' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'spiritual', label: 'Spiritual', icon: '✝️' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'timeline', label: 'Timeline', icon: '🕐' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-3 mb-6 fade-in">
        <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl border border-gray-200 transition">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <span className="text-sm text-gray-400">Members / {form.fullName}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Edit size={14} /> {editing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          {editing && (
            <button onClick={() => { onSave(form); setEditing(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <Save size={14} /> Save
            </button>
          )}
          <button onClick={() => setShowDelete(true)} className="p-2.5 hover:bg-red-50 rounded-xl border border-gray-200 transition">
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 fade-in">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: form.photoPreview ? 'transparent' : '#1B4FD8' }}>
              {form.photoPreview ? <img src={form.photoPreview} alt="" className="w-full h-full object-cover" /> : form.fullName.split(' ').map(w => w[0]).slice(0,2).join('')}
            </div>
            {editing && (
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#1B4FD8' }}>
                <Upload size={12} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                className="text-2xl font-bold w-full border-b-2 border-blue-200 focus:outline-none mb-2 pb-1"
                style={{ fontFamily: 'Cormorant Garamond' }} />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>{form.fullName}</h1>
            )}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: statusStyle[form.status]?.bg, color: statusStyle[form.status]?.text }}>{form.status}</span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: membershipStyle[form.membership]?.bg, color: membershipStyle[form.membership]?.text }}>{form.membership}</span>
              <span className="text-xs text-gray-400 font-mono">{form.memberId}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <p className="text-gray-500 flex items-center gap-1.5"><Phone size={13} style={{ color: '#1B4FD8' }} /> {form.phone}</p>
              <p className="text-gray-500 flex items-center gap-1.5"><Mail size={13} style={{ color: '#1B4FD8' }} /> {form.email || '—'}</p>
              <p className="text-gray-500 flex items-center gap-1.5"><MapPin size={13} style={{ color: '#1B4FD8' }} /> {form.location || '—'}</p>
              <p className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} style={{ color: '#1B4FD8' }} /> Joined {form.dateJoined ? new Date(form.dateJoined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}</p>
              <p className="text-gray-500 flex items-center gap-1.5"><Users size={13} style={{ color: '#1B4FD8' }} /> {form.ministry || '—'}</p>
              <p className="text-gray-500 flex items-center gap-1.5"><Clock size={13} style={{ color: '#1B4FD8' }} /> Last seen {form.lastSeen ? new Date(form.lastSeen).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</p>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
          {[
            { label: 'Call', icon: Phone, color: '#059669', action: () => window.open('tel:' + form.phone) },
            { label: 'WhatsApp', icon: MessageSquare, color: '#25D366', action: () => window.open('https://wa.me/' + form.whatsapp?.replace(/\D/g,'')) },
            { label: 'Email', icon: Mail, color: '#1B4FD8', action: () => window.open('mailto:' + form.email) },
          ].map(a => (
            <button key={a.label} onClick={a.action}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border border-gray-200 hover:shadow-sm"
              style={{ color: a.color }}>
              <a.icon size={15} /> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6 overflow-x-auto bg-white rounded-t-2xl">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition flex-shrink-0"
            style={{ color: tab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: tab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-in">

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Member ID', value: form.memberId },
              { label: 'Full Name', value: form.fullName },
              { label: 'Gender', value: form.gender },
              { label: 'Age', value: form.dateOfBirth ? calcAge(form.dateOfBirth) + ' years' : '—' },
              { label: 'Phone', value: form.phone },
              { label: 'WhatsApp', value: form.whatsapp },
              { label: 'Email', value: form.email },
              { label: 'Location', value: form.location },
              { label: 'Date Joined', value: form.dateJoined ? new Date(form.dateJoined).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Status', value: form.status },
              { label: 'Membership', value: form.membership },
              { label: 'Ministry', value: form.ministry },
              { label: 'Cell Group', value: form.cellGroup },
              { label: 'Baptism', value: form.baptismStatus },
              { label: 'Marital Status', value: form.maritalStatus },
              { label: 'Occupation', value: form.occupation },
              { label: 'Attendance', value: form.attendance + '%' },
              { label: 'Last Seen', value: form.lastSeen ? new Date(form.lastSeen).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
            ].map(d => (
              <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                <p className="text-sm font-medium text-gray-800">{d.value || '—'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Personal */}
        {tab === 'personal' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', field: 'fullName', type: 'text' },
              { label: 'Gender', field: 'gender', type: 'select', options: ['Male', 'Female'] },
              { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
              { label: 'Marital Status', field: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
              { label: 'Spouse Name', field: 'spouseName', type: 'text', ph: 'Spouse full name' },
              { label: 'Number of Children', field: 'numberOfChildren', type: 'number' },
              { label: 'Occupation', field: 'occupation', type: 'text', ph: 'Job title or profession' },
              { label: 'Education Level', field: 'educationLevel', type: 'select', options: ['Primary', 'Secondary', 'Diploma', 'Degree', 'Masters', 'PhD', 'Other'] },
              { label: 'Nationality', field: 'nationality', type: 'text' },
            ].map(f => (
              <div key={f.field} className={f.field === 'fullName' ? 'col-span-2' : ''}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                {editing ? (
                  f.type === 'select' ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      placeholder={f.ph || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  )
                ) : (
                  <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">
                    {f.field === 'dateOfBirth' && form[f.field] ? `${new Date(form[f.field]).toLocaleDateString('en-GB')} (${calcAge(form[f.field])} yrs)` : form[f.field] || '—'}
                  </p>
                )}
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Home Address</label>
              {editing ? (
                <input type="text" value={form.homeAddress || ''} onChange={e => update('homeAddress', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              ) : <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form.homeAddress || '—'}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Area / Location</label>
              {editing ? (
                <input type="text" value={form.location || ''} onChange={e => update('location', e.target.value)}
                  placeholder="e.g. Achimota, Kasoa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              ) : <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form.location || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Emergency Contact Name</label>
              {editing ? (
                <input type="text" value={form.emergencyName || ''} onChange={e => update('emergencyName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              ) : <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form.emergencyName || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Emergency Contact Phone</label>
              {editing ? (
                <input type="tel" value={form.emergencyPhone || ''} onChange={e => update('emergencyPhone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              ) : <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form.emergencyPhone || '—'}</p>}
            </div>
          </div>
        )}

        {/* Church */}
        {tab === 'church' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Member ID', field: 'memberId', type: 'text' },
              { label: 'Date Joined Church', field: 'dateJoined', type: 'date' },
              { label: 'Membership Status', field: 'status', type: 'select', options: ['Member', 'Worker', 'Leader', 'Visitor'] },
              { label: 'Active / Inactive', field: 'membership', type: 'select', options: ['Active', 'Inactive'] },
              { label: 'Baptism Status', field: 'baptismStatus', type: 'select', options: ['Baptised', 'Not Baptised', 'Scheduled'] },
              { label: 'Baptism Date', field: 'baptismDate', type: 'date' },
              { label: 'Confirmed Member', field: 'confirmedMember', type: 'select', options: ['Yes', 'No'] },
              { label: 'Primary Ministry', field: 'ministry', type: 'select', options: ['Choir', 'Instrumentalists', 'Ushering', 'Youth Ministry', 'Prayer Team', 'Media Team', 'Sunday School', 'Welfare', 'Evangelism', 'Security', 'None'] },
              { label: 'Cell Group', field: 'cellGroup', type: 'text' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                {editing ? (
                  f.type === 'select' ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  )
                ) : (
                  <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form[f.field] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ministry */}
        {tab === 'ministry' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Primary Ministry', field: 'ministry', type: 'select', options: ['Choir', 'Instrumentalists', 'Ushering', 'Youth Ministry', 'Prayer Team', 'Media Team', 'Sunday School', 'Welfare', 'Evangelism', 'None'] },
                { label: 'Voice Part (Choir)', field: 'voicePart', type: 'select', options: ['Soprano', 'Alto', 'Tenor', 'Bass'] },
                { label: 'Instrument Played', field: 'instrumentPlayed', type: 'select', options: ['Keyboard', 'Drums', 'Guitar', 'Bass Guitar', 'Violin', 'Trumpet', 'Other'] },
                { label: 'Cell Group Role', field: 'cellGroupRole', type: 'select', options: ['Member', 'Leader', 'Assistant Leader', 'Host'] },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  {editing ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Not applicable</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form[f.field] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Ministries & Departments</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 text-xs font-bold text-gray-500 uppercase">Ministry</th>
                      <th className="text-left py-2 px-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                      <th className="text-left py-2 px-4 text-xs font-bold text-gray-500 uppercase">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">{form.ministry || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{form.status}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{form.dateJoined ? new Date(form.dateJoined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Attendance */}
        {tab === 'attendance' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Sunday Service', value: form.attendance || 0, color: '#1B4FD8' },
                { label: 'Midweek Service', value: Math.round((form.attendance || 0) * 0.8), color: '#7C3AED' },
                { label: 'Cell Meeting', value: Math.round((form.attendance || 0) * 0.9), color: '#059669' },
                { label: 'Ministry Meeting', value: Math.round((form.attendance || 0) * 0.85), color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600">{s.label}</p>
                    <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: s.value + '%', background: s.color }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#1B4FD8' }}>Last Attendance</p>
              <p className="text-sm text-gray-600">{form.lastSeen ? new Date(form.lastSeen).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Not recorded'}</p>
            </div>
            {editing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Attendance %</label>
                  <input type="number" value={form.attendance || ''} onChange={e => update('attendance', e.target.value)}
                    min="0" max="100" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Last Seen Date</label>
                  <input type="date" value={form.lastSeen || ''} onChange={e => update('lastSeen', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Finance */}
        {tab === 'finance' && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Contributions', value: 'GH₵' + totalContributions.toLocaleString(), color: '#1B4FD8' },
                { label: 'This Year', value: 'GH₵950', color: '#059669' },
                { label: 'Last Month', value: 'GH₵250', color: '#7C3AED' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl text-center bg-gray-50">
                  <p className="text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contributions.map(c => (
                    <tr key={c.id}>
                      <td className="py-3 px-4 text-sm text-gray-600">{new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{c.type}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-bold" style={{ color: '#1B4FD8' }}>GH₵{c.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spiritual */}
        {tab === 'spiritual' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Baptism Status', field: 'baptismStatus', type: 'select', options: ['Baptised', 'Not Baptised', 'Scheduled'] },
              { label: 'Discipleship Class', field: 'discipleshipClass', type: 'select', options: ['Completed', 'In Progress', 'Not Started'] },
              { label: 'Bible Study Group', field: 'bibleStudyGroup', type: 'text', ph: 'Group name' },
              { label: 'Mentor / Pastor Assigned', field: 'mentorAssigned', type: 'text', ph: 'Mentor name' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                {editing ? (
                  f.type === 'select' ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  )
                ) : (
                  <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form[f.field] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Family */}
        {tab === 'family' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Marital Status', field: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
                { label: 'Spouse Name', field: 'spouseName', type: 'text', ph: 'Spouse full name' },
                { label: 'Number of Children', field: 'numberOfChildren', type: 'number' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  {editing ? (
                    f.type === 'select' ? (
                      <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                        <option value="">Select</option>
                        {f.options?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                        placeholder={f.ph || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                    )
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-800">{form[f.field] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Family Members in Church</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">No family members linked yet.</p>
                {editing && (
                  <button className="mt-2 text-xs font-medium" style={{ color: '#1B4FD8' }}>+ Link Family Member</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {tab === 'notes' && (
          <div className="space-y-4">
            {[
              { label: 'Counselling Notes', field: 'counsellingNotes', ph: 'Pastoral counselling notes (private)...' },
              { label: 'Prayer Requests', field: 'prayerRequests', ph: 'Member prayer requests...' },
              { label: 'Health Issues', field: 'healthIssues', ph: 'Known health conditions...' },
              { label: 'General Remarks', field: 'generalRemarks', ph: 'Any other remarks...' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  {f.label} <span className="text-gray-300 normal-case font-normal">(Private — visible to admin only)</span>
                </label>
                {editing ? (
                  <textarea rows={3} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
                ) : (
                  <p className="px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-600 min-h-[60px]">{form[f.field] || 'No notes yet'}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {tab === 'timeline' && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 mb-4">Member activity history</p>
            {timeline.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">🕐</p>
                <p className="text-sm text-gray-400">No timeline events yet</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                {timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-4 mb-5 relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 z-10 bg-white border-2 border-gray-100">
                      {t.icon}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-sm font-semibold text-gray-800">{t.event}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(t.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl w-full max-w-sm">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
              <Trash2 size={24} style={{ color: '#DC2626' }} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Member?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove <strong>{form.fullName}</strong> from the church records.</p>
            <div className="flex gap-3">
              <button onClick={() => { onDelete(member.id); onBack() }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>Yes, Delete</button>
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Add Member Modal ──────────────────────────────────────────────────────────
function AddMemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({ ...emptyMember, memberId: 'GCI-' + String(Date.now()).slice(-4) })
  const [tab, setTab] = useState('basic')
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'church', label: 'Church' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Add New Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-xs font-medium transition"
              style={{ color: tab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: tab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'basic' && (
            <>
              {[
                { label: 'Full Name *', field: 'fullName', type: 'text', ph: 'Member full name', col: 2 },
                { label: 'Member ID', field: 'memberId', type: 'text', ph: 'e.g. GCI-001' },
                { label: 'Gender', field: 'gender', type: 'select', options: ['Male', 'Female'] },
                { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
                { label: 'Occupation', field: 'occupation', type: 'text', ph: 'Job title' },
              ].map(f => (
                <div key={f.field} className={f.col === 2 ? '' : ''}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      placeholder={f.ph || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  )}
                </div>
              ))}
            </>
          )}
          {tab === 'contact' && (
            <>
              {[
                { label: 'Phone Number *', field: 'phone', type: 'tel', ph: '+233 24 000 0000' },
                { label: 'WhatsApp Number', field: 'whatsapp', type: 'tel', ph: '+233 24 000 0000' },
                { label: 'Email Address', field: 'email', type: 'email', ph: 'member@email.com' },
                { label: 'Home Address', field: 'homeAddress', type: 'text', ph: 'Full home address' },
                { label: 'Area / Location', field: 'location', type: 'text', ph: 'e.g. Achimota, Kasoa' },
                { label: 'Emergency Contact Name', field: 'emergencyName', type: 'text', ph: 'Contact name' },
                { label: 'Emergency Contact Phone', field: 'emergencyPhone', type: 'tel', ph: '+233 24 000 0000' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                    placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              ))}
            </>
          )}
          {tab === 'church' && (
            <>
              {[
                { label: 'Date Joined Church', field: 'dateJoined', type: 'date' },
                { label: 'Membership Status', field: 'status', type: 'select', options: ['Member', 'Worker', 'Leader', 'Visitor'] },
                { label: 'Active / Inactive', field: 'membership', type: 'select', options: ['Active', 'Inactive'] },
                { label: 'Primary Ministry', field: 'ministry', type: 'select', options: ['Choir', 'Instrumentalists', 'Ushering', 'Youth Ministry', 'Prayer Team', 'Media Team', 'Sunday School', 'Welfare', 'Evangelism', 'None'] },
                { label: 'Cell Group', field: 'cellGroup', type: 'text', ph: 'Cell group name' },
                { label: 'Baptism Status', field: 'baptismStatus', type: 'select', options: ['Baptised', 'Not Baptised', 'Scheduled'] },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                      placeholder={f.ph || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={() => { if(form.fullName) { onSave({ id: Date.now(), ...form }); onClose() } }}
            disabled={!form.fullName}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add Member
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Members Page ─────────────────────────────────────────────────────────
export default function MembersPage() {
  const storageKey = 'cos_members'

  const getMembers = () => {
    try { const s = sessionStorage.getItem(storageKey); return s ? JSON.parse(s) : initialMembers }
    catch(e) { return initialMembers }
  }

  const [members, setMembers] = useState(getMembers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedMember, setSelectedMember] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const saveMembers = (list) => {
    setMembers(list)
    try { sessionStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {}
  }

  const handleSave = (updated) => saveMembers(members.map(m => m.id === updated.id ? updated : m))
  const handleDelete = (id) => saveMembers(members.filter(m => m.id !== id))
  const handleAdd = (newM) => saveMembers([...members, newM])

  if (selectedMember) {
    return (
      <MemberProfile
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
        onSave={(updated) => { handleSave(updated); setSelectedMember(updated) }}
        onDelete={handleDelete}
      />
    )
  }

  const filtered = members.filter(m => {
    const matchSearch = m.fullName?.toLowerCase().includes(search.toLowerCase()) || m.phone?.includes(search) || m.memberId?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || m.status === filter || m.membership === filter ||
      (filter === 'Ministry' && m.ministry) || (filter === 'Cell Group' && m.cellGroup)
    return matchSearch && matchFilter
  })

  const filters = ['All', 'Member', 'Worker', 'Leader', 'Active', 'Inactive']

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Members</h1>
          <p className="text-gray-400 text-sm mt-1">{members.length} total • {members.filter(m => m.membership === 'Active').length} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add Member
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, phone or ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6B7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#E5E7EB') }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ministry</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Cell Group</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Attendance</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last Seen</th>
              <th className="text-right py-4 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(m => (
              <tr key={m.id} className="table-row cursor-pointer" onClick={() => setSelectedMember(m)}>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: m.photoPreview ? 'transparent' : '#1B4FD8' }}>
                      {m.photoPreview ? <img src={m.photoPreview} alt="" className="w-full h-full object-cover" /> : m.fullName?.split(' ').map(w => w[0]).slice(0,2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{m.fullName}</p>
                      <p className="text-xs text-gray-400">{m.memberId} • Joined {m.dateJoined ? new Date(m.dateJoined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{m.phone}</p>
                  <p className="text-xs text-gray-400">{m.email || '—'}</p>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 hidden lg:table-cell">{m.ministry || '—'}</td>
                <td className="py-4 px-4 text-xs text-gray-500 hidden lg:table-cell">{m.cellGroup || '—'}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ background: statusStyle[m.status]?.bg, color: statusStyle[m.status]?.text }}>{m.status}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ background: membershipStyle[m.membership]?.bg, color: membershipStyle[m.membership]?.text }}>{m.membership}</span>
                  </div>
                </td>
                <td className="py-4 px-4 hidden xl:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: (m.attendance || 0) + '%', background: (m.attendance || 0) >= 80 ? '#1B4FD8' : (m.attendance || 0) >= 60 ? '#F59E0B' : '#EF4444' }}></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{m.attendance || 0}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-gray-400 hidden xl:table-cell">
                  {m.lastSeen ? new Date(m.lastSeen).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={e => { e.stopPropagation(); setSelectedMember(m) }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                      View
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={e => e.stopPropagation()}>
                      <MoreVertical size={15} className="text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-400 text-sm">No members found</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <span>Showing {filtered.length} of {members.length} members</span>
      </div>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  )
}

// Clear old session data on first load
if (typeof window !== 'undefined') {
  try { sessionStorage.removeItem('cos_members') } catch(e) {}
}
