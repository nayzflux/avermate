import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TimeRangeOption } from "./dynamic-data-card";

interface TimeRangeSelectProps {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  translations: any;
  className?: string;
}

// Helper function to get display name for time range options
function getTimeRangeDisplayName(timeRange: string, translations: any): string {
  const timeRangeMap: Record<string, string> = {
    sinceStart: translations("sinceStart"),
    thisWeek: translations("thisWeek"),
    thisMonth: translations("thisMonth"),
    thisYear: translations("thisYear"),
    custom: translations("custom"),
  };

  return timeRangeMap[timeRange] || timeRange;
}

export function TimeRangeSelect({
  value,
  options,
  onValueChange,
  translations,
  className,
}: TimeRangeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={translations("selectTimeRange")} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {getTimeRangeDisplayName(option, translations)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
