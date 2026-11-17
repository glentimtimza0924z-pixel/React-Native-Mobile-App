import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const CustomCard = ({
  children,
  onPress,
  style,
  variant = 'elevated', // elevated, outlined, flat
  padding = 16,
}) => {
  const { theme, isDark } = useTheme();

  const isInteractive = typeof onPress === 'function';
  const Component = isInteractive ? TouchableOpacity : View;

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'flat':
        return {
          backgroundColor: theme.surfaceAlt,
          borderWidth: 0,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.card,
          borderWidth: isDark ? 1 : 0,
          borderColor: theme.border,
          ...Platform.select({
            ios: {
              shadowColor: theme.shadowColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.35 : 0.07,
              shadowRadius: 10,
            },
            android: {
              elevation: isDark ? 2 : 3,
            },
            default: {
              shadowColor: theme.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
          }),
        };
    }
  };

  return (
    <Component
      activeOpacity={isInteractive ? 0.8 : 1}
      onPress={onPress}
      style={[
        styles.cardBase,
        getVariantStyles(),
        { padding },
        style,
      ]}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

