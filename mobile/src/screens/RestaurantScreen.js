import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { 
  Text, 
  Appbar, 
  Chip, 
  Divider, 
  Button,
  List,
  Surface,
  useTheme,
  Badge
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CartContext } from '../contexts/CartContext';
import MenuItem from '../components/MenuItem';
import RestaurantInfo from '../components/RestaurantInfo';
import { getRestaurantMenu } from '../services/api';

const RestaurantScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const theme = useTheme();
  const { cart, restaurant: cartRestaurant, addToCart } = useContext(CartContext);
  
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [categories, setCategories] = useState([]);
  const [categoryScrollPositions, setCategoryScrollPositions] = useState({});
  const scrollViewRef = useRef(null);
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [200, 60],
    extrapolate: 'clamp'
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const titlePosition = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [35, 18],
    extrapolate: 'clamp'
  });
  
  const titleSize = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [24, 18],
    extrapolate: 'clamp'
  });
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getRestaurantMenu(restaurant.id);
        setMenuItems(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    
    fetchMenu();
  }, [restaurant.id]);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    // Scroll to the category section
    if (categoryScrollPositions[category] && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: categoryScrollPositions[category] - 100, // Offset for header
        animated: true
      });
    }
  };
  
  const handleAddToCart = (item) => {
    // Check if adding from a different restaurant
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      Alert.alert(
        "Start New Cart?",
        "Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Clear Cart", 
            onPress: () => {
              clearCart();
              const result = addToCart(item, restaurant);
              if (result.success) {
                setCartNotification(true);
                setTimeout(() => setCartNotification(false), 2000);
              }
            }
          }
        ]
      );
      return;
    }
    
    const result = addToCart(item, restaurant);
    if (result.success) {
      setCartNotification(true);
      setTimeout(() => setCartNotification(false), 2000);
    } else if (result.error) {
      Alert.alert("Error", result.error);
    }
  };
  
  const handleLayoutCategory = (category, event) => {
    const layout = event.nativeEvent.layout;
    setCategoryScrollPositions(prev => ({
      ...prev,
      [category]: layout.y
    }));
  };
  
  const renderMenuItemsByCategory = () => {
    return categories.map(category => (
      <View 
        key={category} 
        style={styles.categorySection}
        onLayout={(event) => handleLayoutCategory(category, event)}
      >
        <Text style={styles.categoryTitle}>{category}</Text>
        
        {menuItems
          .filter(item => item.category === category)
          .map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onAddToCart={() => handleAddToCart(item)} 
            />
          ))
        }
      </View>
    ));
  };
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: restaurant.image }}
          style={[styles.headerImage, { opacity: imageOpacity }]}
          resizeMode="cover"
        />
        
        <View style={styles.headerOverlay} />
        
        <Appbar.BackAction 
          color="white" 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        />
        
        <Animated.Text 
          style={[
            styles.restaurantName, 
            { 
              bottom: titlePosition,
              fontSize: titleSize
            }
          ]}
        >
          {restaurant.name}
        </Animated.Text>
        
        <Animated.View 
          style={[
            styles.headerInfo, 
            { 
              opacity: imageOpacity
            }
          ]}
        >
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          
          <Chip style={styles.cuisineChip}>{restaurant.cuisine}</Chip>
          
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={16} color="white" />
            <Text style={styles.deliveryText}>{restaurant.deliveryTime} min</Text>
          </View>
        </Animated.View>
      </Animated.View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.content}>
          <Surface style={styles.categoriesContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map(category => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onPress={() => handleCategorySelect(category)}
                  style={styles.categoryChip}
                  selectedColor={theme.colors.primary}
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>
          </Surface>
          
          <View style={styles.infoCard}>
            <RestaurantInfo restaurant={restaurant} />
          </View>
          
          <Divider />
          
          <View style={styles.menuContainer}>
            {renderMenuItemsByCategory()}
          </View>
        </View>
      </ScrollView>
      
      {cartItemCount > 0 && (
        <TouchableOpacity 
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartButtonContent}>
            <Badge size={24} style={styles.cartBadge}>{cartItemCount}</Badge>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Text style={styles.cartTotal}>
              ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  restaurantName: {
    position: 'absolute',
    left: 16,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerInfo: {
    position: 'absolute',
    left: 16,
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  cuisineChip: {
    marginRight: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryText: {
    color: 'white',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 80, // Space for the View Cart button
  },
  categoriesContainer: {
    backgroundColor: 'white',
    elevation: 2,
    zIndex: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    marginRight: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartBadge: {
    backgroundColor: 'white',
    color: '#4caf50',
  },
  viewCartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartTotal: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default RestaurantScreen;