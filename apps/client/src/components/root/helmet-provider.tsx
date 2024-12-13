"use client";

import React from "react";
import { HelmetProvider } from "react-helmet-async";
import MetaTags from "@/components/root/helmet";

export default function HeadHelmetProvider() {
  return (
    <HelmetProvider>
      <MetaTags />
    </HelmetProvider>
  );
}
