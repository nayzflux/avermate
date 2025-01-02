"use client";

import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { averageOverTime, getChildren } from "@/utils/average";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

// [PATCH] A small helper to handle cumulative start dates.
function getCumulativeStartDate(
  periods: Period[],
  currentPeriod: Period
): Date {
  // If we have a "full-year" special period, you can either:
  // - Use currentPeriod.startAt
  // - Or use the earliest real period's start date
  // We'll just default to currentPeriod.startAt for "full-year".
  if (currentPeriod.id === "full-year") {
    return new Date(currentPeriod.startAt);
  }

  // Sort all periods by start date
  const sorted = [...periods].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  // Find the current period’s index
  const currentIndex = sorted.findIndex((p) => p.id === currentPeriod.id);
  if (currentIndex === -1) {
    // Fallback if not found
    return new Date(currentPeriod.startAt);
  }

  // If isCumulative => we start from the earliest period's start date
  if (currentPeriod.isCumulative) {
    return new Date(sorted[0].startAt);
  }

  // Otherwise => just use the current period's start date
  return new Date(currentPeriod.startAt);
}

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
  periods,
}: {
  subjectId: string;
  period: Period;
  subjects: Subject[];
  periods: Period[];
}) {
  const [activeTooltipIndices, setActiveTooltipIndices] = useState<{
    [key: string]: number | null;
  }>({});

  interface ChartDataEntry {
    date: string;
    average: number | null;
    // Index signature to allow child subject keys, etc.
    [key: string]: string | number | null;
  }

  // Callback to update active tooltip indices
  const handleActiveTooltipIndicesChange = React.useCallback(
    (indices: { [key: string]: number | null }) => {
      setActiveTooltipIndices(indices);
    },
    []
  );

  // [PATCH] Build chart data in an IIFE for clarity
  const { childrenAverage, chartData, chartConfig } = (() => {
    // 1) Find the children of the main subject
    const childrenIds = getChildren(subjects, subjectId);

    // 2) Decide start & end for the chart’s X-axis
    const endDate = new Date(period.endAt);
    const startDate = getCumulativeStartDate(periods, period); // [PATCH]

    // 3) Generate daily dates from [startDate ... endDate]
    const dates: Date[] = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      dates.push(new Date(dt));
    }

    // 4) Possibly filter children by depth
    const mainSubject = subjects.find((s) => s.id === subjectId);
    let childrenObjects = subjects.filter((subj) =>
      childrenIds.includes(subj.id)
    );

    // (Optional) Depth-based filtering
    childrenObjects = childrenObjects.filter(
      (child) => child.depth === (mainSubject?.depth ?? 0) + 1
    );

    // 5) Build each child's average
    const childrenAverage = childrenObjects.map((child, index) => ({
      id: child.id,
      name: child.name,
      // Pass all four args to averageOverTime, which now handles isCumulative
      average: averageOverTime(subjects, child.id, period, periods),
      color: predefinedColors[index % predefinedColors.length],
    }));

    // 6) Main subject’s average
    const mainAverages = averageOverTime(subjects, subjectId, period, periods);

    // 7) Combine into chart data
    const chartData: ChartDataEntry[] = dates.map((date, index) => ({
      date: date.toISOString(),
      average: mainAverages[index],
      ...Object.fromEntries(
        childrenAverage.map((child) => [child.id, child.average[index]])
      ),
    }));

    // 8) Build chart config for legend, colors, etc.
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
            color: child.color,
          },
        ])
      ),
    };

    return { childrenAverage, chartData, chartConfig };
  })();

  // [PATCH] Check if we have any data at all (empty state).
  // If all values (for main average + children) are null, let's consider it empty
  const hasAnyData = chartData.some((entry) => {
    // Check the main average
    if (entry.average !== null && entry.average !== undefined) return true;
    // Check each child’s average
    for (const key of Object.keys(entry)) {
      if (key === "date" || key === "average") continue;
      if (entry[key] !== null && entry[key] !== undefined) {
        return true;
      }
    }
    return false;
  });

  if (!hasAnyData) {
    // [PATCH] Render some "empty" or "no data" state if you prefer
    return (
      <Card className="p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Aucune note à afficher pour cette période.
        </p>
      </Card>
    );
  }

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy, index, stroke, activeTooltipIndex } = props;
    if (activeTooltipIndex !== null && index === activeTooltipIndex) {
      return <circle cx={cx} cy={cy} r={4} fill={stroke} opacity={0.8} />;
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
                valueFormatter={(val) => val.toFixed(2)}
                onUpdateActiveTooltipIndices={handleActiveTooltipIndicesChange}
              />
            }
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("fr-FR", {
                month: "short",
                day: "numeric",
              })
            }
          />

          {/* Lines for each child */}
          {childrenAverage?.map((child) => (
            <Line
              key={child.id}
              dataKey={child.id}
              type="monotone"
              fill={child.color}
              stroke={child.color}
              connectNulls={true}
              activeDot={false}
              dot={(props) => {
                const { key, ...rest } = props;
                return (
                  <CustomDot
                    key={key}
                    {...rest}
                    dataKey={child.id}
                    activeTooltipIndex={activeTooltipIndices[child.id]}
                  />
                );
              }}
            />
          ))}

          {/* Main subject line */}
          <Line
            dataKey="average"
            type="monotone"
            fill="url(#fillAverage)"
            stroke="#2662d9"
            strokeWidth={3}
            connectNulls={true}
            activeDot={false}
            dot={(props) => {
              const { key, ...restProps } = props;
              return (
                <CustomDot
                  key={key}
                  {...restProps}
                  activeTooltipIndex={activeTooltipIndices["average"]}
                />
              );
            }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
