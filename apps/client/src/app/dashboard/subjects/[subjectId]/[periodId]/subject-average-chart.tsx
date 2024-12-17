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
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
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

// Type for DataPoint
type DataPoint = {
  date: string;
  average: number | null;
  [key: string]: number | null | string;
};

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

  // Callback to update active tooltip indices
  const handleActiveTooltipIndicesChange = useCallback(
    (indices: { [key: string]: number | null }) => {
      setActiveTooltipIndices(indices);
    },
    []
  );

  const { childrenAverage, originalChartData, chartConfig } = useMemo(() => {
    const childrensId = getChildren(subjects, subjectId);

    const endDate = new Date(period.endAt);
    const startDate = new Date(period.startAt);

    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const mainSubject = subjects.find((subject) => subject.id === subjectId);

    let childrensObjects = subjects.filter((subject) =>
      childrensId.includes(subject.id)
    );

    // Optionally filter by depth
    childrensObjects = childrensObjects.filter(
      (child) => child.depth === (mainSubject?.depth ?? 0) + 1
    );

    const childrenAverageData = childrensObjects.map((child, index) => ({
      id: child.id,
      name: child.name,
      average: averageOverTime(subjects, child.id, period),
      color: predefinedColors[index % predefinedColors.length],
    }));

    const averages = averageOverTime(subjects, subjectId, period);

    const chartData: DataPoint[] = dates.map((date, index) => ({
      date: date.toISOString(),
      average: averages[index],
      ...Object.fromEntries(
        childrenAverageData.map((child) => [child.id, child.average[index]])
      ),
    }));

    const chartConfig = {
      average: {
        label: "Moyenne",
        color: "#2662d9",
      },
      ...Object.fromEntries(
        childrenAverageData.map((child) => [
          child.id,
          {
            label: child.name,
            color: child.color,
          },
        ])
      ),
    };

    return {
      childrenAverage: childrenAverageData,
      originalChartData: chartData,
      chartConfig,
    };
  }, [subjects, subjectId, period]);

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
    // Ensure we have at least two data points for the chart to prevent rendering a single line
    return dataPointsInRange.length >= 2
      ? originalChartData.filter(
          (dataPoint) =>
            dataPoint.date >= startTime && dataPoint.date <= endTime
        )
      : originalChartData.slice(0, 2);
  }, [startTime, endTime, originalChartData]);

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
        const zoomFactor = deltaDistance * 0.002; // Reduced sensitivity

        const direction = zoomFactor > 0 ? 1 : -1;

        const currentRange =
          new Date(
            endTime || originalChartData[originalChartData.length - 1].date
          ).getTime() -
          new Date(startTime || originalChartData[0].date).getTime();

        const zoomAmount = currentRange * 0.05 * direction; // Adjusted zoomAmount for smoother zooming

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

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy, index, stroke, dataKey, activeTooltipIndices } = props;
    if (
      activeTooltipIndices[dataKey] !== null &&
      index === activeTooltipIndices[dataKey]
    ) {
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
      {" "}
      <div
        className="h-full w-full relative"
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
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          {/* Event Handler Wrapper */}

          <LineChart data={zoomedData} margin={{ left: -30 }}>
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

            {/* Render Lines for Each Child */}
            {childrenAverage.map((child) => (
              <Line
                key={child.id}
                dataKey={child.id}
                type="monotone"
                stroke={child.color}
                connectNulls={true}
                activeDot={false}
                isAnimationActive={false}
                dot={(props) => (
                  <CustomDot
                    {...props}
                    dataKey={child.id}
                    activeTooltipIndices={activeTooltipIndices}
                  />
                )}
              />
            ))}

            {/* Render Main Average Line */}
            <Line
              dataKey="average"
              type="monotone"
              stroke="#2662d9"
              strokeWidth={3}
              connectNulls={true}
              activeDot={false}
              isAnimationActive={false}
              dot={(props) => (
                <CustomDot
                  {...props}
                  dataKey="average"
                  activeTooltipIndices={activeTooltipIndices}
                />
              )}
            />
          </LineChart>

          {/* Optional Reset Button */}
          {/* <div className="absolute top-2 right-2 z-10">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={
                startTime === originalChartData[0].date &&
                endTime === originalChartData[originalChartData.length - 1].date
              }
              className="text-xs sm:text-sm"
            >
              Reset
            </Button>
          </div> */}
        </ChartContainer>
      </div>
    </Card>
  );
}
