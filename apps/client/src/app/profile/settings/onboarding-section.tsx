"use client";

import ProfileSection from "../profile-section";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const OnboardingSection = () => {
  const t = useTranslations("Settings.Settings.Onboarding");

  return (
    <ProfileSection title={t("title")} description={t("description")}>
      <Link href={"/onboarding"}>
        <Button>
          {t("start")}
          <ArrowRightIcon />
        </Button>
      </Link>
    </ProfileSection>
  );
};
