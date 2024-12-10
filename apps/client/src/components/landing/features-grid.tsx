import {
  CircleStackIcon,
  CubeTransparentIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import { BentoBackground } from "./bento/bento-background";
import { MockAverageChart } from "./bento/mock-average-chart";
import MockGradesTable from "./bento/mock-grades-table";
import { MockInsights } from "./bento/mock-insights";

const features = [
  {
    Icon: CircleStackIcon,
    name: "Aperçu précis et clair",
    description:
      "Analysez vos résultats avec des statistiques avancées, des moyennes précises. Identifiez vos points forts et vos axes d'améliorations en un coup d'oeil.",
    href: "#",
    cta: "Découvrir",
    className: "col-span-3 md:col-span-2 row-span-2 md:row-span-1",
    background: (
      <BentoBackground>
        <MockInsights />
      </BentoBackground>
    ),
  },
  {
    Icon: CubeTransparentIcon,
    name: "Matières et coefficients flexible",
    description:
      "Personnalisez votre suivi : créez vos matières, ajustez les coefficients et suivez des moyennes adaptées à votre parcours.",
    href: "#",
    cta: "En savoir plus",
    className: "col-span-3 md:col-span-1 row-span-2 md:row-span-2",
    background: (
      <BentoBackground>
        <MockGradesTable />
      </BentoBackground>
    ),
  },
  {
    Icon: PresentationChartLineIcon,
    name: "Évolution en temps réel",
    description:
      "Suivez l'évolution de vos résultats en temps réel grâce à des graphiques détaillés. Visualisez vos progrès et ajustez vos efforts.",
    href: "#",
    cta: "Utilisez",
    className: "col-span-3 md:col-span-2 row-span-2 md:row-span-1",
    background: (
      <BentoBackground>
        <MockAverageChart />
      </BentoBackground>
    ),
  },
  // {
  //   Icon: Share2Icon,
  //   name: "Intégration avec les ENT",
  //   description:
  //     "Connectez-vous à votre ENT pour importer vos notes et vos matières en un clic. Gagnez du temps et concentrez-vous sur l'essentiel.",
  //   href: "#",
  //   cta: "Utilisez",
  //   className: "col-span-1",
  //   background: <OrbitingCirclesDemo />,
  // },
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
