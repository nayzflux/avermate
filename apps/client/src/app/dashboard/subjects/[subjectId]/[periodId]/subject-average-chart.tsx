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
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { averageOverTime, getChildren } from "@/utils/average";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Period } from "@/types/period";
import React, { useState, useCallback } from "react";

const predefinedColors = [
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
  "#ede15b",
  "#bdcf32",
  "#87bc45",
  "#27aeef",
  "#b33dc6",
];

export default function SubjectAverageChart({
  subjectId,
  period,
  subjects,
}: {
  subjectId: string;
  period: Period;
  subjects: Subject[];
}) {
  // const [activeTooltipIndices, setActiveTooltipIndices] = useState<{
  //   [key: string]: number | null;
  // }>({});

  // // Callback to update active tooltip index
  // const handleActiveTooltipIndicesChange = React.useCallback(
  //   (indices: { [key: string]: number | null }) => {
  //     setActiveTooltipIndices(indices);
  //   },
  //   []
  // );

  // State to manage the active index for the data series
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null
  );

  // Callback to update active tooltip index
  const handleActiveTooltipIndexChange = (index: number | null) => {
    setActiveTooltipIndex(index);
  };

  const { childrenAverage, chartData, chartConfig } = (() => {
    const childrensId = getChildren(subjects, subjectId);

    const endDate = new Date(period.endAt);
    const startDate = new Date(period.startAt);

    const dates = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      dates.push(new Date(dt));
    }

    const mainSubject = subjects.find((subject) => subject.id === subjectId);

    let childrensObjects = subjects.filter((subject) =>
      childrensId.includes(subject.id)
    );

    // TODO: add an option to enable/disable the depth filter
    childrensObjects = childrensObjects.filter(
      (child) => child.depth === (mainSubject?.depth ?? 0) + 1
    );

    const childrenAverage = childrensObjects.map((child, index) => {
      return {
        id: child.id,
        name: child.name,
        average: averageOverTime(subjects, child.id, startDate, endDate),
        color: predefinedColors[index % predefinedColors.length], // Assign color from the list
      };
    });

    const averages = averageOverTime(subjects, subjectId, startDate, endDate);

    const chartData = dates.map((date, index) => ({
      date: date.toISOString(),
      average: averages[index],
      ...Object.fromEntries(
        childrenAverage.map((child) => [child.id, child.average[index]])
      ),
    }));

    const chartConfig = {
      average: {
        label: "Moyenne",
        color: "#2662d9",
      },
      ...Object.fromEntries(
        childrenAverage.map((child) => [
          child.id,
          {
            label: child.name,
            color: child.color, // Use the dynamically assigned color
          },
        ])
      ),
    };

    return { childrenAverage, chartData, chartConfig };
  })();

  // Custom dot component
const CustomDot = (props: any) => {
  const { cx, cy, index, stroke, activeTooltipIndex } = props;
  if (activeTooltipIndex !== null && index === activeTooltipIndex) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4} // Adjust size as needed
        fill={stroke}
      />
    );
  }
  return null;
};


  return (
    <Card className="p-4">
      <ChartContainer config={chartConfig} className="h-[400px] w-[100%]">
        <LineChart data={chartData} margin={{ left: -30 }}>
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
            filterNull={false}
            cursor={false}
            content={
              <ChartTooltipContent
                chartData={chartData}
                findNearestNonNull={true}
                labelFormatter={(value) => value}
                onUpdateActiveTooltipIndex={handleActiveTooltipIndexChange}
              />
            }
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("fr-FR", {
                month: "short",
                day: "numeric",
              })
            }
          />

          {childrenAverage?.map((child) => (
            <Line
              key={child.id}
              dataKey={child.id}
              type="monotone"
              fill={child.color}
              stroke={child.color}
              connectNulls={true}
              activeDot={false}
              dot={(props) => (
                <CustomDot
                  {...props}
                  dataKey={child.id}
                  activeTooltipIndex={activeTooltipIndex}
                />
              )}
            />
          ))}

          <Line
            dataKey="average"
            type="monotone"
            fill="url(#fillAverage)"
            stroke="#2662d9"
            strokeWidth={3}
            connectNulls={true}
            activeDot={false}
            dot={(props) => (
              <CustomDot
                {...props}
                dataKey="average"
                activeTooltipIndex={activeTooltipIndex}
              />
            )}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}

/* <AreaChart
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
        </AreaChart> */
