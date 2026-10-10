import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, useColorScheme } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useAuthStore } from '../store/auth';

// Custom themes with green accent
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#22c55e',
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#22c55e',
  },
};

function useProtectedRoute() {
  const { session, initialized, profile } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    // Check if profile is complete (has all required fields)
    const isProfileComplete = profile &&
      profile.sex !== null &&
      profile.age !== null &&
      profile.height_cm !== null &&
      profile.weight_kg !== null &&
      profile.activity_level !== null &&
      profile.goal !== null;

    if (!session && !inAuthGroup) {
      // Not signed in and not on an auth screen — redirect to login
      router.replace('/(auth)/login');
    } else if (session && !isProfileComplete && !inOnboardingGroup) {
      // Signed in but profile incomplete and not on onboarding — redirect to onboarding
      router.replace('/(onboarding)/step1');
    } else if (session && inAuthGroup) {
      // Signed in but still on an auth screen — redirect to tabs
      router.replace('/(tabs)');
    }
  }, [session, initialized, profile, segments, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useProtectedRoute();

  // Show loading screen until auth state is determined
  if (!initialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
