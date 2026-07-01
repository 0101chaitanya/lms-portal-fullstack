import { useEffect, useState } from 'react';
import { 
  Container, Card, CardContent, Typography, Box, CircularProgress, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trainer'); 
  
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [trainerData, setTrainerData] = useState({ name: '', email: '', password: '' });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUserData, setEditUserData] = useState({ id: '', name: '', email: '' });

  const handleEditClick = (user) => {
    setEditUserData({ id: user._id, name: user.name, email: user.email });
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/admin/users/${editUserData.id}`, {
        name: editUserData.name,
        email: editUserData.email,
      });
      setOpenEditDialog(false);
      fetchAdminData(activeTab);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

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
    fetchAdminData(activeTab);
  }, [activeTab]);

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/status`);
      fetchAdminData(activeTab); 
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', m: 0 }}>
            Admin Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/trainer/dashboard')}
          >
            Manage Courses & Topics
          </Button>
        </Box>
      </Box>

      {}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 5,
        width: '100%' 
      }}>
        {[
          { label: 'Total Trainers', value: metrics?.totalTrainers, color: '#1976d2' },
          { label: 'Total Students', value: metrics?.totalStudents, color: '#2e7d32' },
          { label: 'Total Courses', value: metrics?.totalCourses, color: '#ed6c02' },
          { label: 'Total Topics', value: metrics?.totalTopics, color: '#9c27b0' },
        ].map((metric, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              width: '100%',
              maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
            }}
          >
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
          </Box>
        ))}
      </Box>

      {}
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

        {}
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
                        color="primary" 
                        onClick={() => handleEditClick(row)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color={row.status === 'active' ? 'warning' : 'success'} 
                        onClick={() => handleToggleStatus(row._id)}
                        sx={{ mr: 1 }}
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

      {}
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

      {}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit {activeTab === 'trainer' ? 'Trainer' : 'Student'} Info</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Full Name" 
            type="text" 
            fullWidth 
            value={editUserData.name} 
            onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} 
          />
          <TextField 
            margin="dense" 
            label="Email Address" 
            type="email" 
            fullWidth 
            value={editUserData.email} 
            onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
