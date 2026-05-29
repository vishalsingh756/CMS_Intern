import { useNavigate } from 'react-router-dom';
import useAuthStore from '../utils/authStore';

const ProtectedRoute = ({ element, requiredRole }) => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  if (!token || !user) {
    navigate('/login');
    return null;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return element;
};

export default ProtectedRoute;
