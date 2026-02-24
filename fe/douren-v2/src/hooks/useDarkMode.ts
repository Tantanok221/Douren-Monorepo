import { useEffect, useState } from "react";

const STORAGE_KEY = "douren-v2-dark-mode";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage === "undefined") return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isDark));
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
};
