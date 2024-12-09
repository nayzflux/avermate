import GlobalAverageChart from "@/components/charts/global-average-chart";
import { subjects } from "@/data/mock";

export const MockAverageChart = () => {
  return (
    <GlobalAverageChart
      subjects={subjects}
      period={{
        id: "full-year",
        name: "Toute l&apos;année",
        startAt: new Date(new Date().getFullYear(), 8, 1).toISOString(),
        endAt: new Date(new Date().getFullYear() + 1, 5, 30).toISOString(),
        userId: "",
        createdAt: "",
      }}
    />
  );
};
