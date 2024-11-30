"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Payload, ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
      chartData?: any[];
      findNearestNonNull?: boolean;
      dataKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      chartData,
      findNearestNonNull = false,
      dataKey,
    },
    ref
  ) => {
    const { config } = useChart();

    // Use useMemo to compute adjustedPayload
    const adjustedPayload = React.useMemo(() => {
      if (
        !findNearestNonNull ||
        !chartData ||
        !payload ||
        payload.length === 0
      ) {
        return payload;
      }

      return payload
        .map((item) => {
          const currentValue = item.value;
          if (
            currentValue !== null &&
            currentValue !== undefined &&
            !isNaN(Number(currentValue))
          ) {
            return item;
          }

          const dataKey = item.dataKey;
          const currentDate = item.payload.date;
          const dataIndex = chartData.findIndex((d) => d.date === currentDate);

          if (dataIndex === -1) {
            return item;
          }

          let nearestIndex = dataIndex;

          // Search forward
          let forwardIndex = dataIndex + 1;
          while (
            forwardIndex < chartData.length &&
            (dataKey !== undefined &&
              (chartData[forwardIndex]?.[dataKey] === null ||
              chartData[forwardIndex]?.[dataKey] === undefined ||
              isNaN(Number(chartData[forwardIndex]?.[dataKey]))))
          ) {
            forwardIndex++;
          }

          // Search backward
          let backwardIndex = dataIndex - 1;
          while (
            backwardIndex >= 0 &&
            (dataKey !== undefined &&
              (chartData[backwardIndex]?.[dataKey] === null ||
              chartData[backwardIndex]?.[dataKey] === undefined ||
              isNaN(Number(chartData[backwardIndex]?.[dataKey]))))
          ) {
            backwardIndex--;
          }

          // Choose the closest index
          if (forwardIndex < chartData.length && backwardIndex >= 0) {
            if (
              Math.abs(forwardIndex - dataIndex) <
              Math.abs(dataIndex - backwardIndex)
            ) {
              nearestIndex = forwardIndex;
            } else {
              nearestIndex = backwardIndex;
            }
          } else if (forwardIndex < chartData.length) {
            nearestIndex = forwardIndex;
          } else if (backwardIndex >= 0) {
            nearestIndex = backwardIndex;
          } else {
            // No non-null data points found
            return null;
          }

          // Create a new item with the nearest non-null data point
          const nearestData = chartData[nearestIndex];
          return {
            ...item,
            payload: nearestData,
            value: dataKey ? nearestData?.[dataKey] : undefined,
          };
        })
        .filter(Boolean); // Remove any null items
    }, [findNearestNonNull, chartData, payload]);

    // Use adjustedPayload in tooltipLabel
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !adjustedPayload?.length) {
        return null;
      }

      const [item] = adjustedPayload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, adjustedPayload as Payload<ValueType, NameType>[])}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [
      adjustedPayload,
      hideLabel,
      labelKey,
      config,
      label,
      labelFormatter,
      labelClassName,
    ]);

    // Now handle early returns
    if (!active) {
      return null;
    }

    if (!adjustedPayload || adjustedPayload.length === 0) {
      return null;
    }

    // Existing tooltip rendering logic
    const nestLabel = adjustedPayload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {adjustedPayload.map((item, index) => {
            const key = `${nameKey || item?.name || item?.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item?.payload?.fill || item?.color;

            return (
              <div
                key={item?.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item?.name}
                        </span>
                      </div>
                      {typeof item?.value === "number" && !isNaN(Number(item?.value)) ? (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item?.value?.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          N/A
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";



// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
