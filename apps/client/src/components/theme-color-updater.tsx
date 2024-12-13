"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes"; // or your custom theme logic

export default function ThemeColorUpdater() {
  const { theme } = useTheme();
  // Assuming 'theme' is either "light" or "dark"
  // from something like next-themes or your own context.

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    // Use the same colors you use in Tailwind. For example:
    metaThemeColor.setAttribute(
      "content",
      theme === "dark" ? "#09090b" : "#ffffff"
    );
  }, [theme]);

  return null;
}
