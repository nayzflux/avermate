import { DiscoverFeaturesButton } from "../buttons/discover-features-button";
import { Heading } from "../texts/heading";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";

export const Headline = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-8 md:gap-16 items-center">
        {/* Heading */}
        <Heading as="h1">Prenez le contrôle de vos notes</Heading>

        {/* Subheading */}
        <h2 className="md:text-base text-xs text-muted-foreground text-center max-w-[300px] md:max-w-[600px]">
          Obtenez un aperçu instantané et précis de vos notes et de vos
          moyennes. Suivez votre progression en temps réel pour atteindre vos
          objectifs.
        </h2>

        <div className="flex flex-col md:flex-row gap-2 md:gap-8">
          {/* Call to action */}
          <GetStarted />

          <DiscoverFeaturesButton />
        </div>
      </div>
    </LandingSection>
  );
};
