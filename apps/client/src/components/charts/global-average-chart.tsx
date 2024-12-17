"use client";

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
import { BookOpenIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo, useRef } from "react";
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
import AddGradeDialog from "../dialogs/add-grade-dialog";
import { SubjectEmptyState } from "../empty-states/subject-empty-state";
import { Button } from "../ui/button";

export const description = "A simple area chart";

// Type for DataPoint
type DataPoint = {
  date: string;
  average: number | null;
};

export default function GlobalAverageChart({
  subjects,
  period,
}: {
  subjects: Subject[];
  period: Period;
}) {
  // State to manage the active index for the data series
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null
  );

  // Callback to update active tooltip index
  const handleActiveTooltipIndexChange = (index: number | null) => {
    setActiveTooltipIndex(index);
  };

  // Calculate the start and end dates
  const endDate = useMemo(() => new Date(period.endAt), [period.endAt]);
  const startDate = useMemo(() => new Date(period.startAt), [period.startAt]);

  // Generate an array of dates
  const dates = useMemo(() => {
    const tempDates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      tempDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return tempDates;
  }, [startDate, endDate]);

  // Calculate the average grades over time
  const averages = useMemo(
    () => averageOverTime(subjects, undefined, period),
    [subjects, period]
  );

  // Memoize originalChartData to prevent unnecessary re-renders
  const originalChartData: DataPoint[] = useMemo(() => {
    return dates.map((date, index) => ({
      date: date.toISOString(),
      average: averages[index],
    }));
  }, [dates, averages]);

  const chartConfig = {
    average: {
      label: "Moyenne",
      color: "#2662d9",
    },
  };

  // Calculate average grades per subject for radar chart, only if it is a main subject
  const radarData = useMemo(() => {
    return subjects
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
  }, [subjects]);

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

  // Handle if there are no subjects
  if (subjects.length === 0) {
    return <SubjectEmptyState />;
  }

  // If all the averages are null
  const allAveragesNull = useMemo(
    () => originalChartData.every((data) => data.average === null),
    [originalChartData]
  );

  if (allAveragesNull) {
    return (
      <Card className="lg:col-span-5 flex flex-col justify-center items-center p-6 gap-8 w-full h-full">
        <BookOpenIcon className="w-12 h-12" />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold text-center">
            Aucune note pour l&apos;instant
          </h2>
          <p className="text-center">
            Ajouter une nouvelle note pour commencer à suivre vos moyennes.
          </p>
        </div>
        <AddGradeDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une note
          </Button>
        </AddGradeDialog>
      </Card>
    );
  }

  // Initialize state for zoom and pan
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // For panning
  const isPanning = useRef(false);
  const panStartX = useRef(0);
  const panStartTime = useRef<number>(0);
  const panEndTime = useRef<number>(0);

  // For pinch zoom
  const lastTouchDistance = useRef<number | null>(null);

  // Precompute the indices of non-null data points
  const nonNullDataPoints = useMemo(() => {
    return originalChartData
      .map((dataPoint, index) => (dataPoint.average !== null ? index : -1))
      .filter((index) => index !== -1);
  }, [originalChartData]);

  // Initialize startTime and endTime based on originalChartData
  useEffect(() => {
    if (originalChartData.length) {
      setStartTime(originalChartData[0].date);
      setEndTime(originalChartData[originalChartData.length - 1].date);
    }
  }, [originalChartData]);

  // Memoize zoomedData to prevent unnecessary computations
  const zoomedData = useMemo(() => {
    if (!startTime || !endTime) {
      return originalChartData;
    }
    const dataPointsInRange = originalChartData.filter(
      (dataPoint) =>
        dataPoint.date >= startTime &&
        dataPoint.date <= endTime &&
        dataPoint.average !== null
    );
    // Ensure we have at least two data points for the chart to prevent rendering a single dot
    return dataPointsInRange.length >= 2
      ? originalChartData.filter(
          (dataPoint) =>
            dataPoint.date >= startTime &&
            dataPoint.date <= endTime &&
            dataPoint.average !== null
        )
      : originalChartData.slice(0, 2);
  }, [startTime, endTime, originalChartData]);

  // Calculate total for display (optional, adjust as needed)
  const total = useMemo(
    () => zoomedData.reduce((acc, curr) => acc + (curr.average ?? 0), 0),
    [zoomedData]
  );

  // Handle Reset to original view
  const handleReset = () => {
    if (originalChartData.length) {
      setStartTime(originalChartData[0].date);
      setEndTime(originalChartData[originalChartData.length - 1].date);
    }
  };

  // Helper function to count non-null data points in a range
  const countNonNullInRange = (newStart: string, newEnd: string) => {
    return originalChartData.filter(
      (dataPoint) =>
        dataPoint.date >= newStart &&
        dataPoint.date <= newEnd &&
        dataPoint.average !== null
    ).length;
  };

  // Handle Wheel for Zooming (Desktop)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!originalChartData.length || !chartRef.current) return;

    const zoomFactor = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;

    const currentRange =
      new Date(
        endTime || originalChartData[originalChartData.length - 1].date
      ).getTime() - new Date(startTime || originalChartData[0].date).getTime();

    const zoomAmount = currentRange * zoomFactor * direction;

    // Zoom towards the mouse position
    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - chartRect.left;
    const chartWidth = chartRect.width;
    const mousePercentage = chartWidth > 0 ? mouseX / chartWidth : 0.1; // Prevent division by zero

    const currentStartTime = new Date(
      startTime || originalChartData[0].date
    ).getTime();
    const currentEndTime = new Date(
      endTime || originalChartData[originalChartData.length - 1].date
    ).getTime();

    let newStartTime = currentStartTime + zoomAmount * mousePercentage;
    let newEndTime = currentEndTime - zoomAmount * (1 - mousePercentage);

    // Clamp new times within data range
    const dataStart = new Date(originalChartData[0].date).getTime();
    const dataEnd = new Date(
      originalChartData[originalChartData.length - 1].date
    ).getTime();

    // Prevent over-zooming
    if (newStartTime >= newEndTime) return;

    // Clamp to data range
    if (newStartTime < dataStart) {
      newStartTime = dataStart;
      newEndTime = newStartTime + currentRange;
    } else if (newEndTime > dataEnd) {
      newEndTime = dataEnd;
      newStartTime = newEndTime - currentRange;
    }

    const newStartISO = new Date(newStartTime).toISOString();
    const newEndISO = new Date(newEndTime).toISOString();

    // Check if the new range includes at least two non-null data points
    const nonNullCount = countNonNullInRange(newStartISO, newEndISO);
    if (nonNullCount >= 2) {
      // Check if the date range has changed
      if (
        newStartISO === startTime &&
        newEndISO === endTime &&
        direction === -1
      ) {
        handleReset();
      } else {
        setStartTime(newStartISO);
        setEndTime(newEndISO);
      }
    }
  };

  // Handle Mouse Down for Panning (Desktop)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isPanning.current = true;
    panStartX.current = e.clientX;
    panStartTime.current = new Date(
      startTime || originalChartData[0].date
    ).getTime();
    panEndTime.current = new Date(
      endTime || originalChartData[originalChartData.length - 1].date
    ).getTime();
  };

  // Handle Mouse Move for Panning (Desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    e.preventDefault();

    const chartRect = chartRef.current?.getBoundingClientRect();
    if (!chartRect) return;

    const deltaX = e.clientX - panStartX.current;
    const chartWidth = chartRect.width;
    const currentRange = panEndTime.current - panStartTime.current;
    const timePerPixel = chartWidth > 0 ? currentRange / chartWidth : 0; // Prevent division by zero
    const deltaTime = -deltaX * timePerPixel; // Negative to pan correctly

    let newStartTime = panStartTime.current + deltaTime;
    let newEndTime = panEndTime.current + deltaTime;

    // Clamp to data range
    const dataStart = new Date(originalChartData[0].date).getTime();
    const dataEnd = new Date(
      originalChartData[originalChartData.length - 1].date
    ).getTime();

    if (newStartTime < dataStart) {
      newStartTime = dataStart;
      newEndTime = newStartTime + currentRange;
    } else if (newEndTime > dataEnd) {
      newEndTime = dataEnd;
      newStartTime = newEndTime - currentRange;
    }

    const newStartISO = new Date(newStartTime).toISOString();
    const newEndISO = new Date(newEndTime).toISOString();

    // Check if the new range includes at least two non-null data points
    const nonNullCount = countNonNullInRange(newStartISO, newEndISO);
    if (nonNullCount >= 2) {
      setStartTime(newStartISO);
      setEndTime(newEndISO);
    } else {
      // Automatically zoom out to make space for additional points
      const expandedRange = currentRange * 1.2; // Zoom out by 20%
      let adjustedStartTime = newStartTime - (expandedRange - currentRange) / 2;
      let adjustedEndTime = newEndTime + (expandedRange - currentRange) / 2;

      // Clamp adjusted range
      if (adjustedStartTime < dataStart) {
        adjustedStartTime = dataStart;
        adjustedEndTime = adjustedStartTime + expandedRange;
      }
      if (adjustedEndTime > dataEnd) {
        adjustedEndTime = dataEnd;
        adjustedStartTime = adjustedEndTime - expandedRange;
      }

      const adjustedStartISO = new Date(adjustedStartTime).toISOString();
      const adjustedEndISO = new Date(adjustedEndTime).toISOString();

      setStartTime(adjustedStartISO);
      setEndTime(adjustedEndISO);
    }
  };

  // Handle Mouse Up to Stop Panning (Desktop)
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning.current) {
      isPanning.current = false;
    }
  };

  // Handle Touch Start for Panning and Pinch Zoom (Mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      // Single touch for panning
      isPanning.current = true;
      const touch = e.touches[0];
      panStartX.current = touch.clientX;
      panStartTime.current = new Date(
        startTime || originalChartData[0].date
      ).getTime();
      panEndTime.current = new Date(
        endTime || originalChartData[originalChartData.length - 1].date
      ).getTime();
    } else if (e.touches.length === 2) {
      // Two fingers for pinch zoom
      isPanning.current = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
    }
  };

  // Handle Touch Move for Panning and Pinch Zoom (Mobile)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isPanning.current) {
      // Handle panning
      const touch = e.touches[0];
      const deltaX = touch.clientX - panStartX.current;

      const chartRect = chartRef.current?.getBoundingClientRect();
      if (!chartRect) return;

      const chartWidth = chartRect.width;
      const currentRange = panEndTime.current - panStartTime.current;
      const timePerPixel = chartWidth > 0 ? currentRange / chartWidth : 0; // Prevent division by zero
      const deltaTime = -deltaX * timePerPixel; // Negative to pan correctly

      let newStartTime = panStartTime.current + deltaTime;
      let newEndTime = panEndTime.current + deltaTime;

      // Clamp to data range
      const dataStart = new Date(originalChartData[0].date).getTime();
      const dataEnd = new Date(
        originalChartData[originalChartData.length - 1].date
      ).getTime();

      if (newStartTime < dataStart) {
        newStartTime = dataStart;
        newEndTime = newStartTime + currentRange;
      } else if (newEndTime > dataEnd) {
        newEndTime = dataEnd;
        newStartTime = newEndTime - currentRange;
      }

      const newStartISO = new Date(newStartTime).toISOString();
      const newEndISO = new Date(newEndTime).toISOString();

      // Check if the new range includes at least two non-null data points
      const nonNullCount = countNonNullInRange(newStartISO, newEndISO);
      if (nonNullCount >= 2) {
        setStartTime(newStartISO);
        setEndTime(newEndISO);
      }
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastTouchDistance.current !== null) {
        const deltaDistance = distance - lastTouchDistance.current;
        const zoomFactor = deltaDistance * 0.002; // **Reduced sensitivity from 0.005 to 0.002**

        const direction = zoomFactor > 0 ? 1 : -1;

        const currentRange =
          new Date(
            endTime || originalChartData[originalChartData.length - 1].date
          ).getTime() -
          new Date(startTime || originalChartData[0].date).getTime();

        const zoomAmount = currentRange * 0.05 * direction; // **Adjusted zoomAmount factor to 0.05 for smoother zooming**

        // Zoom towards the center point between the two touches
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const chartRect = chartRef.current?.getBoundingClientRect();
        if (!chartRect) return;

        const mousePercentage =
          chartRect.width > 0
            ? (centerX - chartRect.left) / chartRect.width
            : 0.5; // Prevent division by zero

        const currentStartTime = new Date(
          startTime || originalChartData[0].date
        ).getTime();
        const currentEndTime = new Date(
          endTime || originalChartData[originalChartData.length - 1].date
        ).getTime();

        let newStartTime = currentStartTime + zoomAmount * mousePercentage;
        let newEndTime = currentEndTime - zoomAmount * (1 - mousePercentage);

        // Prevent over-zooming
        if (newStartTime >= newEndTime) return;

        // Clamp to data range
        const dataStart = new Date(originalChartData[0].date).getTime();
        const dataEnd = new Date(
          originalChartData[originalChartData.length - 1].date
        ).getTime();

        if (newStartTime < dataStart) {
          newStartTime = dataStart;
          newEndTime = newStartTime + currentRange;
        } else if (newEndTime > dataEnd) {
          newEndTime = dataEnd;
          newStartTime = newEndTime - currentRange;
        }

        const newStartISO = new Date(newStartTime).toISOString();
        const newEndISO = new Date(newEndTime).toISOString();

        // Check if the new range includes at least two non-null data points
        const nonNullCount = countNonNullInRange(newStartISO, newEndISO);
        if (nonNullCount >= 2) {
          // Check if the date range has changed
          if (
            newStartISO === startTime &&
            newEndISO === endTime &&
            direction === -1
          ) {
            handleReset();
          } else {
            setStartTime(newStartISO);
            setEndTime(newEndISO);
          }
        } else {
          // Automatically zoom out to make space for additional points
          const expandedRange = currentRange * 1.2; // Zoom out by 20%
          let adjustedStartTime =
            newStartTime - (expandedRange - currentRange) / 2;
          let adjustedEndTime = newEndTime + (expandedRange - currentRange) / 2;

          // Clamp adjusted range
          if (adjustedStartTime < dataStart) {
            adjustedStartTime = dataStart;
            adjustedEndTime = adjustedStartTime + expandedRange;
          }
          if (adjustedEndTime > dataEnd) {
            adjustedEndTime = dataEnd;
            adjustedStartTime = adjustedEndTime - expandedRange;
          }

          const adjustedStartISO = new Date(adjustedStartTime).toISOString();
          const adjustedEndISO = new Date(adjustedEndTime).toISOString();

          setStartTime(adjustedStartISO);
          setEndTime(adjustedEndISO);
        }
      }

      lastTouchDistance.current = distance;
    }
  };

  // Handle Touch End to Stop Panning (Mobile)
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
    if (e.touches.length === 0) {
      isPanning.current = false;
    }
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
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
              Visualiser l&apos;évolution de votre moyenne générale sur ce
              trimestre
            </CardDescription>
            {/* Event Handler Wrapper */}
            <div
              className="h-[302px] w-full relative"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              ref={chartRef}
              style={{
                touchAction: "none",
                cursor: isPanning.current ? "grabbing" : "grab",
              }}
            >
              <ChartContainer config={chartConfig} className="h-full w-full">
                {/* Reset Button */}
                {/* <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={
                      startTime === originalChartData[0].date &&
                      endTime ===
                        originalChartData[originalChartData.length - 1].date
                    }
                    className="text-xs sm:text-sm"
                  >
                    Reset
                  </Button>
                </div> */}
                {/* AreaChart */}
                <AreaChart data={zoomedData} margin={{ left: -30 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatXAxis}
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
                        chartData={zoomedData}
                        findNearestNonNull={true}
                        dataKey="average"
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString("fr-FR", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        valueFormatter={(val) => (val ?? 0).toFixed(2)}
                        onUpdateActiveTooltipIndex={
                          handleActiveTooltipIndexChange
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
                    <linearGradient
                      id="fillAverage"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2662d9" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#2662d9"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    isAnimationActive={false}
                    dataKey="average"
                    type="monotone"
                    fill="url(#fillAverage)"
                    stroke="#2662d9"
                    connectNulls={true}
                    activeDot={false}
                    dot={(props) => (
                      <CustomDot
                        {...props}
                        activeTooltipIndex={activeTooltipIndex}
                      />
                    )}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
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
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      valueFormatter={(val) => val.toFixed(2)}
                    />
                  }
                />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
