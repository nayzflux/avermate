import { ReactNode } from "react";
import { Card } from "../ui/card";
import { useState, useEffect } from "react";

export default function DataCard({
  title,
  description,
  children,
  icon: Icon,
}: {
  title: string;
  description: string;
  children: ReactNode;
  icon: any;
  }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null; // Don't render anything until mounted
    }
  return (
    <Card className="p-6 rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">{title}</p>
          <Icon/>
        </div>

        <div className="flex flex-col gap-0.5">
          {children}

          <p className="text-xs text-muted-foreground font-light">{description}</p>
        </div>
      </div>
    </Card>
  );
}
