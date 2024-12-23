import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Avatar({
  src,
  size,
  className,
}: {
  src: string;
  size: number;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <>
          {size === 256 && (
            <Skeleton className="rounded-full size-32 lg:size-64" />
          )}
          {size === 32 && <Skeleton className="rounded-full size-8" />}
        </>
      )}
      <img
        src={src}
        alt="User avatar"
        width={size}
        height={size}
        className={cn("rounded-full", className, loaded ? "block" : "hidden")}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}
