import React, { useState, useContext, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Animated
} from 'react-native';
import { 
  Appbar, 
  Text, 
  Chip, 
  Button, 
  Divider, 
  Card, 
  Title, 
  Paragraph,
  Badge,
  useTheme,
  Snackbar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CartContext } from '../contexts/CartContext';
import { generateMockMenu } from '../services/restaurantService';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const theme = useTheme();
  const { addToCart } = useContext(CartContext);
  
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState(restaurant.menu || generateMockMenu(restaurant.cuisine));
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  const handleAddItem = (item) => {
    addToCart(item, restaurant);
    setSnackbarMessage(`Added ${item.name} to cart`);
    setVisibleSnackbar(true);
  };
  
  const renderMenuItem = ({ item }) => (
    <Card style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemInfo}>
          <Title style={styles.menuItemTitle}>
            {item.name}
            {item.popular && <Chip style={styles.popularChip} textStyle={styles.smallText}>Popular</Chip>}
          </Title>
          <Paragraph numberOfLines={2} style={styles.menuItemDesc}>
            {item.description}
          </Paragraph>
          <View style={styles.menuItemFooter}>
            <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
            <View style={styles.tagsContainer}>
              {item.vegetarian && <Chip style={styles.vegChip} textStyle={styles.smallText}>Veg</Chip>}
              {item.spicy && <Chip style={styles.spicyChip} textStyle={styles.smallText}>Spicy</Chip>}
            </View>
          </View>
        </View>
        <View style={styles.menuItemImageContainer}>
          <Image 
            source={{ uri: item.image || `https://source.unsplash.com/random/100x100/?food,${item.name.toLowerCase().replace(/\s/g, '-')}` }} 
            style={styles.menuItemImage} 
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleAddItem(item)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Appbar.Header statusBarHeight={0} style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title={restaurant.name} 
          titleStyle={[styles.headerTitle, { opacity: titleOpacity }]} 
        />
        <Appbar.Action icon="heart-outline" onPress={() => {}} />
        <Appbar.Action icon="share-variant-outline" onPress={() => {}} />
      </Appbar.Header>
      
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Restaurant Header */}
        <Animated.View 
          style={[
            styles.restaurantHeader, 
            { height: headerHeight, opacity: headerOpacity }
          ]}
        >
          <Image source={{ uri: restaurant.image }} style={styles.coverImage} />
          <View style={styles.restaurantOverlay}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.restaurantMeta}>
              <Chip 
                icon="silverware-fork-knife" 
                style={styles.metaChip}
              >{restaurant.cuisine}</Chip>
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
              </View>
              <Chip 
                icon="cash" 
                style={styles.metaChip}
              >{"$".repeat(restaurant.priceRange)}</Chip>
            </View>
          </View>
        </Animated.View>
        
        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryItem}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.deliveryText}>{restaurant.deliveryTime} min</Text>
          </View>
          <View style={styles.deliveryDivider} />
          <View style={styles.deliveryItem}>
            <Ionicons name="bicycle-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.deliveryText}>${restaurant.deliveryFee.toFixed(2)} delivery</Text>
          </View>
          <View style={styles.deliveryDivider} />
          <View style={styles.deliveryItem}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.deliveryText}>${restaurant.minimumOrder} min</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]} 
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'menu' && { color: theme.colors.primary, fontWeight: 'bold' }
            ]}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'info' && styles.activeTab]} 
            onPress={() => setActiveTab('info')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'info' && { color: theme.colors.primary, fontWeight: 'bold' }
            ]}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]} 
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'reviews' && { color: theme.colors.primary, fontWeight: 'bold' }
            ]}>Reviews</Text>
          </TouchableOpacity>
        </View>
        
        <Divider />
        
        {/* Content based on active tab */}
        {activeTab === 'menu' && (
          <View style={styles.menuContainer}>
            {Object.keys(menuByCategory).map(category => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <FlatList
                  data={menuByCategory[category]}
                  renderItem={renderMenuItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              </View>
            ))}
          </View>
        )}
        
        {activeTab === 'info' && (
          <View style={styles.infoContainer}>
            <Card style={styles.infoCard}>
              <Card.Content>
                <Title>Hours</Title>
                <Paragraph style={styles.infoParagraph}>{restaurant.openingHours}</Paragraph>
                
                <Title style={styles.infoTitle}>Address</Title>
                <Paragraph style={styles.infoParagraph}>{restaurant.address}</Paragraph>
                
                <Title style={styles.infoTitle}>Phone</Title>
                <Paragraph style={styles.infoParagraph}>{restaurant.phone}</Paragraph>
                
                <Title style={styles.infoTitle}>Website</Title>
                <Paragraph style={styles.infoParagraph}>{restaurant.website}</Paragraph>
                
                <Title style={styles.infoTitle}>About</Title>
                <Paragraph style={styles.infoParagraph}>{restaurant.description}</Paragraph>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {activeTab === 'reviews' && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.comingSoon}>Reviews coming soon!</Text>
          </View>
        )}
      </Animated.ScrollView>
      
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={2000}
        action={{
          label: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    elevation: 0,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  restaurantHeader: {
    height: HEADER_MAX_HEIGHT,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  restaurantOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  restaurantName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaChip: {
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  deliveryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  menuContainer: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuItem: {
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  popularChip: {
    backgroundColor: '#E3F2FD',
    height: 24,
    marginLeft: 8,
  },
  vegChip: {
    backgroundColor: '#E8F5E9',
    height: 24,
    marginRight: 4,
  },
  spicyChip: {
    backgroundColor: '#FFEBEE',
    height: 24,
  },
  smallText: {
    fontSize: 10,
  },
  menuItemImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: -12,
    right: -12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    marginTop: 16,
  },
  infoParagraph: {
    marginBottom: 8,
  },
  reviewsContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  comingSoon: {
    fontSize: 18,
    color: 'gray',
  },
});

export default RestaurantDetailScreen;