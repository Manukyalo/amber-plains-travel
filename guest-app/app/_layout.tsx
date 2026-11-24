import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { AmberPlainsColors } from '../constants/Colors';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: AmberPlainsColors.night,
            },
            headerTintColor: AmberPlainsColors.sand,
            headerTitleStyle: {
              fontWeight: '600',
              color: AmberPlainsColors.sand,
            },
            contentStyle: {
              backgroundColor: AmberPlainsColors.night,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/login"
            options={{ title: 'Guest Sign In', headerShown: false }}
          />
          <Stack.Screen
            name="(auth)/register"
            options={{ title: 'Guest Registration', headerShown: true }}
          />
          <Stack.Screen
            name="trip/[id]"
            options={{ title: 'Expedition Command', headerShown: true }}
          />
          <Stack.Screen
            name="payment/[bookingId]"
            options={{ title: 'Secure Payment', headerShown: true }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Amber Plains Concierge' }}
          />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
