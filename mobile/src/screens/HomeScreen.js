import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { 
  Appbar, 
  Searchbar, 
  Chip, 
  Text, 
  ActivityIndicator,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import RestaurantCard from '../components/RestaurantCard';
import { getRestaurants } from '../services/api';

const cuisineFilters = [
  'All', 
  'Italian', 
  'Japanese', 
  'Chinese', 
  'Mexican', 
  'Indian', 
  'Thai', 
  'American', 
  'French'
];

const sortOptions = [
  { label: 'Fastest Delivery', value: 'delivery' },
  { label: 'Rating', value: 'rating' },
  { label: 'Distance', value: 'distance' }
];

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedSort, setSelectedSort] = useState('delivery');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [selectedCuisine, searchQuery, selectedSort, restaurants]);
  
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const data = await getRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const applyFilters = () => {
    let results = [...restaurants];
    
    // Apply cuisine filter
    if (selectedCuisine !== 'All') {
      results = results.filter(restaurant => 
        restaurant.cuisine === selectedCuisine
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        restaurant.cuisine.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Apply sorting
    switch (selectedSort) {
      case 'delivery':
        results.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        // For now, just use a simple sort by deliveryTime as a proxy for distance
        results.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
    }
    
    setFilteredRestaurants(results);
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search restaurants or cuisines"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cuisineFilters}
      >
        {cuisineFilters.map(cuisine => (
          <Chip
            key={cuisine}
            selected={selectedCuisine === cuisine}
            onPress={() => setSelectedCuisine(cuisine)}
            style={styles.cuisineChip}
            selectedColor={theme.colors.primary}
          >
            {cuisine}
          </Chip>
        ))}
      </ScrollView>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortOptions}
        >
          {sortOptions.map(option => (
            <Chip
              key={option.value}
              selected={selectedSort === option.value}
              onPress={() => setSelectedSort(option.value)}
              style={styles.sortChip}
              selectedColor={theme.colors.primary}
            >
              {option.label}
            </Chip>
          ))}
        </ScrollView>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Appbar.Header statusBarHeight={0} style={styles.appbar}>
        <Appbar.Content title="MealMover" titleStyle={styles.appbarTitle} />
        <Appbar.Action 
          icon={props => <Ionicons name="notifications-outline" {...props} />} 
          onPress={() => {}} 
        />
      </Appbar.Header>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          renderItem={({ item }) => (
            <RestaurantCard 
              restaurant={item} 
              onPress={() => navigation.navigate('Restaurant', { restaurant: item })}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="gray" />
              <Text style={styles.emptyText}>No restaurants found</Text>
              <Text style={styles.emptySubtext}>Try changing your search or filters</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appbar: {
    backgroundColor: 'white',
    elevation: 2,
  },
  appbarTitle: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingBottom: 16,
    marginBottom: 8,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  cuisineFilters: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cuisineChip: {
    marginRight: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sortLabel: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  sortOptions: {
    paddingVertical: 8,
  },
  sortChip: {
    marginRight: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: 'gray',
    marginTop: 8,
    textAlign: 'center',
  }
});

export default HomeScreen;