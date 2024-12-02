import { LandingSection } from "./landing-section";

export const SocialProof = () => {
  return (
    <LandingSection className="!px-0">
      <div className="grid grid-cols-3 w-full px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 py-8 border-y divide-x backdrop-blur-2xl">
        <div className="flex flex-col items-center">
          <p className="font-extrabold text-2xl">200</p>
          <p className="text-muted-foreground">Utilisateurs inscrits</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-extrabold text-2xl">1242</p>
          <p className="text-muted-foreground">Notes entrées</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-extrabold text-2xl">500</p>
          <p className="text-muted-foreground">Matières crées</p>
        </div>
      </div>
    </LandingSection>
  );
};
