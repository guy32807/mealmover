import React from 'react';
import { 
  Container, Typography, Box, Grid, Paper, 
  Card, CardContent, CardMedia, Divider, Button
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import { Link as RouterLink } from 'react-router-dom';
import MetaTags from '../seo/MetaTags';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <MetaTags 
        title="About MealMover - Your Food Delivery Solution" 
        description="Learn about MealMover, our mission to connect you with the best local restaurants, and how we're making food delivery better."
      />
      
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About MealMover
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Connecting hungry people with the best local restaurants since 2020.
        </Typography>
      </Box>
      
      {/* Our Story Section */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box 
            component="img" 
            src="https://source.unsplash.com/random/800x600/?restaurant,food"
            alt="MealMover Story"
            sx={{ 
              width: '100%', 
              borderRadius: 2,
              boxShadow: 3,
              height: { xs: 300, md: 400 },
              objectFit: 'cover'
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            MealMover started with a simple mission: to make ordering from your favorite local restaurants easy, fast, and enjoyable.
          </Typography>
          <Typography variant="body1" paragraph>
            Founded in 2020 by a team of food enthusiasts and tech innovators, we saw an opportunity to transform the way people discover and enjoy local cuisine. What began as a small startup in San Francisco has grown into a service connecting thousands of restaurants with hungry customers across the country.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe that good food is at the heart of every community, and we're committed to supporting local restaurants while providing an exceptional experience for our customers.
          </Typography>
        </Grid>
      </Grid>
      
      {/* Our Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Values
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quality First
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We partner with restaurants that share our commitment to quality food and service.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Reliable Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We ensure your food arrives hot, fresh, and on time, every time.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <PublicIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Community Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We actively support local businesses and give back to the communities we serve.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Customer Focus
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We put our customers first and continuously improve based on your feedback.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Our Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Meet Our Leadership Team
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              name: 'Sarah Johnson',
              role: 'CEO & Co-Founder',
              image: 'https://source.unsplash.com/random/400x400/?woman,professional',
              bio: 'Former restaurant owner and tech entrepreneur with a passion for connecting people through food.'
            },
            {
              name: 'Michael Chen',
              role: 'CTO & Co-Founder',
              image: 'https://source.unsplash.com/random/400x400/?man,professional',
              bio: 'Software engineer with 15+ years experience building innovative tech solutions for the food industry.'
            },
            {
              name: 'Jessica Martinez',
              role: 'COO',
              image: 'https://source.unsplash.com/random/400x400/?woman,executive',
              bio: 'Operations expert who ensures seamless delivery and exceptional customer experiences.'
            },
            {
              name: 'David Wilson',
              role: 'VP of Partnerships',
              image: 'https://source.unsplash.com/random/400x400/?man,business',
              bio: 'Builds and maintains relationships with our restaurant partners across the country.'
            }
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ mb: 8 }}>
        <Paper sx={{ p: 4, backgroundColor: 'primary.main', color: 'white' }}>
          <Grid container spacing={3} justifyContent="center">
            {[
              { value: '5000+', label: 'Restaurant Partners' },
              { value: '50+', label: 'Cities Served' },
              { value: '1M+', label: 'Happy Customers' },
              { value: '10M+', label: 'Orders Delivered' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
      
      {/* Join Us Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Join the MealMover Family
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
          Whether you're a restaurant looking to expand your reach, a driver wanting to join our delivery team, or a hungry customer - we'd love to have you be part of our growing community.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/partner-with-us"
            sx={{ mx: 1, mb: 2 }}
          >
            Partner With Us
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/contact"
            sx={{ mx: 1, mb: 2 }}
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default About;