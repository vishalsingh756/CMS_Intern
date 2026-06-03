import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)' }}>

      {/* Desktop sidebar — always visible, sticky */}
      <div style={{ width:'228px', flexShrink:0, display:'flex' }} id="desktop-sidebar">
        <Sidebar alwaysVisible onClose={() => {}} />
      </div>

      {/* Mobile sidebar — slides in over content */}
      {open && (
        <div style={{ display:'block' }} id="mobile-sidebar">
          <Sidebar isOpen={open} onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Content area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <Header onMenuClick={() => setOpen(v => !v)} />
        <main style={{ flex:1, overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
