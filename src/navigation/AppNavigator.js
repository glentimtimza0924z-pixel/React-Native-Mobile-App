import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { LabsScreen } from '../screens/LabsScreen';
import { LabDetailScreen } from '../screens/LabDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon Helper with responsive mobile spacing
const TabBarIcon = ({ icon, label, focused, color }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.65 }]}>{icon}</Text>
    <Text
      numberOfLines={1}
      style={[
        styles.tabLabel,
        {
          color,
          fontWeight: focused ? '700' : '500',
        },
      ]}
    >
      {label}
    </Text>
  </View>
);

// Main Bottom Tab Navigator
function BottomTabs() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          borderTopColor: theme.navBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          elevation: 10,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.35 : 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon="🏠"
              label="Dashboard"
              focused={focused}
              color={focused ? theme.primary : theme.textMuted}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Labs"
        component={LabsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon="🔬"
              label="Labs"
              focused={focused}
              color={focused ? theme.primary : theme.textMuted}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon="👥"
              label="Pair"
              focused={focused}
              color={focused ? theme.primary : theme.textMuted}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon="⚙️"
              label="Settings"
              focused={focused}
              color={focused ? theme.primary : theme.textMuted}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root App Navigator Stack
export const AppNavigator = () => {
  const { theme, isDark } = useTheme();

  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.navBackground,
      text: theme.text,
      border: theme.navBorder,
      notification: theme.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen
          name="LabDetail"
          component={LabDetailScreen}
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 48,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
