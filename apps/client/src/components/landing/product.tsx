import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { FeaturesGrid } from "./features-grid";
import { LandingSection } from "./landing-section";

export const Product = () => {
  return (
    <LandingSection>
      <div className="flex flex-col items-center gap-4">
        <SubHeading as="h3">Découvrez nos fonctionnalitées</SubHeading>

        <Heading className="max-w-[550px]" as="h2">
          Suivez votre progression en un coup d'oeil
        </Heading>
      </div>

      <FeaturesGrid />
    </LandingSection>
  );
};
