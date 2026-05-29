import { useState } from 'react';
import { FiUser, FiSave, FiLock } from 'react-icons/fi';
import Layout from '../components/Layout';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(profileForm);
      if (setUser) setUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

        <div className="space-y-6">
          {/* Avatar + Name */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}
              </p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`inline-flex mt-2 items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                user?.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                user?.role === 'editor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                'bg-green-500/10 text-green-400 border-green-500/30'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <FiUser size={16} className="text-cyan-400" /> Edit Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                    placeholder="John"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-600 mt-1">Username cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                <FiSave size={15} />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <FiLock size={16} className="text-purple-400" /> Account Info
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Email', value: user?.email },
                { label: 'Username', value: `@${user?.username}` },
                { label: 'Role', value: user?.role },
                { label: 'Account Status', value: 'Active' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-800/60 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-gray-300 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
