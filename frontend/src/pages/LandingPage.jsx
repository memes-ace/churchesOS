import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [plans, setPlans] = useState([
    { name: 'Starter', price: 'GHC 200', period: '/month', color: '#1B4FD8', features: ['Up to 100 members', 'Member profiles & attendance', 'Finance tracking', 'Announcements & Prayer', 'Member Portal PWA', 'Church Settings'] },
    { name: 'Growth', price: 'GHC 459', period: '/month', color: '#7C3AED', popular: true, features: ['Up to 500 members', 'Everything in Starter', 'SMS communication', 'Events & Sermons', 'Ministries & Cell Groups', 'Volunteers module', 'AI Intelligence suite', 'Reports & Analytics'] },
    { name: 'Enterprise', price: 'GHC 859', period: '/month', color: '#F59E0B', features: ['Unlimited members', 'Everything in Growth', 'Marketplace access', 'Equipment management', 'Purchases tracking', 'Counselling records', 'Priority support'] },
  ])

  const [landingContent, setLandingContent] = useState({
    hero_title: 'Run Your Church',
    hero_subtitle: 'The all-in-one church management platform for African churches. Manage members, finances, attendance, SMS and grow with AI.',
    hero_badge: 'Built for African Churches',
    stats: [
      { number: '500+', label: 'Churches' },
      { number: '50,000+', label: 'Members' },
      { number: 'GHC 2M+', label: 'Tracked' },
      { number: '99.9%', label: 'Uptime' },
    ],
    momo_number: '0599 001 992',
    momo_name: 'Tabscrow Company Limited',
    whatsapp: '233599001992',
    email: 'admin@churchesos.com',
    cta_title: 'Ready to transform your church management?',
    cta_subtitle: 'Join churches across Ghana using ChurchesOS to save time and grow their congregation.',
  })

  useEffect(() => {
    // Fetch live content + prices from API
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(s => {
        if (s && (s.starterPrice || s.starterPlan)) {
          setPlans([
            { name: 'Starter', price: `GHC ${s.starterPlan?.price || s.starterPrice || 200}`, period: '/month', color: '#1B4FD8', features: ['Up to 100 members', 'Member profiles & attendance', 'Finance tracking', 'Announcements & Prayer', 'Member Portal PWA', 'Church Settings'] },
            { name: 'Growth', price: `GHC ${s.growthPlan?.price || s.growthPrice || 459}`, period: '/month', color: '#7C3AED', popular: true, features: ['Up to 500 members', 'Everything in Starter', 'SMS communication', 'Events & Sermons', 'Ministries & Cell Groups', 'Volunteers module', 'AI Intelligence suite', 'Reports & Analytics'] },
            { name: 'Enterprise', price: `GHC ${s.enterprisePlan?.price || s.enterprisePrice || 859}`, period: '/month', color: '#F59E0B', features: ['Unlimited members', 'Everything in Growth', 'Marketplace access', 'Equipment management', 'Purchases tracking', 'Counselling records', 'Priority support'] },
          ])
        }
        // Update landing content from DB
        setLandingContent({
          hero_title: s.landing_hero_title || 'Run Your Church',
          hero_subtitle: s.landing_hero_subtitle || 'The all-in-one church management platform for African churches.',
          hero_badge: s.landing_hero_badge || 'Built for African Churches',
          stats: s.landing_stats || [
            { number: '500+', label: 'Churches' },
            { number: '50,000+', label: 'Members' },
            { number: 'GHC 2M+', label: 'Tracked' },
            { number: '99.9%', label: 'Uptime' },
          ],
          momo_number: s.landing_momo_number || '0599 001 992',
          momo_name: s.landing_momo_name || 'Tabscrow Company Limited',
          whatsapp: s.landing_whatsapp || '233599001992',
          email: s.landing_email || 'admin@churchesos.com',
          cta_title: s.landing_cta_title || 'Ready to transform your church management?',
          cta_subtitle: s.landing_cta_subtitle || 'Join churches across Ghana using ChurchesOS.',
        })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.4 + 0.1,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        particles.slice(i+1).forEach(q => {
          const d = Math.hypot(p.x-q.x, p.y-q.y)
          if (d < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(27,79,216,${0.06*(1-d/100)})`; ctx.lineWidth=0.5; ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke() }
        })
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(100,150,255,${p.opacity})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  const features = [
    { icon: '👥', title: 'Member Management', desc: 'Complete profiles with attendance, giving, ministry and cell group details.' },
    { icon: '📊', title: 'Finance & Accounting', desc: 'Track tithes, offerings and expenses with beautiful reports.' },
    { icon: '✅', title: 'Attendance Tracking', desc: 'Mark attendance and identify inactive members easily.' },
    { icon: '📱', title: 'SMS Communication', desc: 'Send bulk SMS to all members or specific groups.' },
    { icon: '🤖', title: 'AI Intelligence', desc: 'AI chat, health analytics, engagement scores and growth advisor.' },
    { icon: '📲', title: 'Member Portal PWA', desc: 'Members install a branded app on their phone.' },
    { icon: '🏪', title: 'Church Marketplace', desc: 'Find verified vendors for equipment, catering, printing and more.' },
    { icon: '📅', title: 'Events Management', desc: 'Create events, send reminders and track attendance.' },
    { icon: '📋', title: 'Reports & Analytics', desc: 'Beautiful charts on membership, attendance and finances.' },
  ]

  const S = {
    page: { background: '#0A0F1E', color: 'white', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' },
    nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 5%', background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none', transition: 'all 0.3s' },
    logo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: 'white' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', fontSize: '0.72rem', fontWeight: 500, padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' },
    btnPrimary: { background: '#1B4FD8', color: 'white', border: 'none', padding: '0.85rem 1.8rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 },
    btnOutline: { background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0.85rem 1.8rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem' },
    sectionBadge: { color: '#D4A853', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' },
    sectionTitle: { fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em' },
  }

  return (
    <div style={S.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns button { width: 100% !important; }
          .mockup-wrapper { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-popular { transform: none !important; }
          .cta-btns { flex-direction: column !important; align-items: center !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; }
          .footer-links { justify-content: center !important; }
          .payment-actions { flex-direction: column !important; }
          section { padding: 4rem 5% !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .mockup-wrapper { max-width: 600px !important; }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>Churches<span style={{ color: '#D4A853' }}>OS</span></div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[['Features','features'],['Pricing','pricing'],['Payment','payment']].map(([l,id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.88rem' }}>{l}</button>
          ))}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.88rem' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ ...S.btnPrimary, padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>Get Started →</button>
        </div>
        {/* Mobile nav */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="mobile-only">
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ ...S.btnPrimary, padding: '0.5rem 1rem', fontSize: '0.82rem' }}>Register</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>☰</button>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(10,15,30,0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 5%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[['Features','features'],['Pricing','pricing'],['Payment','payment']].map(([l,id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', textAlign: 'left', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '7rem 5% 4rem' }}>
        <div style={S.badge}>✦ {landingContent.hero_badge}</div>
        <h1 style={{ ...S.sectionTitle, fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', marginBottom: '1.25rem' }}>
          {landingContent.hero_title}<br />
          <em style={{ fontStyle: 'italic', color: '#D4A853' }}>Smarter,</em>{' '}
          <strong style={{ fontWeight: 600 }}>Not Harder.</strong>
        </h1>
        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: 'rgba(255,255,255,0.5)', maxWidth: '540px', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 300, padding: '0 1rem' }}>
          {landingContent.hero_subtitle}
        </p>
        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '400px' }}>
          <button onClick={() => navigate('/register')} style={S.btnPrimary}>Start Free Trial →</button>
          <button onClick={() => scrollTo('features')} style={S.btnOutline}>Explore Features</button>
        </div>

        {/* 3D Mockup - hidden on mobile */}
        <div className="mockup-wrapper" style={{ marginTop: '4rem', width: '100%', maxWidth: '820px', perspective: '1200px' }}>
          <div style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', overflow: 'hidden', transform: 'rotateX(6deg) rotateY(-2deg)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', transition: 'transform 0.5s' }}
            onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-0.5; const y=(e.clientY-r.top)/r.height-0.5; e.currentTarget.style.transform=`rotateX(${-y*8}deg) rotateY(${x*8}deg)` }}
            onMouseLeave={e => { e.currentTarget.style.transform='rotateX(6deg) rotateY(-2deg)' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.7rem 1rem', display: 'flex', gap: '0.4rem' }}>
              {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
            </div>
            <div style={{ display: 'flex', height: '300px' }}>
              <div style={{ width: '150px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond', color: '#D4A853', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>ChurchesOS</div>
                {['Dashboard','Members','Finance','AI Intelligence','Marketplace'].map((item, i) => (
                  <div key={item} style={{ padding: '0.4rem 0.5rem', borderRadius: '5px', marginBottom: '0.2rem', fontSize: '0.62rem', color: i===0?'#93C5FD':'rgba(255,255,255,0.35)', background: i===0?'rgba(27,79,216,0.2)':'transparent', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <div style={{ width:4, height:4, borderRadius:'50%', background:'currentColor', opacity:0.6 }} />{item}
                  </div>
                ))}
              </div>
              <div style={{ flex:1, padding:'1.25rem' }}>
                <div style={{ fontFamily:'Cormorant Garamond', fontSize:'1rem', color:'white', marginBottom:'0.75rem' }}>Dashboard</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', marginBottom:'0.75rem' }}>
                  {[['Members','248','#60A5FA'],['Income','GHC 12,400','#34D399'],['Attendance','78%','#FBBF24'],['AI Score','84/100','#A78BFA']].map(([l,v,c]) => (
                    <div key={l} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'7px', padding:'0.5rem' }}>
                      <div style={{ fontSize:'0.48rem', color:'rgba(255,255,255,0.35)', marginBottom:'0.25rem' }}>{l}</div>
                      <div style={{ fontSize:'0.8rem', fontWeight:600, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'7px', height:'110px', padding:'0.7rem', display:'flex', alignItems:'flex-end', gap:'0.3rem' }}>
                  {[40,55,45,70,60,80,65,90,75,85,70,95].map((h,i) => (
                    <div key={i} style={{ flex:1, height:h+'px', borderRadius:'3px 3px 0 0', background:i%3===1?'rgba(212,168,83,0.5)':'rgba(27,79,216,0.6)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-grid" style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'2.5rem 5%', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', textAlign:'center' }}>
        {(landingContent.stats || []).map((stat, idx) => (
          <div key={idx}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:600, background:'linear-gradient(135deg,#fff,#D4A853)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{stat.number}</div>
            <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginTop:'0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{ position:'relative', zIndex:1, padding:'5rem 5%' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div style={S.sectionBadge}>— Everything You Need</div>
          <h2 style={{ ...S.sectionTitle, fontSize:'clamp(1.8rem,4vw,3rem)' }}>
            Built for how <em style={{ color:'#D4A853' }}>churches actually work</em>
          </h2>
        </div>
        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', overflow:'hidden' }}>
          {features.map(f => (
            <div key={f.title} style={{ background:'#111827', padding:'2rem', transition:'background 0.3s', cursor:'default' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(27,79,216,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='#111827'}>
              <div style={{ fontSize:'1.3rem', marginBottom:'1rem' }}>{f.icon}</div>
              <div style={{ fontSize:'0.92rem', fontWeight:500, marginBottom:'0.5rem' }}>{f.title}</div>
              <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position:'relative', zIndex:1, padding:'5rem 5%', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={S.sectionBadge}>— Simple Pricing</div>
        <h2 style={{ ...S.sectionTitle, fontSize:'clamp(1.8rem,4vw,3rem)', marginBottom:'0.5rem' }}>Plans that grow with your church</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'3rem', fontSize:'0.85rem' }}>14-day free trial • No credit card required • Cancel anytime</p>
        <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', alignItems:'start', textAlign:'left' }}>
          {plans.map(p => (
            <div key={p.name} className={p.popular ? 'pricing-popular' : ''} style={{ background:p.popular?'linear-gradient(135deg,rgba(27,79,216,0.12),rgba(124,58,237,0.08))':'rgba(255,255,255,0.03)', border:`1px solid ${p.popular?'rgba(27,79,216,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:'14px', padding:'2rem', position:'relative', transform:p.popular?'scale(1.03)':'none' }}>
              {p.popular && <div style={{ position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)', background:'#1B4FD8', color:'white', fontSize:'0.65rem', fontWeight:500, padding:'0.25rem 0.9rem', borderRadius:'100px', whiteSpace:'nowrap' }}>Most Popular</div>}
              <div style={{ fontSize:'0.7rem', fontWeight:500, color:'#D4A853', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem' }}>{p.name}</div>
              <div style={{ fontFamily:'Cormorant Garamond', fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:600, lineHeight:1, marginBottom:'0.25rem' }}>{p.price}<span style={{ fontSize:'0.9rem', fontWeight:400, color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans' }}>{p.period}</span></div>
              <div style={{ height:'1px', background:'rgba(255,255,255,0.08)', margin:'1.25rem 0' }} />
              <ul style={{ listStyle:'none', marginBottom:'1.75rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display:'flex', gap:'0.5rem', fontSize:'0.8rem', color:'rgba(203,213,225,0.85)', marginBottom:'0.65rem' }}>
                    <span style={{ color:'#34D399', fontWeight:600, flexShrink:0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} style={{ display:'block', width:'100%', textAlign:'center', padding:'0.8rem', borderRadius:'10px', border:p.popular?'none':'1px solid rgba(255,255,255,0.2)', background:p.popular?'#1B4FD8':'transparent', color:'white', fontSize:'0.88rem', fontWeight:500, cursor:'pointer' }}>
                Get Started {p.popular?'→':''}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT */}
      <section id="payment" style={{ position:'relative', zIndex:1, padding:'5rem 5%', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={S.sectionBadge}>— Easy Payment</div>
        <h2 style={{ ...S.sectionTitle, fontSize:'clamp(1.8rem,4vw,3rem)', marginBottom:'0.5rem' }}>Pay via Mobile Money</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'3rem', fontSize:'0.85rem' }}>No credit card needed. Fast, simple and secure.</p>
        <div style={{ maxWidth:'520px', margin:'0 auto' }}>
          <div style={{ background:'rgba(212,168,83,0.08)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:'18px', padding:'2rem', textAlign:'left', marginBottom:'1rem' }}>
            <div style={{ fontSize:'1.8rem', marginBottom:'0.75rem' }}>📲</div>
            <div style={{ fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem' }}>MTN Mobile Money</div>
            {[['MoMo Number', landingContent.momo_number],['Account Name', landingContent.momo_name]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'0.7rem 1rem', background:'rgba(255,255,255,0.05)', borderRadius:'10px', marginBottom:'0.5rem', flexWrap:'wrap', gap:'0.5rem' }}>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem' }}>{l}</span>
                <span style={{ color:'#D4A853', fontWeight:600, fontSize:'0.82rem' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(27,79,216,0.1)', border:'1px solid rgba(27,79,216,0.25)', borderRadius:'14px', padding:'1.5rem', textAlign:'left', marginBottom:'1rem' }}>
            <p style={{ color:'#60A5FA', fontWeight:600, fontSize:'0.83rem', marginBottom:'0.75rem' }}>ℹ️ How we identify your payment</p>
            <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:'0.75rem' }}>After sending payment, contact us with:</p>
            {['1. Your Church Name','2. MoMo Transaction ID','3. Plan you are paying for','4. Your registered email address'].map(item => (
              <div key={item} style={{ fontSize:'0.78rem', color:'rgba(203,213,225,0.7)', padding:'0.4rem 0.75rem', background:'rgba(255,255,255,0.04)', borderRadius:'7px', marginBottom:'0.4rem' }}>• {item}</div>
            ))}
          </div>
          <div className="payment-actions" style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', justifyContent:'center' }}>
            <a href={`https://wa.me/${landingContent.whatsapp}`} target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.3)', color:'#34D399', padding:'0.6rem 1.25rem', borderRadius:'10px', textDecoration:'none', fontSize:'0.82rem', fontWeight:500 }}>
              💬 WhatsApp Us
            </a>
            <a href={`mailto:${landingContent.email}`}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.3)', color:'#60A5FA', padding:'0.6rem 1.25rem', borderRadius:'10px', textDecoration:'none', fontSize:'0.82rem', fontWeight:500 }}>
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', zIndex:1, padding:'6rem 5%', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ ...S.sectionTitle, fontSize:'clamp(2rem,5vw,4rem)', marginBottom:'1rem' }}>
          {landingContent.cta_title}
        </h2>
        <p style={{ color:'rgba(255,255,255,0.4)', maxWidth:'480px', margin:'0 auto 2.5rem', fontSize:'0.95rem', lineHeight:1.8 }}>
          {landingContent.cta_subtitle}
        </p>
        <div className="cta-btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/register')} style={{ ...S.btnPrimary, fontSize:'1rem', padding:'1rem 2rem' }}>Start Your Free Trial →</button>
          <a href={`mailto:${landingContent.email}`} style={{ ...S.btnOutline, fontSize:'1rem', padding:'1rem 2rem', textDecoration:'none', display:'inline-block' }}>Contact Us</a>
        </div>
        <p style={{ marginTop:'1.25rem', fontSize:'0.78rem', color:'rgba(255,255,255,0.25)' }}>14-day free trial • No credit card required • Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,0.08)', padding:'2rem 5%' }}>
        <div className="footer-inner" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem', marginBottom:'1.5rem' }}>
          <div>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:'1.3rem', fontWeight:600, marginBottom:'0.25rem' }}>
              Churches<span style={{ color:'#D4A853' }}>OS</span>
            </div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)' }}>Built by <span style={{ color:'#D4A853' }}>Tabscrow</span> • For African Churches</div>
          </div>
          <div className="footer-links" style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
            {[['Login','/login'],['Register','/register'],['Vendor Apply','/vendor-apply']].map(([l,p]) => (
              <button key={l} onClick={() => navigate(p)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'0.8rem' }}>{l}</button>
            ))}
            <a href={`mailto:${landingContent.email}`} style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', textDecoration:'none' }}>Contact</a>
          </div>
        </div>
        <div style={{ textAlign:'center', fontSize:'0.72rem', color:'rgba(255,255,255,0.18)', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1rem' }}>
          © 2026 ChurchesOS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
