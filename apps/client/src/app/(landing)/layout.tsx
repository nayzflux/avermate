import { Header } from "@/components/landing/header";
import { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white dark:bg-zinc-950 shadow-[0px_4px_64px_0px_rgba(255,255,255,0.05)_inset]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
