import Link from "next/link";
import { Button } from "../ui/button";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";

export const Headline = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-16 items-center">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold max-w-[450px] text-center text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:via-zinc-100 dark:to-zinc-400">
          Prenez le contrôle de vos notes
        </h1>

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
