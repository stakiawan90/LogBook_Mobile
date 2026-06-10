import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import { ThemeProvider as AppThemeProvider, useAppTheme } from '@/context/ThemeContext';

function LayoutContent() {
  const { effectiveScheme } = useAppTheme();

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      card: '#1c1c1e',
      primary: '#0a7ea4',
      text: '#ffffff',
      border: '#38383a',
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
      card: '#f2f2f6',
      primary: '#0a7ea4',
      text: '#000000',
      border: '#c6c6c8',
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={effectiveScheme === 'dark' ? customDarkTheme : customLightTheme}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              flex: 1,
              backgroundColor: effectiveScheme === 'dark' ? '#000000' : '#ffffff',
            },
            animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              contentStyle: {
                flex: 1,
                backgroundColor: effectiveScheme === 'dark' ? '#000000' : '#ffffff',
              },
            }}
          />
          {/* Removed unused modal screen since no `modal` route exists */}
        </Stack>
        <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <LayoutContent />
    </AppThemeProvider>
  );
}
