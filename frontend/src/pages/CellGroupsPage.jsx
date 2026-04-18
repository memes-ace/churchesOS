import { cellGroupsAPI } from '../utils/api'
import { useState } from 'react'
import { Plus, X, Save, Trash2, ArrowLeft, Phone, MapPin, Calendar, Users, MessageSquare, Edit, CheckCircle, BarChart3 } from 'lucide-react'

const emptyCellGroup = {
  name: '', cellGroupId: '', location: '', meetingAddress: '',
  meetingDay: '', meetingTime: '', dateCreated: '',
  leaderName: '', assistantLeaderName: '', hostName: '',
  leaderPhone: '', leaderEmail: '',
  color: '#1B4FD8',
}

const statusColors = {
  Active: { bg: '#DBEAFE', text: '#1E40AF' },
  Inactive: { bg: '#FEE2E2', text: '#991B1B' },
}

const roleColors = {
  Leader: { bg: '#EDE9FE', text: '#5B21B6' },
  'Assistant Leader': { bg: '#EEF2FF', text: '#1B4FD8' },
  Member: { bg: '#F0FDF4', text: '#166534' },
  Host: { bg: '#FFF7ED', text: '#9A3412' },
}

// ─── Create / Edit Cell Group Modal ───────────────────────────────────────────
function CellGroupFormModal({ cell, onClose, onSave }) {
  const [form, setForm] = useState(cell ? { ...cell } : { ...emptyCellGroup, cellGroupId: 'CG-' + Date.now() })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const colors = ['#1B4FD8', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2', '#EC4899', '#374151']

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>{cell ? 'Edit Cell Group' : 'Create Cell Group'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Colour</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => update('color', c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ background: c, border: form.color === c ? '3px solid #0F172A' : '3px solid transparent' }} />
              ))}
            </div>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Basic Information</p>
          {[
            { label: 'Cell Group Name *', field: 'name', ph: 'e.g. Grace Cell — East Legon' },
            { label: 'Cell Group ID', field: 'cellGroupId', ph: 'e.g. CG-001' },
            { label: 'Area / Location *', field: 'location', ph: 'e.g. East Legon, Accra' },
            { label: 'Meeting Address', field: 'meetingAddress', ph: 'Full meeting venue address' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Meeting Day</label>
              <select value={form.meetingDay || ''} onChange={e => update('meetingDay', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select day</option>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Meeting Time</label>
              <input type="time" value={form.meetingTime || ''} onChange={e => update('meetingTime', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Created</label>
            <input type="date" value={form.dateCreated || ''} onChange={e => update('dateCreated', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Leadership</p>
          {[
            { label: 'Cell Leader Name *', field: 'leaderName', ph: 'Leader full name' },
            { label: 'Assistant Cell Leader', field: 'assistantLeaderName', ph: 'Assistant leader name' },
            { label: 'Host Name', field: 'hostName', ph: 'Person hosting the meeting' },
            { label: 'Leader Phone', field: 'leaderPhone', ph: '+233 24 000 0000' },
            { label: 'Leader Email', field: 'leaderEmail', ph: 'leader@email.com' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}

          <button onClick={() => { if(form.name && form.leaderName) { onSave(form); onClose() } }}
            disabled={!form.name || !form.leaderName}
            className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#1B4FD8' }}>
            {cell ? 'Save Changes' : 'Create Cell Group'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Cell Group Profile Page ───────────────────────────────────────────────────
function CellGroupProfile({ cell, onBack, onEdit }) {
  const storageKey = `cos_cell_${cell.id}`

  const getData = () => {
    try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : { members: [], attendance: [], visitors: [], activities: [], announcements: [] } }
    catch(e) { return { members: [], attendance: [], visitors: [], activities: [], announcements: [] } }
  }

  const [data, setData] = useState(getData)
  const [tab, setTab] = useState('overview')
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddAttendance, setShowAddAttendance] = useState(false)
  const [showAddVisitor, setShowAddVisitor] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [memberForm, setMemberForm] = useState({ name: '', phone: '', role: 'Member', dateJoined: '', status: 'Active' })
  const [attendanceForm, setAttendanceForm] = useState({ date: '', present: '', visitors: '', absentees: '', notes: '' })
  const [visitorForm, setVisitorForm] = useState({ name: '', phone: '', invitedBy: '', dateAttended: '', interestedInChurch: '' })
  const [activityForm, setActivityForm] = useState({ topic: '', prayerRequests: '', testimonies: '', notes: '', date: '' })
  const [announcementForm, setAnnouncementForm] = useState({ message: '' })

  const save = (newData) => {
    setData(newData)
    try { localStorage.setItem(storageKey, JSON.stringify(newData)) } catch(e) {}
  }

  const addMember = () => {
    if (!memberForm.name) return
    save({ ...data, members: [...data.members, { id: Date.now(), ...memberForm }] })
    setMemberForm({ name: '', phone: '', role: 'Member', dateJoined: '', status: 'Active' })
    setShowAddMember(false)
  }

  const deleteMember = (id) => save({ ...data, members: data.members.filter(m => m.id !== id) })

  const addAttendance = () => {
    if (!attendanceForm.date) return
    save({ ...data, attendance: [...data.attendance, { id: Date.now(), ...attendanceForm }] })
    setAttendanceForm({ date: '', present: '', visitors: '', absentees: '', notes: '' })
    setShowAddAttendance(false)
  }

  const addVisitor = () => {
    if (!visitorForm.name) return
    save({ ...data, visitors: [...data.visitors, { id: Date.now(), ...visitorForm }] })
    setVisitorForm({ name: '', phone: '', invitedBy: '', dateAttended: '', interestedInChurch: '' })
    setShowAddVisitor(false)
  }

  const addActivity = () => {
    if (!activityForm.topic) return
    save({ ...data, activities: [...data.activities, { id: Date.now(), ...activityForm }] })
    setActivityForm({ topic: '', prayerRequests: '', testimonies: '', notes: '', date: '' })
    setShowAddActivity(false)
  }

  const sendAnnouncement = () => {
    if (!announcementForm.message) return
    save({ ...data, announcements: [...data.announcements, { id: Date.now(), ...announcementForm, date: new Date().toISOString() }] })
    setAnnouncementForm({ message: '' })
    setShowAnnouncement(false)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'visitors', label: 'Visitors', icon: '👋' },
    { id: 'activities', label: 'Activities', icon: '✝️' },
    { id: 'announcements', label: 'Messages', icon: '📢' },
    { id: 'reports', label: 'Reports', icon: '📊' },
  ]

  const avgAttendance = data.attendance.length
    ? Math.round(data.attendance.reduce((s, a) => s + Number(a.present || 0), 0) / data.attendance.length)
    : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 fade-in">
        <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl border border-gray-200 transition">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: cell.color + '20' }}>🏠</div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>{cell.name}</h1>
            <p className="text-gray-400 text-xs mt-0.5">{cell.cellGroupId} • {cell.location} • Leader: {cell.leaderName}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
          <Edit size={14} /> Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition flex-shrink-0"
            style={{ color: tab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: tab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-6 fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Members', value: data.members.length, color: '#1B4FD8' },
              { label: 'Avg Attendance', value: avgAttendance, color: '#059669' },
              { label: 'Visitors This Month', value: data.visitors.length, color: '#7C3AED' },
              { label: 'Meetings Recorded', value: data.attendance.length, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center stat-card">
                <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Cell Group Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Cell Group ID', value: cell.cellGroupId },
                { label: 'Location', value: cell.location },
                { label: 'Meeting Address', value: cell.meetingAddress },
                { label: 'Meeting Day', value: cell.meetingDay },
                { label: 'Meeting Time', value: cell.meetingTime },
                { label: 'Cell Leader', value: cell.leaderName },
                { label: 'Assistant Leader', value: cell.assistantLeaderName || 'Not set' },
                { label: 'Host', value: cell.hostName || 'Not set' },
                { label: 'Leader Phone', value: cell.leaderPhone },
                { label: 'Leader Email', value: cell.leaderEmail || 'Not set' },
                { label: 'Date Created', value: cell.dateCreated ? new Date(cell.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set' },
              ].map(d => (
                <div key={d.label} className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                  <p className="text-sm font-medium text-gray-800">{d.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      {tab === 'members' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{data.members.length} members</p>
            <button onClick={() => setShowAddMember(!showAddMember)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <Plus size={14} /> Add Member
            </button>
          </div>

          {showAddMember && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Add New Member</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                  <input type="text" value={memberForm.name} onChange={e => setMemberForm(p => ({...p, name: e.target.value}))}
                    placeholder="Member full name" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                  <input type="tel" value={memberForm.phone} onChange={e => setMemberForm(p => ({...p, phone: e.target.value}))}
                    placeholder="+233 24 000 0000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                  <select value={memberForm.role} onChange={e => setMemberForm(p => ({...p, role: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option>Member</option><option>Leader</option><option>Assistant Leader</option><option>Host</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Date Joined Cell</label>
                  <input type="date" value={memberForm.dateJoined} onChange={e => setMemberForm(p => ({...p, dateJoined: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                  <select value={memberForm.status} onChange={e => setMemberForm(p => ({...p, status: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addMember} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Member</button>
                <button onClick={() => setShowAddMember(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {data.members.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-400 text-sm">No members yet. Add the first member above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.members.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: cell.color }}>
                    {m.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.phone} {m.dateJoined ? `• Joined ${new Date(m.dateJoined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: roleColors[m.role]?.bg, color: roleColors[m.role]?.text }}>{m.role}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: statusColors[m.status]?.bg, color: statusColors[m.status]?.text }}>{m.status}</span>
                    <button onClick={() => deleteMember(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance */}
      {tab === 'attendance' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{data.attendance.length} meetings recorded</p>
            <button onClick={() => setShowAddAttendance(!showAddAttendance)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <Plus size={14} /> Record Meeting
            </button>
          </div>

          {showAddAttendance && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Record Meeting Attendance</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Meeting Date *</label>
                  <input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm(p => ({...p, date: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Members Present</label>
                  <input type="number" value={attendanceForm.present} onChange={e => setAttendanceForm(p => ({...p, present: e.target.value}))}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Visitors Present</label>
                  <input type="number" value={attendanceForm.visitors} onChange={e => setAttendanceForm(p => ({...p, visitors: e.target.value}))}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Absentees</label>
                  <input type="number" value={attendanceForm.absentees} onChange={e => setAttendanceForm(p => ({...p, absentees: e.target.value}))}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
                  <input type="text" value={attendanceForm.notes} onChange={e => setAttendanceForm(p => ({...p, notes: e.target.value}))}
                    placeholder="Any notes about this meeting" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addAttendance} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Attendance</button>
                <button onClick={() => setShowAddAttendance(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {data.attendance.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-400 text-sm">No attendance records yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Date','Present','Visitors','Absentees','Notes'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.attendance.map(a => (
                    <tr key={a.id} className="table-row">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 text-sm font-bold" style={{ color: '#1B4FD8' }}>{a.present || 0}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{a.visitors || 0}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{a.absentees || 0}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{a.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Visitors */}
      {tab === 'visitors' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{data.visitors.length} visitors recorded</p>
            <button onClick={() => setShowAddVisitor(!showAddVisitor)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <Plus size={14} /> Add Visitor
            </button>
          </div>

          {showAddVisitor && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Add Cell Meeting Visitor</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Visitor Name *</label>
                  <input type="text" value={visitorForm.name} onChange={e => setVisitorForm(p => ({...p, name: e.target.value}))}
                    placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                  <input type="tel" value={visitorForm.phone} onChange={e => setVisitorForm(p => ({...p, phone: e.target.value}))}
                    placeholder="+233 24 000 0000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Invited By</label>
                  <input type="text" value={visitorForm.invitedBy} onChange={e => setVisitorForm(p => ({...p, invitedBy: e.target.value}))}
                    placeholder="Member who invited them" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Date Attended</label>
                  <input type="date" value={visitorForm.dateAttended} onChange={e => setVisitorForm(p => ({...p, dateAttended: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Interested in Joining Church?</label>
                  <select value={visitorForm.interestedInChurch} onChange={e => setVisitorForm(p => ({...p, interestedInChurch: e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option value="">Select</option><option>Yes</option><option>No</option><option>Maybe</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addVisitor} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Visitor</button>
                <button onClick={() => setShowAddVisitor(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {data.visitors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">👋</p>
              <p className="text-gray-400 text-sm">No visitors recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.visitors.map(v => (
                <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#7C3AED' }}>
                    {v.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.phone} • Invited by {v.invitedBy || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    {v.interestedInChurch && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: v.interestedInChurch === 'Yes' ? '#DCFCE7' : '#F3F4F6', color: v.interestedInChurch === 'Yes' ? '#166534' : '#6B7280' }}>
                        {v.interestedInChurch === 'Yes' ? '✓ Interested' : v.interestedInChurch}
                      </span>
                    )}
                    {v.dateAttended && <p className="text-xs text-gray-400 mt-1">{new Date(v.dateAttended).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spiritual Activities */}
      {tab === 'activities' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{data.activities.length} activities recorded</p>
            <button onClick={() => setShowAddActivity(!showAddActivity)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <Plus size={14} /> Record Activity
            </button>
          </div>

          {showAddActivity && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Record Spiritual Activity</p>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Bible Study Topic *</label>
                <input type="text" value={activityForm.topic} onChange={e => setActivityForm(p => ({...p, topic: e.target.value}))}
                  placeholder="Topic or scripture studied" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                <input type="date" value={activityForm.date} onChange={e => setActivityForm(p => ({...p, date: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              {[
                { label: 'Prayer Requests', field: 'prayerRequests', ph: 'Prayer requests shared...' },
                { label: 'Testimonies', field: 'testimonies', ph: 'Testimonies shared...' },
                { label: 'Discussion Notes', field: 'notes', ph: 'Key points from discussion...' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
                  <textarea rows={2} value={activityForm[f.field]} onChange={e => setActivityForm(p => ({...p, [f.field]: e.target.value}))}
                    placeholder={f.ph} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={addActivity} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Save Activity</button>
                <button onClick={() => setShowAddActivity(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {data.activities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">✝️</p>
              <p className="text-gray-400 text-sm">No activities recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.activities.map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{a.topic}</h3>
                    {a.date && <span className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  </div>
                  {a.prayerRequests && <div className="mb-2"><p className="text-xs font-bold text-gray-400 mb-1">PRAYER REQUESTS</p><p className="text-sm text-gray-600">{a.prayerRequests}</p></div>}
                  {a.testimonies && <div className="mb-2"><p className="text-xs font-bold text-gray-400 mb-1">TESTIMONIES</p><p className="text-sm text-gray-600">{a.testimonies}</p></div>}
                  {a.notes && <div><p className="text-xs font-bold text-gray-400 mb-1">NOTES</p><p className="text-sm text-gray-600">{a.notes}</p></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announcements */}
      {tab === 'announcements' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{data.announcements.length} messages sent</p>
            <button onClick={() => setShowAnnouncement(!showAnnouncement)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
              <MessageSquare size={14} /> Send Message
            </button>
          </div>

          {showAnnouncement && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Send Message to Cell Group</p>
              <textarea rows={4} value={announcementForm.message} onChange={e => setAnnouncementForm({ message: e.target.value })}
                placeholder="Type your message to all cell group members..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm resize-none" />
              <div className="flex gap-3">
                <button onClick={sendAnnouncement} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Send Message</button>
                <button onClick={() => setShowAnnouncement(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {data.announcements.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">📢</p>
              <p className="text-gray-400 text-sm">No messages sent yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...data.announcements].reverse().map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div className="space-y-4 fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Members', value: data.members.length, color: '#1B4FD8', icon: '👥' },
              { label: 'Active Members', value: data.members.filter(m => m.status === 'Active').length, color: '#059669', icon: '✅' },
              { label: 'Avg Attendance', value: avgAttendance, color: '#7C3AED', icon: '📊' },
              { label: 'Total Visitors', value: data.visitors.length, color: '#F59E0B', icon: '👋' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center stat-card">
                <p className="text-2xl mb-2">{s.icon}</p>
                <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Attendance Summary</h3>
            {data.attendance.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No attendance data yet</p>
            ) : (
              <div className="space-y-2">
                {data.attendance.slice(-5).reverse().map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: '#1B4FD8' }}>{a.present} present</span>
                      <span className="text-gray-400">{a.visitors} visitors</span>
                      <span className="text-red-400">{a.absentees} absent</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>Interest in Church</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Yes', 'No', 'Maybe'].map(status => (
                <div key={status} className="text-center p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold mb-1" style={{ color: status === 'Yes' ? '#059669' : status === 'No' ? '#DC2626' : '#F59E0B' }}>
                    {data.visitors.filter(v => v.interestedInChurch === status).length}
                  </p>
                  <p className="text-xs text-gray-500">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Cell Groups Page ─────────────────────────────────────────────────────
export default function CellGroupsPage() {
  const mainKey = 'cos_cell_groups'

  const [cellGroups, setCellGroups] = useState([])

  useEffect(() => {
    cellGroupsAPI.getAll().then(data => {
      if (Array.isArray(data)) setCellGroups(data.map(c => ({
        id: c.id, name: c.name, cellGroupId: c.cell_group_id,
        location: c.location, meetingAddress: c.meeting_address,
        meetingDay: c.meeting_day, meetingTime: c.meeting_time,
        leaderName: c.leader_name, leaderPhone: c.leader_phone,
        leaderEmail: c.leader_email, assistantLeaderName: c.assistant_leader_name,
        hostName: c.host_name, color: c.color || '#1B4FD8', dateCreated: c.date_created,
      })))
    }).catch(e => console.warn('Cell groups API error:', e.message))
  }, [])
  const [activeCell, setActiveCell] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editCell, setEditCell] = useState(null)

  const saveCellGroups = (list) => {
    setCellGroups(list)
    try { localStorage.setItem(mainKey, JSON.stringify(list)) } catch(e) {}
  }

  const handleCreate = (form) => {
    saveCellGroups([...cellGroups, { id: Date.now(), ...form }])
  }

  const handleEdit = (form) => {
    saveCellGroups(cellGroups.map(c => c.id === form.id ? form : c))
    if (activeCell?.id === form.id) setActiveCell(form)
  }

  const handleDelete = (id) => {
    saveCellGroups(cellGroups.filter(c => c.id !== id))
    setActiveCell(null)
  }

  const getMemberCount = (cellId) => {
    try { const s = localStorage.getItem(`cos_cell_${cellId}`); if (!s) return 0; const d = JSON.parse(s); return d.members?.length || 0 }
    catch(e) { return 0 }
  }

  if (activeCell) {
    return (
      <CellGroupProfile
        cell={activeCell}
        onBack={() => setActiveCell(null)}
        onEdit={() => setEditCell(activeCell)}
      />
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Cell Groups</h1>
          <p className="text-gray-400 text-sm mt-1">{cellGroups.length} groups</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Cell Group
        </button>
      </div>

      {cellGroups.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No cell groups yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first cell group to get started</p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Create First Cell Group
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
          {cellGroups.map(c => {
            const memberCount = getMemberCount(c.id)
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card cursor-pointer hover:border-blue-200 transition"
                onClick={() => setActiveCell(c)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: (c.color || '#1B4FD8') + '15' }}>🏠</div>
                  <button onClick={e => { e.stopPropagation(); setEditCell(c) }} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                    <Edit size={14} className="text-gray-400" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{c.name}</h3>
                <div className="space-y-1.5 mb-4">
                  {c.location && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} style={{ color: c.color }} /> {c.location}</p>}
                  {c.leaderName && <p className="text-xs text-gray-500 flex items-center gap-1"><Users size={11} style={{ color: c.color }} /> {c.leaderName}</p>}
                  {c.leaderPhone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={11} style={{ color: c.color }} /> {c.leaderPhone}</p>}
                  {(c.meetingDay || c.meetingTime) && <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={11} style={{ color: c.color }} /> {c.meetingDay} {c.meetingTime}</p>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-sm font-bold" style={{ color: c.color || '#1B4FD8' }}>
                    <Users size={13} /> {memberCount} members
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#1B4FD8' }}>View Profile →</span>
                </div>
              </div>
            )
          })}

          {/* Create new card */}
          <div onClick={() => setShowCreate(true)}
            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-5 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: '#EEF2FF' }}>
              <Plus size={22} style={{ color: '#1B4FD8' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Create Cell Group</p>
          </div>
        </div>
      )}

      {showCreate && (
        <CellGroupFormModal
          onClose={() => setShowCreate(false)}
          onSave={(form) => { handleCreate(form); setShowCreate(false) }}
        />
      )}

      {editCell && (
        <CellGroupFormModal
          cell={editCell}
          onClose={() => setEditCell(null)}
          onSave={(form) => { handleEdit(form); setEditCell(null) }}
        />
      )}
    </div>
  )
}
