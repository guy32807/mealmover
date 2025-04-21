import React, { useContext, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { 
  Text, 
  Appbar, 
  Divider, 
  List, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  ActivityIndicator,
  useTheme
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import EmptyState from '../components/EmptyState';

const CartScreen = ({ navigation }) => {
  const theme = useTheme();
  const { cart, restaurant, addToCart, removeFromCart, clearCart, getCartTotals } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  
  const { subtotal, deliveryFee, serviceFee, tax, total, itemCount } = getCartTotals();
  
  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign in Required",
        "Please sign in to place an order",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Sign In", 
            onPress: () => navigation.navigate('Auth', { screen: 'Login' }) 
          }
        ]
      );
      return;
    }
    
    if (!restaurant || cart.length === 0) {
      return;
    }
    
    // Add confirmation dialog
    Alert.alert(
      "Confirm Order",
      `Place order for $${total.toFixed(2)} from ${restaurant.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Place Order", 
          onPress: () => processOrder() 
        }
      ]
    );
  };
  
  const processOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order object
      const order = {
        id: `ord-${Date.now()}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: [...cart],
        subtotal,
        deliveryFee,
        serviceFee,
        tax,
        total,
        status: 'confirmed',
        deliveryAddress: user.address || '123 Main St',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + restaurant.deliveryTime * 60000).toISOString()
      };
      
      // Clear cart
      clearCart();
      
      // Navigate to order success screen
      navigation.navigate('OrderSuccess', { order });
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem processing your order. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (!restaurant || cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="My Cart" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        
        <EmptyState 
          icon="cart-outline"
          title="Your cart is empty"
          description="Add items from a restaurant to get started"
          buttonText="Browse Restaurants"
          onButtonPress={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Cart" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon="delete-outline" 
          onPress={() => {
            Alert.alert(
              "Clear Cart",
              "Are you sure you want to clear all items?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { 
                  text: "Clear", 
                  onPress: () => clearCart(),
                  style: "destructive" 
                }
              ]
            );
          }} 
        />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* Restaurant Info */}
        <Card style={styles.restaurantCard}>
          <Card.Title title={restaurant.name} />
          <Card.Content>
            <Text style={styles.restaurantInfo}>
              {restaurant.cuisine} • {restaurant.deliveryTime} min • ${restaurant.deliveryFee.toFixed(2)} delivery
            </Text>
          </Card.Content>
        </Card>
        
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Items</Text>
          
          {cart.map((item) => (
            <View key={`${item.id}-${item.options?.join('-') || ''}`} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                {item.options && item.options.length > 0 && (
                  <Text style={styles.itemOptions}>{item.options.join(', ')}</Text>
                )}
              </View>
              
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => removeFromCart(item)}
                >
                  <Ionicons name="remove" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => addToCart(item)}
                >
                  <Ionicons name="add" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        {/* Order Summary */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Service Fee</Text>
            <Text>${serviceFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Tax</Text>
            <Text>${tax.toFixed(2)}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          style={styles.checkoutButton}
          labelStyle={styles.checkoutButtonText}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.onPrimary} size="small" />
          ) : (
            `Checkout • $${total.toFixed(2)}`
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  restaurantCard: {
    margin: 16,
  },
  restaurantInfo: {
    color: 'gray',
  },
  itemsContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemPrice: {
    color: 'gray',
  },
  itemOptions: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkoutButton: {
    height: 50,
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CartScreen;
