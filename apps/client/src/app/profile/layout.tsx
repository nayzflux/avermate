import DashboardHeader from "@/components/dashboard/dashboard-header";
import React from "react";
import ProfileNav from "./profile-nav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <DashboardHeader />

      <div className="flex gap-16 px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 py-4 sm:py-16">
        <ProfileNav />

        {children}
      </div>
    </div>
  );
}
