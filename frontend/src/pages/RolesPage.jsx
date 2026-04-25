import { useState } from 'react'
import { Shield, X, Save, Users, ChevronRight, Check, Info } from 'lucide-react'

const roleDefinitions = [
  {
    id: 'pastor',
    name: 'Pastor',
    icon: '✝️',
    color: '#7C3AED',
    bg: '#EDE9FE',
    description: 'Full view access to all church data. Cannot edit but can view everything.',
    permissions: [
      'View all members',
      'View all attendance records',
      'View all finances',
      'View all ministries & cell groups',
      'View all reports',
      'View equipment reports',
      'View purchases & receipts',
    ],
  },
  {
    id: 'church_admin',
    name: 'Church Admin',
    icon: '⛪',
    color: '#1B4FD8',
    bg: '#EEF2FF',
    description: 'Can manage most church operations. Cannot access finance unless Finance Officer role is also assigned.',
    permissions: [
      'Add / edit / delete members',
      'Record & manage attendance',
      'Manage events and programs',
      'Manage visitors',
      'Send SMS announcements',
      'Manage ministries',
      'View reports',
    ],
  },
  {
    id: 'ministry_leader',
    name: 'Ministry Leader',
    icon: '🎵',
    color: '#059669',
    bg: '#DCFCE7',
    description: 'Can only manage their assigned ministry. Cannot see other ministries or financial data.',
    permissions: [
      'Manage own ministry members',
      'Record ministry attendance',
      'Post ministry announcements',
      'Upload files and songs (Choir)',
      'Add meeting notes',
      'View own ministry reports',
    ],
  },
  {
    id: 'cell_leader',
    name: 'Cell Leader',
    icon: '🏠',
    color: '#F59E0B',
    bg: '#FEF9C3',
    description: 'Can only manage their assigned cell group. Cannot access other modules.',
    permissions: [
      'Add / remove cell group members',
      'Record cell meeting attendance',
      'Write meeting notes',
      'Post prayer requests',
      'Share announcements to cell',
      'View own cell group reports',
    ],
  },
  {
    id: 'finance_officer',
    name: 'Finance Officer',
    icon: '💰',
    color: '#0891B2',
    bg: '#ECFEFF',
    description: 'Full access to all financial data, transactions, and purchase records.',
    permissions: [
      'View all financial records',
      'Add / edit transactions',
      'Record purchases and receipts',
      'Generate finance reports',
      'View member giving records',
      'Approve purchases',
    ],
  },
  {
    id: 'member',
    name: 'Member',
    icon: '👤',
    color: '#6B7280',
    bg: '#F3F4F6',
    description: 'Basic access. Can only view their own profile, giving records, and church announcements.',
    permissions: [
      'View own profile',
      'View own giving history',
      'View church announcements',
      'View uploaded sermons',
      'Submit prayer requests',
      'View cell group messages',
    ],
  },
]

const storageKey = 'cos_user_roles'

const getUserRoles = () => {
  try { return [] }
  catch(e) { return [] }
}

function AssignRoleModal({ user, onClose, onSave }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'member')
  const [assignedMinistry, setAssignedMinistry] = useState(user?.assignedMinistry || '')
  const [assignedCell, setAssignedCell] = useState(user?.assignedCell || '')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>
              Assign Role
            </h2>
            <p className="text-xs text-gray-400">{user?.name} • {user?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {roleDefinitions.map(role => (
            <button key={role.id} onClick={() => setSelectedRole(role.id)}
              className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition text-left"
              style={{ borderColor: selectedRole === role.id ? role.color : '#E5E7EB', background: selectedRole === role.id ? role.bg : 'white' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: role.bg }}>
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold" style={{ color: selectedRole === role.id ? role.color : '#0F172A' }}>{role.name}</p>
                  {selectedRole === role.id && <Check size={16} style={{ color: role.color }} />}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{role.description}</p>
              </div>
            </button>
          ))}

          {selectedRole === 'ministry_leader' && (
            <div className="p-4 rounded-xl border border-green-200" style={{ background: '#F0FDF4' }}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Assign to Ministry</label>
              <select value={assignedMinistry} onChange={e => setAssignedMinistry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
                <option value="">Select ministry</option>
                {['Choir', 'Instrumentalists', 'Ushering', 'Youth Ministry', 'Prayer Team', 'Media Team', 'Sunday School', 'Welfare', 'Evangelism', 'Security'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          {selectedRole === 'cell_leader' && (
            <div className="p-4 rounded-xl border border-yellow-200" style={{ background: '#FEFCE8' }}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Assign to Cell Group</label>
              <input type="text" value={assignedCell} onChange={e => setAssignedCell(e.target.value)}
                placeholder="e.g. Grace Cell - East Legon"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={() => { onSave({ ...user, role: selectedRole, assignedMinistry, assignedCell }); onClose() }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: '#1B4FD8' }}>
            <Save size={15} /> Assign Role
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function AddUserModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'member' })
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px' }}>Add Portal User</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EEF2FF' }}>
            <Info size={14} style={{ color: '#1B4FD8', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: '#1B4FD8' }}>This gives the person access to the ChurchesOS portal with the selected role. They will receive a login email.</p>
          </div>
          {[
            { label: 'Full Name *', field: 'name', type: 'text', ph: 'e.g. Gifty Mensah' },
            { label: 'Email Address *', field: 'email', type: 'email', ph: 'email@example.com' },
            { label: 'Phone Number', field: 'phone', type: 'tel', ph: '+233 24 000 0000' },
          ].map(f => (
            <div key={f.field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={e => update(f.field, e.target.value)}
                placeholder={f.ph} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
            <select value={form.role} onChange={e => update('role', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm">
              {roleDefinitions.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
            </select>
          </div>
          <button onClick={() => { if(form.name && form.email) { onSave({ id: Date.now(), ...form, status: 'Active', dateAdded: new Date().toISOString() }); onClose() } }}
            disabled={!form.name || !form.email}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50" style={{ background: '#1B4FD8' }}>
            Add User & Send Invite
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RolesPage() {
  const [users, setUsers] = useState(getUserRoles)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  const saveUsers = (list) => { setUsers(list) }

  const handleSaveRole = (updated) => {
    saveUsers(users.map(u => u.id === updated.id ? updated : u))
    setSelected(null)
  }

  const handleAddUser = (user) => saveUsers([...users, user])
  const handleDelete = (id) => saveUsers(users.filter(u => u.id !== id))

  const getRoleDef = (roleId) => roleDefinitions.find(r => r.id === roleId) || roleDefinitions[5]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Roles & Permissions</h1>
          <p className="text-gray-400 text-sm mt-1">Control who can access and manage different parts of ChurchesOS</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#1B4FD8' }}>
          <Users size={15} /> Add User
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100 fade-in">
        {[
          { id: 'users', label: 'Portal Users', icon: '👥' },
          { id: 'roles', label: 'Role Definitions', icon: '🔐' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition"
            style={{ color: activeTab === t.id ? '#1B4FD8' : '#6B7280', borderBottom: activeTab === t.id ? '2px solid #1B4FD8' : '2px solid transparent' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="fade-in">
          {users.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>No portal users yet</h3>
              <p className="text-gray-400 text-sm mb-2">Add leaders and staff who need access to ChurchesOS</p>
              <p className="text-gray-300 text-xs mb-6">e.g. Choir leader, Cell leader, Finance officer</p>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium mx-auto" style={{ background: '#1B4FD8' }}>
                <Users size={15} /> Add First User
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(u => {
                const roleDef = getRoleDef(u.role)
                return (
                  <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 stat-card">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: roleDef.color }}>
                      {u.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                      {u.assignedMinistry && <p className="text-xs mt-0.5" style={{ color: roleDef.color }}>Ministry: {u.assignedMinistry}</p>}
                      {u.assignedCell && <p className="text-xs mt-0.5" style={{ color: roleDef.color }}>Cell: {u.assignedCell}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{ background: roleDef.bg, color: roleDef.color }}>
                        {roleDef.icon} {roleDef.name}
                      </span>
                      <button onClick={() => setSelected(u)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        Change Role
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                        <X size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {roleDefinitions.map(role => (
            <div key={role.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: role.bg }}>
                  {role.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond', fontSize: '17px' }}>{role.name}</h3>
                  <p className="text-xs" style={{ color: role.color }}>{users.filter(u => u.role === role.id).length} users assigned</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{role.description}</p>
              <div className="space-y-1.5">
                {role.permissions.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: role.bg }}>
                      <Check size={10} style={{ color: role.color }} />
                    </div>
                    <span className="text-xs text-gray-600">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <AssignRoleModal
          user={selected}
          onClose={() => setSelected(null)}
          onSave={handleSaveRole}
        />
      )}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  )
}
