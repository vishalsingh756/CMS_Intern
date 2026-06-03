import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './utils/authStore';
import ProtectedRoute from './utils/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Interactions from './pages/Interactions';
import UserManagement from './pages/UserManagement';
import ActivityLogs from './pages/ActivityLogs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import Leads from './pages/Leads';

function App() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/clients" element={<ProtectedRoute element={<Clients />} />} />
        <Route path="/clients/:id" element={<ProtectedRoute element={<ClientDetail />} />} />
        <Route path="/deals" element={<ProtectedRoute element={<Deals />} />} />
        <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />
        <Route path="/interactions" element={<ProtectedRoute element={<Interactions />} />} />
        <Route path="/users" element={<ProtectedRoute element={<UserManagement />} requiredRole="admin" />} />
        <Route path="/activity-logs" element={<ProtectedRoute element={<ActivityLogs />} requiredRole="admin" />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
        <Route path="/leads" element={<ProtectedRoute element={<Leads />} />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
