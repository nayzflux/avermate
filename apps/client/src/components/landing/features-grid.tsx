import { Loader2Icon } from "lucide-react";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";

const features = [
  {
    Icon: Loader2Icon,
    name: "Aperçu précis et clair",
    description:
      "Analysez vos résultats avec des statistiques avancées, des moyennes précises. Identifiez vos points forts et vos axes d'améliorations en un coup d'oeil.",
    href: "#",
    cta: "Découvrir",
    className: "col-span-3 lg:col-span-1",
    background: <div>Back</div>,
  },
  {
    Icon: Loader2Icon,
    name: "Matières et coefficients flexible",
    description:
      "Personnalisez votre suivi : créez vos matières, ajustez les coefficients et suivez des moyennes adaptées à votre parcours.",
    href: "#",
    cta: "En savoir plus",
    className: "col-span-3 lg:col-span-1",
    background: <div>Back</div>,
  },
  {
    Icon: Loader2Icon,
    name: "Évolution en temps réel",
    description:
      "Suivez l'évolution de vos résultats en temps réel grâce à des graphiques détaillés. Visualisez vos progrès et ajustez vos efforts.",
    href: "#",
    cta: "Découvrir",
    className: "col-span-3 lg:col-span-1",
    background: <div>Back</div>,
  },
];

export const FeaturesGrid = () => {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
};
