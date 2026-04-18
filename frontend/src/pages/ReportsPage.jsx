import { useState } from 'react'
import { BarChart3, Users, DollarSign, Calendar, Download, TrendingUp } from 'lucide-react'

const reportTypes = [
  { id: 'members', label: 'Member Report', icon: Users, color: '#1B4FD8', description: 'Full list of all church members with their details' },
  { id: 'attendance', label: 'Attendance Report', icon: Calendar, color: '#7C3AED', description: 'Attendance records for all services and meetings' },
  { id: 'finance', label: 'Finance Report', icon: DollarSign, color: '#059669', description: 'Income, expenses and financial summary' },
  { id: 'ministry', label: 'Ministry Report', icon: Users, color: '#F59E0B', description: 'Ministry membership and attendance breakdown' },
  { id: 'visitors', label: 'Visitors Report', icon: TrendingUp, color: '#EC4899', description: 'Visitor records and conversion tracking' },
  { id: 'growth', label: 'Church Growth Report', icon: BarChart3, color: '#0891B2', description: 'Overall church growth and trends' },
]

export default function ReportsPage() {
  const [generating, setGenerating] = useState(null)
  const [generated, setGenerated] = useState([])

  const generateReport = (reportId) => {
    setGenerating(reportId)
    setTimeout(() => {
      setGenerating(null)
      setGenerated(prev => [...prev, reportId])
      setTimeout(() => setGenerated(prev => prev.filter(r => r !== reportId)), 3000)
    }, 2000)
  }

  const getMemberCount = () => { try { return JSON.parse(localStorage.getItem('cos_members_db') || '[]').length } catch(e) { return 0 } }
  const getAttendanceCount = () => { try { return JSON.parse(localStorage.getItem('cos_attendance_db') || '[]').length } catch(e) { return 0 } }
  const getFinanceTotal = () => {
    try {
      const t = JSON.parse(localStorage.getItem('cos_finance_db') || '[]')
      return t.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount || 0), 0)
    } catch(e) { return 0 }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Generate and download church reports</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 fade-in">
        {[
          { label: 'Total Members', value: getMemberCount(), color: '#1B4FD8' },
          { label: 'Services Recorded', value: getAttendanceCount(), color: '#7C3AED' },
          { label: 'Total Income', value: 'GHC ' + getFinanceTotal().toLocaleString(), color: '#059669' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center stat-card">
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
        {reportTypes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: r.color + '15' }}>
                <r.icon size={22} style={{ color: r.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: '16px' }}>{r.label}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">{r.description}</p>
            <div className="flex gap-2">
              <button onClick={() => generateReport(r.id)}
                disabled={generating === r.id}
                className="flex-1 py-2.5 rounded-xl text-white text-xs font-medium disabled:opacity-70 transition flex items-center justify-center gap-1.5"
                style={{ background: generated.includes(r.id) ? '#059669' : r.color }}>
                {generating === r.id ? 'Generating...' : generated.includes(r.id) ? '✓ Generated' : 'Generate Report'}
              </button>
              <button className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
