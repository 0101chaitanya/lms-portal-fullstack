import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-courses'); // 'my-courses' or 'catalog'
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [enrolledRes, allCoursesRes] = await Promise.all([
        api.get('/student/enrolled-courses'),
        api.get('/courses')
      ]);
      setEnrolledCourses(enrolledRes.data);

      const enrolledIds = new Set(enrolledRes.data.map(c => c._id));
      const catalog = allCoursesRes.data.filter(c => !enrolledIds.has(c._id));
      setAvailableCourses(catalog);
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      setLoading(true);
      await api.post('/student/enroll', { courseId });
      alert('Successfully enrolled in course!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
      setLoading(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', m: 0 }}>
          Student Dashboard
        </Typography>
      </Box>

      {/* Tabs Layout */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button 
          variant={activeTab === 'my-courses' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('my-courses')}
        >
          My Courses
        </Button>
        <Button 
          variant={activeTab === 'catalog' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('catalog')}
        >
          Browse Catalog
        </Button>
      </Box>

      {activeTab === 'my-courses' ? (
        enrolledCourses.length === 0 ? (
          <Typography variant="subtitle1" color="text.secondary">
            You are not enrolled in any courses yet. Browse the catalog to get started!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {enrolledCourses.map((course) => (
              <Grid key={course._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.thumbnail || 'https://via.placeholder.com/300x180?text=Course+Thumbnail'}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description ? course.description.substring(0, 80) : ''}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {course.trainerId?.name || 'Unknown Instructor'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      onClick={() => navigate(`/student/course/${course._id}`)}
                    >
                      Start Learning
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        availableCourses.length === 0 ? (
          <Typography variant="subtitle1" color="text.secondary">
            No new courses available. You have enrolled in all published courses!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {availableCourses.map((course) => (
              <Grid key={course._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.thumbnail || 'https://via.placeholder.com/300x180?text=Course+Thumbnail'}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description ? course.description.substring(0, 80) : ''}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {course.trainerId?.name || 'Unknown Instructor'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Container>
  );
};

export default StudentDashboard;
