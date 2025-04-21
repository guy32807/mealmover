const Restaurant = require('../models/Restaurant');

// Utility for calculating distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Restaurant controller with methods for handling restaurant-related requests

const restaurantsController = {
  // Get all restaurants with filtering
  getAllRestaurants: async (req, res) => {
    try {
      const { 
        lat, lng, maxDistance = 10, 
        minPrice, maxPrice, rating, cuisine, 
        openNow, keyword, sortBy = 'distance'
      } = req.query;
      
      // For demo purposes, we'll use mock data
      // In a real app, this would query MongoDB
      const mockRestaurants = [
        {
          id: 1,
          name: 'Italian Delight',
          cuisine: 'Italian',
          address: '123 Main St, San Francisco, CA',
          rating: 4.5,
          priceRange: 2,
          location: { lat: 37.7749, lng: -122.4194 },
          image: 'https://source.unsplash.com/random/300x200/?italian,restaurant',
          openingHours: 'Mon-Sat: 11am-10pm, Sun: 12pm-9pm',
          phone: '(415) 555-1234',
          website: 'https://example.com/italian-delight',
          features: ['wifi', 'parking', 'alcohol'],
          description: 'Authentic Italian cuisine with homemade pasta and wood-fired pizzas. Our recipes have been passed down through generations.'
        },
        {
          id: 2,
          name: 'Sushi Master',
          cuisine: 'Japanese',
          address: '456 Oak Ave, San Francisco, CA',
          rating: 4.8,
          priceRange: 3,
          location: { lat: 37.7746, lng: -122.4172 },
          image: 'https://source.unsplash.com/random/300x200/?sushi,restaurant',
          openingHours: 'Daily: 5pm-11pm',
          phone: '(415) 555-5678',
          website: 'https://example.com/sushi-master',
          features: ['alcohol'],
          description: 'Premium sushi restaurant featuring the freshest fish and traditional Japanese techniques. Our chef trained in Tokyo for over 15 years.'
        },
        {
          id: 3,
          name: 'Taco Town',
          cuisine: 'Mexican',
          address: '789 Pine St, San Francisco, CA',
          rating: 4.2,
          priceRange: 1,
          location: { lat: 37.7724, lng: -122.4154 },
          image: 'https://source.unsplash.com/random/300x200/?mexican,restaurant',
          openingHours: 'Daily: 10am-11pm',
          phone: '(415) 555-9012',
          website: 'https://example.com/taco-town',
          features: ['wifi', 'alcohol'],
          description: 'Fast-casual Mexican eatery with authentic street tacos, burritos, and fresh salsas. Family-owned and operated since 2005.'
        },
        {
          id: 4,
          name: 'Golden Dragon',
          cuisine: 'Chinese',
          address: '101 Market St, San Francisco, CA',
          rating: 4.0,
          priceRange: 2,
          location: { lat: 37.7730, lng: -122.4190 },
          image: 'https://source.unsplash.com/random/300x200/?chinese,restaurant',
          openingHours: 'Mon-Sun: 11am-12am',
          phone: '(415) 555-3456',
          website: 'https://example.com/golden-dragon',
          features: ['parking'],
          description: 'Traditional Chinese restaurant specializing in dim sum and Cantonese cuisine. Large dining room perfect for family gatherings.'
        },
        {
          id: 5,
          name: 'Burger Joint',
          cuisine: 'American',
          address: '222 Mission St, San Francisco, CA',
          rating: 4.3,
          priceRange: 2,
          location: { lat: 37.7875, lng: -122.4324 },
          image: 'https://source.unsplash.com/random/300x200/?burger,restaurant',
          openingHours: 'Daily: 11am-10pm',
          phone: '(415) 555-7890',
        }
      ];
      
      res.status(200).json({
        success: true,
        count: mockRestaurants.length,
        data: mockRestaurants
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get a single restaurant by ID
  getRestaurantById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Placeholder - replace with actual database query
      const restaurant = { 
        id: id, 
        name: 'Sample Restaurant ' + id, 
        cuisine: 'Italian',
        address: '123 Main St',
        description: 'A lovely restaurant serving authentic cuisine',
        rating: 4.5,
        priceRange: '$$',
        hours: {
          monday: '11:00 AM - 10:00 PM',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 11:00 PM',
          saturday: '10:00 AM - 11:00 PM',
          sunday: '10:00 AM - 9:00 PM'
        },
        phone: '(555) 123-4567',
        website: 'https://example.com',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      };
      
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = restaurantsController;