import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  
  // Load cart from storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        const restaurantData = await AsyncStorage.getItem('restaurant');
        
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
        
        if (restaurantData) {
          setRestaurant(JSON.parse(restaurantData));
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to storage when it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        if (restaurant) {
          await AsyncStorage.setItem('restaurant', JSON.stringify(restaurant));
        }
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };
    
    saveCart();
  }, [cart, restaurant]);
  
  const addToCart = (item, newRestaurant = null) => {
    // If adding item from a different restaurant
    if (newRestaurant && restaurant && newRestaurant.id !== restaurant.id && cart.length > 0) {
      Alert.alert(
        "Start New Order?",
        `Your cart contains items from ${restaurant.name}. Would you like to clear your cart and start a new order from ${newRestaurant.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Clear Cart",
            onPress: () => {
              setCart([{ ...item, quantity: 1 }]);
              setRestaurant(newRestaurant);
            }
          }
        ]
      );
      return;
    }
    
    // Update restaurant if needed
    if (newRestaurant && (!restaurant || restaurant.id !== newRestaurant.id)) {
      setRestaurant(newRestaurant);
    }
    
    // Check if item exists in cart
    const existingItemIndex = cart.findIndex(
      cartItem => 
        cartItem.id === item.id &&
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (item) => {
    const existingItemIndex = cart.findIndex(
      cartItem => 
        cartItem.id === item.id &&
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
    );
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      
      if (updatedCart[existingItemIndex].quantity > 1) {
        // Decrement quantity
        updatedCart[existingItemIndex].quantity -= 1;
        setCart(updatedCart);
      } else {
        // Remove item if quantity is 1
        updatedCart.splice(existingItemIndex, 1);
        setCart(updatedCart);
        
        // Clear restaurant if cart is empty
        if (updatedCart.length === 0) {
          setRestaurant(null);
        }
      }
    }
  };
  
  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
  };
  
  const getCartTotals = () => {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + serviceFee + tax;
    
    return {
      itemCount,
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      total
    };
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        restaurant,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotals
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;