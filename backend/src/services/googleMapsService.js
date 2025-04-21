const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';

const findNearbyRestaurants = async (location, radius) => {
    try {
        const response = await axios.get(`${GOOGLE_MAPS_API_URL}/place/nearbysearch/json`, {
            params: {
                location,
                radius,
                type: 'restaurant',
                key: GOOGLE_MAPS_API_KEY
            }
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Error fetching nearby restaurants: ' + error.message);
    }
};

const calculateDistance = async (origin, destination) => {
    try {
        const response = await axios.get(`${GOOGLE_MAPS_API_URL}/distancematrix/json`, {
            params: {
                origins: origin,
                destinations: destination,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        return response.data.rows[0].elements[0];
    } catch (error) {
        throw new Error('Error calculating distance: ' + error.message);
    }
};

// In your Google Maps component
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// When initializing the Google Maps component
<GoogleMap apiKey={apiKey} ... />

module.exports = {
    findNearbyRestaurants,
    calculateDistance
};