"use client";

import { authClient } from "@/lib/auth";
import { GetStartedButton } from "../buttons/get-started-button";
import { GoToDashboardButton } from "../buttons/go-to-dashboard-button";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const GetStarted = () => {
  const { data: session, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const session = await authClient.getSession();
      return session;
    },
  });

  if (isLoading || !session || isError) {
    return <GetStartedButton />;
  }

  return <GoToDashboardButton />;
};
