import { Link } from 'react-router-dom';
import { 
  FiUsers, FiCheckSquare, FiBarChart2, FiLayers, FiInfo, 
  FiCheckCircle, FiShield, FiTarget, FiActivity, 
  FiMail, FiExternalLink, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import useAuthStore from '../utils/authStore';

export default function About() {
  const { user } = useAuthStore();

  const keyFeatures = [
    {
      icon: FiUsers,
      title: "Client Intelligence",
      desc: "Maintain rich client profiles, logs, and communication history in a refined centralized vault.",
      color: "var(--indigo)",
      shadow: "rgba(79, 70, 229, 0.15)"
    },
    {
      icon: FiActivity,
      title: "Activity Tracking",
      desc: "Schedule interactions, automate tasks, and monitor client pipelines with elegant checklists.",
      color: "var(--rose)",
      shadow: "rgba(225, 29, 72, 0.15)"
    },
    {
      icon: FiBarChart2,
      title: "Reports & Analytics",
      desc: "Observe deal value distribution and client metrics via high-fidelity, interactive dashboards.",
      color: "var(--amber)",
      shadow: "rgba(245, 158, 11, 0.15)"
    },
    {
      icon: FiShield,
      title: "Granular Security",
      desc: "Keep records secure using strict role-based access policies built for compliance and scaling.",
      color: "var(--cyan)",
      shadow: "rgba(6, 182, 212, 0.15)"
    }
  ];

  const efficiencyPoints = [
    "Refined glassmorphic components",
    "Secure cookie-session and token authorization",
    "Real-time audit trails for administrator oversight",
    "Scalable MERN Architecture with Mongo Atlas",
    "Ultra-responsive fluid layouts",
    "Performance optimized bundle builds"
  ];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Decorative Aurora Ambient Lights */}
      <div className="aurora-blob aurora-1"></div>
      <div className="aurora-blob aurora-2"></div>

      {/* Navigation Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        height: '72px',
        background: 'rgba(10, 10, 15, 0.85)', 
        backdropFilter: 'blur(16px) saturate(1.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ 
          maxWidth: '1300px', 
          margin: '0 auto', 
          padding: '0 32px', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          
          {/* Logo with Hover Glow */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="rail-logo-container">
            <div className="rail-logo-mark" style={{ width: '36px', height: '36px' }}>
              <FiLayers size={16} color="#fff" />
            </div>
            <span style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', 
              fontWeight: 900, 
              color: '#ffffff', 
              letterSpacing: '-0.04em'
            }}>CMS</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            <a href="#why-cms" className="navbar-link">Why CMS</a>
            <a href="#features" className="navbar-link">Features</a>
            <a href="#efficiency" className="navbar-link">Efficiency</a>
            <a href="#mission" className="navbar-link">Mission</a>
            <a href="#contact" className="navbar-link">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, zIndex: 1 }}>

        {/* Hero Section - Asymmetric Layout with Staggered floating cards */}
        <section style={{ 
          maxWidth: '1300px', 
          margin: '0 auto', 
          padding: '100px 32px 80px',
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 text-left anim-fade-up">
              <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '16px' }}>
                Senior Product Design Studio
              </span>
              <h1 className="hero-heading text-gradient" style={{ marginBottom: '24px' }}>
                Simplifying Client Management, <br />
                <span className="text-gradient-jewel">One Workspace</span> at a Time.
              </h1>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px' }}>
                The Client Management System (CMS) is a premium workspace built for businesses that value relationship details, structured coordination, and beautiful design.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary">
                    Open Workspace <FiArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-primary">
                    Create Workspace <FiArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </Link>
                )}
                <a href="#features" className="btn btn-ghost">
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right Column: Asymmetric, overlapping floating stat cards (Broken Grid Moment) */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0" style={{ height: '320px' }}>
              
              {/* Card 1: Active Clients (Gold accent, rotated) */}
              <div className="stat-card absolute" style={{
                '--stat-accent': 'var(--amber)',
                '--stat-accent-bg': 'rgba(245, 158, 11, 0.12)',
                '--stat-shadow': 'rgba(245, 158, 11, 0.15)',
                top: '0px',
                left: '20px',
                transform: 'rotate(-3deg) translateY(0px)',
                zIndex: 3,
                width: '240px'
              }}>
                <div className="stat-card-icon">
                  <FiUsers size={18} />
                </div>
                <div className="stat-card-label">Active Clients</div>
                <div className="stat-card-number">1,482</div>
                <div className="stat-card-trend up" style={{ bottom: '20px', right: '20px' }}>+12%</div>
              </div>

              {/* Card 2: Deal Flow (Indigo accent, offset, rotated) */}
              <div className="stat-card absolute" style={{
                '--stat-accent': 'var(--indigo)',
                '--stat-accent-bg': 'rgba(79, 70, 229, 0.12)',
                '--stat-shadow': 'rgba(79, 70, 229, 0.15)',
                top: '50px',
                right: '10px',
                transform: 'rotate(2deg) translateY(0px)',
                zIndex: 2,
                width: '240px'
              }}>
                <div className="stat-card-icon">
                  <FiTrendingUp size={18} />
                </div>
                <div className="stat-card-label">Pipeline Value</div>
                <div className="stat-card-number">$45.8K</div>
                <div className="stat-card-trend up" style={{ bottom: '20px', right: '20px' }}>+8%</div>
              </div>

              {/* Card 3: Tasks Done (Rose accent, bottom, overlapping) */}
              <div className="stat-card absolute" style={{
                '--stat-accent': 'var(--rose)',
                '--stat-accent-bg': 'rgba(225, 29, 72, 0.12)',
                '--stat-shadow': 'rgba(225, 29, 72, 0.15)',
                bottom: '-30px',
                left: '80px',
                transform: 'rotate(-1deg) translateY(0px)',
                zIndex: 4,
                width: '240px'
              }}>
                <div className="stat-card-icon">
                  <FiCheckSquare size={18} />
                </div>
                <div className="stat-card-label">Tasks Done</div>
                <div className="stat-card-number">98%</div>
                <div className="stat-card-trend up" style={{ bottom: '20px', right: '20px' }}>Stable</div>
              </div>

            </div>

          </div>
        </section>

        {/* Why CMS Section - Alternating Spacing & Background */}
        <section id="why-cms" style={{ 
          background: 'var(--bg-deep)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '110px 0' 
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 32px' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <span className="eyebrow">Product Concept</span>
                <h2 className="section-heading" style={{ marginTop: '12px', marginBottom: '24px' }}>
                  A system tailored for operational clarity.
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
                  Scattered notes and loose documents stunt growth. Businesses need a cohesive repository where relationships are categorized, client logs are audit-tracked, and deal pipelines update in real time.
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  CMS combines modern technical practices with custom usability logic. Driven by React and backed by Express, the workspace supports instant interactions and clean layout dynamics.
                </p>
              </div>

              {/* Asymmetric tech stack display card */}
              <div className="lg:col-span-6 lg:pl-8">
                <div className="card" style={{ padding: '36px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
                    Engineered Foundation
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: "MongoDB Atlas", desc: "NoSQL schema scaling and cluster indexing" },
                      { label: "Express API", desc: "Structured route authentication controllers" },
                      { label: "React Client", desc: "State coordination with Zustand modules" },
                      { label: "Node.js Platform", desc: "High performance runtime and services" }
                    ].map((t, idx) => (
                      <div key={idx} className="card-inset" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--indigo)' }}>{t.label}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Key Features Section - Generous spacing (120px) */}
        <section id="features" style={{ padding: '120px 0' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 32px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <span className="eyebrow">Architecture</span>
              <h2 className="section-heading text-gradient" style={{ marginTop: '12px' }}>Feature Architecture</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '10px' }}>Unified workspaces designed to ease team collaboration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((f, i) => (
                <div key={i} className="card" style={{ 
                  padding: '32px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px',
                  '--stat-shadow': f.shadow
                }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    background: `${f.color}15`, 
                    color: f.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: `0 4px 10px ${f.color}20`
                  }}>
                    <f.icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Built for Efficiency Section */}
        <section id="efficiency" style={{ 
          background: 'var(--bg-deep)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '110px 0' 
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="eyebrow">Design Standard</span>
              <h2 className="section-heading" style={{ marginTop: '12px' }}>Built for Operational Speed</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {efficiencyPoints.map((p, idx) => (
                <div key={idx} className="card-inset" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <FiCheckCircle size={20} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                  <span style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-secondary)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Section - Centered premium block */}
        <section id="mission" style={{ padding: '120px 32px', maxWidth: '960px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', textAlign: 'center' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(79, 70, 229, 0.12)', 
              color: 'var(--indigo)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.15)' 
            }}>
              <FiTarget size={24} />
            </div>
            
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif" }}>Our Core Focus</h2>
            
            <p style={{ fontSize: '18px', color: '#ffffff', lineHeight: '1.8', fontWeight: 500 }}>
              "To deliver absolute clarity and structured organization to client-facing teams through deliberate design."
            </p>
            
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              By merging advanced workspace controls with a light-weight glassmorphic layout, CMS allows managers to focus on relationships rather than administrative complexity.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ 
          background: 'var(--bg-deep)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '110px 0' 
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
            
            <div className="card" style={{
              padding: '48px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '28px'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(225, 29, 72, 0.12)', color: 'var(--rose)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.15)'
              }}>
                <FiMail size={24} />
              </div>
              
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: "'Playfair Display', serif" }}>Get in Touch</h2>
                <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.6' }}>
                  Have questions, feature requests, or need custom integration help? Reach out directly via our contact form.
                </p>
              </div>

              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSeD5Rld3Mi67fIQYBu5IdaI4XdaLPLK2jvecvaKYDzBxfMHYw/viewform" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Open Form <FiExternalLink size={14} />
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--bg-base)', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        padding: '36px 32px' 
      }}>
        <div style={{ 
          maxWidth: '1300px', 
          margin: '0 auto', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '20px' 
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="rail-logo-mark" style={{ width: '28px', height: '28px' }}>
              <FiLayers size={12} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em', fontFamily: "'Playfair Display', serif" }}>CMS</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} CMS Inc. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '24px' }}>
            {user ? (
              <Link to="/dashboard" style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }} className="hover:text-white">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }} className="hover:text-white">Sign In</Link>
                <Link to="/register" style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }} className="hover:text-white">Register</Link>
              </>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
