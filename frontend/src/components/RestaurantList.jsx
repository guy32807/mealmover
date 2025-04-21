import React from 'react';
import { Grid, Box, Typography, Pagination } from '@mui/material';
import RestaurantCard from './RestaurantCard';
import './RestaurantList.css';

const RestaurantList = ({ restaurants = [], onRestaurantSelect }) => {
    const [page, setPage] = React.useState(1);
    const restaurantsPerPage = 6;
    
    if (!restaurants || restaurants.length === 0) {
        return <Typography variant="body1">No restaurants found.</Typography>;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(restaurants.length / restaurantsPerPage);
    const startIndex = (page - 1) * restaurantsPerPage;
    const displayedRestaurants = restaurants.slice(startIndex, startIndex + restaurantsPerPage);
    
    const handlePageChange = (event, value) => {
        setPage(value);
        // Scroll to top when changing page
        window.scrollTo({
            top: document.getElementById('restaurant-list-top').offsetTop - 20,
            behavior: 'smooth'
        });
    };

    return (
        <Box id="restaurant-list-top">
            <Grid container spacing={3}>
                {displayedRestaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                        <RestaurantCard 
                            restaurant={{
                                ...restaurant,
                                id: restaurant.id.toString(),
                                location: restaurant.location || {
                                    lat: restaurant.lat || 37.7749,
                                    lng: restaurant.lng || -122.4194
                                }
                            }}
                            onRestaurantSelect={onRestaurantSelect}
                        />
                    </Grid>
                ))}
            </Grid>
            
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
};

export default RestaurantList;