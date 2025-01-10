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
}

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  duration,
}: NumberTickerProps) {
  // The ref that tells us when this element is in view
  const ref = useRef<HTMLSpanElement>(null);

  // Start from 0 if counting up, or start from `value` if counting down
  const startValue = direction === "down" ? value : 0;
  const endValue = direction === "down" ? 0 : value;

  // This is the raw motion value we’ll animate
  const motionValue = useMotionValue(startValue);

  // When no duration is provided, fallback to a spring.
  // You can tweak damping/stiffness to speed it up or slow it down.
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 200,
  });

  // Track when the component is in view so we only animate once
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Pre-create a formatter for all numbers, so we don’t create a new one on every re-render.
  const formatter = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // A small callback to update DOM text whenever motionValue changes
  const updateDom = useCallback(
    (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatter.format(
          Number(latest.toFixed(decimalPlaces))
        );
      }
    },
    [formatter, decimalPlaces]
  );

  // Trigger the actual animation when in view + after any specified delay
  useEffect(() => {
    if (!isInView) return;

    // Delay the start with a setTimeout
    const timeoutId = setTimeout(() => {
      if (duration === undefined) {
        // If no duration is provided, we simply set the motionValue target.
        // The spring will handle the easing.
        motionValue.set(endValue);
      } else {
        // If a duration is provided, we use Framer Motion’s animate method.
        // This gives direct control over how many seconds the transition lasts.
        const controls = animate(motionValue, endValue, {
          duration,
          ease: [0.16, 1, 0.3, 1],
        });
        // Clean up if the component unmounts mid-animation
        return () => controls.stop();
      }
    }, delay * 1000);

    // Cleanup for the timeout
    return () => clearTimeout(timeoutId);
  }, [isInView, endValue, duration, delay, motionValue]);

  // Whichever approach we’re using (spring or direct animate), we subscribe to changes
  useEffect(() => {
    const activeValue = duration === undefined ? springValue : motionValue;
    const unsubscribe = activeValue.on("change", updateDom);
    return unsubscribe;
  }, [duration, springValue, motionValue, updateDom]);

  // On first render, update the DOM with our initial value immediately
  useEffect(() => {
    updateDom(motionValue.get());
  }, [updateDom, motionValue]);

  return (
    <span
      className={cn("inline-block", className)}
      ref={ref}
    />
  );
}
