import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("Loading location...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          // Default to San Francisco if permission denied
          setLocation({
            latitude: 37.7749,
            longitude: -122.4194,
          });
          setAddress("San Francisco, CA");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // Reverse geocode to get address
        let geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const { city, region } = geocode[0];
          setAddress(`${city}, ${region}`);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg('Error getting location');
        // Use default location
        setLocation({
          latitude: 37.7749,
          longitude: -122.4194,
        });
        setAddress("San Francisco, CA");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateLocation = async (newLocation) => {
    try {
      setLoading(true);
      setLocation(newLocation);
      
      // Reverse geocode to get address
      let geocode = await Location.reverseGeocodeAsync({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });

      if (geocode && geocode.length > 0) {
        const { city, region } = geocode[0];
        setAddress(`${city}, ${region}`);
      }
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        errorMsg, 
        address, 
        loading, 
        updateLocation 
      }}>
      {children}
    </LocationContext.Provider>
  );
};