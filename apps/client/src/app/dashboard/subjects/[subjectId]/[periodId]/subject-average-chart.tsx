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
import { useTranslations } from "next-intl";
import { useFormatDates } from "@/utils/format";
import { useFormatter } from "next-intl";

function getCumulativeStartDate(
  periods: Period[],
  currentPeriod: Period
): Date {
  if (currentPeriod.id === "full-year") {
    return new Date(currentPeriod.startAt);
  }

  const sorted = [...periods].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  const currentIndex = sorted.findIndex((p) => p.id === currentPeriod.id);
  if (currentIndex === -1) {
    return new Date(currentPeriod.startAt);
  }

  if (currentPeriod.isCumulative) {
    return new Date(sorted[0].startAt);
  }

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
  const formatter = useFormatter();
  const t = useTranslations("Dashboard.Charts.SubjectAverageChart");
  const formatDates = useFormatDates(formatter);

  const [activeTooltipIndices, setActiveTooltipIndices] = useState<{
    [key: string]: number | null;
  }>({});

  const handleActiveTooltipIndicesChange = React.useCallback(
    (indices: { [key: string]: number | null }) => {
      setActiveTooltipIndices(indices);
    },
    []
  );

  const { childrenAverage, chartData, chartConfig } = (() => {
    const childrenIds = getChildren(subjects, subjectId);
    const endDate = new Date(period.endAt);
    const startDate = getCumulativeStartDate(periods, period);

    const dates: Date[] = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      dates.push(new Date(dt));
    }

    const mainSubject = subjects.find((s) => s.id === subjectId);
    let childrenObjects = subjects.filter((subj) =>
      childrenIds.includes(subj.id)
    );

    childrenObjects = childrenObjects.filter(
      (child) => child.depth === (mainSubject?.depth ?? 0) + 1
    );

    const childrenAverage = childrenObjects.map((child, index) => ({
      id: child.id,
      name: child.name,
      average: averageOverTime(subjects, child.id, period, periods),
      color: predefinedColors[index % predefinedColors.length],
    }));

    const mainAverages = averageOverTime(subjects, subjectId, period, periods);

    const chartData = dates.map((date, index) => ({
      date: date.toISOString(),
      average: mainAverages[index],
      ...Object.fromEntries(
        childrenAverage.map((child) => [child.id, child.average[index]])
      ),
    }));

    const chartConfig = {
      average: {
        label: t("average"),
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
            tickFormatter={(value) => formatDates.formatShort(new Date(value))}
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
            labelFormatter={(value) => formatDates.formatShort(new Date(value))}
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
