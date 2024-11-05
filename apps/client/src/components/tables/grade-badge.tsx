import { cn } from "@/lib/utils";

const average = 10;
const rounded = false;

export default function GradeBadge() {
  const value = Math.random() * 20;

  return (
    <span
      className={cn(
        "flex items-center justify-center text-center align-middle px-2 py-0.5 border border-muted-foreground bg-muted font-semibold rounded text-sm bg-opacity-40",
        value >= average + 2 && "bg-blue-500 text-blue-500 border-blue-500",
        value >= average + 3.5 &&
          "bg-green-500 text-green-500 border-green-500",
        value <= average - 2 &&
          "bg-yellow-400 text-yellow-500 border-yellow-500",
        value <= average - 3.5 && "bg-red-500 text-red-500 border-red-500",
        rounded && "rounded-full"
      )}
    >
      <p className="text-center align-middle">{value.toFixed(2)}</p>
    </span>
  );
}
