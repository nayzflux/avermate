import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/providers/theme-provider";
import { Gabarito } from "next/font/google";
import { ThemeColorMetaTag } from "@/components/color";
import { Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const gabarito = Gabarito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avermate",
  description:
    "Obtenez un aperçu instantané et précis de vos notes et de vos moyennes. Suivez votre progression en temps réel pour atteindre vos objectifs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2) Read the locale and messages (provided by i18n/request.ts)
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className={cn("", gabarito.className)}>
        <QueryProvider>
          <ThemeProvider>
            <ThemeColorMetaTag />
            <NextIntlClientProvider locale={locale} messages={messages}>
              <div data-vaul-drawer-wrapper="" className="bg-background">
                {children}
              </div>
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
