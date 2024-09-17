import { useTheme } from 'next-themes';

export const useThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return { theme, switchTheme };
};