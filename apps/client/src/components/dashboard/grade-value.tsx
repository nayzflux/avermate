import { cn } from "@/lib/utils";

export default function GradeValue({
  value,
  outOf,
  size = "sm",
}: {
  value: number;
  outOf: number;
  size?: "sm" | "xl";
}) {
  return (
    <div className="flex items-center gap-1">
      <p
        className={cn(
          "font-bold",
          size === "sm" && "text-xl",
          size === "xl" && "text-3xl"
        )}
      >
        13.5
      </p>
      <p className="text-sm text-muted-foreground">/20</p>
    </div>
  );
}
