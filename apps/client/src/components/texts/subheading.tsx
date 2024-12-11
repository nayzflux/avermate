import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const SubHeading = ({
  as: As,
  className,
  children,
}: {
  as: "h3" | "h4";
  className?: string;
  children: ReactNode;
}) => {
  return (
    <As
      className={cn(
        "max-w-[200px] md:max-w-[450px] text-sm md:text-base text-center text-muted-foreground",
        className
      )}
    >
      {children}
    </As>
  );
};
