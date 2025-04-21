import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const MapViewComponent = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const response = await axios.get(`YOUR_BACKEND_URL/restaurants?lat=${location.coords.latitude}&lng=${location.coords.longitude}`);
            setRestaurants(response.data);
        };

        fetchRestaurants();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
            >
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant._id}
                        coordinate={{
                            latitude: restaurant.location.coordinates[1],
                            longitude: restaurant.location.coordinates[0],
                        }}
                        title={restaurant.name}
                        description={restaurant.cuisine}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default MapViewComponent;