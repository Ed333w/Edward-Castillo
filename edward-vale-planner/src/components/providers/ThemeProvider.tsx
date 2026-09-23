'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (t: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'ev-planner-theme';

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    return stored ?? 'system';
  } catch {
    return 'system'; // localStorage unavailable (private mode, blocked)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme);

  // Keeps the DOM (an external system) in sync with React state — including
  // on first mount, so this also covers the initial load.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemePreference) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // Preference just won't persist across reloads; not critical.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
