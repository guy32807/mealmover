import axios from 'axios';
import config from '../config';

// Create a custom axios instance for API requests
const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch restaurants from API based on location and filters
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Array of restaurant objects
 */
export const fetchRestaurants = async (params) => {
  try {
    const response = await apiClient.get('/restaurants', { params });
    
    // Map the response to our application's restaurant model
    const restaurants = response.data.data || response.data;
    
    // Transform and enhance restaurant data
    return restaurants.map(restaurant => ({
      ...restaurant,
      // Ensure all restaurants have the right structure
      id: restaurant.id || `rest-${Math.random().toString(36).substr(2, 9)}`,
      name: restaurant.name,
      cuisine: restaurant.cuisine || restaurant.categories?.[0]?.title || 'Various',
      description: restaurant.description || formatYelpDescription(restaurant),
      priceRange: restaurant.priceRange || getPriceRange(restaurant.price),
      rating: restaurant.rating || 0,
      deliveryTime: restaurant.deliveryTime || calculateMockDeliveryTime(restaurant),
      deliveryFee: restaurant.deliveryFee || calculateDeliveryFee(restaurant),
      location: restaurant.location || {
        lat: restaurant.coordinates?.latitude || restaurant.lat,
        lng: restaurant.coordinates?.longitude || restaurant.lng
      },
      // Add delivery-specific fields
      offersDelivery: restaurant.offersDelivery ?? true,
      minimumOrder: restaurant.minimumOrder || Math.floor(Math.random() * 5) * 5 + 10,
      openingHours: restaurant.openingHours || getRandomOpeningHours(),
      // Generate mock menu if not provided
      menu: restaurant.menu || generateMockMenu(restaurant.cuisine)
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

/**
 * Generate menu based on restaurant cuisine
 */
export const generateMockMenu = (cuisine = 'Various') => {
  const menuItems = [];
  const categories = getMenuCategoriesByCuisine(cuisine);
  
  categories.forEach(category => {
    const itemCount = Math.floor(Math.random() * 5) + 3; // 3-8 items per category
    
    for (let i = 0; i < itemCount; i++) {
      menuItems.push({
        id: `item-${Math.random().toString(36).substr(2, 9)}`,
        name: getDishNameByCuisine(cuisine, category),
        description: getRandomDescription(),
        price: (Math.floor(Math.random() * 20) + 5 + Math.random()).toFixed(2),
        category,
        image: `https://source.unsplash.com/random/300x200/?${cuisine.toLowerCase()},${category.toLowerCase()}`,
        popular: Math.random() > 0.7,
        vegetarian: Math.random() > 0.7,
        spicy: Math.random() > 0.7
      });
    }
  });
  
  return menuItems;
};

/**
 * Utility functions for generating mock data
 */
const formatYelpDescription = (restaurant) => {
  if (restaurant.categories?.length) {
    return `${restaurant.name} offers ${restaurant.categories.map(c => c.title).join(', ')} cuisine.`;
  }
  return `${restaurant.name} - A local favorite restaurant.`;
};

const getPriceRange = (yelpPrice) => {
  if (!yelpPrice) return Math.floor(Math.random() * 3) + 1;
  return yelpPrice.length; // Yelp uses $ to $$$$ system
};

const calculateMockDeliveryTime = (restaurant) => {
  return Math.floor(Math.random() * 30) + 15; // 15-45 minutes
};

const calculateDeliveryFee = (restaurant) => {
  return (Math.floor(Math.random() * 5) + 1 + Math.random()).toFixed(2); // $1-$6
};

const getRandomOpeningHours = () => {
  const openingTime = Math.floor(Math.random() * 4) + 7; // 7-11 AM
  const closingTime = Math.floor(Math.random() * 4) + 20; // 8 PM-12 AM
  return `${openingTime}:00 AM - ${closingTime === 24 ? '12' : closingTime - 12}:00 PM`;
};

const getMenuCategoriesByCuisine = (cuisine) => {
  const commonCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  
  const cuisineSpecificCategories = {
    Italian: ['Pasta', 'Pizza', 'Risotto', 'Antipasti'],
    Japanese: ['Sushi', 'Ramen', 'Tempura', 'Donburi'],
    Chinese: ['Dim Sum', 'Noodles', 'Rice Dishes', 'Soups'],
    Mexican: ['Tacos', 'Burritos', 'Enchiladas', 'Quesadillas'],
    Indian: ['Curry', 'Tandoor', 'Biryani', 'Bread'],
    Thai: ['Curries', 'Noodles', 'Stir Fry', 'Soups'],
    American: ['Burgers', 'Sandwiches', 'Grill', 'Sides'],
    French: ['Entrées', 'Plats Principaux', 'Fromages', 'Desserts'],
    Mediterranean: ['Mezze', 'Grill', 'Seafood', 'Sides'],
    Korean: ['BBQ', 'Stews', 'Rice Bowls', 'Banchan'],
  };
  
  return cuisineSpecificCategories[cuisine] || commonCategories;
};

const getDishNameByCuisine = (cuisine, category) => {
  const dishNames = {
    Italian: {
      'Pasta': ['Spaghetti Carbonara', 'Fettuccine Alfredo', 'Lasagna', 'Penne Arrabbiata', 'Ravioli'],
      'Pizza': ['Margherita', 'Quattro Formaggi', 'Pepperoni', 'Prosciutto', 'Diavola'],
      'Antipasti': ['Bruschetta', 'Caprese Salad', 'Arancini', 'Prosciutto e Melone'],
      'Desserts': ['Tiramisu', 'Panna Cotta', 'Cannoli', 'Gelato']
    },
    // Add more cuisines similarly
  };
  
  if (dishNames[cuisine]?.[category]) {
    return dishNames[cuisine][category][Math.floor(Math.random() * dishNames[cuisine][category].length)];
  }
  
  // Default dish names by category
  const defaultNames = {
    'Appetizers': ['Spring Rolls', 'Nachos', 'Fried Calamari', 'Hummus', 'Chicken Wings'],
    'Main Courses': ['Grilled Salmon', 'Chicken Curry', 'Beef Stew', 'Vegetable Stir-Fry', 'Mushroom Risotto'],
    'Desserts': ['Chocolate Cake', 'Ice Cream', 'Cheesecake', 'Apple Pie', 'Crème Brûlée'],
    'Beverages': ['Iced Tea', 'Coffee', 'Lemonade', 'Soda', 'Milkshake']
  };
  
  if (defaultNames[category]) {
    return defaultNames[category][Math.floor(Math.random() * defaultNames[category].length)];
  }
  
  return `${cuisine} ${category} Dish`;
};

const getRandomDescription = () => {
  const descriptions = [
    'A delicious and flavorful dish prepared with fresh ingredients',
    'Our chef\'s special recipe, loved by our customers',
    'A traditional favorite with a modern twist',
    'Made with locally sourced ingredients for authentic flavor',
    'A perfect blend of flavors to satisfy your cravings',
    'Prepared fresh daily using our secret family recipe'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Place an order
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} - Order confirmation
 */
export const placeOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

/**
 * Fetch user's order history
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of order objects
 */
export const fetchOrderHistory = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

/**
 * Get estimated delivery time
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} userLocation - User's location coordinates
 * @returns {Promise<number>} - Estimated delivery time in minutes
 */
export const getEstimatedDeliveryTime = async (restaurantId, userLocation) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/delivery-time`, {
      params: userLocation
    });
    return response.data.estimatedTime;
  } catch (error) {
    console.error('Error getting delivery time:', error);
    // Return mock time if API fails
    return Math.floor(Math.random() * 30) + 15;
  }
};

export default {
  fetchRestaurants,
  placeOrder,
  fetchOrderHistory,
  getEstimatedDeliveryTime,
  generateMockMenu
};