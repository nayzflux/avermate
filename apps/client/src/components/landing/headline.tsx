import Link from "next/link";
import { Heading } from "../texts/heading";
import { Button } from "../ui/button";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";

export const Headline = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-16 items-center">
        {/* Heading */}
        <Heading as="h1">Prenez le contrôle de vos notes</Heading>

        {/* Subheading */}
        <h2 className="text text-muted-foreground text-center max-w-[600px]">
          Obtenez un aperçu instantané et précis de vos notes et de vos
          moyennes. Suivez votre progression en temps réel pour atteindre vos
          objectifs.
        </h2>

        <div className="flex gap-8">
          {/* Call to action */}
          <GetStarted />

          <Button variant="link" asChild>
            <Link href="#features">Découvrir les fonctionnalitées</Link>
          </Button>
        </div>
      </div>
    </LandingSection>
  );
};
