import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLayers } from 'react-icons/fi';
import useAuthStore from '../utils/authStore';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate  = useNavigate();
  const register  = useAuthStore((s) => s.register);
  const [form, setForm]     = useState({ username:'', email:'', password:'', firstName:'', lastName:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow]     = useState(false);

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
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, type='text', placeholder, icon: Icon, req }) => (
    <div>
      <label className="label">
        {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
        {req ? ' *' : ''}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />}
        <input
          name={name} value={form[name]} onChange={ch}
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

  return (
    <div className="auth-wrap">
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', top:'-10%', right:'-5%',
          width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'410px' }}>
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
            <Field name="username"  placeholder="johndoe"         icon={FiUser} req />
            <Field name="email"     type="email" placeholder="john@company.com" icon={FiMail} req />
            <Field name="password"  placeholder="••••••••"         icon={FiLock} req />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <Field name="firstName" placeholder="John" />
              <Field name="lastName"  placeholder="Doe" />
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

          <div style={{ marginTop:'18px', textAlign:'center' }}>
            <span style={{ fontSize:'12.5px', color:'var(--text-3)' }}>Already have an account? </span>
            <Link to="/login" style={{ fontSize:'12.5px', color:'var(--accent)', fontWeight:600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
