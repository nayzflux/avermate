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
import { Gabarito } from "next/font/google";

const gabarito = Gabarito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avermate",
  description: "Tracks your average grades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("", gabarito.className)}>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
