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

export default function SubjectAverageChart({
  subjectId,
  period,
  subjects,
}: {
  subjectId: string;
  period: Period;
  subjects: Subject[];
}) {

  // const {
  //   data: periods,
  //   isError: isPeriodsError,
  //   isPending: isPeriodsPending,
  // } = useQuery({
  //   queryKey: ["periods"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("periods");
  //     let data = await res.json<{ periods: Period[] }>();
  //     // filter the periods by the periodId
  //     data.periods = data.periods.filter((period) => period.id === periodId);
  //     return data.periods;
  //   },
  // });

  //console.log(subjects);

  const { childrenAverage, chartData, chartConfig } = (() => {
    // if (isPending || isError || isPeriodsPending || isPeriodsError) {
    //   return { chartConfig: {} };
    // }

    const childrensId = getChildren(subjects, subjectId);

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

    const mainSubject = subjects.find((subject) => subject.id === subjectId);

    let childrensObjects = subjects.filter((subject) =>
      childrensId.includes(subject.id)
    );
    //filter the childrens objects by only the childrens having a depth of 1 superior of the main subject
    childrensObjects = childrensObjects.filter(
      (child) => child.depth === (mainSubject?.depth ?? 0) + 1
    );

    const childrenAverage = childrensObjects.map((child) => {
      return {
        id: child.id,
        name: child.name,
        average: averageOverTime(subjects, child.id, startDate, endDate),
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
            color: "#f87171",
          },
        ])
      ),
    } satisfies ChartConfig;

    return { childrenAverage, chartData, chartConfig };
  })();

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

  return (
    <Card className="p-4">
      <ChartContainer config={chartConfig} className="h-[400px] w-[100%]">
        {/* <AreaChart
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
        </AreaChart> */}
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
            content={<ChartTooltipContent />}
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

          {childrenAverage?.map((child) => (
            <Line
              key={child.id}
              dataKey={child.id}
              type="monotone"
              fill="#f87171"
              stroke="#f87171"
              dot={false}
              connectNulls={true}
            />
          ))}

          <Line
            dataKey="average"
            type="monotone"
            fill="url(#fillAverage)"
            stroke="#2662d9"
            dot={false}
            strokeWidth={3}
            connectNulls={true}
            //always on top and big stroke
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
