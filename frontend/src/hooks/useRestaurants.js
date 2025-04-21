import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import config from '../config';

const fetchRestaurants = async ({ location, filters }) => {
  const { lat, lng } = location;
  const { priceRange, rating, cuisines, openNow, keyword } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('minPrice', priceRange[0]);
  params.append('maxPrice', priceRange[1]);
  params.append('rating', rating);
  if (cuisines.length > 0) {
    cuisines.forEach(cuisine => params.append('cuisine', cuisine));
  }
  if (openNow) {
    params.append('openNow', true);
  }
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  const response = await axios.get(`${config.API_URL}/restaurants?${params.toString()}`);
  return response.data;
};

export const useRestaurants = (location, filters) => {
  return useQuery(
    ['restaurants', location, filters],
    () => fetchRestaurants({ location, filters }),
    {
      enabled: !!location.lat && !!location.lng,
      staleTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useRestaurantDetails = (restaurantId) => {
  return useQuery(
    ['restaurant', restaurantId],
    async () => {
      const response = await axios.get(`${config.API_URL}/restaurants/${restaurantId}`);
      return response.data;
    },
    {
      enabled: !!restaurantId,
      staleTime: 600000, // 10 minutes
    }
  );
};