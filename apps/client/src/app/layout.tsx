import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/providers/theme-provider";
import { Gabarito } from "next/font/google";
import HeadHelmetProvider from "@/components/root/helmet-provider";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <head>
          <link rel="manifest" href="/manifest.webmanifest" />
        </head>
        <body className={cn("", gabarito.className)}>
          <QueryProvider>
            <ThemeProvider>
              <HeadHelmetProvider />
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
