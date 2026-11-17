import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const Badge = ({ label, variant = 'default', size = 'sm', style }) => {
  const { theme } = useTheme();

  let bg = theme.surfaceAlt;
  let text = theme.textSecondary;

  switch (variant) {
    case 'success':
    case 'Completed':
      bg = theme.successLight;
      text = theme.success;
      break;
    case 'warning':
    case 'In Progress':
    case 'Coming Soon':
      bg = theme.warningLight;
      text = theme.warning;
      break;
    case 'danger':
    case 'Pending':
      bg = theme.dangerLight;
      text = theme.danger;
      break;
    case 'primary':
    case 'Core':
    case 'Interactive':
      bg = theme.primaryLight;
      text = theme.primary;
      break;
    case 'Locked':
      bg = theme.surfaceAlt;
      text = theme.textMuted;
      break;
    case 'info':
      bg = theme.infoLight;
      text = theme.info;
      break;
    default:
      bg = theme.surfaceAlt;
      text = theme.textSecondary;
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
          borderRadius: 20,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: text,
            fontSize: isSmall ? 11 : 13,
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
