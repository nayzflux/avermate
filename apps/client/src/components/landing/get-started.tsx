"use client";

import { authClient } from "@/lib/auth";
import { GetStartedButton } from "../buttons/get-started-button";
import { GoToDashboardButton } from "../buttons/go-to-dashboard-button";

export const GetStarted = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return <GetStartedButton />;
  }

  return <GoToDashboardButton />;
};
