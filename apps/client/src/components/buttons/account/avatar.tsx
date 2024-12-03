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
        <Skeleton
          className={cn("rounded-full", className)}
          style={{ width: size, height: size }}
        />
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
