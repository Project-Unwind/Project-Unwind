
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

  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

function getInitialSeason() {
  const savedSeason = localStorage.getItem("unwind_season");

  if (savedSeason === "halloween" || savedSeason === "diwali") {
    return savedSeason;
  }

  // Backward compatibility with existing Halloween settings.
  if (localStorage.getItem("unwind_halloween") === "true") {
    return "halloween";
  }

  return null;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [season, setSeason] = useState(getInitialSeason);

  const halloweenMode = season === "halloween";
  const diwaliMode = season === "diwali";

  const setHalloweenMode = (enabled) => {
    setSeason((current) =>
      (typeof enabled === "function"
        ? enabled(current === "halloween")
        : enabled)
        ? "halloween"
        : current === "halloween"
          ? null
          : current
    );
  };

  const setDiwaliMode = (enabled) => {
    setSeason((current) =>
      (typeof enabled === "function"
        ? enabled(current === "diwali")
        : enabled)
        ? "diwali"
        : current === "diwali"
          ? null
          : current
    );
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("unwind_theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    if (season) {
      root.setAttribute("data-season", season);
      localStorage.setItem("unwind_season", season);
    } else {
      root.removeAttribute("data-season");
      localStorage.removeItem("unwind_season");
    }

    localStorage.setItem(
      "unwind_halloween",
      String(halloweenMode)
    );
  }, [season, halloweenMode]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark",
      season,
      setSeason,
      halloweenMode,
      setHalloweenMode,
      diwaliMode,
      setDiwaliMode
    }),
    [theme, season]
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
