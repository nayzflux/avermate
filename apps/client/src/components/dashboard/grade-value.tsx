import { cn } from "@/lib/utils";
import NumberTicker from "@/components/ui/number-ticker";

export default function GradeValue({
  value,
  outOf,
  size = "xl",
}: {
  value: number;
  outOf: number;
  size?: "sm" | "xl";
}) {
  // decimals is giving the number of decimal detected in the value
  const decimals = value.toString().split(".")[1]?.length || 0;
  return (
    <div className="flex items-center gap-1">
      <p
        className={cn(
          size === "sm" && "text-l font-normal",
          size === "xl" && "text-3xl font-bold"
        )}
      >
        <NumberTicker decimalPlaces={decimals} value={value} />
        <span
          className={cn(
            "text-sm text-muted-foreground align-sub",
            size === "sm" && "text-xs"
          )}
        >
          /{outOf}
        </span>
      </p>
    </div>
  );
}
