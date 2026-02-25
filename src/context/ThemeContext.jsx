import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const AVAILABLE_THEMES = ["pink", "green", "blue", "orange", "classic"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("accentTheme");
    return AVAILABLE_THEMES.includes(saved) ? saved : "pink";
  });
const [mode, setMode] = useState(
  localStorage.getItem("mode") || "light"
);
useEffect(() => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem("mode", mode);
}, [mode]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("accentTheme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode, AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}