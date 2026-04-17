import { useState } from 'react'
import { Plus, Users, MessageSquare, X, Edit, Trash2, ArrowLeft, Upload, Save } from 'lucide-react'

const initialMinistries = [
  { id: 1, name: 'Instrumentalists', leader: '', leaderPhone: '', members: 0, meetingDay: 'Fridays 4PM', color: '#0891B2', emoji: '🎸', description: 'Keyboard, drums, bass and lead guitars' },
  { id: 2, name: 'Choir', leader: '', leaderPhone: '', members: 0, meetingDay: 'Fridays 5PM', color: '#7C3AED', emoji: '🎵', description: 'Worship and music ministry' },
  { id: 3, name: 'Ushering', leader: '', leaderPhone: '', members: 0, meetingDay: 'Sundays 7AM', color: '#1B4FD8', emoji: '🤝', description: 'Reception and hospitality team' },
  { id: 4, name: 'Youth Ministry', leader: '', leaderPhone: '', members: 0, meetingDay: 'Saturdays 3PM', color: '#F59E0B', emoji: '🔥', description: 'Youth and young adults ministry' },
  { id: 5, name: 'Prayer Team', leader: '', leaderPhone: '', members: 0, meetingDay: 'Wednesdays 6AM', color: '#059669', emoji: '🙏', description: 'Intercession and prayer warriors' },
  { id: 6, name: 'Media Team', leader: '', leaderPhone: '', members: 0, meetingDay: 'Sundays 7:30AM', color: '#0891B2', emoji: '📹', description: 'Audio, video and social media' },
  { id: 7, name: 'Sunday School', leader: '', leaderPhone: '', members: 0, meetingDay: 'Sundays 8AM', color: '#DC2626', emoji: '📚', description: 'Children and junior church' },
  { id: 8, name: 'Welfare', leader: '', leaderPhone: '', members: 0, meetingDay: 'First Saturdays', color: '#D97706', emoji: '❤️', description: 'Member care and support' },
  { id: 9, name: 'Evangelism', leader: '', leaderPhone: '', members: 0, meetingDay: 'Saturdays 8AM', color: '#7C3AED', emoji: '📢', description: 'Outreach and soul winning' },
  { id: 10, name: 'Cell Groups', leader: '', leaderPhone: '', members: 0, meetingDay: 'Weekly', color: '#059669', emoji: '🏠', description: 'Home fellowship groups' },
  { id: 11, name: 'Women Ministry', leader: '', leaderPhone: '', members: 0, meetingDay: 'Last Saturdays', color: '#EC4899', emoji: '👑', description: 'Women of purpose ministry' },
  { id: 12, name: 'Men Fellowship', leader: '', leaderPhone: '', members: 0, meetingDay: 'Second Saturdays', color: '#1B4FD8', emoji: '💪', description: 'Men of valour fellowship' },
  { id: 13, name: 'Security Team', leader: '', leaderPhone: '', members: 0, meetingDay: 'Sundays 7AM', color: '#374151', emoji: '🛡️', description: 'Church security and parking' },
]

const emptyProfile = {
  photo: null, photoPreview: null, fullName: '', gender: '', dateOfBirth: '',
  phone: '', whatsapp: '', email: '', homeAddress: '', location: '',
  emergencyName: '', emergencyPhone: '', membershipId: '', dateJoinedChurch: '',
  membershipStatus: 'Active', baptismStatus: '', baptismDate: '',
  confirmedMember: 'No', maritalStatus: '', spouseName: '',
  ministryRole: 'Member', voicePart: '', instrumentPlayed: '',
  dateJoinedMinistry: '', ministryStatus: 'Active', specialSkills: '',
  otherMinistries: '', sundayAttendance: '', rehearsalAttendance: '',
  cellGroup: '', discipleshipClass: '', bibleStudyGroup: '', mentorAssigned: '',
  healthIssues: '', disciplineNotes: '', leadershipComments: '', specialRemarks: '',
}

function MemberProfileModal({ member, ministry, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(member ? { ...member } : { ...emptyProfile })
  const [tab, setTab] = useState('basic')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const update = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => update('photoPreview', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Personal', icon: '👤' },
    { id: 'church', label: 'Church', icon: '⛪' },
    { id: 'ministry', label: ministry.name, icon: ministry.emoji },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'spiritual', label: 'Spiritual', icon: '✝️' },
    { id: 'notes', label: 'Notes', icon: '📝' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
              {form.photoPreview
                ? <img src={form.photoPreview} alt="" className="w-full h-full object-cover" />
                : <span className="text-3xl">👤</span>}
            </div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
                {form.fullName || 'New Member'}
              </h2>
              <p className="text-xs text-gray-400">{ministry.name} • {form.ministryRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {member && (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={17} className="text-red-400" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto flex-shrink-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition flex-shrink-0"
              style={{
                color: tab === t.id ? '#1B4FD8' : '#6B7280',
                borderBottom: tab === t.id ? '2px solid #1B4FD8' : '2px solid transparent'
              }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {tab === 'basic' && (
            <div className="space-y-4">
              {/* Photo */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 mb-2">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {form.photoPreview
                    ? <img src={form.photoPreview} alt="" className="w-full h-full object-cover" />
                    : <span className="text-4xl">👤</span>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition bg-white">
                    <Upload size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                  <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    placeholder="e.g. Abena Asante"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">WhatsApp Number</label>
                  <input type="tel" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="member@email.com"
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Emergency Contact Name</label>
                  <input type="text" value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)}
                    placeholder="Contact full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Emergency Contact Phone</label>
                  <input type="tel" value={form.emergencyPhone} onChange={e => update('emergencyPhone', e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          )}

          {tab === 'church' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Membership ID</label>
                <input type="text" value={form.membershipId} onChange={e => update('membershipId', e.target.value)}
                  placeholder="e.g. GCI-2025-001"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Joined Church</label>
                <input type="date" value={form.dateJoinedChurch} onChange={e => update('dateJoinedChurch', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Membership Status</label>
                <select value={form.membershipStatus} onChange={e => update('membershipStatus', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option>Active</option><option>Inactive</option><option>Visitor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Confirmed Member</label>
                <select value={form.confirmedMember} onChange={e => update('confirmedMember', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Baptism Status</label>
                <select value={form.baptismStatus} onChange={e => update('baptismStatus', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Baptised</option><option>Not Baptised</option><option>Scheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Baptism Date</label>
                <input type="date" value={form.baptismDate} onChange={e => update('baptismDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
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
            </div>
          )}

          {tab === 'ministry' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl mb-2" style={{ background: ministry.color + '10' }}>
                <p className="text-sm font-semibold" style={{ color: ministry.color }}>{ministry.emoji} {ministry.name} — Ministry Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
                  <select value={form.ministryRole} onChange={e => update('ministryRole', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option>Member</option><option>Leader</option><option>Assistant Leader</option>
                    <option>Instrumentalist</option><option>Secretary</option><option>Coordinator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Ministry Status</label>
                  <select value={form.ministryStatus} onChange={e => update('ministryStatus', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option>Active</option><option>On Leave</option><option>Suspended</option><option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Voice Part (Choir)</label>
                  <select value={form.voicePart} onChange={e => update('voicePart', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option value="">Not applicable</option>
                    <option>Soprano</option><option>Alto</option><option>Tenor</option><option>Bass</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Instrument Played</label>
                  <select value={form.instrumentPlayed} onChange={e => update('instrumentPlayed', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option value="">None</option>
                    <option>Keyboard</option><option>Drums</option><option>Guitar</option>
                    <option>Bass Guitar</option><option>Violin</option><option>Trumpet</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date Joined Ministry</label>
                  <input type="date" value={form.dateJoinedMinistry} onChange={e => update('dateJoinedMinistry', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Special Skills</label>
                  <select value={form.specialSkills} onChange={e => update('specialSkills', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                    <option value="">None</option>
                    <option>Soloist</option><option>Composer</option><option>Song Leader</option>
                    <option>Music Director</option><option>Arranger</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Other Ministries Member Of</label>
                  <input type="text" value={form.otherMinistries} onChange={e => update('otherMinistries', e.target.value)}
                    placeholder="e.g. Ushering, Prayer Team, Media Team"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          )}

          {tab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl text-center" style={{ background: '#EEF2FF' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B4FD8' }}>{form.sundayAttendance || '—'}</p>
                  <p className="text-xs text-gray-500">Sunday Attendance</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: '#F0FDF4' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#059669' }}>{form.rehearsalAttendance || '—'}</p>
                  <p className="text-xs text-gray-500">Rehearsal Attendance</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Sunday Service Attendance %</label>
                <input type="text" value={form.sundayAttendance} onChange={e => update('sundayAttendance', e.target.value)}
                  placeholder="e.g. 85%" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rehearsal / Meeting Attendance %</label>
                <input type="text" value={form.rehearsalAttendance} onChange={e => update('rehearsalAttendance', e.target.value)}
                  placeholder="e.g. 90%" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            </div>
          )}

          {tab === 'spiritual' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Cell Group</label>
                <input type="text" value={form.cellGroup} onChange={e => update('cellGroup', e.target.value)}
                  placeholder="Cell group name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Discipleship Class</label>
                <select value={form.discipleshipClass} onChange={e => update('discipleshipClass', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                  <option value="">Select</option>
                  <option>Completed</option><option>In Progress</option><option>Not Started</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bible Study Group</label>
                <input type="text" value={form.bibleStudyGroup} onChange={e => update('bibleStudyGroup', e.target.value)}
                  placeholder="Group name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Mentor / Pastor Assigned</label>
                <input type="text" value={form.mentorAssigned} onChange={e => update('mentorAssigned', e.target.value)}
                  placeholder="Mentor name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              {[
                { label: 'Health Issues', field: 'healthIssues', ph: 'Any known health conditions...' },
                { label: 'Discipline Notes', field: 'disciplineNotes', ph: 'Discipline records if any...' },
                { label: 'Leadership Comments', field: 'leadershipComments', ph: 'Comments from ministry leader...' },
                { label: 'Special Remarks', field: 'specialRemarks', ph: 'Any other special remarks...' },
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
            <Save size={15} /> Save Profile
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>

        {/* Delete Confirm Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-2xl w-full max-w-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEE2E2' }}>
                <Trash2 size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Delete Member?</h3>
              <p className="text-sm text-gray-500 mb-5">
                This will permanently remove <strong>{form.fullName || 'this member'}</strong> from {ministry.name}. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { onDelete(member.id); onClose() }}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#DC2626' }}>
                  Yes, Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
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

function MinistryMembersView({ ministry, onBack }) {
  const storageKey = `cos_ministry_${ministry.id}`

  const getMembers = () => {
    try {
      const saved = sessionStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch(e) { return [] }
  }

  const [members, setMembers] = useState(getMembers)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const saveMembers = (list) => {
    setMembers(list)
    try { sessionStorage.setItem(storageKey, JSON.stringify(list)) } catch(e) {}
  }

  const handleSave = (form) => {
    if (selected) {
      saveMembers(members.map(m => m.id === selected.id ? { ...m, ...form } : m))
    } else {
      saveMembers([...members, { id: Date.now(), ...form }])
    }
    setSelected(null)
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    saveMembers(members.filter(m => m.id !== id))
    setSelected(null)
    setShowAdd(false)
  }

  const statusColor = {
    Active: { bg: '#DBEAFE', text: '#1E40AF' },
    'On Leave': { bg: '#FEF9C3', text: '#854D0E' },
    Suspended: { bg: '#FEE2E2', text: '#991B1B' },
    Inactive: { bg: '#F3F4F6', text: '#6B7280' }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8 fade-in">
        <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition border border-gray-200">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: ministry.color + '15' }}>
            {ministry.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>{ministry.name}</h1>
            <p className="text-gray-400 text-sm">{members.length} members • Leader: {ministry.leader}</p>
          </div>
        </div>
        <button onClick={() => { setSelected(null); setShowAdd(true) }}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">{ministry.emoji}</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No members yet</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first {ministry.name} member to get started</p>
          <button onClick={() => { setSelected(null); setShowAdd(true) }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add First Member
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 fade-in">
          {members.map(m => (
            <div key={m.id} onClick={() => { setSelected(m); setShowAdd(false) }}
              className="bg-white rounded-2xl border border-gray-100 p-5 stat-card cursor-pointer hover:border-blue-200 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: m.photoPreview ? 'transparent' : ministry.color }}>
                  {m.photoPreview
                    ? <img src={m.photoPreview} alt="" className="w-full h-full object-cover" />
                    : (m.fullName ? m.fullName.split(' ').map(w => w[0]).slice(0, 2).join('') : '?')}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{m.fullName || 'Unnamed'}</p>
                  <p className="text-xs text-gray-400 truncate">{m.phone || 'No phone'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>
                  {m.ministryRole || 'Member'}
                </span>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: statusColor[m.ministryStatus]?.bg || '#F3F4F6', color: statusColor[m.ministryStatus]?.text || '#374151' }}>
                  {m.ministryStatus || 'Active'}
                </span>
              </div>
              {m.voicePart && <p className="text-xs text-gray-400">Voice: {m.voicePart}</p>}
              {m.instrumentPlayed && <p className="text-xs text-gray-400">Instrument: {m.instrumentPlayed}</p>}
              {m.location && <p className="text-xs text-gray-400 mt-1">📍 {m.location}</p>}
              <p className="text-xs font-medium mt-3" style={{ color: '#1B4FD8' }}>Tap to edit profile →</p>
            </div>
          ))}

          {/* Add card */}
          <div onClick={() => { setSelected(null); setShowAdd(true) }}
            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-5 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition flex flex-col items-center justify-center min-h-[180px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: '#EEF2FF' }}>
              <Plus size={22} style={{ color: '#1B4FD8' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#1B4FD8' }}>Add New Member</p>
            <p className="text-xs text-gray-400 mt-1 text-center">Fill in complete profile</p>
          </div>
        </div>
      )}

      {(selected || showAdd) && (
        <MemberProfileModal
          member={selected}
          ministry={ministry}
          onClose={() => { setSelected(null); setShowAdd(false) }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

function EditMinistryModal({ ministry, onClose, onSave }) {
  const [form, setForm] = useState({ ...ministry })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Edit {ministry.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Ministry Name', field: 'name' },
            { label: 'Ministry Leader', field: 'leader' },
            { label: 'Leader Phone', field: 'leaderPhone' },
            { label: 'Meeting Day & Time', field: 'meetingDay' },
            { label: 'Description', field: 'description' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type="text" value={form[f.field] || ''} onChange={e => update(f.field, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          ))}
          <button onClick={() => { onSave(form); onClose() }}
            className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateMinistryModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', leader: '', leaderPhone: '', meetingDay: '', description: '', color: '#1B4FD8', emoji: '⛪' })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const emojis = ['⛪', '🎵', '🎸', '🙏', '🔥', '📢', '❤️', '🤝', '📹', '📚', '🛡️', '👑', '💪', '🏠', '✝️', '🌟', '🕊️', '📖']
  const colors = ['#1B4FD8', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2', '#EC4899', '#374151', '#F59E0B']
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond' }}>Create New Ministry</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Icon</label>
            <div className="flex gap-2 flex-wrap">
              {emojis.map(e => (
                <button key={e} onClick={() => update('emoji', e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition"
                  style={{ background: form.emoji === e ? '#EEF2FF' : '#F3F4F6', border: form.emoji === e ? '2px solid #1B4FD8' : '2px solid transparent' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ministry Colour</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => update('color', c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ background: c, border: form.color === c ? '3px solid #0F172A' : '3px solid transparent' }} />
              ))}
            </div>
          </div>
          {[
            { label: 'Ministry Name *', field: 'name', ph: 'e.g. Prayer Team' },
            { label: 'Ministry Leader *', field: 'leader', ph: 'Leader full name' },
            { label: 'Leader Phone', field: 'leaderPhone', ph: '+233 24 000 0000' },
            { label: 'Meeting Day & Time', field: 'meetingDay', ph: 'e.g. Fridays 5PM' },
            { label: 'Description', field: 'description', ph: 'Brief description of ministry' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type="text" value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <button
            onClick={() => { if(form.name && form.leader) { onSave({ ...form, id: Date.now(), members: 0 }); onClose() } }}
            disabled={!form.name || !form.leader}
            className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#1B4FD8' }}>
            Create Ministry
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState(initialMinistries)
  const [activeMinistry, setActiveMinistry] = useState(null)
  const [editMinistry, setEditMinistry] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  if (activeMinistry) {
    const current = ministries.find(m => m.id === activeMinistry.id) || activeMinistry
    return <MinistryMembersView ministry={current} onBack={() => setActiveMinistry(null)} />
  }

  const getMemberCount = (ministryId) => {
    try {
      const saved = sessionStorage.getItem(`cos_ministry_${ministryId}`)
      return saved ? JSON.parse(saved).length : 0
    } catch(e) { return 0 }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Ministries & Departments</h1>
          <p className="text-gray-400 text-sm mt-1">{ministries.length} ministries</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Plus size={15} /> Create Ministry
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 fade-in">
        {ministries.map(m => {
          const count = getMemberCount(m.id)
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: m.color + '15' }}>
                  {m.emoji}
                </div>
                <button onClick={() => setEditMinistry(m)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <Edit size={14} className="text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{m.name}</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{m.description}</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Users size={13} style={{ color: m.color }} />
                <span className="text-sm font-bold" style={{ color: m.color }}>{count}</span>
                <span className="text-xs text-gray-400">members</span>
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-1 mb-4">
                <p className="text-xs text-gray-400">Leader: <span className="font-medium text-gray-600">{m.leader}</span></p>
                <p className="text-xs text-gray-400">Phone: <span className="font-medium text-gray-600">{m.leaderPhone || 'Not set'}</span></p>
                <p className="text-xs text-gray-400">Meets: <span className="font-medium text-gray-600">{m.meetingDay}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveMinistry(m)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#1B4FD8' }}>
                  Manage Members
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                  <MessageSquare size={11} /> SMS
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editMinistry && (
        <EditMinistryModal
          ministry={editMinistry}
          onClose={() => setEditMinistry(null)}
          onSave={(updated) => {
            setMinistries(prev => prev.map(m => m.id === updated.id ? updated : m))
          }}
        />
      )}
      {showCreate && (
        <CreateMinistryModal
          onClose={() => setShowCreate(false)}
          onSave={(newM) => setMinistries(prev => [...prev, newM])}
        />
      )}
    </div>
  )
}
