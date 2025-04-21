import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Chip, Rating,
  Button, Divider, Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PropTypes from 'prop-types';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const RestaurantCard = ({ restaurant, onRestaurantSelect }) => {
  const formatPrice = (priceRange) => {
    return Array(priceRange).fill('$').join('');
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <StyledCard onClick={() => onRestaurantSelect(restaurant)}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={restaurant.image || 'https://via.placeholder.com/300x160?text=No+Image'}
          alt={restaurant.name}
        />
        
        {restaurant.acceptingOrders ? (
          <Chip
            label="Open"
            color="success"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          />
        ) : (
          <Chip
            label="Closed"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" gutterBottom noWrap sx={{ maxWidth: '80%' }}>
            {restaurant.name}
          </Typography>
          <Chip
            size="small"
            label={formatPrice(restaurant.priceRange)}
            sx={{ height: 24, minWidth: 45 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={restaurant.rating}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({restaurant.rating})
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {restaurant.cuisine}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon fontSize="inherit" sx={{ mr: 0.5 }} />
          {truncateText(restaurant.address, 35)}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {restaurant.deliveryTime} min
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalShippingIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              ${restaurant.deliveryFee}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          startIcon={<DeliveryDiningIcon />}
          disabled={!restaurant.acceptingOrders}
        >
          {restaurant.acceptingOrders ? 'Order Now' : 'Currently Closed'}
        </Button>
      </Box>
    </StyledCard>
  );
};

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    priceRange: PropTypes.number.isRequired,
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
    acceptingOrders: PropTypes.bool.isRequired,
    deliveryTime: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
  }).isRequired,
  onRestaurantSelect: PropTypes.func.isRequired
};

export default RestaurantCard;