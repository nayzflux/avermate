import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { Skeleton } from "../ui/skeleton";

export default function dashboardLoader() {
  const chartConfig = {};

  const chartData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  const radarData = [{ average: 15 }, {}, {}, {}, {}, {}];

  return (
    <main className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">
          <Skeleton className="w-40 h-[32px]" />
        </h1>
        <h1 className="text-3xl font-normal pt-1">
          <Skeleton className="w-[250px] h-9" />
        </h1>
      </div>

      <Separator />

      {/* Statistiques */}
      <Tabs>
        <div className="flex flex-col gap-4">
          <ScrollArea>
            <div className="flex w-full">
              <Skeleton className="flex md:hidden h-9 w-full" />

              <TabsList className="md:flex hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className="px-1 data-[state=active]:bg-background cursor-default"
                  >
                    <Skeleton className="w-32 h-7" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="p-6 rounded-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 justify-between">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-[30.5px] md:h-[36px]" />

                    <div className="text-xs text-muted-foreground font-light pt-2">
                      <Skeleton className="h-4 mb-1" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Evolution de la moyenne générale */}
            <Card className="lg:col-span-5">
              <CardHeader className="pl-6 pt-4 pb-1">
                <CardTitle>
                  <Skeleton className="w-36 h-6" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-start lg:space-x-4 text-sm flex-wrap lg:flex-nowrap h-fit justify-center gap-[10px] flex-col lg:flex-row pt-2">
                  {/* Area Chart Section */}
                  <div className="flex flex-col items-center lg:items-start grow min-w-0 my-0 mx-auto w-[100%] lg:w-[60%]">
                    <CardDescription className="pb-8 w-full">
                      <Skeleton className="w-full h-6" />
                    </CardDescription>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[302px] w-[100%]"
                    >
                      <AreaChart data={chartData} margin={{ left: -30 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickCount={10}
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
                        <Area
                          dataKey="average"
                          type="monotone"
                          fill="url(#fillAverage)"
                          stroke=""
                          connectNulls={true}
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
                      <Skeleton className="w-44 h-6" />
                    </CardDescription>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[332px] w-[100%] m-auto !aspect-auto"
                    >
                      <RadarChart data={radarData} outerRadius="90%">
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey={"subject"}
                          tick={
                            <text
                              textAnchor="middle"
                              fontSize={12}
                              fill="#a1a1aa"
                              className="text-muted-foreground animate-pulse-dimmer rounded-md bg-primary/10 tracking-[-4px] text-lg select-none"
                            >
                              ▬▬
                            </text>
                          }
                        />
                        <Radar
                          dataKey="average"
                          stroke=""
                          fill=""
                          fillOpacity={0}
                        />
                      </RadarChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dernières notes */}
            <Card className="lg:col-span-2">
              <CardHeader className="pl-8">
                <CardTitle className="text-l">
                  <Skeleton className=" h-6" />
                </CardTitle>

                <CardDescription>
                  <Skeleton className="w-20 h-6 " />
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg p-2"
                    >
                      <div className="flex flex-col gap-0.5 w-[80%]">
                        <div className="font-semibold">
                          <Skeleton className="w-36 h-6" />
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          <Skeleton className="w-24 h-5" />
                        </div>
                      </div>

                      <Skeleton className="w-20 h-6" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </main>
  );
}
