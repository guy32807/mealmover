const express = require('express');
const axios = require('axios');
const router = express.Router();

// Google Places API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Get restaurants near a location
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 1500, type = 'restaurant', keyword } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Fetch nearby restaurants from Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        keyword,
        key: GOOGLE_MAPS_API_KEY
      }
    });
    
    // Enhance the data with random delivery information
    const enhancedResults = response.data.results.map(place => ({
      ...place,
      deliveryTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      deliveryFee: (Math.random() * 5 + 1).toFixed(2), // $1-$6
      acceptingOrders: Math.random() > 0.1 // 90% of restaurants accept orders
    }));
    
    res.json({
      status: response.data.status,
      data: enhancedResults
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get a specific restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch place details from Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: id,
        fields: 'name,rating,formatted_address,formatted_phone_number,website,geometry,photos,price_level,types,opening_hours',
        key: GOOGLE_MAPS_API_KEY
      }
    });
    
    // If no results, return 404
    if (!response.data.result) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Enhance with delivery information
    const enhancedPlace = {
      ...response.data.result,
      deliveryTime: Math.floor(Math.random() * 30) + 15,
      deliveryFee: (Math.random() * 5 + 1).toFixed(2),
      acceptingOrders: Math.random() > 0.1
    };
    
    res.json(enhancedPlace);
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

// Mock endpoint for restaurant menu
router.get('/:id/menu', (req, res) => {
  // In a real app, this would fetch real menu data
  // For now, we'll generate a mock menu
  const { id } = req.params;
  
  // Generate mock menu items
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  const menu = [];
  
  categories.forEach(category => {
    const itemCount = Math.floor(Math.random() * 5) + 2; // 2-6 items per category
    
    for (let i = 0; i < itemCount; i++) {
      menu.push({
        id: `${id}-${category.toLowerCase()}-${i}`,
        name: `${category} Item ${i + 1}`,
        description: 'Delicious food item with fresh ingredients',
        price: (Math.random() * 15 + 5).toFixed(2), // $5-$20
        category
      });
    }
  });
  
  res.json(menu);
});

module.exports = router;