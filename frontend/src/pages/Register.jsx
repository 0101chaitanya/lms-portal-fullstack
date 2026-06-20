import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      await api.post('/auth/register', formData);
      setOtpSent(true);
      setMsg({ type: 'success', text: 'OTP sent to your email. Please verify.' });
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      await api.post('/auth/verify-email', { email: formData.email, otp });
      setMsg({ type: 'success', text: 'Email verified successfully! You can now log in.' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {otpSent ? 'Verify Email' : 'Student Registration'}
        </Typography>

        {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

        {!otpSent ? (
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              margin="normal" required fullWidth label="Full Name" name="name"
              value={formData.name} onChange={handleChange}
            />
            <TextField
              margin="normal" required fullWidth label="Email Address" name="email" type="email"
              value={formData.email} onChange={handleChange}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Password" type="password"
              value={formData.password} onChange={handleChange}
            />
            <Button
              type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOtp}>
            <TextField
              margin="normal" required fullWidth label="Enter 6-digit OTP" name="otp"
              value={otp} onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
        )}
        
        {!otpSent && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account? <RouterLink to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>Login here</RouterLink>
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
