import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card } from "../ui/card";

// TODO: Fix tambouille

export default function DataCard({
  title,
  description,
  children,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  icon: any;
  className?: string;
}) {

  return (
    <Card className={cn("p-6 rounded-lg", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <p className="font-semibold">{title}</p>
          <Icon className="size-6 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-0.5">
          {children}

          <p className="text-xs text-muted-foreground font-light">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
