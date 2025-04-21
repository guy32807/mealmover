import { mockRestaurants, mockMenus, mockOrders } from './mockData';

// Simulated API delay
const apiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch restaurants with optional filtering
 */
export const getRestaurants = async (params = {}) => {
  await apiDelay();
  
  let restaurants = [...mockRestaurants];
  
  // Apply filters if provided
  if (params.cuisine) {
    restaurants = restaurants.filter(r => r.cuisine === params.cuisine);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    restaurants = restaurants.filter(r => 
      r.name.toLowerCase().includes(searchLower) || 
      r.cuisine.toLowerCase().includes(searchLower)
    );
  }
  
  if (params.priceRange) {
    restaurants = restaurants.filter(r => params.priceRange.includes(r.priceRange));
  }
  
  if (params.rating) {
    restaurants = restaurants.filter(r => r.rating >= params.rating);
  }
  
  return restaurants;
};

/**
 * Fetch a single restaurant by ID
 */
export const getRestaurant = async (id) => {
  await apiDelay();
  return mockRestaurants.find(r => r.id === id);
};

/**
 * Fetch menu items for a restaurant
 */
export const getRestaurantMenu = async (restaurantId) => {
  await apiDelay();
  return mockMenus[restaurantId] || [];
};

/**
 * Fetch order history for a user
 */
export const getUserOrders = async (userId) => {
  await apiDelay();
  return mockOrders.filter(order => order.userId === userId);
};

/**
 * Place a new order
 */
export const placeOrder = async (orderData) => {
  await apiDelay(1500);  // Longer delay to simulate order processing
  
  const newOrder = {
    id: 'order-' + Math.floor(Math.random() * 1000000),
    ...orderData,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // In a real app, we would send this to a server
  mockOrders.push(newOrder);
  
  return newOrder;
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId) => {
  await apiDelay();
  return mockOrders.find(order => order.id === orderId);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, userData) => {
  await apiDelay();
  // In a real app, we would send this to a server
  return { success: true, user: userData };
};

export default {
  getRestaurants,
  getRestaurant,
  getRestaurantMenu,
  getUserOrders,
  placeOrder,
  getOrder,
  updateUserProfile
};