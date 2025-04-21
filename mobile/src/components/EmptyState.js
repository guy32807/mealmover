import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({
  icon,
  title,
  description,
  buttonText,
  onButtonPress,
  iconSize = 80
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Ionicons 
        name={icon} 
        size={iconSize} 
        color={theme.colors.primary} 
        style={styles.icon} 
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonText && onButtonPress && (
        <Button 
          mode="contained" 
          onPress={onButtonPress} 
          style={styles.button}
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 16,
  }
});

export default EmptyState;