"use client";

import React, { useState, useCallback } from "react";
import NumberTicker from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

export const DifferenceBadge = ({ diff }: { diff: number }) => {
  // Track the *animated* (displayed) value coming from NumberTicker
  const [displayedValue, setDisplayedValue] = useState(0);

  // We'll get called on each frame by NumberTicker
  const handleValueChange = useCallback((val: number) => {
    setDisplayedValue(val);
  }, []);

  // Decide sign: only show "+" if > 0, only show "–" if < 0, else ""
  let sign = "";
  if (displayedValue > 0) {
    sign = "+";
  } else if (displayedValue < 0) {
    sign = "";
  }

  // Fade background from greyish -> red/green as abs(value) increases
  const absVal = Math.abs(displayedValue);

  // Default grey color
  let backgroundColor = "rgba(128,128,128,0.3)";
  let textColor = "rgba(128,128,128,1)";

  // Only if the displayed value is large enough to not be ~0.000
  if (absVal > 0.0005) {
    // Adjust maxImpact to tune how quickly color saturates
    const maxImpact = 7;
    // ratio from 0..1
    const ratio = Math.min(absVal / maxImpact, 1);

    if (displayedValue > 0) {
      // Green color. Tailwind's 'green-500' is #10B981 (16,185,129)
      backgroundColor = `rgba(16,185,129, ${0.2 + 0.8 * ratio})`;
      textColor = `rgb(16,185,129)`;
    } else {
      // Red color. Tailwind's 'red-500' is #EF4444 (239,68,68)
      backgroundColor = `rgba(239,68,68, ${0.2 + 0.8 * ratio})`;
      textColor = `rgb(239,68,68)`;
    }
  }

  return (
    <div className="py-2">
      <span
        // Inline style for the dynamic colors
        style={{
          backgroundColor,
          color: textColor,
        }}
        // Basic styling classes (non-dynamic Tailwind only)
        className={cn("bg-opacity-30 rounded-lg text-xl md:text-3xl px-2 py-1")}
      >
        {sign}
        {/* Increase decimals to 3, fixed duration = 2s */}
        <NumberTicker
          decimalPlaces={3}
          value={diff}
          duration={2}
          onValueChange={handleValueChange}
        />
      </span>
    </div>
  );
};
