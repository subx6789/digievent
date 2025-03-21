"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { theme } = useThemeStore();
  
  return (
    <NextThemesProvider 
      {...props}
      defaultTheme={theme}
    >
      <ThemeSynchronizer />
      {children}
    </NextThemesProvider>
  );
}

// Component to synchronize theme changes with our store
function ThemeSynchronizer() {
  const { setTheme: setStoreTheme } = useThemeStore();
  const { theme } = useTheme();
  
  // Sync next-themes -> Zustand
  useEffect(() => {
    if (theme) {
      setStoreTheme(theme as 'light' | 'dark' | 'system');
    }
  }, [theme, setStoreTheme]);
  
  return null;
}
