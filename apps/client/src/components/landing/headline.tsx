"use client";

import { useTranslations } from "next-intl";
import { LandingSection } from "./landing-section";
import { DiscoverFeaturesButton } from "../buttons/discover-features-button";
import { Heading } from "../texts/heading";
import { GetStarted } from "./get-started";

export const Headline = () => {
  const t = useTranslations("Landing.Headline");

  return (
    <LandingSection>
      <div className="flex flex-col gap-8 md:gap-16 items-center">
        {/* Heading */}
        <Heading as="h1">{t("title")}</Heading>

        {/* Subheading */}
        <h2 className="md:text-base text-xs text-muted-foreground text-center max-w-[300px] md:max-w-[600px]">
          {t("subtitle")}
        </h2>

        <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
          <GetStarted />
          <DiscoverFeaturesButton />
        </div>
      </div>
    </LandingSection>
  );
};
