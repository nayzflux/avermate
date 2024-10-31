import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardNav from "@/components/nav/dashboard-nav";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Navigation du dashboard */}
      <DashboardNav />

      {/* Page */}
      <div className="px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16">
        {children}
      </div>
    </div>
  );
}
