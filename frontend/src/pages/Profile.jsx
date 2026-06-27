import { useState } from 'react';
import { FiUser, FiSave, FiMail, FiLock, FiShield } from 'react-icons/fi';
import Layout from '../components/Layout';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const ROLE_BADGE = { admin:'badge badge-red', editor:'badge badge-blue', author:'badge badge-green' };

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [form, setForm]   = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    bio:       user?.bio       || '',
  });
  const [loading, setLoading] = useState(false);

  const save = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await authService.updateProfile(form);
      if (setUser) setUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const ch = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.username;

  return (
    <Layout>
      <div className="page" style={{ maxWidth:'680px' }}>
        <div style={{ marginBottom:'22px' }}>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Manage your personal information</p>
        </div>

        {/* Avatar card */}
        <div className="card" style={{ padding:'22px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'18px', flexWrap:'wrap' }}>
          <div style={{
            width:'64px', height:'64px', borderRadius:'14px', flexShrink:0,
            background:'linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'26px', fontWeight:900, color:'#fff',
            boxShadow:'0 4px 16px rgba(50,121,249,0.3)',
          }}>
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:'17px', fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.02em' }}>
              {displayName}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'5px', flexWrap:'wrap' }}>
              <FiMail size={12} color="var(--text-3)" />
              <span style={{ fontSize:'12.5px', color:'var(--text-3)' }}>{user?.email}</span>
              <span style={{ color:'var(--border-2)' }}>·</span>
              <span className={ROLE_BADGE[user?.role] || 'badge badge-gray'}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card" style={{ padding:'22px', marginBottom:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'7px', background:'var(--accent-s)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FiUser size={13} color="var(--accent)" />
            </div>
            <span style={{ fontSize:'13.5px', fontWeight:700, color:'var(--text-1)' }}>Edit Profile</span>
          </div>

          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div className="form-grid">
              <div>
                <label className="label">First Name</label>
                <input value={form.firstName} onChange={e => ch('firstName', e.target.value)}
                  placeholder="John" className="input" />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input value={form.lastName} onChange={e => ch('lastName', e.target.value)}
                  placeholder="Doe" className="input" />
              </div>
            </div>

            <div>
              <label className="label">Username</label>
              <input value={user?.username || ''} disabled className="input"
                style={{ background:'var(--surface-2)', color:'var(--text-3)', cursor:'not-allowed' }} />
              <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'4px' }}>Username cannot be changed</p>
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea value={form.bio} onChange={e => ch('bio', e.target.value)}
                rows={3} placeholder="Tell us about yourself…" className="input" style={{ resize:'none' }} />
            </div>

            <div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? <span className="spinner spinner-sm spinner-white" /> : <><FiSave size={14} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>

        {/* Account info */}
        <div className="card" style={{ padding:'22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'7px', background:'var(--purple-s)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FiShield size={13} color="var(--purple)" />
            </div>
            <span style={{ fontSize:'13.5px', fontWeight:700, color:'var(--text-1)' }}>Account Info</span>
          </div>
          <div>
            {[
              { label:'Email',          value: user?.email,      icon: FiMail   },
              { label:'Username',       value:`@${user?.username}`, icon: FiUser },
              { label:'Role',           value: user?.role,       icon: FiShield },
              { label:'Account Status', value: 'Active',         icon: FiLock   },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 0',
                borderBottom:'1px solid var(--border)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <Icon size={13} color="var(--text-3)" />
                  <span style={{ fontSize:'13px', color:'var(--text-3)' }}>{label}</span>
                </div>
                <span style={{ fontSize:'13px', color:'var(--text-1)', fontWeight:500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

