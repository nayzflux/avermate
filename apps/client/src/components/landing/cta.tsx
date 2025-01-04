import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations("Landing.CTA");

  return (
    <LandingSection>
      <div className="flex flex-col gap-2 md:gap-4 items-center">
        <SubHeading as="h3">{t("startToday")}</SubHeading>

        <Heading className="max-w-[275px] md:max-w-[550px]" as="h2">
          {t("transformEfforts")}
        </Heading>
      </div>

      <div>
        <GetStarted />
      </div>
    </LandingSection>
  );
};
