import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  effectiveScheme: "light" | "dark";
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const effectiveScheme: "light" | "dark" =
    themeMode === "system" ? systemScheme : themeMode;

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      effectiveScheme,
      isDark: effectiveScheme === "dark",
    }),
    [effectiveScheme, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
}
