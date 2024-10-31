import { cn } from "@/lib/utils";
import Image from "next/image";

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
    <Image
      src={src}
      alt="User avatar"
      width={size}
      height={size}
      className={cn("rounded-full", className)}
    />
  );
}
