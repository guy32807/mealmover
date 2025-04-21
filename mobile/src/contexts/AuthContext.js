import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../services/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user from storage
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const foundUser = mockUsers.find(
        user => user.email === email && user.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password for security
      const { password: _, ...secureUser } = foundUser;
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(secureUser));
      
      setUser(secureUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with email already exists
      const existingUser = mockUsers.find(user => user.email === userData.email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        avatar: 'https://source.unsplash.com/random/100x100/?portrait'
      };
      
      // Remove password for security
      const { password: _, ...secureUser } = newUser;
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(secureUser));
      
      setUser(secureUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const updateProfile = async (updates) => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...updates };
      
      // Save updated user to storage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;