import {Theme, defaultTheme} from '@react-native-material/core';
import {StyleSheet} from 'react-native';

const borderRadius = 0;

const shape = {
  borderBottomEndRadius: borderRadius,
  borderBottomStartRadius: borderRadius,
  borderTopEndRadius: borderRadius,
  borderTopStartRadius: borderRadius,
} as const;

const colors = {
  primary: '#6750A4',
  secondary: '#F2C94C',
  ligthBackground: '#f3edf7',
} as const;

export const mirabloTheme: Theme = {
  ...defaultTheme,
  colorScheme: 'light',
  typography: {
    ...defaultTheme.typography,
    h1: {
      ...defaultTheme.typography.h1,
      fontSize: 42,
    },
    h2: {
      ...defaultTheme.typography.h1,
      fontSize: 30,
    },
  },
  palette: {
    ...defaultTheme.palette,
    primary: {
      main: colors.primary,
      on: '#fff',
    },
    secondary: {
      main: colors.secondary,
      on: '#fff',
    },
  },
  shapes: {
    medium: shape,
    small: shape,
    large: shape,
  },
} as const;

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});

export default styles;
