"use client";

import { useEffect } from "react";

export default function ThemeColorMetaTag() {
  useEffect(() => {
    // Safely access `document` in the browser
    const metaTag = document.getElementById("themeColor") as HTMLMetaElement;
    if (!metaTag) return;

    const isDarkMode = document.documentElement.classList.contains("dark");
    metaTag.content = isDarkMode ? "#09090b" : "#ffffff";
  }, []);

  useEffect(() => {
    if ("virtualKeyboard" in navigator) {
      // Opt into overlay mode so the viewport doesn’t resize automatically
      (navigator as any).virtualKeyboard.overlaysContent = true;
    }
  }, []);

  // SSR sees just a default meta
  return (
    <meta
      id="themeColor"
      name="theme-color"
      content="#09090b" // Default for SSR
    />
  );
}
