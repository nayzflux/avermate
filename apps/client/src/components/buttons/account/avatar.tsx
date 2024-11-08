import { cn } from "@/lib/utils";

export default function Avatar({
  src,
  size,
  className,
}: {
  src: string;
  size: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt="User avatar"
      width={size}
      height={size}
      className={cn("rounded-full", className)}
    />
  );
}
