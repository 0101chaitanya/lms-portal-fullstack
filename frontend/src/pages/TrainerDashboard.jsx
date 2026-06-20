import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, Button, Paper, Alert } from '@mui/material';
import api from '../api/axios';
import { useSelector } from 'react-redux';

const TrainerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [metricsRes, coursesRes] = await Promise.all([
        api.get('/trainer/metrics'),
        api.get(`/courses?trainerId=${user._id}`)
      ]);
      setMetrics(metricsRes.data);
      setMyCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching trainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      await api.post('/courses', formData);
      setFormMsg({ type: 'success', text: 'Course created successfully!' });
      setFormData({ title: '', description: '', category: '', thumbnail: '' });
      fetchData(); // Refresh data
    } catch (error) {
      setFormMsg({ type: 'error', text: error.response?.data?.message || 'Failed to create course' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Trainer Dashboard
      </Typography>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Total Courses</Typography>
              <Typography variant="h3">{metrics?.totalCourses || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Total Topics</Typography>
              <Typography variant="h3">{metrics?.totalTopics || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Total Enrollments</Typography>
              <Typography variant="h3">{metrics?.totalStudentsEnrolled || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Create Course Form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Create New Course
            </Typography>
            
            {formMsg.text && (
              <Alert severity={formMsg.type} sx={{ mb: 2 }}>{formMsg.text}</Alert>
            )}

            <Box component="form" onSubmit={handleCreateCourse}>
              <TextField
                fullWidth label="Course Title" name="title"
                value={formData.title} onChange={handleChange}
                margin="normal" required
              />
              <TextField
                fullWidth label="Category" name="category"
                value={formData.category} onChange={handleChange}
                margin="normal" required
              />
              <TextField
                fullWidth label="Thumbnail Image URL" name="thumbnail"
                value={formData.thumbnail} onChange={handleChange}
                margin="normal" required
              />
              <TextField
                fullWidth label="Description" name="description"
                value={formData.description} onChange={handleChange}
                margin="normal" required multiline rows={4}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
                Publish Course
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* List of Created Courses */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            My Published Courses
          </Typography>
          {myCourses.length === 0 ? (
            <Typography color="text.secondary">No courses created yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {myCourses.map((course) => (
                <Grid item xs={12} sm={6} key={course._id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" noWrap>{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{course.category}</Typography>
                      {/* You can add a button here to navigate to a "Manage Topics" page later */}
                      <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                        Manage Topics
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrainerDashboard;
