import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomCard } from './CustomCard';
import { useTheme } from '../context/ThemeContext';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  style,
  onPress,
}) => {
  const { theme } = useTheme();
  const color = accentColor || theme.primary;

  return (
    <CustomCard
      onPress={onPress}
      style={[styles.container, style]}
      padding={14}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${color}1A` }, // 10% opacity tint
          ]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={[styles.valueText, { color: theme.text }]}>{value}</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text
          numberOfLines={1}
          style={[styles.titleText, { color: theme.textSecondary }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitleText, { color: theme.textMuted }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  bottomSection: {
    marginTop: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 11,
    marginTop: 2,
  },
});

