import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    const savedAddresses = localStorage.getItem('addresses');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (orders.length) localStorage.setItem('orders', JSON.stringify(orders));
    if (addresses.length) localStorage.setItem('addresses', JSON.stringify(addresses));
    if (favorites.length) localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [user, orders, addresses, favorites]);
  
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'placed'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };
  
  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `address-${Date.now()}`
    };
    
    setAddresses(prev => [newAddress, ...prev]);
    return newAddress;
  };
  
  const toggleFavorite = (restaurantId) => {
    if (favorites.includes(restaurantId)) {
      setFavorites(prev => prev.filter(id => id !== restaurantId));
      return false;
    } else {
      setFavorites(prev => [...prev, restaurantId]);
      return true;
    }
  };
  
  const isFavorite = (restaurantId) => {
    return favorites.includes(restaurantId);
  };
  
  const contextValue = {
    user,
    setUser,
    orders,
    addOrder,
    addresses,
    addAddress,
    toggleFavorite,
    isFavorite,
    favorites
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;