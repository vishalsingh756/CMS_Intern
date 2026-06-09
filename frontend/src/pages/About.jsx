import { Link } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiCheckSquare, FiBarChart2, FiLayers, FiMail, FiInfo, FiExternalLink } from 'react-icons/fi';

export default function About() {
  // Google Form URL (embedded=true renders the form layout natively)
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeD5Rld3Mi67fIQYBu5IdaI4XdaLPLK2jvecvaKYDzBxfMHYw/viewform?embedded=true";

  const features = [
    {
      icon: FiUsers,
      title: "Client Relationship Management",
      desc: "Maintain detailed logs of clients, interactions, and follow-ups. Keep all contact history in a centralized workspace.",
      color: "var(--accent)"
    },
    {
      icon: FiDollarSign,
      title: "Deals & Sales Pipeline",
      desc: "Track active opportunities, stages, revenue estimations, and close dates. Maximize your team's sales conversion rates.",
      color: "var(--green)"
    },
    {
      icon: FiCheckSquare,
      title: "Task & Interaction Logs",
      desc: "Schedule tasks, log calls, and set reminders. Ensure your team never misses an important client touchpoint.",
      color: "var(--purple)"
    },
    {
      icon: FiBarChart2,
      title: "Performance Reports",
      desc: "Gain deep insights into deals won, monthly activity trends, and team productivity using real-time analytics dashboards.",
      color: "var(--orange)"
    }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Decorative top gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navigation Header */}
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
              <FiLayers size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>CMS</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#features" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Features</a>
            <a href="#about" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>About Us</a>
            <a href="#contact" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Contact</a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 16px', borderRadius: '980px', fontSize: '13px' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '980px', fontSize: '13px' }}>
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, zIndex: 1 }}>

        {/* Hero Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
          <div className="anim-fade-up">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-s)', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '980px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              <FiInfo size={12} /> Modern Workspace CRM
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.05em', lineHeight: '1.1', maxWidth: '800px', margin: '0 auto 18px' }}>
              Supercharge Your Customer Relationships & Workspace Tasks
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>
              A clean, modern, and unified platform built to manage clients, track opportunities, log tasks, and organize deals efficiently.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14.5px', borderRadius: '980px' }}>
                Create Free Account
              </Link>
              <a href="#features" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: '14.5px', borderRadius: '980px' }}>
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>Powerful Features</h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-2)', marginTop: '8px' }}>Everything your team needs to stay productive and close more sales.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {features.map((f, i) => (
                <div key={i} className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)' }}>{f.title}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* About the Website Section */}
        <section id="about" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Our Mission</span>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', marginTop: '8px', marginBottom: '16px' }}>
                Simplifying Workspace Collaboration & Client Tracking
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: '1.7', marginBottom: '16px' }}>
                We believe that managing clients and sales shouldn't require bloated, confusing software. That's why we created CMS—an elegant, lightweight CRM workspace that prioritizes visual clarity, user performance, and ease of access.
              </p>
              <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: '1.7' }}>
                Designed with a premium SaaS interface, our dashboard makes it simple to monitor monthly pipelines, schedule tasks, view team activity logs, and generate ad-hoc reports in seconds.
              </p>
            </div>
            
            {/* Visual Glassmorphic Block */}
            <div className="glass" style={{ padding: '36px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>Fast. Responsive. Secure.</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-2)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Clean UI/UX:</strong> Fast response times with sleek Apple-inspired metrics.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-2)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Role-Based Access:</strong> Restrict actions and views depending on user roles (Admin, Editor, Author).</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-2)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Activity Audits:</strong> Complete transparency with logged events for all actions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            <div className="glass" style={{
              padding: '40px 32px',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--accent-s)', color: 'var(--accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79,70,229,0.1)'
              }}>
                <FiMail size={24} />
              </div>
              
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>Get in Touch</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginTop: '8px', lineHeight: '1.6' }}>
                  Have questions, feature requests, or need support? Click below to open our official contact form and reach our team.
                </p>
              </div>

              <a 
                href={GOOGLE_FORM_URL.replace('?embedded=true', '')} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  borderRadius: '980px',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                  textDecoration: 'none'
                }}
              >
                Open Contact Form <FiExternalLink size={14} />
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiLayers size={14} color="#fff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>CMS</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
            &copy; {new Date().getFullYear()} CMS Inc. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/login" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Sign In</Link>
            <Link to="/register" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Register</Link>
          </div>

        </div>
      </footer>

    </div>
  );
}
