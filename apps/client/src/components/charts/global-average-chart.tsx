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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
export const description = "A simple area chart";
const chartData = [
  { month: "January", desktop: 12.5 },
  { month: "February", desktop: 13.7 },
  { month: "March", desktop: 13.3 },
  { month: "April", desktop: 14 },
  { month: "May", desktop: 13.4 },
  { month: "June", desktop: 13 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2662d9",
  },
} satisfies ChartConfig;

export default function GlobalAverageChart() {
  return (
    <Card className="lg:col-span-5">
      <CardHeader>
        <CardTitle>Moyenne Générale</CardTitle>
        <CardDescription>
          Visualiser l'évolution de votre moyenne générale sur ce trimestre
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* Chart */}
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -30,
              // right: 12,
            }}
          >
            {/* Grid */}
            <CartesianGrid vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Y Axis */}
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 20]}
              tickMargin={8}
              tickCount={5}
            />

            {/* Tooltip */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Gradient */}
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
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
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
      </CardContent>
    </Card>
  );
}
