import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import firebase from '../firebase';

const DetailsScreen = () => {
    const route = useRoute();
    const { restaurantId } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const restaurantRef = firebase.firestore().collection('restaurants').doc(restaurantId);
                const doc = await restaurantRef.get();
                if (doc.exists) {
                    setRestaurant(doc.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error("Error fetching restaurant details: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={styles.errorContainer}>
                <Text>No restaurant found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: restaurant.location.latitude,
                    longitude: restaurant.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: restaurant.location.latitude,
                        longitude: restaurant.location.longitude,
                    }}
                    title={restaurant.name}
                    description={restaurant.cuisine}
                />
            </MapView>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    cuisine: {
        fontSize: 18,
        color: 'gray',
    },
    description: {
        fontSize: 16,
        marginVertical: 8,
    },
    map: {
        width: '100%',
        height: 300,
        marginVertical: 16,
    },
});

export default DetailsScreen;