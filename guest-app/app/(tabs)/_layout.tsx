import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { View, Text, Platform } from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function TabLayout() {
  const { totalCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AmberPlainsColors.gold,
        tabBarInactiveTintColor: AmberPlainsColors.sage,
        tabBarStyle: {
          backgroundColor: AmberPlainsColors.night,
          borderTopColor: AmberPlainsColors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: AmberPlainsColors.night,
          borderBottomColor: AmberPlainsColors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: AmberPlainsColors.sand,
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          headerTitle: 'AMBER PLAINS EXPEDITIONS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size || 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="enquiry"
        options={{
          title: 'Plan Trip',
          headerTitle: 'Custom Safari Curation',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size || 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'My Safaris',
          headerTitle: 'Expedition Command',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trail-sign-outline" size={size || 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Boutique',
          headerTitle: 'Safari Field Gear',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <Ionicons name="bag-handle-outline" size={size || 22} color={color as string} />
              {totalCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    backgroundColor: AmberPlainsColors.gold,
                    borderRadius: 9,
                    width: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: AmberPlainsColors.night,
                      fontSize: 10,
                      fontWeight: '800',
                    }}
                  >
                    {totalCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Concierge',
          headerTitle: 'Guest Concierge & Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size || 22} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
