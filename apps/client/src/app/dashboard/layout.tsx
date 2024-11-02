import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardNav from "@/components/nav/dashboard-nav";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col shadow-[0px_4px_64px_0px_rgba(255,255,255,0.05)_inset] min-h-screen h-full">
      {/* Header */}
      <DashboardHeader />

      {/* Page */}
      <div className="py-6 px-8">{children}</div>
    </div>
  );
}
