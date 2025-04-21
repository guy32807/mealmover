import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import MapView from '../components/MapView';
import { fetchRestaurants } from '../services/apiService'; // Assume this service fetches data from the backend

const HomeScreen = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                const data = await fetchRestaurants();
                setRestaurants(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadRestaurants();
    }, []);

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView restaurants={restaurants} />
            <FlatList
                data={restaurants}
                renderItem={({ item }) => <RestaurantCard restaurant={item} />}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

export default HomeScreen;