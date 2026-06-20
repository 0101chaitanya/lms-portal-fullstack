import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Components (You'll build these in Phase 6)
const Login = () => <h2>Login Page</h2>;
const Register = () => <h2>Register Page</h2>;
const StudentDashboard = () => <h2>Student Dashboard</h2>;
const TrainerDashboard = () => <h2>Trainer Dashboard</h2>;
const AdminDashboard = () => <h2>Admin Dashboard</h2>;
const Unauthorized = () => <h2>Unauthorized Access</h2>;

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Protected Trainer Routes (Admins can usually access trainer views too) */}
        <Route element={<ProtectedRoute allowedRoles={['trainer', 'admin']} />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
