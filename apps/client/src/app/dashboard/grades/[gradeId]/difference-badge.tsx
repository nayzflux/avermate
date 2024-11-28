import { cn } from "@/lib/utils";
import { formatDiff } from "@/utils/format";

export const DifferenceBadge = ({ diff }: { diff: number }) => {
  return (
    <div className="py-2">
      <span
        className={cn(
          "bg-opacity-30 rounded-lg texl-xl md:text-3xl px-2 py-1",
          diff >= 0 && "text-green-500 bg-green-500",
          diff < 0 && "text-red-500 bg-red-500"
        )}
      >
        {formatDiff(diff)}
      </span>
    </div>
  );
};
