import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import MetaTags from '../seo/MetaTags';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <MetaTags 
        title="Page Not Found - MealMover" 
        description="Sorry, the page you are looking for cannot be found."
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 4,
            maxWidth: 600,
            width: '100%',
          }}
        >
          <SentimentDissatisfiedIcon 
            sx={{ 
              fontSize: 100, 
              color: 'text.secondary',
              mb: 2
            }} 
          />
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/"
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;