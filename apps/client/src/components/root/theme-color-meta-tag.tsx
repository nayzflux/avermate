"use client";
import { useTheme } from "next-themes";

export default function ThemeColorMetaTag() {
  const theme = useTheme();
  const metaTag = document.querySelector('meta[name="theme-color"]');
  if (metaTag) {
    metaTag.setAttribute(
      "content",
      theme.resolvedTheme === "dark" ? "#09090b" : "#ffffff"
    );
  }

  return null;
}
