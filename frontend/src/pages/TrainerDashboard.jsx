import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, Button, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  // Course Edit State
  const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
  const [editCourseData, setEditCourseData] = useState({ id: '', title: '', description: '', category: '', thumbnail: '' });

  // Topic Management State
  const [openTopicsDialog, setOpenTopicsDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicFormData, setTopicFormData] = useState({ id: '', title: '', description: '', videoUrl: '', order: 1 });
  const [topicEditMode, setTopicEditMode] = useState(false);

  // Course handlers
  const handleEditCourseClick = (course) => {
    setEditCourseData({
      id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnail: course.thumbnail || ''
    });
    setOpenEditCourseDialog(true);
  };

  const handleUpdateCourse = async () => {
    try {
      await api.put(`/courses/${editCourseData.id}`, {
        title: editCourseData.title,
        description: editCourseData.description,
        category: editCourseData.category,
        thumbnail: editCourseData.thumbnail
      });
      setOpenEditCourseDialog(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course and all its topics?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  // Topic handlers
  const fetchTopics = async (courseId) => {
    setTopicLoading(true);
    try {
      const response = await api.get(`/topics/${courseId}`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setTopicLoading(false);
    }
  };

  const handleManageTopicsClick = (course) => {
    setSelectedCourse(course);
    fetchTopics(course._id);
    setTopicFormData({ id: '', title: '', description: '', videoUrl: '', order: 1 });
    setTopicEditMode(false);
    setOpenTopicsDialog(true);
  };

  const handleTopicFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (topicEditMode) {
        await api.put(`/topics/${topicFormData.id}`, {
          title: topicFormData.title,
          description: topicFormData.description,
          videoUrl: topicFormData.videoUrl,
          order: Number(topicFormData.order)
        });
      } else {
        await api.post('/topics', {
          courseId: selectedCourse._id,
          title: topicFormData.title,
          description: topicFormData.description,
          videoUrl: topicFormData.videoUrl,
          order: Number(topicFormData.order)
        });
      }
      setTopicFormData({ id: '', title: '', description: '', videoUrl: '', order: 1 });
      setTopicEditMode(false);
      fetchTopics(selectedCourse._id);
      fetchData(); // Refresh topics metrics on dashboard
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save topic');
    }
  };

  const handleEditTopicClick = (topic) => {
    setTopicFormData({
      id: topic._id,
      title: topic.title,
      description: topic.description || '',
      videoUrl: topic.videoUrl || '',
      order: topic.order || 1
    });
    setTopicEditMode(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await api.delete(`/topics/${topicId}`);
        fetchTopics(selectedCourse._id);
        fetchData(); // Refresh topics metrics on dashboard
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete topic');
      }
    }
  };

  const fetchData = async () => {
    try {
      const [metricsRes, coursesRes] = await Promise.all([
        api.get('/trainer/metrics'),
        api.get(user?.role === 'admin' ? '/courses' : `/courses?trainerId=${user?._id}`)
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', m: 0 }}>
            {user?.role === 'admin' ? 'Course Management (Admin Mode)' : 'Trainer Dashboard'}
          </Typography>
          {user?.role === 'admin' && (
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => navigate('/admin/dashboard')}
            >
              Back to Admin Dashboard
            </Button>
          )}
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} sm={4}>
          <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Total Courses</Typography>
              <Typography variant="h3">{metrics?.totalCourses || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card elevation={3} sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Total Topics</Typography>
              <Typography variant="h3">{metrics?.totalTopics || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
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
        <Grid xs={12} md={5}>
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
        <Grid xs={12} md={7}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {user?.role === 'admin' ? 'All Published Courses' : 'My Published Courses'}
          </Typography>
          {myCourses.length === 0 ? (
            <Typography color="text.secondary">No courses created yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {myCourses.map((course) => (
                <Grid xs={12} sm={6} key={course._id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" noWrap>{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{course.category}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2
                      }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleManageTopicsClick(course)}
                        >
                          Manage Topics
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditCourseClick(course)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Edit Course Dialog */}
      <Dialog open={openEditCourseDialog} onClose={() => setOpenEditCourseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course Info</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Course Title" 
            type="text" 
            fullWidth 
            value={editCourseData.title} 
            onChange={(e) => setEditCourseData({...editCourseData, title: e.target.value})} 
          />
          <TextField 
            margin="dense" 
            label="Category" 
            type="text" 
            fullWidth 
            value={editCourseData.category} 
            onChange={(e) => setEditCourseData({...editCourseData, category: e.target.value})} 
          />
          <TextField 
            margin="dense" 
            label="Thumbnail Image URL" 
            type="text" 
            fullWidth 
            value={editCourseData.thumbnail} 
            onChange={(e) => setEditCourseData({...editCourseData, thumbnail: e.target.value})} 
          />
          <TextField 
            margin="dense" 
            label="Description" 
            type="text" 
            fullWidth 
            multiline 
            rows={4}
            value={editCourseData.description} 
            onChange={(e) => setEditCourseData({...editCourseData, description: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditCourseDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateCourse} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Topics Dialog */}
      <Dialog open={openTopicsDialog} onClose={() => setOpenTopicsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Topics for {selectedCourse?.title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Topic Form */}
            <Grid xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {topicEditMode ? 'Edit Topic' : 'Add New Topic'}
                </Typography>
                <Box component="form" onSubmit={handleTopicFormSubmit}>
                  <TextField 
                    margin="dense" label="Topic Title" type="text" fullWidth required
                    value={topicFormData.title} onChange={(e) => setTopicFormData({...topicFormData, title: e.target.value})}
                  />
                  <TextField 
                    margin="dense" label="Description" type="text" fullWidth multiline rows={2}
                    value={topicFormData.description} onChange={(e) => setTopicFormData({...topicFormData, description: e.target.value})}
                  />
                  <TextField 
                    margin="dense" label="Video URL (YouTube)" type="text" fullWidth required
                    value={topicFormData.videoUrl} onChange={(e) => setTopicFormData({...topicFormData, videoUrl: e.target.value})}
                  />
                  <TextField 
                    margin="dense" label="Order" type="number" fullWidth required
                    value={topicFormData.order} onChange={(e) => setTopicFormData({...topicFormData, order: Number(e.target.value)})}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      {topicEditMode ? 'Update Topic' : 'Add Topic'}
                    </Button>
                    {topicEditMode && (
                      <Button onClick={() => {
                        setTopicEditMode(false);
                        setTopicFormData({ id: '', title: '', description: '', videoUrl: '', order: 1 });
                      }} variant="outlined" color="secondary">
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Topics List */}
            <Grid xs={12} md={7}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Course Topics List
              </Typography>
              {topicLoading ? (
                <CircularProgress size={24} />
              ) : topics.length === 0 ? (
                <Typography color="text.secondary">No topics added yet.</Typography>
              ) : (
                <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {topics.map((topic, index) => (
                    <Paper key={topic._id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {topic.order}. {topic.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {topic.videoUrl}
                          </Typography>
                        </Box>
                        <Box>
                          <Button size="small" onClick={() => handleEditTopicClick(topic)} sx={{ mr: 0.5 }}>
                            Edit
                          </Button>
                          <Button size="small" color="error" onClick={() => handleDeleteTopic(topic._id)}>
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTopicsDialog(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainerDashboard;
