import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};
 
export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Custom themes with better colors
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
      <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { 
              flex: 1,
              backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
            },
            // Add smooth transitions
            animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              contentStyle: { 
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
              },
            }} 
          />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal', 
              headerShown: false,
              contentStyle: { 
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
              },
              animation: 'slide_from_bottom',
            }} 
          />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}