import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change / resize
  useEffect(() => {
    const close = () => setDrawerOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className="app-shell">

      {/* ── Ambient aurora glows ── */}
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />

      {/* ── Desktop sidebar rail (hidden on mobile via CSS) ── */}
      <Sidebar variant="rail" />

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <Sidebar
        variant="drawer"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* ── Main content column ── */}
      <div className="app-content">
        <Header onMenuClick={() => setDrawerOpen(v => !v)} />
        <main className="app-main">
          {children}
        </main>
      </div>

    </div>
  );
}
