import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLayers } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '../utils/authStore';
import { toast } from 'react-toastify';

const Field = ({ name, type='text', placeholder, icon: Icon, req, form, errors, onChange, show, setShow }) => (
  <div>
    <label className="label">
      {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
      {req ? ' *' : ''}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />}
      <input
        name={name} value={form[name] || ''} onChange={onChange}
        type={name === 'password' ? (show ? 'text' : 'password') : type}
        placeholder={placeholder}
        className={`input ${Icon ? 'input-icon-left' : ''} ${errors[name] ? 'error' : ''}`}
        style={{ paddingRight: name === 'password' ? '38px' : undefined }}
      />
      {name === 'password' && (
        <button type="button" onClick={() => setShow(!show)} style={{
          position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)',
          background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex',
        }}>
          {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      )}
    </div>
    {errors[name] && <p style={{ fontSize:'11.5px', color:'var(--red)', marginTop:'4px' }}>{errors[name]}</p>}
  </div>
);

export default function Register() {
  const navigate  = useNavigate();
  const register  = useAuthStore((s) => s.register);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendVerification = useAuthStore((s) => s.resendVerification);
  const googleLogin = useAuthStore((s) => s.googleLogin);

  const [form, setForm]     = useState({ username:'', email:'', password:'', firstName:'', lastName:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow]     = useState(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogle = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return; // Do not initialize if Client ID is not set

      if (window.google?.accounts?.id && !unverifiedEmail) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            setLoading(true);
            try {
              await googleLogin(response.credential);
              toast.success('Registered and logged in with Google!');
              navigate('/dashboard');
            } catch (err) {
              toast.error(err.response?.data?.message || 'Google registration failed');
            } finally {
              setLoading(false);
            }
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "344",
            text: "signup_with",
            shape: "rectangular"
          }
        );
      }
    };

    initGoogle();
    const timer = setTimeout(initGoogle, 1000);
    return () => clearTimeout(timer);
  }, [googleLogin, navigate, unverifiedEmail]);

  const ch = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Min 3 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    setOtpLoading(true);
    try {
      await verifyEmail({ email: unverifiedEmail, code: otpCode });
      toast.success('Email verified successfully! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerification({ email: unverifiedEmail });
      toast.success('Verification code resent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resend failed');
    }
  };

  if (unverifiedEmail) {
    return (
      <div className="auth-wrap">
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '420px', height: '420px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '11px',
              background: 'var(--accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
            }}>
              <FiMail size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
              Verify your email
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px', lineHeight: '1.4' }}>
              We've sent a 6-digit verification code to <br />
              <strong style={{ color: 'var(--text-1)' }}>{unverifiedEmail}</strong>
            </p>
          </div>

          <div className="auth-card">
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  style={{
                    letterSpacing: '0.4em',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                  className="input"
                />
              </div>

              <button
                type="submit" disabled={otpLoading}
                className="btn btn-primary"
                style={{ width: '100%', height: '40px', fontSize: '14px', fontWeight: 700 }}
              >
                {otpLoading ? <span className="spinner spinner-sm spinner-white" /> : 'Verify Account'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Didn't receive a code? </span>
                <button 
                  onClick={handleResendOtp}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Resend Code
                </button>
              </div>
              <div>
                <button 
                  onClick={() => setUnverifiedEmail('')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '12.5px', color: 'var(--text-3)', fontWeight: 500, cursor: 'pointer' }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', top:'-10%', right:'-5%',
          width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{
            width:'44px', height:'44px', borderRadius:'11px', background:'var(--accent)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            marginBottom:'14px', boxShadow:'0 4px 14px rgba(79,70,229,0.4)',
          }}>
            <FiLayers size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize:'22px', fontWeight:900, color:'var(--text-1)', letterSpacing:'-0.04em' }}>
            Create account
          </h1>
          <p style={{ fontSize:'13px', color:'var(--text-3)', marginTop:'4px' }}>
            Join your team's workspace
          </p>
        </div>

        <div className="auth-card">
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'13px' }}>
            <Field name="username"  placeholder="johndoe"         icon={FiUser} req form={form} errors={errors} onChange={ch} />
            <Field name="email"     type="email" placeholder="john@company.com" icon={FiMail} req form={form} errors={errors} onChange={ch} />
            <Field name="password"  placeholder="••••••••"         icon={FiLock} req form={form} errors={errors} onChange={ch} show={show} setShow={setShow} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <Field name="firstName" placeholder="John" form={form} errors={errors} onChange={ch} />
              <Field name="lastName"  placeholder="Doe" form={form} errors={errors} onChange={ch} />
            </div>

            <button
              type="submit" disabled={loading}
              className="btn btn-primary"
              style={{ width:'100%', height:'40px', fontSize:'14px', fontWeight:700, marginTop:'4px' }}
            >
              {loading
                ? <span className="spinner spinner-sm spinner-white" />
                : 'Create account'}
            </button>
          </form>

          {/* Divider & Google Sign-in Button */}
          {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 12px 0', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              </div>

              {/* Mock Google Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Google Sign-In is in development. Please set the VITE_GOOGLE_CLIENT_ID environment variable in Vercel settings to activate it.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    height: '40px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  <FcGoogle size={18} />
                  <span>Sign up with Google</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 12px 0', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              </div>

              {/* Google Sign-in Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div id="google-signup-btn"></div>
              </div>
            </>
          )}

          <div style={{ marginTop: '18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Already have an account? </span>
              <Link to="/login" style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
            <div>
              <Link to="/about" style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                About & Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
