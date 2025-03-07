import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type TimeRangeOption } from "./dynamic-data-card";

interface TimeRangeSelectProps {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  translations: any;
  className?: string;
}

export function TimeRangeSelect({
  value,
  options,
  onValueChange,
  translations,
  className,
}: TimeRangeSelectProps) {
  // Map time range options to display names
  const getTimeRangeDisplayName = (option: string) => {
    switch (option) {
      case "sinceStart":
        return translations("timeRanges.sinceStart");
      case "thisWeek":
        return translations("timeRanges.thisWeek");
      case "thisMonth":
        return translations("timeRanges.thisMonth");
      case "thisYear":
        return translations("timeRanges.thisYear");
      case "custom":
        return translations("timeRanges.custom");
      default:
        return option;
    }
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={translations("selectTimeRange")} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {getTimeRangeDisplayName(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
