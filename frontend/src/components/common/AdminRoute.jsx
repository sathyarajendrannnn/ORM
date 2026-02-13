import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const AdminRoute = ({ children }) => {
  return authService.isAuthenticated() && authService.isAdmin() 
    ? children 
    : <Navigate to="/dashboard" />;
};

export default AdminRoute;