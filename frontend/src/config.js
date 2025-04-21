// Application configuration

const config = {
  // API endpoint
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  
  // Default map center (San Francisco)
  DEFAULT_MAP_CENTER: {
    lat: 37.7749,
    lng: -122.4194
  },
  
  // Default zoom level for maps
  DEFAULT_MAP_ZOOM: 13,
  
  // Distance units (miles or kilometers)
  DISTANCE_UNIT: 'miles',
  
  // Features available in the application
  FEATURES: {
    GEOLOCATION: true,        // Use browser geolocation
    FAVORITES: true,          // Allow saving favorite restaurants
    REVIEWS: false,           // User reviews functionality (not implemented yet)
    PHOTOS: false,            // User photos functionality (not implemented yet)
    DIRECTIONS: true          // Show directions to restaurants
  }
};

// Log configuration in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('API URL from config:', config.API_URL);
}

export default config;