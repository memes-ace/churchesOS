import { useState, useEffect, useRef } from 'react'
import { Brain, Send, TrendingUp, Users, Zap, RefreshCw, Star, AlertTriangle, CheckCircle, MessageSquare, BarChart2 } from 'lucide-react'

const SUGGESTIONS = [
  "Who are my inactive members?",
  "What's our financial health this month?",
  "Draft an SMS to all members about Sunday service",
  "Which members haven't attended in 3 months?",
  "Give me a summary of our giving trends",
  "Draft a letter to inactive members",
  "How can we improve member retention?",
  "What's our total income vs expenses?",
]

export default function AiPage() {
  const user = JSON.parse(localStorage.getItem('cos_user') || '{}')
  const token = localStorage.getItem('cos_token') || ''
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hello! I'm your AI Church Assistant powered by Google Gemini. I have full access to your church data including members, attendance, finances and more.\n\nYou can ask me anything in plain English — I'll give you insights, draft messages, analyze trends, or answer any question about your church. What would you like to know?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [engagement, setEngagement] = useState([])
  const [growth, setGrowth] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch(`/api/churches/${user.church_id}/ai/chat`, {
        method: 'POST', headers,
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.response || 'Sorry, I could not process that.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const loadData = async (type) => {
    setDataLoading(true)
    try {
      const res = await fetch(`/api/churches/${user.church_id}/ai/${type}`, { headers })
      const data = await res.json()
      if (type === 'analytics') setAnalytics(data)
      if (type === 'engagement') setEngagement(Array.isArray(data) ? data : [])
      if (type === 'growth') setGrowth(data)
    } catch(e) { console.warn(e) }
    finally { setDataLoading(false) }
  }

  useEffect(() => {
    if (tab === 'analytics' && !analytics) loadData('analytics')
    if (tab === 'engagement' && !engagement.length) loadData('engagement')
    if (tab === 'growth' && !growth) loadData('growth')
  }, [tab])

  const engagementStyle = (label) => {
    const map = {
      'Highly Engaged': { bg: '#DCFCE7', color: '#166534' },
      'Engaged': { bg: '#DBEAFE', color: '#1E40AF' },
      'Moderate': { bg: '#FEF9C3', color: '#854D0E' },
      'At Risk': { bg: '#FEE2E2', color: '#991B1B' },
      'Inactive': { bg: '#F3F4F6', color: '#6B7280' },
    }
    return map[label] || map['Inactive']
  }

  const tabs = [
    { key: 'chat', label: 'AI Chat', icon: MessageSquare },
    { key: 'analytics', label: 'Analytics', icon: BarChart2 },
    { key: 'engagement', label: 'Engagement', icon: Users },
    { key: 'growth', label: 'Growth', icon: Zap },
  ]

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F8FAFF' }}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800" style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
              AI Church Intelligence
            </h1>
            <p className="text-xs text-gray-400">Powered by Google Gemini • Free</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition"
              style={{
                background: tab === t.key ? 'linear-gradient(135deg, #7C3AED, #1B4FD8)' : 'transparent',
                color: tab === t.key ? 'white' : '#6B7280',
              }}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {m.role === 'ai' ? (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
                      <Brain size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: '#1B4FD8' }}>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {/* Bubble */}
                <div className={`max-w-2xl ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background: m.role === 'user' ? 'linear-gradient(135deg, #7C3AED, #1B4FD8)' : 'white',
                      color: m.role === 'user' ? 'white' : '#374151',
                      borderRadius: m.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
                  <Brain size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div className="flex gap-1 items-center h-5">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: '#7C3AED', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 flex-wrap">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:border-purple-200 hover:text-purple-600 transition bg-white">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask anything about your church in plain English..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:outline-none focus:border-purple-300 text-sm resize-none"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {tab === 'analytics' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-500">AI-powered insights from your church data</p>
            <button onClick={() => { setAnalytics(null); loadData('analytics') }} disabled={dataLoading}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw size={13} className={dataLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {dataLoading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Brain size={40} className="mx-auto mb-3 animate-pulse" style={{ color: '#7C3AED' }} />
              <p className="text-gray-400 text-sm">AI is analyzing your church data...</p>
            </div>
          ) : analytics && (
            <div className="space-y-4 max-w-4xl">
              {/* Health Score */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Church Health Score</h3>
                  <span className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{
                      background: analytics.health_score >= 75 ? '#DCFCE7' : analytics.health_score >= 50 ? '#FEF9C3' : '#FEE2E2',
                      color: analytics.health_score >= 75 ? '#166534' : analytics.health_score >= 50 ? '#854D0E' : '#991B1B'
                    }}>
                    {analytics.health_label}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-5xl font-bold" style={{ color: '#7C3AED' }}>{analytics.health_score}</p>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="h-3 rounded-full" style={{ width: `${analytics.health_score}%`, background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4"><Brain size={16} style={{ color: '#7C3AED' }} /><h3 className="font-bold text-gray-800">Key Insights</h3></div>
                  {analytics.key_insights?.map((s, i) => <p key={i} className="text-sm text-gray-600 mb-2 flex gap-2"><span style={{ color: '#7C3AED' }}>•</span>{s}</p>)}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4"><CheckCircle size={16} style={{ color: '#059669' }} /><h3 className="font-bold text-gray-800">Recommendations</h3></div>
                  {analytics.recommendations?.map((s, i) => <p key={i} className="text-sm text-gray-600 mb-2 flex gap-2"><span style={{ color: '#059669' }}>✓</span>{s}</p>)}
                </div>
                {analytics.risk_alerts?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4"><AlertTriangle size={16} style={{ color: '#F59E0B' }} /><h3 className="font-bold text-gray-800">Risk Alerts</h3></div>
                    {analytics.risk_alerts?.map((s, i) => <p key={i} className="text-sm p-3 rounded-xl mb-2" style={{ background: '#FEF9C3', color: '#92400E' }}>{s}</p>)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ENGAGEMENT TAB */}
      {tab === 'engagement' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-500">AI engagement scores for each member</p>
            <button onClick={() => { setEngagement([]); loadData('engagement') }} disabled={dataLoading}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50">
              <RefreshCw size={13} className={dataLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          {dataLoading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Brain size={40} className="mx-auto mb-3 animate-pulse" style={{ color: '#7C3AED' }} />
              <p className="text-gray-400 text-sm">Scoring your members...</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {engagement.map((m, i) => {
                const s = engagementStyle(m.engagement_label)
                return (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
                          {m.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>{m.engagement_label}</span>
                        </div>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: '#7C3AED' }}>{m.engagement_score}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div className="h-2 rounded-full" style={{ width: `${m.engagement_score}%`, background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }} />
                    </div>
                    {m.recommended_action && <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">💡 {m.recommended_action}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* GROWTH TAB */}
      {tab === 'growth' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-500">AI-powered weekly growth recommendations</p>
            <button onClick={() => { setGrowth(null); loadData('growth') }} disabled={dataLoading}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50">
              <RefreshCw size={13} className={dataLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          {dataLoading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Brain size={40} className="mx-auto mb-3 animate-pulse" style={{ color: '#7C3AED' }} />
              <p className="text-gray-400 text-sm">Preparing your growth report...</p>
            </div>
          ) : growth && (
            <div className="space-y-4 max-w-4xl">
              <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #1B4FD8)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Growth Score</h3>
                  <Zap size={22} className="text-white/70" />
                </div>
                <p className="text-5xl font-bold mb-2">{growth.growth_score}<span className="text-xl text-white/60">/100</span></p>
                <p className="text-white/80 text-sm leading-relaxed">{growth.summary}</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                {[
                  { title: "This Week — Do These", items: growth.this_week_actions, icon: Zap, color: '#F59E0B', bg: '#FFFBEB', itemColor: '#92400E' },
                  { title: "What You're Doing Well", items: growth.wins, icon: Star, color: '#059669', bg: '#F0FDF4', itemColor: '#166534' },
                  { title: "Member Retention Tips", items: growth.member_retention_tips, icon: Users, color: '#1B4FD8', bg: '#EEF2FF', itemColor: '#1E40AF' },
                  { title: "Outreach Ideas", items: growth.outreach_ideas, icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF', itemColor: '#6D28D9' },
                ].map(section => (
                  <div key={section.title} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <section.icon size={15} style={{ color: section.color }} />
                      <h3 className="font-bold text-gray-800 text-sm">{section.title}</h3>
                    </div>
                    {section.items?.map((item, i) => (
                      <div key={i} className="text-sm p-2.5 rounded-xl mb-2" style={{ background: section.bg, color: section.itemColor }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
