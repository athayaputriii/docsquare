'use client';

import { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeConfig({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <ThemeContext.Provider value={{ darkMode, toggle: () => setDarkMode((prev) => !prev) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeConfig must be used within ThemeConfig');
  }
  return ctx;
}
