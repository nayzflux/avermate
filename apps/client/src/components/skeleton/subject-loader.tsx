import React from "react";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataCards from "@/app/dashboard/(overview)/data-cards";
import GlobalAverageChart from "../charts/global-average-chart";
import RecentGradesCard from "@/components/dashboard/recent-grades/recent-grades";
import DataCard from "../dashboard/data-card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";
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
import { Button } from "../ui/button";
import AddGradeDialog from "../dialogs/add-grade-dialog";
import AddPeriodDialog from "../dialogs/add-period-dialog";
import AddSubjectDialog from "../dialogs/add-subject-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Line, LineChart } from "recharts";

export default function subjectLoader() {
  const chartConfig = {};

  const chartData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button className="text-blue-600" variant="link" disabled>
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-96" />

        <Button size="icon" variant="outline" disabled>
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-between">
                <p className="font-semibold">
                  <Skeleton className="w-20 h-6" />
                </p>
                <Skeleton className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-9" />

                <p className="text-xs text-muted-foreground font-light pt-2">
                  <Skeleton className="h-4 mb-1" />
                  <Skeleton className="w-20 h-4" />
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Charts of average evolution */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          <Skeleton className="w-96 h-7" />
        </h2>

        <Card className="p-4">
          <ChartContainer config={chartConfig} className="h-[400px] w-[100%]">
            <LineChart data={chartData} margin={{ left: -30 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={
                  <text className="text-muted-foreground animate-pulse-dimmer rounded-md bg-primary/10 tracking-[-4px] text-lg select-none">
                    ■■■
                  </text>
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 20]}
                tickMargin={8}
                tickCount={5}
                tick={
                  <text className="text-muted-foreground animate-pulse-dimmer rounded-md bg-primary/10 tracking-[-4px] text-lg select-none">
                    ■■
                  </text>
                }
              />

              <Line
                dataKey="average"
                type="monotone"
                fill="url(#fillAverage)"
                stroke="#2662d9"
                dot={false}
                strokeWidth={3}
                connectNulls={true}
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}
