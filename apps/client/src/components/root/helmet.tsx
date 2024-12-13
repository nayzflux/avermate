"use client";

import React from "react";
import { useTheme } from "next-themes";
import Head from "next/head";

export default function MetaTags() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#09090b" : "#ffffff";

  return (
    <Head>
      <meta name="theme-color" content={color} />
    </Head>
  );
}