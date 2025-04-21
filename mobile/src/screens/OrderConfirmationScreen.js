import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Linking
} from 'react-native';
import { 
  Text, 
  Appbar, 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  Divider,
  Surface,
  ActivityIndicator,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';

const DELIVERY_STAGES = [
  { id: 'confirmed', label: 'Order Confirmed', icon: 'checkmark-circle' },
  { id: 'preparing', label: 'Preparing Your Food', icon: 'restaurant' },
  { id: 'picked-up', label: 'Out for Delivery', icon: 'bicycle' },
  { id: 'delivered', label: 'Delivered', icon: 'home' }
];

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderDetails } = route.params;
  const theme = useTheme();
  const [currentStage, setCurrentStage] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(orderDetails.estimatedDelivery);
  const [driverLocation, setDriverLocation] = useState(null);
  
  // Fake the order progress for the demo
  useEffect(() => {
    // Stage 1: Order confirmed (already set)
    // Stage 2: Preparing
    const preparingTimeout = setTimeout(() => {
      setCurrentStage(1);
    }, 5000);
    
    // Stage 3: Out for delivery
    const deliveryTimeout = setTimeout(() => {
      setCurrentStage(2);
      simulateDriverMovement();
    }, 10000);
    
    // Stage 4: Delivered
    const deliveredTimeout = setTimeout(() => {
      setCurrentStage(3);
    }, orderDetails.estimatedDelivery * 1000);
    
    return () => {
      clearTimeout(preparingTimeout);
      clearTimeout(deliveryTimeout);
      clearTimeout(deliveredTimeout);
    };
  }, []);
  
  const simulateDriverMovement = () => {
    // Set initial driver location (restaurant location with slight offset)
    const restaurantLocation = {
      latitude: orderDetails.restaurant.location.lat + 0.002,
      longitude: orderDetails.restaurant.location.lng - 0.001,
    };
    
    setDriverLocation(restaurantLocation);
    
    // Simulate driver movement
    let step = 0;
    const totalSteps = 20;
    
    const deliveryAddress = orderDetails.deliveryAddress;
    const destination = {
      latitude: deliveryAddress.latitude || 37.78825,  // Default if not available
      longitude: deliveryAddress.longitude || -122.4324
    };
    
    const latDiff = (destination.latitude - restaurantLocation.latitude) / totalSteps;
    const lngDiff = (destination.longitude - restaurantLocation.longitude) / totalSteps;
    
    const interval = setInterval(() => {
      step++;
      
      if (step <= totalSteps) {
        setDriverLocation({
          latitude: restaurantLocation.latitude + (latDiff * step),
          longitude: restaurantLocation.longitude + (lngDiff * step)
        });
        
        // Update estimated time
        const remainingTime = Math.max(1, Math.floor((orderDetails.estimatedDelivery * (totalSteps - step)) / totalSteps));
        setEstimatedTime(remainingTime);
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };
  
  const goToHomeScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };
  
  const callRestaurant = () => {
    Linking.openURL(`tel:${orderDetails.restaurant.phone}`);
  };
  
  const getCurrentStageText = () => {
    switch (currentStage) {
      case 0:
        return 'Your order has been confirmed and the restaurant is being notified.';
      case 1:
        return 'The restaurant is preparing your delicious meal.';
      case 2:
        return `Your food is on the way! Estimated delivery in ${estimatedTime} minutes.`;
      case 3:
        return 'Your order has been delivered. Enjoy your meal!';
      default:
        return '';
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Appbar.Header statusBarHeight={0} style={styles.header}>
        <Appbar.Content title="Order Confirmation" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="home" onPress={goToHomeScreen} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.orderNumberRow}>
              <Title>Order #{orderDetails.id.split('-')[1]}</Title>
              <Chip style={[styles.statusChip, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.statusText}>{orderDetails.status}</Text>
              </Chip>
            </View>
            
            <Text style={styles.statusDescription}>
              {getCurrentStageText()}
            </Text>
            
            <View style={styles.progressTracker}>
              {DELIVERY_STAGES.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <View style={styles.stageContainer}>
                    <View style={[
                      styles.stageIcon,
                      { 
                        backgroundColor: index <= currentStage 
                          ? theme.colors.primary 
                          : '#e0e0e0'
                      }
                    ]}>
                      <Ionicons 
                        name={stage.icon} 
                        size={22} 
                        color="white" 
                      />
                    </View>
                    <Text style={[
                      styles.stageLabel,
                      { 
                        color: index <= currentStage 
                          ? theme.colors.primary 
                          : '#757575',
                        fontWeight: index === currentStage ? 'bold' : 'normal'
                      }
                    ]}>
                      {stage.label}
                    </Text>
                  </View>
                  
                  {index < DELIVERY_STAGES.length - 1 && (
                    <View style={[
                      styles.stageLine,
                      { 
                        backgroundColor: index < currentStage 
                          ? theme.colors.primary 
                          : '#e0e0e0'
                      }
                    ]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </Card.Content>
        </Card>
        
        {currentStage >= 2 && (
          <Card style={styles.mapCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Delivery Tracking</Title>
              
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: driverLocation?.latitude || orderDetails.restaurant.location.lat,
                    longitude: driverLocation?.longitude || orderDetails.restaurant.location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                >
                  {/* Restaurant Marker */}
                  <Marker
                    coordinate={{
                      latitude: orderDetails.restaurant.location.lat,
                      longitude: orderDetails.restaurant.location.lng
                    }}
                    title={orderDetails.restaurant.name}
                    description="Restaurant location"
                  >
                    <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
                  </Marker>
                  
                  {/* Delivery Address Marker */}
                  <Marker
                    coordinate={{
                      latitude: orderDetails.deliveryAddress.latitude || 37.78825,
                      longitude: orderDetails.deliveryAddress.longitude || -122.4324
                    }}
                    title="Delivery Address"
                    description={orderDetails.deliveryAddress.street}
                  >
                    <Ionicons name="home" size={24} color={theme.colors.accent} />
                  </Marker>
                  
                  {/* Driver Marker */}
                  {driverLocation && (
                    <Marker
                      coordinate={driverLocation}
                      title="Driver"
                      description="Your order is on the way"
                    >
                      <View style={styles.driverMarker}>
                        <Ionicons name="bicycle" size={18} color="white" />
                      </View>
                    </Marker>
                  )}
                </MapView>
              </View>
              
              <View style={styles.etaContainer}>
                <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.etaText}>
                  Estimated delivery: {estimatedTime} minutes
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
        
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Order Details</Title>
            
            <View style={styles.restaurantRow}>
              <Image 
                source={{ uri: orderDetails.restaurant.image }} 
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{orderDetails.restaurant.name}</Text>
                <Text style={styles.restaurantAddress}>
                  {orderDetails.restaurant.address}
                </Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Your Items</Text>
            
            {orderDetails.items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemDetails}>
                  <Text>{item.quantity} x {item.name}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              </View>
            ))}
            
            <Divider style={styles.divider} />
            
            <View style={styles.paymentSummary}>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>${orderDetails.subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text>Delivery Fee</Text>
                <Text>${orderDetails.deliveryFee.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text>Service Fee</Text>
                <Text>${orderDetails.serviceFee.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text>Tax</Text>
                <Text>${orderDetails.tax.toFixed(2)}</Text>
              </View>
              
              <Divider style={styles.summaryDivider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>${orderDetails.total.toFixed(2)}</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} style={styles.addressIcon} />
              <View>
                <Text style={styles.addressLabel}>{orderDetails.deliveryAddress.label}</Text>
                <Text>{orderDetails.deliveryAddress.street}</Text>
                <Text>
                  {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state} {orderDetails.deliveryAddress.zip}
                </Text>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                icon="phone" 
                onPress={callRestaurant}
                style={styles.contactButton}
              >
                Contact Restaurant
              </Button>
              
              <Button 
                mode="outlined" 
                icon="chat" 
                onPress={() => {}}
                style={styles.supportButton}
              >
                Get Support
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  statusCard: {
    margin: 16,
    marginBottom: 8,
  },
  orderNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusDescription: {
    marginBottom: 24,
  },
  progressTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  stageContainer: {
    alignItems: 'center',
    width: 60,
  },
  stageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  stageLine: {
    flex: 1,
    height: 2,
    marginHorizontal: -5,
  },
  mapCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    backgroundColor: '#2196f3',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
  },
  etaText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  detailsCard: {
    margin: 16,
    marginTop: 8,
  },
  restaurantRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  restaurantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  restaurantAddress: {
    color: 'gray',
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderItem: {
    marginBottom: 8,
  },
  orderItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  paymentSummary: {
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryDivider: {
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addressIcon: {
    marginRight: 12,
  },
  addressLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  supportButton: {
    flex: 1,
    marginLeft: 8,
  }
});

export default OrderConfirmationScreen;