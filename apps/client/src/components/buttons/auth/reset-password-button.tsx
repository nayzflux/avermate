"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const ResetPasswordButton = () => {
  const t = useTranslations("Auth.SignIn");

  return (
    <Button asChild variant="link" className="text-muted-foreground" size="sm">
      <Link href="/auth/forgot-password">{t("forgotPassword")}</Link>
    </Button>
  );
};
