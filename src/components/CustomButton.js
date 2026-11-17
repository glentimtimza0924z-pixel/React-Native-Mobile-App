import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md', // sm, md, lg
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  // Determine size dimensions
  const sizeStyles = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      fontSize: 13,
      borderRadius: 8,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      fontSize: 15,
      borderRadius: 12,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 28,
      fontSize: 17,
      borderRadius: 14,
    },
  }[size] || {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 15,
    borderRadius: 12,
  };

  // Determine variant colors
  let backgroundColor = theme.primary;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';

  switch (variant) {
    case 'secondary':
      backgroundColor = theme.surfaceAlt;
      textColor = theme.text;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = theme.primary;
      borderWidth = 1.5;
      borderColor = theme.primary;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = theme.primary;
      break;
    case 'danger':
      backgroundColor = theme.danger;
      textColor = '#FFFFFF';
      break;
    case 'success':
      backgroundColor = theme.success;
      textColor = '#FFFFFF';
      break;
    case 'primary':
    default:
      backgroundColor = theme.primary;
      textColor = '#FFFFFF';
      break;
  }

  if (disabled) {
    backgroundColor = theme.surfaceAlt;
    textColor = theme.textMuted;
    borderColor = theme.border;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        {
          backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: sizeStyles.borderRadius,
          borderWidth,
          borderColor,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.buttonText,
              {
                color: textColor,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

