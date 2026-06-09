import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLayers } from 'react-icons/fi';
import useAuthStore from '../utils/authStore';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow]   = useState(false);

  const ch = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Decorative shapes */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '390px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '11px',
            background: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          }}>
            <FiLayers size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
            CMS
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>
            Sign in to your workspace
          </p>
        </div>

        <div className="auth-card">
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  name="email" type="email" value={form.email} onChange={ch}
                  placeholder="you@company.com"
                  className={`input input-icon-left ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && <p style={{ fontSize: '11.5px', color: 'var(--red)', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  name="password" type={show ? 'text' : 'password'} value={form.password} onChange={ch}
                  placeholder="••••••••"
                  className={`input input-icon-left ${errors.password ? 'error' : ''}`}
                  style={{ paddingRight: '38px' }}
                />
                <button type="button" onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                  display: 'flex', padding: '3px',
                }}>
                  {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '11.5px', color: 'var(--red)', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '40px', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}
            >
              {loading
                ? <span className="spinner spinner-sm spinner-white" />
                : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>No account? </span>
              <Link to="/register" style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600 }}>
                Create one
              </Link>
            </div>
            <div>
              <Link to="/about" style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                About & Contact
              </Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '11.5px', color: 'var(--text-3)' }}>
          Demo: register any account or create an admin
        </p>
      </div>
    </div>
  );
}
