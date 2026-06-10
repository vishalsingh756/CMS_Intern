import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)', position: 'relative' }}>
      
      {/* Premium Aurora Glow Elements (Ambient light blur effect) */}
      <div className="aurora-blob aurora-1"></div>
      <div className="aurora-blob aurora-2"></div>

      {/* Desktop sidebar — always visible, sticky */}
      <Sidebar alwaysVisible onClose={() => {}} />

      {/* Mobile sidebar — slides in over content */}
      {open && (
        <div style={{ display:'block', zIndex: 150 }} id="mobile-sidebar">
          <Sidebar isOpen={open} onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Content area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, position: 'relative', zIndex: 5 }}>
        <Header onMenuClick={() => setOpen(v => !v)} />
        <main style={{ flex:1, overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
