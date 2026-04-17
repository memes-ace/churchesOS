import { Download, BarChart3, Users, DollarSign, Calendar, Eye, BookOpen } from 'lucide-react'
const reports = [
  { name: 'Membership Report', desc: 'Total members, new members, inactive, growth rate', icon: Users, color: '#1B4FD8', last: '1 Apr 2025' },
  { name: 'Attendance Report', desc: 'Weekly & monthly attendance, trends, absentee list', icon: Calendar, color: '#7C3AED', last: '7 Apr 2025' },
  { name: 'Financial Report', desc: 'Income, expenses, balance, giving trends', icon: DollarSign, color: '#059669', last: '1 Apr 2025' },
  { name: 'Visitor Report', desc: 'Total visitors, conversion rate, follow-up status', icon: Eye, color: '#F59E0B', last: '7 Apr 2025' },
  { name: 'Event Report', desc: 'Attendance, income, expenses per event', icon: Calendar, color: '#EF4444', last: '31 Mar 2025' },
  { name: 'Sermon Report', desc: 'Most accessed sermons, topics preached', icon: BookOpen, color: '#0891B2', last: '7 Apr 2025' },
]
export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Reports Centre</h1>
        <p className="text-gray-400 text-sm mt-1">Generate, download and schedule automated reports</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
        {reports.map(r => (
          <div key={r.name} className="bg-white rounded-2xl border border-gray-100 p-5 stat-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: r.color + '15' }}>
              <r.icon size={19} style={{ color: r.color }} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>{r.name}</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{r.desc}</p>
            <p className="text-xs text-gray-400 mb-4">Last generated: {r.last}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1" style={{ background: '#1B4FD8' }}>
                <BarChart3 size={11} /> Generate
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"><Download size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
