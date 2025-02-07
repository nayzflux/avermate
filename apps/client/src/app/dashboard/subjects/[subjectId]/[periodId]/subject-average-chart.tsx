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
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  XAxis,
  YAxis,
  useActiveTooltipLabel,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { useFormatDates } from "@/utils/format";
import { useFormatter } from "next-intl";

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

interface ChartDataPoint {
  date: string;
  average: number | null;
  [key: string]: number | string | null;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface CustomTooltipContentProps {
  active?: boolean;
  label?: string;
  chartData: ChartDataPoint[];
  chartConfig: ChartConfig;
  formatDates: ReturnType<typeof useFormatDates>;
}

function findNearestDatum(
  data: ChartDataPoint[],
  targetDate: string,
  dataKey: string
): ChartDataPoint | null {
  let nearestDatum: ChartDataPoint | null = null;
  let minDiff = Infinity;
  const targetTime = new Date(targetDate).getTime();

  data.forEach((datum) => {
    const value = datum[dataKey];
    if (value !== undefined && value !== null) {
      const datumTime = new Date(datum.date).getTime();
      const diff = Math.abs(datumTime - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        nearestDatum = datum;
      }
    }
  });

  return nearestDatum;
}

function SubjectActiveDot({
  dataKey,
  fill,
  chartData,
}: {
  dataKey: string;
  fill: string;
  chartData: ChartDataPoint[];
}) {
  const activeLabel = useActiveTooltipLabel();
  if (!activeLabel) return null;

  const nearestDatum = findNearestDatum(chartData, activeLabel, dataKey);
  if (!nearestDatum || nearestDatum[dataKey] === undefined) return null;

  const value = nearestDatum[dataKey];
  if (value === null) return null;

  return (
    <ReferenceDot
      x={nearestDatum.date}
      y={typeof value === 'number' ? value : undefined}
      r={4}
      fill={fill}
      strokeWidth={0}
      opacity={0.8}
    />
  );
}

function CustomTooltipContent({
  active,
  label,
  chartData,
  chartConfig,
  formatDates,
}: CustomTooltipContentProps) {
  if (!active || !label) return null;

  const payload = Object.entries(chartConfig).map(([dataKey, config]) => {
    const nearestDatum = findNearestDatum(chartData, label, dataKey);
    const value = nearestDatum?.[dataKey];
    return {
      dataKey,
      value: value,
      color: config.color,
      name: config.label,
      payload: nearestDatum,
    };
  });

  const validEntries = payload.filter((entry) => entry.value !== null && entry.value !== undefined);

  return (
    <ChartTooltipContent
      active={true}
      label={formatDates.formatShort(new Date(label))}
      payload={validEntries.map((entry) => ({
        name: entry.name,
        value: typeof entry.value === 'number' ? entry.value.toFixed(2) : 'N/A',
        color: entry.color,
        payload: null,
      }))}
    />
  );
}

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

  const { childrenAverage, chartData, chartConfig } = (() => {
    const childrenIds = getChildren(subjects, subjectId);
    const endDate = new Date(period.endAt);
    const startDate = new Date(period.startAt);

    const dates = [];
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt));
    }

    const mainAverage = averageOverTime(subjects, subjectId, period, periods);
    const childrenAverage = childrenIds.map((childId, index) => ({
      id: childId,
      name: subjects.find((s) => s.id === childId)?.name || childId,
      color: predefinedColors[index % predefinedColors.length],
      data: averageOverTime(subjects, childId, period, periods),
    }));

    const chartData = dates.map((date, index) => {
      const data: ChartDataPoint = {
        date: date.toISOString(),
        average: mainAverage[index],
      };

      childrenAverage.forEach((child) => {
        data[child.id] = child.data[index];
      });

      return data;
    });

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

  return (
    <Card className="p-4">
      <ChartContainer config={chartConfig} className="h-[400px] w-[100%]">
        <ResponsiveContainer width="100%" height="100%">
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
              content={({ active, label }) => (
                <CustomTooltipContent
                  active={active}
                  label={label}
                  chartData={chartData}
                  chartConfig={chartConfig}
                  formatDates={formatDates}
                />
              )}
            />

            {childrenAverage?.map((child) => (
              <Line
                key={child.id}
                dataKey={child.id}
                type="monotone"
                stroke={child.color}
                connectNulls={true}
                dot={false}
                activeDot={false}
              />
            ))}

            <Line
              dataKey="average"
              type="monotone"
              stroke="#2662d9"
              strokeWidth={3}
              connectNulls={true}
              dot={false}
              activeDot={false}
            />

            {childrenAverage?.map((child) => (
              <SubjectActiveDot
                key={child.id}
                dataKey={child.id}
                fill={child.color}
                chartData={chartData}
              />
            ))}
            <SubjectActiveDot
              dataKey="average"
              fill="#2662d9"
              chartData={chartData}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
}
