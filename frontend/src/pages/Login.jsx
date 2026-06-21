import { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      // Message is handled below via alert
    }

    if (isSuccess || user) {
      // Redirect based on role
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/student/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 4, 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%' 
      }}>
        {/* Left Side: Illustration / Image (Hidden on small screens) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          flex: '1 1 0px',
          width: '100%',
          maxWidth: { md: '50%' }
        }}>
          <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Box
              component="img"
              src="/lms_landing_hero.png"
              alt="LMS Hero Illustration"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '550px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Visual gradient overlay on image */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.4) 60%, transparent 100%)',
              p: 4,
              pt: 10
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
                Empower Your Learning Journey
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                Join masterclasses led by industry experts, track your milestones, and build hands-on skills in coding and development.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side: Login Form Card */}
        <Box sx={{ 
          flex: '1 1 0px',
          width: '100%',
          maxWidth: { xs: '100%', md: '41.67%' } // Equivalent to md={5}
        }}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(17, 24, 39, 0.7)', WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: '800', textAlign: 'center', mb: 1, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Enter your credentials to access your dashboard
            </Typography>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account? <RouterLink to="/register" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 'bold' }}>Register here</RouterLink>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
