import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Unauthorized = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginClick = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h3" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography color="text.secondary" paragraph>
          You do not have permission to view this page. Please log in with an account that has the correct privileges.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleLoginClick}>
            Go to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;
