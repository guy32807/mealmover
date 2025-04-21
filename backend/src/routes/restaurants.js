const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantsController');

// Now use restaurantsController directly without 'new'

// Route to get all restaurants
router.get('/', restaurantsController.getAllRestaurants);

// Route to get a restaurant by ID
router.get('/:id', restaurantsController.getRestaurantById);

module.exports = router;