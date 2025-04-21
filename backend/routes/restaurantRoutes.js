const express = require('express');
const router = express.Router();
const restaurantService = require('../services/restaurantService');

// Get all restaurants based on location
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius, term, limit } = req.query;
    
    // Default to San Francisco if no location provided
    const userLat = lat || 37.7749;
    const userLng = lng || -122.4194;
    
    const restaurants = await restaurantService.getRestaurants(
      userLat, 
      userLng, 
      radius, 
      term, 
      limit
    );
    
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error in restaurant route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error in restaurant detail route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;