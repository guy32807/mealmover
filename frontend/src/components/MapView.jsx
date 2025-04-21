import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  MarkerF, // Use MarkerF which is the modern version in the library
  InfoWindow 
} from '@react-google-maps/api';
import { useTheme } from '@mui/material/styles';
import { Paper, Typography, useMediaQuery, Button, Box, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import config from '../config';
import './MapView.css';

// Map container styles
const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// Move this outside of your component as a constant
const mapLibraries = ['places', 'geometry'];

const MapView = ({ restaurants = [], onRestaurantSelect }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to SF
    const [mapRef, setMapRef] = useState(null);
    const [useGoogleMaps, setUseGoogleMaps] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: config.GOOGLE_MAPS_API_KEY,
        libraries: mapLibraries // Use the constant instead of an inline array
    });

    // Get user's location
    useEffect(() => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(userPos);
                    setMapCenter(userPos);
                    setIsLoading(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }, []);

    const onMapLoad = useCallback((map) => {
        setMapRef(map);
    }, []);

    const onMarkerClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        if (onRestaurantSelect) {
            onRestaurantSelect(restaurant);
        }
    };

    const panToLocation = (location) => {
        if (mapRef) {
            mapRef.panTo(location);
            mapRef.setZoom(15);
        }
    };

    // Function to toggle between placeholder and Google Maps
    const toggleMapView = () => {
        setUseGoogleMaps(!useGoogleMaps);
    };
    
    if (loadError) {
        return (
            <div className="map-container">
                <Paper elevation={3} className="map-error">
                    <Typography variant="h6" color="error">
                        Error loading maps: {loadError.message}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={toggleMapView}
                        sx={{ mt: 2 }}
                    >
                        Use Placeholder Map
                    </Button>
                </Paper>
            </div>
        );
    }

    return (
        <div className="map-container">
            {isLoading && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    sx={{ height: '100%', position: 'absolute', width: '100%', zIndex: 10 }}
                >
                    <CircularProgress />
                </Box>
            )}
            
            {useGoogleMaps && isLoaded ? (
                <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={13}
                        onLoad={onMapLoad}
                        options={{
                            fullscreenControl: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            zoomControlOptions: {
                                position: window.google?.maps.ControlPosition.RIGHT_CENTER
                            }
                        }}
                    >
                        {/* User location marker */}
                        {userLocation && (
                            <MarkerF
                                position={userLocation}
                                icon={{
                                    path: window.google?.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: "#4285F4",
                                    fillOpacity: 1,
                                    strokeColor: "#FFFFFF",
                                    strokeWeight: 2,
                                }}
                                title="Your location"
                            />
                        )}
                        
                        {/* Restaurant markers */}
                        {restaurants.map(restaurant => (
                            <MarkerF
                                key={restaurant.id}
                                position={restaurant.location}
                                onClick={() => onMarkerClick(restaurant)}
                                animation={window.google?.maps.Animation.DROP}
                                title={restaurant.name}
                            />
                        ))}
                        
                        {/* Info window for selected restaurant */}
                        {selectedRestaurant && (
                            <InfoWindow
                                position={selectedRestaurant.location}
                                onCloseClick={() => setSelectedRestaurant(null)}
                            >
                                <div className="info-window">
                                    <Typography variant="subtitle1" fontWeight="bold">{selectedRestaurant.name}</Typography>
                                    <Typography variant="body2">{selectedRestaurant.cuisine}</Typography>
                                    <Typography variant="body2">Rating: {selectedRestaurant.rating}⭐</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => onRestaurantSelect(selectedRestaurant)}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                    
                    {/* Map controls */}
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                        {userLocation && (
                            <Button 
                                size="small"
                                variant="outlined"
                                startIcon={<LocationOnIcon />}
                                onClick={() => panToLocation(userLocation)}
                            >
                                My Location
                            </Button>
                        )}
                        <Button 
                            size="small"
                            variant="text"
                            color="secondary"
                            onClick={toggleMapView}
                        >
                            Use Placeholder
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Paper elevation={3} className="map-placeholder">
                    <div className="placeholder-content">
                        <Typography variant="h5" gutterBottom>Restaurant Map</Typography>
                        <Typography variant="body1">
                            {restaurants.length} restaurants found in your area
                        </Typography>
                        <Box className="placeholder-markers" sx={{ my: 2 }}>
                            {restaurants.slice(0, 3).map(restaurant => (
                                <Box 
                                    key={restaurant.id} 
                                    className="placeholder-marker"
                                    onClick={() => onRestaurantSelect(restaurant)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <div className="marker-pin"></div>
                                    <div className="marker-info">
                                        <Typography variant="subtitle2">{restaurant.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {restaurant.cuisine} • {restaurant.rating} ⭐
                                        </Typography>
                                    </div>
                                </Box>
                            ))}
                        </Box>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={toggleMapView}
                        >
                            Try Google Maps
                        </Button>
                    </div>
                </Paper>
            )}
        </div>
    );
};

export default MapView;