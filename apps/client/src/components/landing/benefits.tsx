import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { LandingSection } from "./landing-section";

const benefits = [
  "Facile à mettre en place",
  "Rapide et sécurisé",
  "Flexible et personnalisable",
  "Bonne expérience utilisateur",
];
const cons = [
  "Difficile à mettre en place",
  "Mauvaise expérience utilisateur",
  "Manque de fonctionnalités",
];

export const Benefits = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-4 items-center">
        <SubHeading className="max-w-[175px]" as="h3">
          Restez concentré sur ce qui compte vraiment
        </SubHeading>

        <Heading className="max-w-[250px] md:max-w-[500px]" as="h2">
          Laissez-nous simplifier vos résultats
        </Heading>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-muted-foreground">Sans Avermate</h4>

          <ul className="flex flex-col gap-2">
            {cons.map((con) => (
              <li className="flex items-center text-red-500" key={con}>
                <XMarkIcon className="size-4 mr-2" />
                {con}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-muted-foreground">Avec Avermate</h4>

          <ul className="flex flex-col gap-2">
            {benefits.map((benefit) => (
              <li className="flex items-center text-emerald-500" key={benefit}>
                <CheckIcon className="size-4 mr-2" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LandingSection>
  );
};
