"use client";
import * as React from "react";
const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

import { type ThemeProviderProps } from "next-themes/dist/types";
import dynamic from "next/dynamic";

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}