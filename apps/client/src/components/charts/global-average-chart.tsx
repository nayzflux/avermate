"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { average, averageOverTime } from "@/utils/average";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";

export const description = "A simple area chart";

export default function GlobalAverageChart({
  subjects,
  period,
}: {
  subjects: Subject[];
  period: Period;
}) {
  // const {
  //   data: subjects,
  //   isError,
  //   isPending,
  // } = useQuery({
  //   queryKey: ["subjects"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("subjects");
  //     const data = await res.json<{ subjects: Subject[] }>();
  //     return data.subjects;
  //   },
  // });

  // if (isPending) {
  //   return (
  //     <Card className="lg:col-span-5">
  //       <CardHeader>
  //         <CardTitle>Moyenne Générale</CardTitle>
  //       </CardHeader>

  //       <CardContent>
  //         <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2">
  //           {/* Area Chart Section */}
  //           <div className="flex flex-col items-center lg:items-start grow min-w-0 my-0 mx-auto w-[100%]">
  //             <CardDescription className="pb-8">
  //               Visualiser l'évolution de votre moyenne générale sur ce
  //               trimestre
  //             </CardDescription>
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <Card className="lg:col-span-5">
  //       <CardHeader>
  //         <CardTitle>Error</CardTitle>
  //       </CardHeader>

  //       <CardContent>
  //         <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2"></div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

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

  // Calculate the start and end dates
  const endDate = new Date(period.endAt);
  const startDate = new Date(period.startAt);

  // Generate an array of dates
  const dates = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(new Date(dt));
  }

  // Calculate the average grades over time
  const averages = averageOverTime(subjects, undefined, startDate, endDate);

  const chartData = dates.map((date, index) => ({
    date: date.toISOString(),
    average: averages[index],
  }));

  //console.log(chartData);

  const chartConfig = {
    average: {
      label: "Moyenne",
      color: "#2662d9",
    },
  };

  // Calculate average grades per subject for radar chart, only if it is a main subject
  const subjectAverages = subjects
    .filter((subject) => subject.isMainSubject)
    .map((subject) => {
      const averageGrade = average(subject.id, subjects);
      const validAverage = averageGrade ?? 0;
      return {
        subject: subject.name,
        average: validAverage,
        fullMark: 20,
      };
    });

  const radarData = subjectAverages;

  const renderPolarAngleAxis = ({
    payload,
    x,
    y,
    cx,
    cy,
  }: {
    payload: { value: string };
    x: number;
    y: number;
    cx: number;
    cy: number;
  }) => {
    // Calculate the angle in radians between the label position and the center
    const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const angle = Math.atan2(y - cy, x - cx);

    // Determine the truncate length based on screen width
    const truncateLength =
      window.innerWidth < 450
        ? 5
        : window.innerWidth < 1024
        ? 10
        : window.innerWidth < 1300
        ? 5
        : window.innerWidth < 2100
        ? 9
        : 12;

    const truncatedLabel =
      payload.value.length > truncateLength
        ? `${payload.value.slice(0, truncateLength)}...`
        : payload.value;

    // Adjust the radius to move the labels inside
    const labelRadius = radius - truncatedLabel.length * 3 + 10;

    // Calculate new label positions
    const nx = cx + labelRadius * Math.cos(angle);
    const ny = cy + labelRadius * Math.sin(angle);

    // Convert angle to degrees for rotation
    let rotation = (angle * 180) / Math.PI;

    // Flip text if rotation is beyond 90 degrees
    if (rotation > 90) {
      rotation -= 180;
    } else if (rotation < -90) {
      rotation += 180;
    }

    return (
      <text
        x={nx}
        y={ny}
        textAnchor="middle"
        transform={`rotate(${rotation}, ${nx}, ${ny})`}
        fontSize={12}
        fill="#a1a1aa"
      >
        {truncatedLabel}
      </text>
    );
  };

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy, index, stroke, dataKey } = props;
    if (
      activeTooltipIndices &&
      activeTooltipIndices[dataKey] !== null &&
      index === activeTooltipIndices[dataKey]
    ) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4} // Adjust size as needed
          opacity={0.8}
          fill={stroke}
        />
      );
    }
    return null;
  };

  return (
    <Card className="lg:col-span-5">
      <CardHeader>
        <CardTitle>Moyenne Générale</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2">
          {/* Area Chart Section */}
          <div className="flex flex-col items-center lg:items-start grow min-w-0 my-0 mx-auto w-[100%] lg:w-[60%]">
            <CardDescription className="pb-8">
              Visualiser l&apos;évolution de votre moyenne générale sur ce trimestre
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
                  filterNull={false}
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      chartData={chartData}
                      findNearestNonNull={true}
                      dataKey="average"
                      labelFormatter={(value) => value}
                      onUpdateActiveTooltipIndices={
                        handleActiveTooltipIndicesChange
                      }
                    />
                  }
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }
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
                  connectNulls={true}
                  activeDot={false}
                  dot={(props) => (
                    <CustomDot
                      {...props}
                      activeTooltipIndex={activeTooltipIndices}
                    />
                  )}
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
              <RadarChart data={radarData} outerRadius="90%">
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={renderPolarAngleAxis} />
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