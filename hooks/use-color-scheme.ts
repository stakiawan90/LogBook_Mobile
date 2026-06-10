import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  const themeContext = useContext(ThemeContext);
  if (themeContext) {
    return themeContext.effectiveScheme;
  }
  return useSystemColorScheme() ?? 'light';
}
