import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, IconButton,
  Grid, Chip, Rating, Divider, Tabs, Tab, List, ListItem, ListItemText, Badge,
  Card, CardMedia, CardContent, TextField, Stepper, Step, StepLabel, Paper,
  Alert, CircularProgress, Snackbar, InputAdornment, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoIcon from '@mui/icons-material/Info';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { generateMockMenu, placeOrder } from '../services/restaurantService';

// TabPanel component for managing tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const RestaurantDetail = ({ open, restaurant, onClose, userLocation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState([]);
  const [orderStep, setOrderStep] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when restaurant changes
    setActiveTab(0);
    setCart([]);
    setOrderStep(0);
    setOrderPlaced(false);
    setOrderProcessing(false);
    setShowSuccessAlert(false);
    setError(null);
    
    // Generate or use restaurant menu
    if (restaurant) {
      setMenuItems(restaurant.menu || generateMockMenu(restaurant.cuisine));
    }
  }, [restaurant]);

  if (!restaurant) return null;

  // Organize menu by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Show feedback
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== itemId));
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = restaurant.deliveryFee || 3.99;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const tax = subtotal * 0.08; // 8% tax
    
    return subtotal + deliveryFee + serviceFee + tax;
  };

  const handleNextStep = () => {
    if (orderStep === 2) {
      handlePlaceOrder();
    } else {
      setOrderStep(prevStep => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setOrderStep(prevStep => prevStep - 1);
  };

  const validateCurrentStep = () => {
    if (orderStep === 0) {
      return cart.length > 0;
    }
    if (orderStep === 1) {
      return deliveryAddress.trim().length > 0;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setOrderProcessing(true);
    setError(null);
    
    try {
      const orderData = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: cart,
        subtotal: calculateSubtotal(),
        deliveryFee: restaurant.deliveryFee || 3.99,
        serviceFee: calculateSubtotal() * 0.05,
        tax: calculateSubtotal() * 0.08,
        total: calculateTotal(),
        deliveryAddress,
        deliveryInstructions,
        paymentMethod,
        status: 'placed',
        orderTime: new Date().toISOString()
      };
      
      // Call API to place order
      await placeOrder(orderData);
      
      setOrderPlaced(true);
      setCart([]);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const renderMenuItem = (item) => (
    <Card key={item.id} sx={{ mb: 2, position: 'relative' }}>
      <Grid container>
        <Grid item xs={8} sm={9}>
          <CardContent>
            <Typography variant="h6" component="div">
              {item.name}
              {item.popular && (
                <Chip 
                  size="small" 
                  label="Popular" 
                  color="primary" 
                  sx={{ ml: 1, height: 20 }} 
                />
              )}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight="bold">
                ${item.price}
              </Typography>
              
              {item.vegetarian && (
                <Chip 
                  size="small" 
                  label="Vegetarian" 
                  color="success" 
                  sx={{ ml: 1, height: 20 }} 
                />
              )}
              
              {item.spicy && (
                <Chip 
                  size="small" 
                  label="Spicy" 
                  color="error" 
                  sx={{ ml: 1, height: 20 }} 
                />
              )}
            </Box>
          </CardContent>
        </Grid>
        
        <Grid item xs={4} sm={3}>
          <Box sx={{ position: 'relative', height: '100%' }}>
            <CardMedia
              component="img"
              image={item.image || `https://source.unsplash.com/random/100x100/?food,${item.name.toLowerCase().replace(/\s/g, '-')}`}
              alt={item.name}
              sx={{ height: '100%', minHeight: 120 }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                right: 8, 
                bgcolor: 'primary.main',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => addToCart(item)}
            >
              <AddIcon sx={{ color: 'white' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );

  const renderCartItem = (item) => (
    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
      <Grid container alignItems="center">
        <Grid item xs={7}>
          <ListItemText
            primary={item.name}
            secondary={`$${item.price} each`}
          />
        </Grid>
        <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => removeFromCart(item.id)}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            {item.quantity}
          </Typography>
          <IconButton size="small" onClick={() => addToCart(item)}>
            <AddIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 2, width: 60, textAlign: 'right' }}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <List disablePadding>
        {cart.map(item => renderCartItem(item))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1">${calculateSubtotal().toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Delivery Fee" />
          <Typography variant="body1">${(restaurant.deliveryFee || 3.99).toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Service Fee" />
          <Typography variant="body1">${(calculateSubtotal() * 0.05).toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax" />
          <Typography variant="body1">${(calculateSubtotal() * 0.08).toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 2, px: 0 }}>
          <ListItemText primary={<Typography variant="h6">Total</Typography>} />
          <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
        </ListItem>
      </List>
    </Box>
  );

  const renderDeliveryStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Address
      </Typography>
      
      <TextField
        label="Address"
        fullWidth
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        required
        margin="normal"
        placeholder="Enter your full address"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        label="Delivery Instructions (Optional)"
        fullWidth
        value={deliveryInstructions}
        onChange={(e) => setDeliveryInstructions(e.target.value)}
        margin="normal"
        placeholder="Apartment number, gate code, etc."
        variant="outlined"
        multiline
        rows={2}
      />
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Estimated Delivery Time
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography>
            {restaurant.deliveryTime || '30-45'} minutes
          </Typography>
        </Box>
      </Box>
      
      {renderOrderSummary()}
    </Box>
  );

  const renderPaymentStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
          <FormControlLabel 
            value="card" 
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">Credit/Debit Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay securely with your card
                </Typography>
              </Box>
            }
          />
        </Paper>
        
        <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
          <FormControlLabel 
            value="paypal" 
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">PayPal</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay using your PayPal account
                </Typography>
              </Box>
            }
          />
        </Paper>
        
        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControlLabel 
            value="cash" 
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">Cash on Delivery</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay in cash when your order arrives
                </Typography>
              </Box>
            }
          />
        </Paper>
      </RadioGroup>
      
      <Divider sx={{ my: 3 }} />
      
      {renderOrderSummary()}
    </Box>
  );

  const renderConfirmationStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {orderProcessing ? (
        <>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h6">Processing your order...</Typography>
        </>
      ) : orderPlaced ? (
        <>
          <Box sx={{ color: 'success.main', fontSize: 60, mb: 2 }}>
            <CheckCircleOutlineIcon fontSize="inherit" />
          </Box>
          <Typography variant="h5" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" paragraph>
            Your order has been placed successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            Estimated delivery time: {restaurant.deliveryTime || '30-45'} minutes
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Done
          </Button>
        </>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Typography variant="h5" gutterBottom>
            Confirm Your Order
          </Typography>
          <Typography variant="body1" paragraph>
            Please review your order details before placing.
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3, textAlign: 'left' }}>
            <Typography variant="subtitle1" gutterBottom>
              Delivery Address
            </Typography>
            <Typography variant="body1">
              {deliveryAddress}
            </Typography>
            
            {deliveryInstructions && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Delivery Instructions
                </Typography>
                <Typography variant="body1">
                  {deliveryInstructions}
                </Typography>
              </>
            )}
            
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {paymentMethod}
            </Typography>
          </Paper>
          
          {renderOrderSummary()}
        </>
      )}
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderOrderSummary();
      case 1:
        return renderDeliveryStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderConfirmationStep();
      default:
        return 'Unknown step';
    }
  };

  const renderMenu = () => (
    <>
      {Object.keys(menuByCategory).map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            {category}
          </Typography>
          {menuByCategory[category].map(item => renderMenuItem(item))}
        </Box>
      ))}
    </>
  );

  const renderRestaurantInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box 
          component="img" 
          src={restaurant.image || 'https://via.placeholder.com/800x400?text=No+Image+Available'} 
          alt={restaurant.name}
          sx={{ 
            width: '100%', 
            borderRadius: 1,
            height: 250,
            objectFit: 'cover'
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Description</Typography>
          <Typography paragraph>
            {restaurant.description || 'No description available for this restaurant.'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Opening Hours"
              secondary={restaurant.openingHours || "Not available"}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DeliveryDiningIcon />
            </ListItemIcon>
            <ListItemText
              primary="Delivery Time"
              secondary={`${restaurant.deliveryTime || '30-45'} minutes`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText
              primary="Delivery Fee"
              secondary={`$${restaurant.deliveryFee || '3.99'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText
              primary="Minimum Order"
              secondary={`$${restaurant.minimumOrder || '10.00'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText
              primary="Address"
              secondary={restaurant.address || "Address not available"}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!orderProcessing) onClose();
      }}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableEscapeKeyDown={orderProcessing}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h2">{restaurant.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {restaurant.cuisine}
            </Typography>
            <Chip 
              size="small" 
              label={'$'.repeat(restaurant.priceRange)} 
              sx={{ mr: 1, height: '20px' }} 
            />
            <Rating 
              value={restaurant.rating} 
              readOnly 
              precision={0.5} 
              size="small" 
            />
          </Box>
        </Box>
        
        {!orderProcessing && (
          <IconButton
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <Divider />
      
      {cart.length > 0 && orderStep === 0 ? (
        <Box sx={{ display: 'flex', bgcolor: 'primary.main', color: 'primary.contrastText', p: 1.5 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart · ${calculateTotal().toFixed(2)}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="small"
            sx={{ ml: 'auto' }}
            onClick={() => setOrderStep(1)}
          >
            Checkout
          </Button>
        </Box>
      ) : null}
      
      {orderStep > 0 ? (
        <Box sx={{ width: '100%', p: 3 }}>
          <Stepper activeStep={orderStep - 1}>
            <Step completed={orderStep > 1}>
              <StepLabel>Review Cart</StepLabel>
            </Step>
            <Step completed={orderStep > 2}>
              <StepLabel>Delivery</StepLabel>
            </Step>
            <Step completed={orderStep > 3}>
              <StepLabel>Payment</StepLabel>
            </Step>
          </Stepper>
          
          <Box sx={{ mt: 3 }}>
            {getStepContent(orderStep)}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<MenuBookIcon />} label="Menu" />
              <Tab icon={<InfoIcon />} label="Info" />
            </Tabs>
          </Box>
          
          <DialogContent dividers>
            <TabPanel value={activeTab} index={0}>
              {renderMenu()}
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              {renderRestaurantInfo()}
            </TabPanel>
          </DialogContent>
        </>
      )}
      
      {orderStep > 0 && (
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePreviousStep} 
            disabled={orderProcessing || orderPlaced}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNextStep}
            disabled={!validateCurrentStep() || orderProcessing || orderPlaced}
          >
            {orderStep === 3 ? 'Place Order' : 'Continue'}
          </Button>
        </DialogActions>
      )}
      
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={2000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Item added to cart!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default RestaurantDetail;