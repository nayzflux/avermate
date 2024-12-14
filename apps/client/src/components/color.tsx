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
  const { theme } = useTheme(); // "dark" or "light" for example

  useEffect(() => {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag) {
      // Adjust color accordingly
      metaTag.setAttribute("content", theme === "light" ? "#ffffff" : "#09090b");
    }
  }, [theme]);

  return null;
}
