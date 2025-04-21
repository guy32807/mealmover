import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Chip, IconButton, Rating, Divider,
  Grid, List, ListItem, ListItemIcon, ListItemText,
  useMediaQuery, Tab, Tabs, Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import DirectionsIcon from '@mui/icons-material/Directions';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReviewsIcon from '@mui/icons-material/Reviews';
import InfoIcon from '@mui/icons-material/Info';

const RestaurantDetail = ({ open, restaurant, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!restaurant) return null;

  const priceDisplay = Array(restaurant.priceRange).fill('$').join('');

  const getGoogleMapsDirectionsUrl = (address) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  const renderFeatures = () => {
    if (!restaurant.features || restaurant.features.length === 0) {
      return <Typography color="text.secondary">No features listed</Typography>;
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {restaurant.features.includes('wifi') && (
          <Chip icon={<WifiIcon />} label="WiFi" size="small" />
        )}
        {restaurant.features.includes('parking') && (
          <Chip icon={<LocalParkingIcon />} label="Parking" size="small" />
        )}
        {restaurant.features.includes('alcohol') && (
          <Chip icon={<LocalBarIcon />} label="Serves Alcohol" size="small" />
        )}
      </Box>
    );
  };

  const renderDescription = () => {
    if (!restaurant.description) {
      return <Typography color="text.secondary">No description available</Typography>;
    }

    return <Typography paragraph>{restaurant.description}</Typography>;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h2">{restaurant.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {restaurant.cuisine}
            </Typography>
            <Chip 
              size="small" 
              label={priceDisplay} 
              sx={{ mr: 1, height: '20px' }} 
            />
            <Rating 
              value={restaurant.rating} 
              readOnly 
              precision={0.5} 
              size="small" 
            />
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<InfoIcon />} label="Details" />
          <Tab icon={<RestaurantMenuIcon />} label="Menu" />
          <Tab icon={<ReviewsIcon />} label="Reviews" />
          <Tab icon={<PhotoLibraryIcon />} label="Photos" />
        </Tabs>
      </Box>
      
      <DialogContent dividers>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src={restaurant.image || 'https://via.placeholder.com/800x400?text=No+Image+Available'} 
                alt={restaurant.name}
                sx={{ 
                  width: '100%', 
                  borderRadius: 1,
                  height: 250,
                  objectFit: 'cover'
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Description</Typography>
                {renderDescription()}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Features</Typography>
                {renderFeatures()}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Opening Hours"
                    secondary={restaurant.openingHours || "Not available"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={restaurant.phone || "Not available"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Website"
                    secondary={
                      restaurant.website ? (
                        <Button
                          href={restaurant.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ p: 0, textTransform: 'none' }}
                        >
                          {restaurant.website}
                        </Button>
                      ) : (
                        "Not available"
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Price Range"
                    secondary={priceDisplay}
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Address
              </Typography>
              <Typography paragraph>{restaurant.address}</Typography>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <RestaurantMenuIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">Menu Not Available</Typography>
            <Typography color="text.secondary">
              Menu information is not available for this restaurant.
            </Typography>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ReviewsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">No Reviews Yet</Typography>
            <Typography color="text.secondary">
              Be the first to review this restaurant.
            </Typography>
          </Box>
        )}
        
        {activeTab === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PhotoLibraryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">No Photos Available</Typography>
            <Typography color="text.secondary">
              No photos have been uploaded for this restaurant.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button startIcon={<DirectionsIcon />} color="primary" variant="outlined"
          onClick={() => window.open(getGoogleMapsDirectionsUrl(restaurant.address), '_blank')}
        >
          Get Directions
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDetail;