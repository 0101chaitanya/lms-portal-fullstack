import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but doesn't have the right role, redirect to unauthorized or home
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
