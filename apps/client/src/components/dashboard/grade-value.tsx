import NumberTicker from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import { formatGradeValue } from "@/utils/format";

export default function GradeValue({
  value,
  outOf,
  size = "xl",
}: {
  value: number;
  outOf: number;
  size?: "sm" | "xl";
}) {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <p
        className={cn(
          size === "sm" && "text-l font-normal",
          size === "xl" && "text-3xl font-bold"
        )}
      >
        <NumberTicker decimalPlaces={2} value={formatGradeValue(value)} />
        <span
          className={cn(
            "text-sm text-muted-foreground align-sub",
            size === "sm" && "text-xs"
          )}
        >
          /{formatGradeValue(outOf)}
        </span>
      </p>
    </div>
  );
}
