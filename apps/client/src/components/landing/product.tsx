import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { FeaturesGrid } from "./features-grid";
import { LandingSection } from "./landing-section";
import { useTranslations } from "next-intl";

export const Product = () => {
  const t = useTranslations("Landing.Product");
  return (
    <div id="features">
      <LandingSection>
        <div className="flex flex-col items-center gap-4">
          <SubHeading as="h3">
            {t("subHeading")}
          </SubHeading>

          <Heading className="max-w-[280px] md:max-w-[550px]" as="h2">
            {t("heading")}
          </Heading>
        </div>

        <FeaturesGrid />

        {/* <MockGradesTable /> */}
        {/* <MockAverageChart /> */}
      </LandingSection>
    </div>
  );
};
