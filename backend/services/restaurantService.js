const axios = require('axios');
const config = require('../config');

const YELP_API_KEY = process.env.YELP_API_KEY; // Add this to your .env file
const YELP_API_URL = 'https://api.yelp.com/v3';

const getRestaurants = async (lat, lng, radius = 1500, term = 'restaurants', limit = 20) => {
  try {
    const response = await axios.get(`${YELP_API_URL}/businesses/search`, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      },
      params: {
        latitude: lat,
        longitude: lng,
        radius: radius,
        term: term,
        limit: limit,
        categories: 'restaurants,food',
        sort_by: 'distance'
      }
    });

    // Transform Yelp data to match our application format
    const restaurants = response.data.businesses.map(business => ({
      id: business.id,
      name: business.name,
      cuisine: business.categories[0]?.title || 'Restaurant',
      description: business.categories.map(cat => cat.title).join(', '),
      address: `${business.location.address1}, ${business.location.city}`,
      phone: business.phone,
      website: business.url,
      priceRange: business.price ? business.price.length : 2, // Convert Yelp $ signs to our rating
      rating: business.rating,
      location: {
        lat: business.coordinates.latitude,
        lng: business.coordinates.longitude
      },
      image: business.image_url,
      deliveryTime: Math.floor(Math.random() * 30) + 15, // Mock: 15-45 min delivery time
      deliveryFee: (Math.random() * 5 + 1).toFixed(2), // Mock: $1-$6 delivery fee
      acceptingOrders: Math.random() > 0.1, // 90% of restaurants accept orders
    }));

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants from Yelp:', error.message);
    throw new Error('Failed to fetch restaurants from Yelp');
  }
};

// Get restaurant details by ID
const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${YELP_API_URL}/businesses/${id}`, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      }
    });

    const business = response.data;
    
    // Get reviews for this restaurant
    const reviewsResponse = await axios.get(`${YELP_API_URL}/businesses/${id}/reviews`, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      }
    });
    
    // Transform to our format
    return {
      id: business.id,
      name: business.name,
      cuisine: business.categories[0]?.title || 'Restaurant',
      description: business.categories.map(cat => cat.title).join(', '),
      address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
      phone: business.display_phone,
      website: business.url,
      priceRange: business.price ? business.price.length : 2,
      rating: business.rating,
      reviewCount: business.review_count,
      location: {
        lat: business.coordinates.latitude,
        lng: business.coordinates.longitude
      },
      image: business.image_url,
      photos: business.photos || [],
      hours: business.hours?.[0]?.open || [],
      reviews: reviewsResponse.data.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        text: review.text,
        time: review.time_created,
        username: review.user.name
      })),
      // Mocked delivery data
      deliveryTime: Math.floor(Math.random() * 30) + 15,
      deliveryFee: (Math.random() * 5 + 1).toFixed(2),
      acceptingOrders: Math.random() > 0.1,
      // Mock menu data (in real app, you'd need another API for this)
      menu: generateMockMenu(business.categories.map(cat => cat.title))
    };
  } catch (error) {
    console.error(`Error fetching restaurant details for ID ${id}:`, error.message);
    throw new Error(`Failed to fetch restaurant details for ID ${id}`);
  }
};

// Helper to generate mock menu based on cuisine
const generateMockMenu = (categories) => {
  // Simplified mock menu generator
  const menu = [];
  
  // Appetizers
  menu.push({
    id: 'category-1',
    name: 'Appetizers',
    items: [
      { id: 'item-1', name: 'House Salad', price: 8.99, description: 'Fresh mixed greens with house dressing' },
      { id: 'item-2', name: 'Soup of the Day', price: 6.99, description: 'Made fresh daily' },
      { id: 'item-3', name: 'Garlic Bread', price: 5.99, description: 'Toasted with garlic butter and herbs' }
    ]
  });
  
  // Main courses based on cuisine
  if (categories.some(cat => cat.toLowerCase().includes('italian'))) {
    menu.push({
      id: 'category-2',
      name: 'Pasta',
      items: [
        { id: 'item-4', name: 'Spaghetti Bolognese', price: 14.99, description: 'Classic meat sauce over spaghetti' },
        { id: 'item-5', name: 'Fettuccine Alfredo', price: 13.99, description: 'Creamy parmesan sauce' },
        { id: 'item-6', name: 'Lasagna', price: 15.99, description: 'Layered pasta with meat and cheese' }
      ]
    });
  } else if (categories.some(cat => cat.toLowerCase().includes('mexican'))) {
    menu.push({
      id: 'category-2',
      name: 'Tacos & Burritos',
      items: [
        { id: 'item-4', name: 'Carne Asada Tacos', price: 12.99, description: 'Marinated steak tacos with salsa' },
        { id: 'item-5', name: 'Vegetarian Burrito', price: 11.99, description: 'Beans, rice, and vegetables' },
        { id: 'item-6', name: 'Enchiladas', price: 13.99, description: 'Corn tortillas filled with chicken and cheese' }
      ]
    });
  } else if (categories.some(cat => cat.toLowerCase().includes('japanese') || cat.toLowerCase().includes('sushi'))) {
    menu.push({
      id: 'category-2',
      name: 'Sushi & Rolls',
      items: [
        { id: 'item-4', name: 'California Roll', price: 10.99, description: 'Crab, avocado, and cucumber' },
        { id: 'item-5', name: 'Spicy Tuna Roll', price: 12.99, description: 'Fresh tuna with spicy sauce' },
        { id: 'item-6', name: 'Salmon Nigiri', price: 14.99, description: 'Fresh salmon over rice' }
      ]
    });
  } else {
    // Default main courses
    menu.push({
      id: 'category-2',
      name: 'Main Courses',
      items: [
        { id: 'item-4', name: 'Grilled Chicken', price: 16.99, description: 'Served with seasonal vegetables' },
        { id: 'item-5', name: 'Beef Stir Fry', price: 15.99, description: 'Tender beef with vegetables in savory sauce' },
        { id: 'item-6', name: 'Vegetable Curry', price: 13.99, description: 'Mild curry with seasonal vegetables' }
      ]
    });
  }
  
  // Desserts
  menu.push({
    id: 'category-3',
    name: 'Desserts',
    items: [
      { id: 'item-7', name: 'Chocolate Cake', price: 7.99, description: 'Rich chocolate cake with ganache' },
      { id: 'item-8', name: 'Cheesecake', price: 8.99, description: 'New York style cheesecake' },
      { id: 'item-9', name: 'Ice Cream', price: 5.99, description: 'Vanilla, chocolate, or strawberry' }
    ]
  });
  
  // Beverages
  menu.push({
    id: 'category-4',
    name: 'Beverages',
    items: [
      { id: 'item-10', name: 'Soft Drinks', price: 2.99, description: 'Coke, Diet Coke, Sprite' },
      { id: 'item-11', name: 'Iced Tea', price: 2.99, description: 'Sweetened or unsweetened' },
      { id: 'item-12', name: 'Coffee', price: 3.99, description: 'Regular or decaf' }
    ]
  });
  
  return menu;
};

module.exports = {
  getRestaurants,
  getRestaurantById
};