// hooks/useThemeSwitcher.ts
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

export const useThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const switchTheme = useCallback((newTheme?: string) => {
    if (newTheme) {
      setTheme(newTheme.toLowerCase());
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, setTheme]);

  return { theme, switchTheme };
};