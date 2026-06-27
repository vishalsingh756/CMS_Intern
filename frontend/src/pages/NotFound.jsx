import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
    }}>
      {/* Blobs */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(50,121,249,0.06) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-5%',  width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 70%)' }} />
      </div>

      <div style={{ textAlign:'center', position:'relative' }}>
        {/* 404 number */}
        <div style={{
          fontSize:'clamp(80px, 15vw, 140px)',
          fontWeight:900,
          letterSpacing:'-0.05em',
          lineHeight:1,
          background:'linear-gradient(135deg, var(--accent) 0%, #818cf8 60%, #a5b4fc 100%)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          marginBottom:'16px',
          fontFamily:'Inter, sans-serif',
        }}>
          404
        </div>

        <h1 style={{ fontSize:'22px', fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.03em', marginBottom:'10px' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize:'14px', color:'var(--text-3)', maxWidth:'340px', margin:'0 auto 28px', lineHeight:1.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', flexWrap:'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ gap:'7px' }}>
            <FiArrowLeft size={14} /> Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ gap:'7px' }}>
            <FiHome size={14} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

