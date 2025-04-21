import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main" component="div">
                MealMover
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Discover and order from the best local restaurants in your area with our easy-to-use food delivery platform.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook" component="a" href="#" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter" component="a" href="#" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram" component="a" href="#" target="_blank">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn" component="a" href="#" target="_blank">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Home
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/faq" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/contact" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/partner-with-us" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Partner With Us
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Customer Service</Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link component={RouterLink} to="/help" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/orders" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/account" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  My Account
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/terms" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Contact Us</Typography>
            <Typography variant="body2" paragraph>
              1234 Food Street<br />
              San Francisco, CA 94103
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Email:</strong> support@mealmover.com<br />
              <strong>Phone:</strong> (123) 456-7890
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Hours:</strong><br />
              Mon-Fri: 8am - 10pm<br />
              Sat-Sun: 9am - 9pm
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 6, mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {year} MealMover. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms
            </Link>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy
            </Link>
            <Link href="/cookies" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Cookies
            </Link>
            <Link href="/accessibility" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Accessibility
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;