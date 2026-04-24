import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(27,79,216,${0.08 * (1 - dist/120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,150,255,${p.opacity})`
        ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [])

  const features = [
    { icon: '👥', title: 'Member Management', desc: 'Complete member profiles with attendance, giving, ministry and cell group details.' },
    { icon: '📊', title: 'Finance & Accounting', desc: 'Track tithes, offerings, income and expenses with beautiful reports.' },
    { icon: '✅', title: 'Attendance Tracking', desc: 'Mark attendance for every service and identify inactive members easily.' },
    { icon: '📱', title: 'SMS Communication', desc: 'Send bulk SMS to all members or specific groups via NALO network.' },
    { icon: '🤖', title: 'AI Intelligence', desc: 'AI chat assistant, health analytics, engagement scores and growth advisor.' },
    { icon: '📲', title: 'Member Portal PWA', desc: 'Members install a branded app to view attendance, giving and announcements.' },
    { icon: '🏪', title: 'Church Marketplace', desc: 'Find verified vendors for equipment, catering, printing and more.' },
    { icon: '📅', title: 'Events Management', desc: 'Create events, send reminders and track RSVPs from one dashboard.' },
    { icon: '📋', title: 'Reports & Analytics', desc: 'Beautiful charts on membership growth, attendance trends and finances.' },
  ]

  const plans = [
    { name: 'Starter', price: 'GHC 150', period: '/month', color: '#1B4FD8', features: ['Up to 100 members', 'Member profiles & attendance', 'Finance tracking', 'Announcements & Prayer', 'Member Portal PWA', 'Church Settings'] },
    { name: 'Growth', price: 'GHC 350', period: '/month', color: '#7C3AED', popular: true, features: ['Up to 500 members', 'Everything in Starter', 'SMS communication', 'Events & Sermons', 'Ministries & Cell Groups', 'Volunteers module', 'AI Intelligence suite', 'Reports & Analytics'] },
    { name: 'Enterprise', price: 'GHC 700', period: '/month', color: '#F59E0B', features: ['Unlimited members', 'Everything in Growth', 'Marketplace access', 'Equipment management', 'Purchases tracking', 'Counselling records', 'Priority support'] },
  ]

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ background: '#0A0F1E', color: 'white', fontFamily: "DM Sans, sans-serif", overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 5%',
        background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600 }}>
          Churches<span style={{ color: '#D4A853' }}>OS</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[['Features', 'features'], ['Pricing', 'pricing'], ['Payment', 'payment']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem' }}>
              {label}
            </button>
          ))}
          <button onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem' }}>
            Login
          </button>
          <button onClick={() => navigate('/register')}
            style={{ background: '#1B4FD8', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 5% 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', fontSize: '0.75rem', fontWeight: 500, padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          ✦ Built for African Churches
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          Run Your Church<br />
          <em style={{ fontStyle: 'italic', color: '#D4A853' }}>Smarter,</em>{' '}
          <strong style={{ fontWeight: 600 }}>Not Harder.</strong>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '560px', lineHeight: 1.8, marginBottom: '3rem', fontWeight: 300 }}>
          The all-in-one church management platform designed for African churches. Manage members, finances, attendance, communicate via SMS and grow with AI-powered insights.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: '#1B4FD8', color: 'white', padding: '0.9rem 2rem', borderRadius: '10px', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>
            Start Free Trial →
          </button>
          <button onClick={() => scrollTo('features')}
            style={{ background: 'transparent', color: 'white', padding: '0.9rem 2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 400, fontSize: '1rem', cursor: 'pointer' }}>
            Explore Features
          </button>
        </div>

        {/* 3D Mockup */}
        <div style={{ marginTop: '5rem', width: '100%', maxWidth: '860px', perspective: '1200px' }}>
          <div style={{
            background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px', overflow: 'hidden',
            transform: 'rotateX(8deg) rotateY(-2deg)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            transition: 'transform 0.5s'
          }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width - 0.5
              const y = (e.clientY - rect.top) / rect.height - 0.5
              e.currentTarget.style.transform = `rotateX(${-y*8}deg) rotateY(${x*8}deg)`
            }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'rotateX(8deg) rotateY(-2deg)' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.8rem 1rem', display: 'flex', gap: '0.5rem' }}>
              {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ display: 'flex', height: '320px' }}>
              <div style={{ width: '160px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond', color: '#D4A853', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>ChurchesOS</div>
                {['Dashboard','Members','Attendance','Finance','AI Intelligence','Marketplace'].map((item, i) => (
                  <div key={item} style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', marginBottom: '0.2rem', fontSize: '0.65rem', color: i === 0 ? '#93C5FD' : 'rgba(255,255,255,0.4)', background: i === 0 ? 'rgba(27,79,216,0.2)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', opacity: 0.6 }} /> {item}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: '1.5rem' }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Dashboard Overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
                  {[['Members','248','#60A5FA'],['Income','GHC 12,400','#34D399'],['Attendance','78%','#FBBF24'],['AI Score','84/100','#A78BFA']].map(([l,v,c]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.6rem' }}>
                      <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>{l}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', height: '120px', padding: '0.8rem', display: 'flex', alignItems: 'flex-end', gap: '0.3rem' }}>
                  {[40,55,45,70,60,80,65,90,75,85,70,95].map((h,i) => (
                    <div key={i} style={{ flex: 1, height: h+'px', borderRadius: '3px 3px 0 0', background: i % 3 === 1 ? 'rgba(212,168,83,0.5)' : 'rgba(27,79,216,0.6)', transition: 'height 0.5s' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '3rem 5%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
        {[['500+','Churches Onboarded'],['50,000+','Members Managed'],['GHC 2M+','Finances Tracked'],['99.9%','Uptime Guarantee']].map(([n,l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 600, background: 'linear-gradient(135deg,#fff,#D4A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '6rem 5%' }}>
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ color: '#D4A853', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>— Everything You Need</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, lineHeight: 1.15 }}>
            Built for how <em style={{ color: '#D4A853' }}>churches actually work</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          {features.map(f => (
            <div key={f.title}
              style={{ background: '#111827', padding: '2.5rem', cursor: 'default', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(27,79,216,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = '#111827'}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(27,79,216,0.15)', border: '1px solid rgba(27,79,216,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{f.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.6rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '6rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: '#D4A853', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>— Simple Pricing</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, marginBottom: '0.5rem' }}>
          Plans that grow with your church
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4rem', fontSize: '0.9rem' }}>14-day free trial • No credit card required • Cancel anytime</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.popular ? 'linear-gradient(135deg,rgba(27,79,216,0.12),rgba(124,58,237,0.08))' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${p.popular ? 'rgba(27,79,216,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '16px', padding: '2.5rem', textAlign: 'left', position: 'relative',
              transform: p.popular ? 'scale(1.03)' : 'none',
              transition: 'transform 0.3s'
            }}>
              {p.popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1B4FD8', color: 'white', fontSize: '0.7rem', fontWeight: 500, padding: '0.3rem 1rem', borderRadius: '100px', whiteSpace: 'nowrap' }}>Most Popular</div>}
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#D4A853', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.name}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.8rem', fontWeight: 600, lineHeight: 1, marginBottom: '0.25rem' }}>{p.price}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>{p.period}</span></div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
              <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.83rem', color: 'rgba(203,213,225,0.9)', marginBottom: '0.7rem' }}>
                    <span style={{ color: '#34D399', fontWeight: 600 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')}
                style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.85rem', borderRadius: '10px', border: p.popular ? 'none' : '1px solid rgba(255,255,255,0.2)', background: p.popular ? '#1B4FD8' : 'transparent', color: 'white', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
                Get Started {p.popular ? '→' : ''}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT */}
      <section id="payment" style={{ position: 'relative', zIndex: 1, padding: '6rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: '#D4A853', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>— Easy Payment</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, marginBottom: '0.5rem' }}>
          Pay via Mobile Money
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4rem', fontSize: '0.9rem' }}>No credit card needed. Fast, simple and secure.</p>

        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: '20px', padding: '2.5rem', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📲</div>
          <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>MTN Mobile Money</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {[['MoMo Number', '0599 001 992'], ['Account Name', 'Tabscrow Company Limited']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{l}</span>
                <span style={{ color: '#D4A853', fontWeight: 600, fontSize: '0.85rem' }}>{v}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>After payment, register your church and send your transaction ID to <strong style={{ color: '#D4A853' }}>admin@churchesos.com</strong> or WhatsApp <strong style={{ color: '#D4A853' }}>0599 001 992</strong>. We activate within 2 hours.</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '8rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Ready to transform<br />your church management?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '500px', margin: '0 auto 3rem', fontSize: '1rem', lineHeight: 1.8 }}>
          Join churches across Ghana using ChurchesOS to save time, grow their congregation and manage everything in one place.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: '#1B4FD8', color: 'white', padding: '1rem 2.5rem', borderRadius: '10px', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>
            Start Your Free Trial →
          </button>
          <a href="mailto:admin@churchesos.com"
            style={{ background: 'transparent', color: 'white', padding: '1rem 2.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 400, fontSize: '1rem', textDecoration: 'none' }}>
            Contact Us
          </a>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>14-day free trial • No credit card required • Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            Churches<span style={{ color: '#D4A853' }}>OS</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Built by <span style={{ color: '#D4A853' }}>Tabscrow</span> • Made for African Churches</div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[['Login', '/login'], ['Register', '/register'], ['Vendor Apply', '/vendor-apply']].map(([l, p]) => (
            <button key={l} onClick={() => navigate(p)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem' }}>
              {l}
            </button>
          ))}
          <a href="mailto:admin@churchesos.com" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', width: '100%', textAlign: 'center', marginTop: '1rem' }}>
          © 2026 ChurchesOS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
