import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { MockAverageChart } from "./bento/mock-average-chart";
import { FeaturesGrid } from "./features-grid";
import { LandingSection } from "./landing-section";

export const Product = () => {
  return (
    <div id="features">
      <LandingSection>
        <div className="flex flex-col items-center gap-4">
          <SubHeading as="h3">Découvrez nos fonctionnalitées</SubHeading>

          <Heading className="max-w-[550px]" as="h2">
            Suivez votre progression en un coup d&apos;oeil
          </Heading>
        </div>

        <FeaturesGrid />

        {/* <MockGradesTable /> */}
        <MockAverageChart />
      </LandingSection>
    </div>
  );
};
