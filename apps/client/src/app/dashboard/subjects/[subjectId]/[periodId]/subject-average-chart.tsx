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
  const [activeTooltipIndices, setActiveTooltipIndices] = useState<{
    [key: string]: number | null;
  }>({});

  // Callback to update active tooltip index
  const handleActiveTooltipIndicesChange = React.useCallback(
    (indices: { [key: string]: number | null }) => {
      setActiveTooltipIndices(indices);
    },
    []
  );

  // State to manage the active index for the data series
  // const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
  //   null
  // );

  // // Callback to update active tooltip index
  // const handleActiveTooltipIndexChange = (index: number | null) => {
  //   setActiveTooltipIndex(index);
  // };

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
        average: averageOverTime(subjects, child.id, period),
        color: predefinedColors[index % predefinedColors.length], // Assign color from the list
      };
    });

    const averages = averageOverTime(subjects, subjectId, period);

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
          opacity={0.8}
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
                  activeTooltipIndex={activeTooltipIndices[child.id]}
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
                activeTooltipIndex={activeTooltipIndices["average"]}
              />
            )}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
