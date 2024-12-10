import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";

export const CTA = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-2 md:gap-4 items-center">
        <SubHeading as="h3">Commencez dés aujourd&apos;hui</SubHeading>

        <Heading className="max-w-[275px] md:max-w-[500px]" as="h2">
          Transformez vos efforts en succès
        </Heading>
      </div>

      <div>
        <GetStarted />
      </div>
    </LandingSection>
  );
};
