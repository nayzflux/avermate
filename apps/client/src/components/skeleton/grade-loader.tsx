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
import {EllipsisVerticalIcon} from "@heroicons/react/24/outline";

export default function gradeLoader() {

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

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-between">
                <p className="font-semibold">
                  <Skeleton className="w-20 h-6" />
                </p>
                <Skeleton className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-10" />

                <p className="text-xs text-muted-foreground font-light pt-2">
                  <Skeleton className="h-4 mb-1" />
                  <Skeleton className="w-20 h-4" />
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
