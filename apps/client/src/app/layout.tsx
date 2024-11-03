import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

import { cn } from "@/lib/utils";
import ThemeProvider from "@/providers/theme-provider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avermate",
  description: "Tracks your average grades",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/favicon-light.png',
        href: '/images/favicon-light.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/favicon-dark.png',
        href: '/images/favicon-dark.png',
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("", inter.className)}>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
