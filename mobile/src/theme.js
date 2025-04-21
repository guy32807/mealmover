import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4caf50', // Green color matching web app
    accent: '#2196f3',
    background: '#f5f5f5',
    surface: '#ffffff',
    error: '#B00020',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#BDBDBD',
    placeholder: '#BDBDBD',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#ff9800',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  }
};

export default theme;