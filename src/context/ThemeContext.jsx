import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorageState('eyeverse_theme', 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')) }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
