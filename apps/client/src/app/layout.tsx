import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/providers/theme-provider";
import { Gabarito, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const gabarito = Gabarito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avermate",
  description:
    "Obtenez un aperçu instantané et précis de vos notes et de vos moyennes. Suivez votre progression en temps réel pour atteindre vos objectifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={cn("", gabarito.className)}>
        <QueryProvider>
          <ThemeProvider>
            <div data-vaul-drawer-wrapper="" className="bg-background">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
