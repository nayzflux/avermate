"use client";

import ResendVerificationLink from "@/components/buttons/auth/resend-verification-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyEmailPage = () => {
  const router = useRouter();
  const toaster = useToast();

  const {
    data: session,
    isPending: isSessionPending,
    isError: isSessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await authClient.getSession();

      if (!data) throw new Error("No session found");

      return data;
    },
    // Poll every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 15 * 1000,
  });

  useEffect(() => {
    // When email is verified redirect to dashboard
    if (session?.user.emailVerified) {
      // Redirect to the dashboard
      router.push("/dashboard");

      // Send toast notification
      toaster.toast({
        title: `👋 Ravi de vous revoir ${session.user.name} !`,
        description: "Nous espérons que vous avez atteint vos objectifs !",
      });
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Vérifiez votre email</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>
            Un lien a été envoyé à {session?.user?.email}. Cliquez sur le lien
            pour vérifier votre email.
          </p>
        </div>
      </div>

      {/* Form */}
      {!isSessionPending ? (
        <ResendVerificationLink email={session?.user.email || ""} />
      ) : (
        <Skeleton className="" />
      )}
    </div>
  );
};

export default VerifyEmailPage;
