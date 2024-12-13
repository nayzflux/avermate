"use client";
import { useTheme } from "next-themes";

export default function ThemeColorMetaTag() {
  const theme = useTheme();
  return (
    <meta
      id="themeColor"
      name="theme-color"
      content={theme.resolvedTheme === "dark" ? "#09090b" : "#ffffff"}
    />
  );
}
