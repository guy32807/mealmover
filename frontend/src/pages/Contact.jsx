import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, TextField, 
  Button, Paper, MenuItem, Snackbar, Alert, 
  Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import MetaTags from '../seo/MetaTags';

const contactReasons = [
  'General Inquiry',
  'Order Issue',
  'Restaurant Partnership',
  'Career Opportunity',
  'Technical Support',
  'Feedback and Suggestions'
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.reason) {
      errors.reason = 'Please select a reason for contact';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Success case
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        reason: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <MetaTags 
        title="Contact Us - MealMover" 
        description="Get in touch with MealMover customer service. We are here to help with all your food delivery questions and concerns."
      />
      
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      
      <Typography variant="subtitle1" paragraph align="center" color="text.secondary" sx={{ mb: 6 }}>
        Have questions or feedback? We'd love to hear from you!
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Get in Touch
            </Typography>
            
            <Typography variant="body1" paragraph color="text.secondary">
              Our customer support team is available to assist you with any questions or concerns.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <List>
              <ListItem disableGutters>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Us" 
                  secondary="support@foodexpress.com"
                />
              </ListItem>
              
              <ListItem disableGutters>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Call Us" 
                  secondary="(123) 456-7890"
                />
              </ListItem>
              
              <ListItem disableGutters>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Our Office" 
                  secondary="1234 Food Street, San Francisco, CA 94103"
                />
              </ListItem>
              
              <ListItem disableGutters>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Hours of Operation" 
                  secondary="Mon-Fri: 8am - 10pm, Sat-Sun: 9am - 9pm"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send Us a Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="reason"
                    select
                    label="Reason for Contact"
                    value={formData.reason}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.reason}
                    helperText={formErrors.reason}
                  >
                    {contactReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="message"
                    label="Your Message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.message}
                    helperText={formErrors.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<SendIcon />}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={submitSuccess} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={submitError} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Something went wrong! Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;