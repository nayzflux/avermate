"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export const DiscoverFeaturesButton = () => {
  const t = useTranslations("Landing.Headline");
  return (
    <>
      <Button size="default" variant="link" asChild className="hidden sm:inline-block">
        <Link href="#features">{t("discoverFeatures")}</Link>
      </Button>
      <Button size="sm" variant="link" asChild className="sm:hidden">
        <Link href="#features">{t("discoverFeatures")}</Link>
      </Button>
    </>
  );
};
