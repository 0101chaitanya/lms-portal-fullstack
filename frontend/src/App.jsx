import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

// Lazy loaded page components
const CoursePlayer = lazy(() => import("./pages/CoursePlayer.jsx"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard.jsx"));
const TrainerDashboard = lazy(() => import("./pages/TrainerDashboard.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));

const App = () => {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/course/:id" element={<CoursePlayer />} />
          </Route>

          {/* Protected Trainer Routes (Admins can usually access trainer views too) */}
          <Route element={<ProtectedRoute allowedRoles={["trainer", "admin"]} />}>
            <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
