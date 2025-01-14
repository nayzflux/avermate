import NumberTicker from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

export const DifferenceBadge = ({ diff }: { diff: number }) => {
  return (
    <div className="py-2">
      <span
        className={cn(
          "bg-opacity-30 rounded-lg texl-xl md:text-3xl px-2 py-1",
          diff >= 0 && "!text-green-500 bg-green-500",
          diff < 0 && "!text-red-500 bg-red-500"
        )}
      >
        {diff > 0 && "+"}
        <NumberTicker decimalPlaces={2} value={diff} duration={2} />
      </span>
    </div>
  );
};
