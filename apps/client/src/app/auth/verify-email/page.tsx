"use client";

import ResendVerificationLink from "@/components/buttons/auth/resend-verification-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const VerifyEmailPage = () => {
  const t = useTranslations("Auth.Verify");
  const router = useRouter();
  const toaster = useToast();

  const {
    data: session,
    isPending: isSessionPending,
    isError: isSessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const data = authClient.getSession();

      if (!data) throw new Error("No session found");

      return data;
    },
    // Poll every 30 seconds
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // When email is verified redirect to dashboard
    if (session?.user.emailVerified) {
      // Redirect to the onboarding
      router.push("/onboarding");

      // Send toast notification
      toaster.toast({
        title: t("welcomeBack", { name: session.user.name }),
        description: t("hopeYouAchievedGoals"),
      });
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">{t("verifyEmail")}</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>{t("emailSent", { email: session?.user?.email })}</p>
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
