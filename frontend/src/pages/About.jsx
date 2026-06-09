import { Link } from 'react-router-dom';
import { 
  FiUsers, FiCheckSquare, FiBarChart2, FiLayers, FiInfo, 
  FiCheckCircle, FiShield, FiTarget, FiActivity, FiUsers as FiCollaboration 
} from 'react-icons/fi';
import useAuthStore from '../utils/authStore';

export default function About() {
  const { user } = useAuthStore();

  const keyFeatures = [
    {
      icon: FiUsers,
      title: "Client Management",
      desc: "Maintain detailed client profiles, contact information, project records, and communication history in a centralized system.",
      color: "var(--accent)"
    },
    {
      icon: FiActivity,
      title: "Task & Activity Tracking",
      desc: "Create tasks, assign responsibilities, schedule follow-ups, and monitor progress to ensure nothing falls through the cracks.",
      color: "var(--green)"
    },
    {
      icon: FiCollaboration,
      title: "Team Collaboration",
      desc: "Enable teams to work together efficiently through shared client records, activity logs, and role-based permissions.",
      color: "var(--purple)"
    },
    {
      icon: FiBarChart2,
      title: "Reports & Insights",
      desc: "Access valuable data on client activity, completed tasks, and overall system performance through easy-to-understand dashboards.",
      color: "var(--orange)"
    },
    {
      icon: FiShield,
      title: "Secure Role-Based Access",
      desc: "Control access based on user roles such as Administrator, Manager, Editor, or Team Member to ensure data security and operational control.",
      color: "var(--accent)"
    }
  ];

  const efficiencyPoints = [
    "Modern and responsive user interface",
    "Secure authentication and authorization",
    "Real-time activity tracking and audit logs",
    "Scalable MERN Stack architecture",
    "Mobile-friendly and user-focused design",
    "Fast, secure, and easy to use"
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Decorative top gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '450px', background: 'radial-gradient(circle at 50% 0%, rgba(79,70,229,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navigation Header */}
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
              <FiLayers size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>CMS</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#why-cms" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Why CMS</a>
            <a href="#features" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Features</a>
            <a href="#efficiency" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Efficiency</a>
            <a href="#mission" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-2)' }}>Our Mission</a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: '13px' }}>
                Back to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: '13px' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: '13px' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, zIndex: 1 }}>

        {/* Hero Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
          <div className="anim-fade-up">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-s)', color: 'var(--accent)', fontSize: '12.5px', fontWeight: 700, padding: '5px 14px', borderRadius: '980px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px' }}>
              <FiInfo size={12} /> Client Management System
            </span>
            <h1 style={{ fontSize: '46px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.05em', lineHeight: '1.15', maxWidth: '850px', margin: '0 auto 18px', fontFamily: "'Outfit', sans-serif" }}>
              Simplifying Client Management,<br />One Workspace at a Time
            </h1>
            <p style={{ fontSize: '16.5px', color: 'var(--text-2)', maxWidth: '750px', margin: '0 auto 32px', lineHeight: '1.75' }}>
              The Client Management System (CMS) is a modern web application built to help businesses organize client information, manage daily operations, track activities, and improve team productivity from a single, centralized platform.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', maxWidth: '750px', margin: '0 auto 36px', lineHeight: '1.7' }}>
              Designed with simplicity and efficiency in mind, CMS eliminates the need for scattered spreadsheets and disconnected tools by bringing client management, task tracking, and reporting together in one secure workspace.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              {user ? (
                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14.5px' }}>
                  Open Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14.5px' }}>
                  Create Free Account
                </Link>
              )}
              <a href="#features" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: '14.5px' }}>
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* Why CMS Section */}
        <section id="why-cms" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Overview</span>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', marginTop: '8px', marginBottom: '20px', fontFamily: "'Outfit', sans-serif" }}>
                  Why CMS?
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '16px' }}>
                  Managing clients effectively requires more than just storing contact information. Teams need a reliable system to track interactions, monitor progress, assign responsibilities, and maintain transparency across projects.
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.75' }}>
                  CMS was created to provide a clean, intuitive, and scalable solution that helps businesses stay organized while delivering a seamless user experience. Built using the MERN Stack (MongoDB, Express.js, React, and Node.js), the platform combines modern technology with practical business functionality.
                </p>
              </div>
              
              {/* Visual Card Representation of tech stack */}
              <div className="card" style={{ padding: '36px', background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Tech Stack Foundations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: "MongoDB", desc: "Secure & scalable document data store" },
                    { label: "Express.js", desc: "High-performance Node.js API router" },
                    { label: "React", desc: "Interactive & fully responsive user interface" },
                    { label: "Node.js", desc: "Robust server runtime engine" }
                  ].map((t, idx) => (
                    <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-2)', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--accent)' }}>{t.label}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Capabilities</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', marginTop: '6px', fontFamily: "'Outfit', sans-serif" }}>Key Features</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', marginTop: '8px' }}>Everything your team needs to stay productive, secure, and coordinated.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {keyFeatures.map((f, i) => (
                <div key={i} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Outfit', sans-serif" }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.7' }}>{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Built for Efficiency Section */}
        <section id="efficiency" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Performance</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', marginTop: '6px', fontFamily: "'Outfit', sans-serif" }}>Built for Efficiency</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {efficiencyPoints.map((p, idx) => (
                <div key={idx} className="card-inset" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid var(--border)' }}>
                  <FiCheckCircle size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-2)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section id="mission" style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="card glass" style={{ padding: '56px 40px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-s)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.15)' }}>
              <FiTarget size={26} />
            </div>
            
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', fontFamily: "'Outfit', sans-serif" }}>Our Mission</h2>
            
            <p style={{ fontSize: '16.5px', color: 'var(--text-1)', lineHeight: '1.8', fontWeight: 500 }}>
              "Our mission is to make client management simple, organized, and accessible for businesses of all sizes."
            </p>
            
            <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: '1.75', textAlign: 'justify' }}>
              By combining powerful management tools with a clean and user-friendly experience, CMS helps teams focus less on administrative complexity and more on building stronger client relationships and achieving better results.
            </p>
            
            <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: '1.75', textAlign: 'justify' }}>
              Whether you're managing a growing client base, coordinating team activities, or monitoring business operations, CMS provides the tools needed to stay productive, organized, and connected.
            </p>
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
            {user ? (
              <Link to="/dashboard" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Sign In</Link>
                <Link to="/register" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Register</Link>
              </>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
