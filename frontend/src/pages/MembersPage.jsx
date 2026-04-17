import { useState } from 'react'
import { Search, Plus, Download, Upload, MoreVertical, X, Phone, Mail, User } from 'lucide-react'

const mockMembers = [
  { id: 1, name: 'Abena Asante', phone: '+233 24 123 4567', email: 'abena@email.com', status: 'Member', membership: 'Active', ministry: 'Choir', joined: '2022-03-15', attendance: '92%', avatar: 'AA', gender: 'Female' },
  { id: 2, name: 'Kwame Boateng', phone: '+233 20 987 6543', email: 'kwame@email.com', status: 'Worker', membership: 'Active', ministry: 'Ushering', joined: '2019-07-22', attendance: '88%', avatar: 'KB', gender: 'Male' },
  { id: 3, name: 'Gifty Mensah', phone: '+233 55 246 8135', email: 'gifty@email.com', status: 'Leader', membership: 'Active', ministry: 'Youth', joined: '2018-01-10', attendance: '95%', avatar: 'GM', gender: 'Female' },
  { id: 4, name: 'Emmanuel Darko', phone: '+233 24 369 2580', email: 'emmanuel@email.com', status: 'Member', membership: 'Active', ministry: 'Media', joined: '2021-11-05', attendance: '75%', avatar: 'ED', gender: 'Male' },
  { id: 5, name: 'Adwoa Frimpong', phone: '+233 27 159 7532', email: 'adwoa@email.com', status: 'Member', membership: 'Active', ministry: 'Sunday School', joined: '2023-02-28', attendance: '81%', avatar: 'AF', gender: 'Female' },
  { id: 6, name: 'Kofi Asumadu', phone: '+233 20 741 8520', email: 'kofi@email.com', status: 'Member', membership: 'Inactive', ministry: 'None', joined: '2020-06-14', attendance: '32%', avatar: 'KA', gender: 'Male' },
  { id: 7, name: 'Ama Owusu', phone: '+233 24 852 9630', email: 'ama@email.com', status: 'Worker', membership: 'Active', ministry: 'Welfare', joined: '2017-09-30', attendance: '90%', avatar: 'AO', gender: 'Female' },
  { id: 8, name: 'Yaw Oppong', phone: '+233 55 963 1470', email: 'yaw@email.com', status: 'Leader', membership: 'Active', ministry: 'Evangelism', joined: '2016-04-12', attendance: '97%', avatar: 'YO', gender: 'Male' },
]

const statusStyle = { Member: { bg: '#EEF2FF', text: '#1B4FD8' }, Worker: { bg: '#FEF9C3', text: '#854D0E' }, Leader: { bg: '#EDE9FE', text: '#5B21B6' }, Visitor: { bg: '#F0F9FF', text: '#0C4A6E' } }
const membershipStyle = { Active: { bg: '#DBEAFE', text: '#1E40AF' }, Inactive: { bg: '#FEE2E2', text: '#991B1B' } }

function MemberModal({ member, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{  }}>Member Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: '#1B4FD8' }}>{member.avatar}</div>
            <div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: statusStyle[member.status]?.bg, color: statusStyle[member.status]?.text }}>{member.status}</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: membershipStyle[member.membership]?.bg, color: membershipStyle[member.membership]?.text }}>{member.membership}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Phone, label: 'Phone', value: member.phone },
              { icon: Mail, label: 'Email', value: member.email },
              { icon: User, label: 'Ministry', value: member.ministry },
              { icon: User, label: 'Gender', value: member.gender },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                  <Icon size={14} style={{ color: '#1B4FD8' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Edit Profile</button>
            <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600">Send SMS</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddMemberModal({ onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', status: 'Member', gender: 'Male', ministry: '' })
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold" style={{  }}>Add New Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Abena Asante' },
            { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+233 24 000 0000' },
            { label: 'Email Address', field: 'email', type: 'email', placeholder: 'member@email.com' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {['Member','Worker','Leader','Visitor'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                {['Male','Female'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ministry</label>
            <select value={form.ministry} onChange={e => setForm({ ...form, ministry: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              <option value="">None</option>
              {['Choir','Ushering','Youth','Media','Sunday School','Welfare','Evangelism','Prayer Team'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>Add Member</button>
        </div>
      </div>
    </div>
  )
}

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedMember, setSelectedMember] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = mockMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
    const matchFilter = filter === 'All' || m.status === filter || m.membership === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Members</h1>
          <p className="text-gray-400 text-sm mt-1">{mockMembers.length} total • {mockMembers.filter(m => m.membership === 'Active').length} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
            <Plus size={15} /> Add Member
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap fade-in">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div className="flex items-center gap-2">
          {['All','Member','Worker','Leader','Active','Inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{ background: filter === f ? '#1B4FD8' : 'white', color: filter === f ? 'white' : '#6b7280', border: '1px solid ' + (filter === f ? '#1B4FD8' : '#e5e7eb') }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ministry</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Attendance</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(m => (
              <tr key={m.id} className="table-row cursor-pointer" onClick={() => setSelectedMember(m)}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1B4FD8' }}>{m.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-400">Joined {new Date(m.joined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{m.phone}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ background: statusStyle[m.status]?.bg, color: statusStyle[m.status]?.text }}>{m.status}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ background: membershipStyle[m.membership]?.bg, color: membershipStyle[m.membership]?.text }}>{m.membership}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 hidden lg:table-cell">{m.ministry}</td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ background: parseInt(m.attendance) >= 80 ? '#1B4FD8' : parseInt(m.attendance) >= 60 ? '#F59E0B' : '#EF4444', width: m.attendance }}></div>
                    </div>
                    <span className="text-xs text-gray-600">{m.attendance}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={e => e.stopPropagation()}>
                    <MoreVertical size={15} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No members found</p>
          </div>
        )}
      </div>
      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
