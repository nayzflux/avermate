"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/types/subject";
import { Separator } from "@/components/ui/separator";

export const description = "A simple area chart";

export default function GlobalAverageChart() {
  const {
    data: subjects,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  // Collect all grades from the subjects
  const allGrades = subjects.flatMap((subject) =>
    subject.grades.map((grade) => ({
      ...grade,
      subjectName: subject.name,
      passedAt: new Date(grade.passedAt),
    }))
  );

  // Sort the grades by the passedAt date
  allGrades.sort((a, b) => a.passedAt - b.passedAt);

  // Calculate the start and end dates
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  // Generate an array of dates
  const dates = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(new Date(dt));
  }

  // Compute cumulative averages for area chart
  let sum = 0;
  let count = 0;
  let gradeIndex = 0;
  const avgData = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    while (
      gradeIndex < allGrades.length &&
      allGrades[gradeIndex].passedAt <= date
    ) {
      // Adjust the grade value to a scale of 0 to 20
      sum += (allGrades[gradeIndex].value / allGrades[gradeIndex].outOf) * 20;
      count++;
      gradeIndex++;
    }

    const average = count > 0 ? sum / count : 0;

    avgData.push({
      date: date.toISOString().slice(0, 10), // Format: YYYY-MM-DD
      average: average,
    });
  }

  const chartData = avgData;

  const chartConfig = {
    average: {
      label: "Moyenne",
      color: "#2662d9",
    },
  };

  // Calculate average grades per subject for radar chart
  const subjectAverages = subjects.map((subject) => {
    const grades = subject.grades;
    const total = grades.reduce((acc, grade) => {
      return acc + (grade.value / grade.outOf) * 20 * grade.coefficient;
    }, 0);
    const totalCoefficient = grades.reduce(
      (acc, grade) => acc + grade.coefficient,
      0
    );
    const average = totalCoefficient > 0 ? total / totalCoefficient : 0;

    return {
      subject: subject.name,
      average: average,
      fullMark: 20,
    };
  });

  const radarData = subjectAverages;

  return (
    <Card className="lg:col-span-5">
      <CardHeader>
        <CardTitle>Moyenne Générale</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2">
          {/* Area Chart Section */}
          <div className="flex flex-col items-center lg:items-start grow min-w-0 my-0 mx-auto w-[100%]">
            <CardDescription className="pb-8">
              Visualiser l'évolution de votre moyenne générale sur ce trimestre
            </CardDescription>
            <ChartContainer config={chartConfig} className="h-[302px] w-[100%]">
              <AreaChart data={chartData} margin={{ left: -30 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 20]}
                  tickMargin={8}
                  tickCount={5}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2662d9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2662d9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="average"
                  type="monotone"
                  fill="url(#fillAverage)"
                  stroke="#2662d9"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <Separator
            orientation="vertical"
            className="hidden lg:block h-[360px]"
          />

          {/* Radar Chart Section */}
          <div className="flex flex-col items-center lg:space-y-2 lg:w-[40%] m-auto lg:pt-0 pt-8 w-[100%]">
            <CardDescription>
              Visualiser votre moyenne par matière
            </CardDescription>
            <ChartContainer
              config={chartConfig}
              className="h-[332px] w-[100%] m-auto !aspect-auto"
            >
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 20]} tickCount={5} />
                <Radar
                  dataKey="average"
                  stroke="#2662d9"
                  fill="#2662d9"
                  fillOpacity={0.6}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
