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
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import { Separator } from "@/components/ui/separator";

export const description = "A simple area chart";
const chartData = [
  { month: "January", desktop: 12.5 },
  { month: "February", desktop: 13.7 },
  { month: "March", desktop: 13.3 },
  { month: "April", desktop: 14 },
  { month: "May", desktop: 13.4 },
  { month: "June", desktop: 13 },
];
const radarData = [
  { subject: "Math", A: 17, fullMark: 20 },
  { subject: "Chinese", A: 13.7, fullMark: 20 },
  { subject: "English", A: 20, fullMark: 20 },
  { subject: "Geography", A: 14, fullMark: 20 },
  { subject: "Physics", A: 13.4, fullMark: 20 },
  { subject: "History", A: 13, fullMark: 20 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2662d9",
  },
} satisfies ChartConfig;

export default function GlobalAverageChart() {
  return (
    <Card className="lg:col-span-5 h-fit lg:h-auto">
      <CardHeader className="pb-0">
        <CardTitle>Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2">
          {/* Area Chart Section */}
          <div className="flex flex-col items-center lg:items-start grow min-w-0 max-h-[332px] my-0 mx-auto w-[100%]">
            <CardDescription className="pb-8">
              Visualiser l'évolution de votre moyenne générale sur ce trimestre
            </CardDescription>
            <ChartContainer config={chartConfig} className="h-[302px] w-[100%]">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: -30,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
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
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <Separator
            orientation="vertical"
            className="hidden lg:block h-[360px]"
          />

          {/* Radar Chart Section */}
          <div className="flex flex-col items-center lg:space-y-2 lg:w-[300px] w-fit m-auto lg:pt-0 pt-8">
            <CardDescription>
              Visualisere votre moyenne par matière
            </CardDescription>
            <ChartContainer
              config={chartConfig}
              className="h-[332px] lg:w-[100%] max-w-[300px] m-auto w-fit"
            >
              <RadarChart
                cx={150}
                cy={150}
                outerRadius={100}
                width={300}
                height={300}
                data={radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Mike"
                  dataKey="A"
                  stroke="var(--color-desktop)"
                  fill="#2662d9"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
