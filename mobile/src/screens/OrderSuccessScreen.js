import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Button, 
  Appbar, 
  Card, 
  Title, 
  List, 
  Divider,
  ProgressBar,
  useTheme
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const theme = useTheme();
  
  // Prevent going back to cart
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  const calculateProgress = () => {
    const now = new Date();
    const orderDate = new Date(order.orderDate);
    const estimatedDelivery = new Date(order.estimatedDelivery);
    
    const totalTime = estimatedDelivery - orderDate;
    const elapsed = now - orderDate;
    
    let progress = Math.min(elapsed / totalTime, 0.99);
    
    // If order is completed, show full progress
    if (order.status === 'delivered') {
      progress = 1;
    }
    
    return progress;
  };
  
  const getStatusText = () => {
    switch(order.status) {
      case 'confirmed':
        return 'Order confirmed';
      case 'preparing':
        return 'Restaurant is preparing your food';
      case 'ready':
        return 'Food is ready for pickup';
      case 'in-progress':
        return 'Driver is on the way';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Order placed';
    }
  };
  
  const getDeliveryTime = () => {
    if (order.status === 'delivered') {
      return formatDate(order.deliveryDate);
    }
    return formatDate(order.estimatedDelivery);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="home" onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Order Confirmed" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.successContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={80} 
            color={theme.colors.primary} 
            style={styles.icon} 
          />
          <Text style={styles.thankYouText}>Thank you for your order!</Text>
          <Text style={styles.orderIdText}>Order #{order.id.split('-')[1]}</Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Delivery Status</Title>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
              <Text style={styles.deliveryTimeText}>
                Estimated delivery: {getDeliveryTime()}
              </Text>
              <ProgressBar 
                progress={calculateProgress()} 
                color={theme.colors.primary} 
                style={styles.progressBar} 
              />
              <View style={styles.deliveryStepsContainer}>
                <Text style={styles.deliveryStepText}>Confirmed</Text>
                <Text style={styles.deliveryStepText}>Preparing</Text>
                <Text style={styles.deliveryStepText}>On the way</Text>
                <Text style={styles.deliveryStepText}>Delivered</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Order Details</Title>
            <Text style={styles.restaurantName}>{order.restaurantName}</Text>
            <Divider style={styles.divider} />
            
            <List.Section>
              {order.items.map((item) => (
                <List.Item
                  key={`${item.id}-${item.quantity}`}
                  title={item.name}
                  description={`$${item.price.toFixed(2)} x ${item.quantity}`}
                  right={() => (
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  )}
                />
              ))}
            </List.Section>
            
            <Divider style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>${order.subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>Delivery Fee</Text>
              <Text>${order.deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>Service Fee</Text>
              <Text>${order.serviceFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>Tax</Text>
              <Text>${order.tax.toFixed(2)}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>${order.total.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Delivery Information</Title>
            <View style={styles.deliveryInfoRow}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.deliveryInfoText}>{order.deliveryAddress}</Text>
            </View>
            
            <View style={styles.deliveryInfoRow}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.deliveryInfoText}>
                Ordered at {formatDate(order.orderDate)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          Back to Home
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.button}
        >
          View All Orders
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
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 16,
    color: 'gray',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  statusContainer: {
    marginTop: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deliveryTimeText: {
    fontSize: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  deliveryStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryStepText: {
    fontSize: 12,
    color: 'gray',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  deliveryInfoText: {
    marginLeft: 16,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    marginVertical: 8,
  }
});

export default OrderSuccessScreen;