import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Box, Divider } from '@mui/material';
import api from '../api/axios';

const CoursePlayer = () => {
  const { id: courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get(`/topics/${courseId}`);
        setTopics(response.data);
        if (response.data.length > 0) {
          setCurrentTopic(response.data[0]); // Default to first video
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, [courseId]);

  // Helper to extract YouTube embed ID
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        
        {/* Left Side: Video Player & Description */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ overflow: 'hidden', mb: 2 }}>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              {currentTopic && currentTopic.videoUrl ? (
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={getEmbedUrl(currentTopic.videoUrl)}
                  title={currentTopic.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%', bgcolor: '#000' }}>
                  <Typography color="white">No Video Available</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {currentTopic && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {currentTopic.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentTopic.description}
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right Side: Topics List (Course Content) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: 'calc(100vh - 120px)', overflow: 'auto' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Course Content</Typography>
            </Box>
            <Divider />
            <List disablePadding>
              {topics.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No topics added yet." />
                </ListItem>
              ) : (
                topics.map((topic, index) => (
                  <ListItem disablePadding key={topic._id} divider>
                    <ListItemButton 
                      selected={currentTopic?._id === topic._id}
                      onClick={() => setCurrentTopic(topic)}
                      sx={{ 
                        '&.Mui-selected': { bgcolor: 'rgba(170, 59, 255, 0.1)' },
                        '&.Mui-selected:hover': { bgcolor: 'rgba(170, 59, 255, 0.2)' }
                      }}
                    >
                      <ListItemText 
                        primary={`${index + 1}. ${topic.title}`} 
                        primaryTypographyProps={{ sx: { fontWeight: currentTopic?._id === topic._id ? 'bold' : 'normal' } }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default CoursePlayer;
