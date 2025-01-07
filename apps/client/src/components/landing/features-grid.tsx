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
import { useTranslations } from "next-intl";

export const FeaturesGrid = () => {
  const t = useTranslations("Landing.Product.Features");

  const features = [
    {
      Icon: CircleStackIcon,
      name: t("preciseOverview"),
      description: t("preciseOverviewDescription"),
      href: "#",
      cta: t("discover"),
      className: "col-span-3 md:col-span-2 row-span-2 md:row-span-1",
      background: (
        <BentoBackground>
          <MockInsights />
        </BentoBackground>
      ),
    },
    {
      Icon: CubeTransparentIcon,
      name: t("flexibleSubjects"),
      description: t("flexibleSubjectsDescription"),
      href: "#",
      cta: t("learnMore"),
      className: "col-span-3 md:col-span-1 row-span-2 md:row-span-2",
      background: (
        <BentoBackground>
          <MockGradesTable />
        </BentoBackground>
      ),
    },
    {
      Icon: PresentationChartLineIcon,
      name: t("realTimeProgress"),
      description: t("realTimeProgressDescription"),
      href: "#",
      cta: t("use"),
      className: "col-span-3 md:col-span-2 row-span-2 md:row-span-1",
      background: (
        <BentoBackground>
          <MockAverageChart />
        </BentoBackground>
      ),
    },
  ];

  return (
    <BentoGrid>
      {features.map((feature, index) => (
        <BentoCard key={index} {...feature} />
      ))}
    </BentoGrid>
  );
};
