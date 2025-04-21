import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import AuthProvider from './src/contexts/AuthContext';
import CartProvider from './src/contexts/CartContext';
import theme from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}