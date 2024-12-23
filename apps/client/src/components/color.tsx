"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export function ThemeColorMetaTag() {
  const { theme } = useTheme(); // could be "dark", "light", "system", etc.

  useEffect(() => {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) return;

    if (theme === "light") {
      metaTag.setAttribute("content", "#ffffff");
    } else if (theme === "dark") {
      metaTag.setAttribute("content", "#09090b");
    } else {
      // Fallback to OS preference if theme is neither "light" nor "dark"
      const osPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      metaTag.setAttribute("content", osPrefersDark ? "#09090b" : "#ffffff");
    }
  }, [theme]);

  return null;
}
