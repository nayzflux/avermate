"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProfileNav from "./profile-nav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Retrieve the `from` param if it exists, otherwise default to "/"
  const [returnUrl, setReturnUrl] = useState("/dashboard");

  useEffect(() => {
    const storedFrom = localStorage.getItem("backFromSettings");
    if (storedFrom) {
      setReturnUrl(storedFrom);
    } else {
      setReturnUrl("/dashboard");
    }
  }, []);

  const handleBack = () => {
    router.push(returnUrl);
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 py-4 sm:py-16">
        {/* Pass the handleBack function to ProfileNav */}
        <div className="flex gap-4 md:gap-8 m-auto max-w-[2000px] ">
          <ProfileNav onBack={handleBack} />
          {children}
        </div>
      </div>
    </div>
  );
}
