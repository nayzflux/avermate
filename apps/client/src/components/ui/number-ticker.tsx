"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in seconds
  decimalPlaces?: number;
  duration?: number; // duration in seconds
  onValueChange?: (val: number) => void;
}

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  duration,
  onValueChange,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Starting/ending values for the motion
  const startValue = 0; // always start from 0
  const endValue = value; // end at the final "value"

  // The raw motion value
  const motionValue = useMotionValue(startValue);

  // Fallback to a spring if no fixed duration is provided
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 200,
  });

  // Only animate once the element is in view (customize margin if needed)
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Format the displayed number to X decimals
  const formatter = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Helper to immediately update the DOM
  const updateDom = useCallback(
    (latest: number) => {
      if (ref.current) {
        // Round to specified decimal places before formatting
        const rounded = Number(latest.toFixed(decimalPlaces));
        ref.current.textContent = formatter.format(rounded);
      }
    },
    [formatter, decimalPlaces]
  );

  // Trigger the actual animation when in view + after the given delay
  useEffect(() => {
    if (!isInView) return;

    const timeoutId = setTimeout(() => {
      if (duration === undefined) {
        // If no duration, just set the final value and let spring handle it
        motionValue.set(endValue);
      } else {
        // If duration is provided, animate with a fixed time
        const controls = animate(motionValue, endValue, {
          duration,
          ease: [0.16, 1, 0.3, 1],
        });
        // Clean up if unmounted mid-animation
        return () => controls.stop();
      }
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [isInView, endValue, duration, delay, motionValue]);

  // Subscribe to motionValue changes and update DOM + trigger onValueChange
  useEffect(() => {
    const activeValue = duration === undefined ? springValue : motionValue;
    const unsubscribe = activeValue.on("change", (latest) => {
      updateDom(latest);
      if (onValueChange) {
        onValueChange(latest);
      }
    });
    return unsubscribe;
  }, [duration, springValue, motionValue, updateDom, onValueChange]);

  // On mount, render the starting value immediately
  useEffect(() => {
    updateDom(motionValue.get());
  }, [updateDom, motionValue]);

  return <span className={cn("inline-block", className)} ref={ref} />;
}
