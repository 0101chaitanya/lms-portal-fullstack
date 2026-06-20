import { useEffect, useState } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import api from '../api/axios';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trainer'); // 'trainer' or 'student'
  
  // Add Trainer Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [trainerData, setTrainerData] = useState({ name: '', email: '', password: '' });

  const fetchAdminData = async (role = 'trainer') => {
    setLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get(`/admin/users?role=${role}`)
      ]);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData(activeTab);
  }, [activeTab]);

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/status`);
      fetchAdminData(activeTab); // Refresh the list
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAdminData(activeTab);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleAddTrainer = async () => {
    try {
      await api.post('/admin/trainers', trainerData);
      setOpenDialog(false);
      setTrainerData({ name: '', email: '', password: '' });
      fetchAdminData('trainer');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add trainer');
    }
  };

  if (loading && !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {/* Platform Metrics */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Trainers', value: metrics?.totalTrainers, color: '#1976d2' },
          { label: 'Total Students', value: metrics?.totalStudents, color: '#2e7d32' },
          { label: 'Total Courses', value: metrics?.totalCourses, color: '#ed6c02' },
          { label: 'Total Topics', value: metrics?.totalTopics, color: '#9c27b0' },
        ].map((metric, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={3} sx={{ borderTop: `5px solid ${metric.color}` }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h4" component="div">
                  {metric.value || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Management Section */}
      <Paper elevation={3} sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Button 
              variant={activeTab === 'trainer' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('trainer')}
              sx={{ mr: 2 }}
            >
              Trainers
            </Button>
            <Button 
              variant={activeTab === 'student' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('student')}
            >
              Students
            </Button>
          </Box>
          
          {activeTab === 'trainer' && (
            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
              + Add New Trainer
            </Button>
          )}
        </Box>

        {/* Users Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No {activeTab}s found.</TableCell></TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography color={row.status === 'active' ? 'success.main' : 'error.main'}>
                        {row.status.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        color={row.status === 'active' ? 'warning' : 'success'} 
                        onClick={() => handleToggleStatus(row._id)}
                      >
                        {row.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteUser(row._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Trainer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Trainer</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth value={trainerData.name} onChange={(e) => setTrainerData({...trainerData, name: e.target.value})} />
          <TextField margin="dense" label="Email Address" type="email" fullWidth value={trainerData.email} onChange={(e) => setTrainerData({...trainerData, email: e.target.value})} />
          <TextField margin="dense" label="Temporary Password" type="password" fullWidth value={trainerData.password} onChange={(e) => setTrainerData({...trainerData, password: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTrainer} variant="contained" color="primary">Add Trainer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
