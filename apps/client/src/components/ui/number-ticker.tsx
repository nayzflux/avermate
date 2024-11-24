"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in seconds
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      if (value === 0) {
        // Directly set the text content to "0" when value is 0
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(0);
        }
      } else {
        setTimeout(() => {
          motionValue.set(direction === "down" ? 0 : value);
        }, delay * 1000);
      }
    }
  }, [motionValue, isInView, delay, value, direction, decimalPlaces]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (value !== 0 && ref.current) {
          ref.current.textContent = Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces, value]
  );

  return (
    <span
      className={cn("inline-block text-black dark:text-white", className)}
      ref={ref}
    />
  );
}
