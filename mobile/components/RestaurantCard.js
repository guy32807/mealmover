import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const RestaurantCard = ({ restaurant }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.distance}>{restaurant.distance} miles away</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cuisine: {
        fontSize: 14,
        color: '#777',
    },
    distance: {
        fontSize: 12,
        color: '#555',
    },
});

export default RestaurantCard;