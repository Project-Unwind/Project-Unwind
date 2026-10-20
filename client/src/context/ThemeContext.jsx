import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  const savedTheme = localStorage.getItem("unwind_theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  const prefersDarkTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return prefersDarkTheme ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [halloweenMode, setHalloweenMode] = useState(() => {
  return localStorage.getItem("unwind_halloween") === "true";
});

useEffect(() => {
  const root = document.documentElement;

  if (halloweenMode) {
    root.setAttribute("data-season", "halloween");
  } else {
    root.removeAttribute("data-season");
  }

  return () => {
    root.removeAttribute("data-season");
  };
}, [halloweenMode]);


  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("unwind_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };
  useEffect(() => {
  localStorage.setItem(
    "unwind_halloween",
    String(halloweenMode)
  );
}, [halloweenMode]);

  const value = useMemo(
  () => ({
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    halloweenMode,
    setHalloweenMode
  }),
  [theme, halloweenMode]
);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}