import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Grid, Typography, Divider, Paper, TextField, Slider, 
  FormControlLabel, Switch, Chip, Box, Button, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Rating,
  useMediaQuery, CircularProgress, Alert, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';

import RestaurantList from '../components/RestaurantList';
import MapView from '../components/MapView';
import MetaTags from '../seo/MetaTags';
import RestaurantDetail from '../components/RestaurantDetail';
import config from '../config';
import { fetchRestaurants } from '../services/restaurantService';

const API_URL = config.API_URL;

const cuisineOptions = [
  'Italian', 'Japanese', 'Chinese', 'Mexican', 'Indian', 'Thai', 'American', 'French', 'Mediterranean', 'Korean'
];

const Home = () => {
  // State for restaurants and loading
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for user location
  const [location, setLocation] = useState(null);
  
  // State for search and filters
  const [keyword, setKeyword] = useState('');
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [openNow, setOpenNow] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  
  // State for restaurant details modal
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // State for filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const filterButtonRef = useRef(null);

  // Fetch restaurants on mount and when location changes
  useEffect(() => {
    getUserLocation();
  }, []);
  
  useEffect(() => {
    if (location) {
      fetchRestaurantsData();
    }
  }, [location]);

  const getUserLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to San Francisco if geolocation fails
          setLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      // Geolocation not supported, use default
      setLocation({ lat: 37.7749, lng: -122.4194 });
    }
  };

  const fetchRestaurantsData = async () => {
    try {
      setLoading(true);
      
      // Construct query parameters
      const params = {
        lat: location.lat,
        lng: location.lng,
        radius: 2000, // 2km radius
        type: 'restaurant'
      };
      
      if (keyword) {
        params.term = keyword;
      }
      
      const restaurantsData = await fetchRestaurants(params);
      
      console.log('Fetched restaurant data:', restaurantsData);
      
      setRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants. Using mock data instead.');
      
      // Use mock data as fallback
      const mockData = generateMockRestaurants();
      setRestaurants(mockData);
      setFilteredRestaurants(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants when search criteria change
  useEffect(() => {
    if (restaurants.length > 0 && !loading) {
      filterRestaurants();
    }
  }, [keyword, priceRange, ratingFilter, selectedCuisines, openNow, deliveryOnly, sortBy]);

  // Function to filter restaurants based on all criteria
  const filterRestaurants = () => {
    if (!restaurants.length) {
      console.log('No restaurants to filter');
      return;
    }
    
    let results = [...restaurants];
    
    // Apply keyword filter (case insensitive)
    if (keyword.trim()) {
      const searchTerm = keyword.toLowerCase().trim();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) || 
        (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(searchTerm)) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply price range filter
    results = results.filter(restaurant => 
      restaurant.priceRange >= priceRange[0] && restaurant.priceRange <= priceRange[1]
    );
    
    // Apply rating filter
    if (ratingFilter > 0) {
      results = results.filter(restaurant => restaurant.rating >= ratingFilter);
    }
    
    // Apply cuisine filter
    if (selectedCuisines.length > 0) {
      results = results.filter(restaurant => 
        selectedCuisines.includes(restaurant.cuisine)
      );
    }
    
    // Apply open now filter (simplified implementation)
    if (openNow) {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Mock implementation - assume restaurants open 8am-10pm
      results = results.filter(() => currentHour >= 8 && currentHour < 22);
    }
    
    // Apply delivery filter
    if (deliveryOnly) {
      results = results.filter(restaurant => restaurant.acceptingOrders);
    }
    
    // Apply sorting
    results = sortRestaurants(results, sortBy);
    
    setFilteredRestaurants(results);
  };
  
  // Sort restaurants based on selected criteria
  const sortRestaurants = (restaurants, sortCriteria) => {
    switch (sortCriteria) {
      case 'rating':
        return [...restaurants].sort((a, b) => b.rating - a.rating);
      case 'deliveryTime':
        return [...restaurants].sort((a, b) => a.deliveryTime - b.deliveryTime);
      case 'priceAsc':
        return [...restaurants].sort((a, b) => a.priceRange - b.priceRange);
      case 'priceDesc':
        return [...restaurants].sort((a, b) => b.priceRange - a.priceRange);
      case 'distance':
      default:
        // Distance sorting would need actual calculation based on user location
        // This is a simplified implementation
        return restaurants;
    }
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };
  
  const handleSortChange = (event, newValue) => {
    if (newValue !== null) {
      setSortBy(newValue);
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const handleCuisineToggle = (cuisine) => {
    setSelectedCuisines(prevSelected => 
      prevSelected.includes(cuisine)
        ? prevSelected.filter(c => c !== cuisine)
        : [...prevSelected, cuisine]
    );
  };

  const handleResetFilters = () => {
    setKeyword('');
    setPriceRange([1, 4]);
    setRatingFilter(0);
    setSelectedCuisines([]);
    setOpenNow(false);
    setDeliveryOnly(false);
    setFilterDialogOpen(false);
  };

  // Generate mock restaurant data for development
  const generateMockRestaurants = () => {
    return [
      {
        id: '1',
        name: 'Pasta Paradise',
        cuisine: 'Italian',
        description: 'Authentic Italian cuisine with homemade pasta and wood-fired pizzas.',
        address: '123 Main St, San Francisco, CA',
        phone: '(415) 555-1234',
        website: 'https://example.com/pasta-paradise',
        priceRange: 2,
        rating: 4.5,
        location: { lat: 37.7749, lng: -122.4194 },
        image: 'https://source.unsplash.com/random/800x600/?italian-food',
        deliveryTime: 25,
        deliveryFee: 3.99,
        offersDelivery: true,
        minimumOrder: 15,
        openingHours: '11:00 AM - 10:00 PM'
      },
      {
        id: '2',
        name: 'Sushi Dreams',
        cuisine: 'Japanese',
        description: 'Fresh sushi and sashimi prepared by master chefs.',
        address: '456 Market St, San Francisco, CA',
        phone: '(415) 555-5678',
        website: 'https://example.com/sushi-dreams',
        priceRange: 3,
        rating: 4.8,
        location: { lat: 37.7775, lng: -122.4164 },
        image: 'https://source.unsplash.com/random/800x600/?sushi',
        deliveryTime: 35,
        deliveryFee: 4.99,
        offersDelivery: true,
        minimumOrder: 20,
        openingHours: '12:00 PM - 9:30 PM'
      },
      {
        id: '3',
        name: 'Taco Town',
        cuisine: 'Mexican',
        description: 'Authentic Mexican street food and margaritas.',
        address: '789 Mission St, San Francisco, CA',
        phone: '(415) 555-9012',
        website: 'https://example.com/taco-town',
        priceRange: 1,
        rating: 4.2,
        location: { lat: 37.7830, lng: -122.4075 },
        image: 'https://source.unsplash.com/random/800x600/?tacos',
        deliveryTime: 20,
        deliveryFee: 2.99,
        offersDelivery: true,
        minimumOrder: 10,
        openingHours: '10:00 AM - 11:00 PM'
      },
      {
        id: '4',
        name: 'Curry House',
        cuisine: 'Indian',
        description: 'Flavorful curries and tandoori specialties.',
        address: '101 Powell St, San Francisco, CA',
        phone: '(415) 555-3456',
        website: 'https://example.com/curry-house',
        priceRange: 2,
        rating: 4.0,
        location: { lat: 37.7851, lng: -122.4071 },
        image: 'https://source.unsplash.com/random/800x600/?curry',
        deliveryTime: 40,
        deliveryFee: 3.49,
        offersDelivery: true,
        minimumOrder: 15,
        openingHours: '11:30 AM - 10:00 PM'
      },
      {
        id: '5',
        name: 'Paris Bistro',
        cuisine: 'French',
        description: 'Classic French cuisine with an extensive wine list.',
        address: '202 Grant Ave, San Francisco, CA',
        phone: '(415) 555-7890',
        website: 'https://example.com/paris-bistro',
        priceRange: 4,
        rating: 4.7,
        location: { lat: 37.7878, lng: -122.4049 },
        image: 'https://source.unsplash.com/random/800x600/?french-cuisine',
        deliveryTime: 45,
        deliveryFee: 5.99,
        offersDelivery: true,
        minimumOrder: 25,
        openingHours: '5:00 PM - 10:30 PM'
      },
      {
        id: '6',
        name: 'Golden Dragon',
        cuisine: 'Chinese',
        description: 'Traditional Chinese dishes from various regions.',
        address: '303 Clay St, San Francisco, CA',
        phone: '(415) 555-2345',
        website: 'https://example.com/golden-dragon',
        priceRange: 2,
        rating: 4.3,
        location: { lat: 37.7956, lng: -122.4003 },
        image: 'https://source.unsplash.com/random/800x600/?chinese-food',
        deliveryTime: 30,
        deliveryFee: 3.99,
        offersDelivery: true,
        minimumOrder: 15,
        openingHours: '11:00 AM - 10:30 PM'
      },
      {
        id: '7',
        name: 'Burritos & More',
        cuisine: 'Mexican',
        description: 'Authentic burritos, tacos, and more Mexican favorites.',
        address: '505 Valencia St, San Francisco, CA',
        phone: '(415) 555-6543',
        website: 'https://example.com/burritos-more',
        priceRange: 1,
        rating: 4.6,
        location: { lat: 37.7642, lng: -122.4214 },
        image: 'https://source.unsplash.com/random/800x600/?burrito',
        deliveryTime: 25,
        deliveryFee: 2.49,
        offersDelivery: true,
        minimumOrder: 10,
        openingHours: '9:00 AM - 12:00 AM'
      },
      {
        id: '8',
        name: 'Thai Spice',
        cuisine: 'Thai',
        description: 'Authentic Thai dishes with fresh ingredients.',
        address: '123 Clement St, San Francisco, CA',
        phone: '(415) 555-8765',
        website: 'https://example.com/thai-spice',
        priceRange: 2,
        rating: 4.4,
        location: { lat: 37.7829, lng: -122.4665 },
        image: 'https://source.unsplash.com/random/800x600/?thai-food',
        deliveryTime: 35,
        deliveryFee: 3.99,
        offersDelivery: true,
        minimumOrder: 15,
        openingHours: '11:30 AM - 9:30 PM'
      }
    ];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MetaTags 
        title="FoodExpress - Food Delivery & Pickup" 
        description="Order food for delivery or pickup from local restaurants near you"
      />
      
      <Typography variant="h4" component="h1" gutterBottom>
        <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        FoodExpress
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Search and filter bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search restaurants, cuisines, or food..."
              value={keyword}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              ref={filterButtonRef}
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDialogOpen(true)}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={deliveryOnly}
                  onChange={(e) => setDeliveryOnly(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Delivery</Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Sort options */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SortIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="body2" sx={{ mr: 2 }}>Sort by:</Typography>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={handleSortChange}
          size="small"
        >
          <ToggleButton value="distance">
            <Typography variant="caption">Distance</Typography>
          </ToggleButton>
          <ToggleButton value="rating">
            <Typography variant="caption">Rating</Typography>
          </ToggleButton>
          <ToggleButton value="deliveryTime">
            <Typography variant="caption">Delivery Time</Typography>
          </ToggleButton>
          <ToggleButton value="priceAsc">
            <Typography variant="caption">Price: Low to High</Typography>
          </ToggleButton>
          <ToggleButton value="priceDesc">
            <Typography variant="caption">Price: High to Low</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Filter indicators */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedCuisines.map(cuisine => (
          <Chip 
            key={cuisine}
            label={cuisine} 
            onDelete={() => handleCuisineToggle(cuisine)}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
        
        {ratingFilter > 0 && (
          <Chip 
            label={`${ratingFilter}+ Stars`} 
            onDelete={() => setRatingFilter(0)}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
        
        {(priceRange[0] > 1 || priceRange[1] < 4) && (
          <Chip 
            label={`${'$'.repeat(priceRange[0])} - ${'$'.repeat(priceRange[1])}`} 
            onDelete={() => setPriceRange([1, 4])}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
        
        {openNow && (
          <Chip 
            label="Open Now" 
            onDelete={() => setOpenNow(false)}
            color="primary" 
            variant="outlined"
            size="small"
          />
        )}
        
        {deliveryOnly && (
          <Chip 
            label="Delivery Only" 
            onDelete={() => setDeliveryOnly(false)}
            color="primary" 
            variant="outlined"
            size="small"
            icon={<LocalShippingIcon fontSize="small" />}
          />
        )}
        
        {(selectedCuisines.length > 0 || ratingFilter > 0 || 
           priceRange[0] > 1 || priceRange[1] < 4 || openNow || deliveryOnly) && (
          <Chip 
            label="Clear All" 
            onClick={handleResetFilters}
            color="secondary"
            size="small"
          />
        )}
      </Box>
      
      {/* Results count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          {loading ? 'Finding restaurants...' : 
            `${filteredRestaurants.length} ${filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found`}
        </Typography>
      </Box>
      
      {/* Map view */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <MapView 
            restaurants={filteredRestaurants} 
            onRestaurantSelect={handleRestaurantSelect}
            userLocation={location}
          />
        )}
      </Box>
      
      {/* Restaurant list */}
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredRestaurants.length > 0 ? (
          <RestaurantList 
            restaurants={filteredRestaurants}
            onRestaurantSelect={handleRestaurantSelect}
          />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>No restaurants found</Typography>
            <Typography>
              Try adjusting your filters or search terms to see more results.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleResetFilters}
              sx={{ mt: 2 }}
            >
              Reset All Filters
            </Button>
          </Paper>
        )}
      </Box>
      
      {/* Filter dialog */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => setFilterDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        disableEnforceFocus
      >
        <DialogTitle>
          Filter Restaurants
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => '$'.repeat(value)}
            min={1}
            max={4}
            marks={[
              { value: 1, label: '$' },
              { value: 2, label: '$$' },
              { value: 3, label: '$$$' },
              { value: 4, label: '$$$$' },
            ]}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              value={ratingFilter}
              onChange={(e, newValue) => setRatingFilter(newValue)}
              precision={0.5}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Cuisines</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {cuisineOptions.map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  onClick={() => handleCuisineToggle(cuisine)}
                  color={selectedCuisines.includes(cuisine) ? "primary" : "default"}
                />
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={openNow}
                  onChange={(e) => setOpenNow(e.target.checked)}
                />
              }
              label="Open Now"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>
            Reset All
          </Button>
          <Button 
            onClick={() => setFilterDialogOpen(false)} 
            variant="contained" 
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Restaurant detail modal */}
      {selectedRestaurant && (
        <RestaurantDetail
          open={detailOpen}
          restaurant={selectedRestaurant}
          onClose={handleCloseDetail}
        />
      )}
    </Container>
  );
};

export default Home;