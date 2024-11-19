import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  {
    month: "January",
    a: 15,
    b: 17,
    c: 13,
  },
  {
    month: "February",
    a: 15,
    b: 17,
    c: 13,
  },
  {
    month: "March",
    a: 15,
    b: 17,
    c: 13,
  },
  {
    month: "April",
    a: 15,
    b: 17,
    c: 13,
  },
  {
    month: "May",
    a: 15,
    b: 17,
    c: 13,
  },
  {
    month: "June",
    a: 15,
    b: 17,
    c: 13,
  },
];

const chartConfig = {
  a: {
    label: "A",
    color: "hsl(var(--chart-1))",
  },
  b: {
    label: "B",
    color: "hsl(var(--chart-5))",
  },
  c: {
    label: "C",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function SubjectAverageChart() {
  return (
    <Card className="p-4">
      <ChartContainer config={chartConfig} className="h-[400px] w-[100%]">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-a)" stopOpacity={0.8} />

              <stop offset="95%" stopColor="var(--color-a)" stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="fillC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-c)" stopOpacity={0.8} />

              <stop offset="95%" stopColor="var(--color-c)" stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-b)" stopOpacity={0.8} />

              <stop offset="95%" stopColor="var(--color-b)" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area
            dataKey="c"
            type="natural"
            fill="url(#fillC)"
            fillOpacity={0.4}
            stroke="var(--color-c)"
            stackId="c"
          />

          <Area
            dataKey="a"
            type="natural"
            fill="url(#fillA)"
            fillOpacity={0.4}
            stroke="var(--color-a)"
            stackId="a"
          />

          <Area
            dataKey="b"
            type="natural"
            fill="url(#fillB)"
            fillOpacity={0.4}
            stroke="var(--color-b)"
            stackId="b"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
