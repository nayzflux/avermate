"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Don't render anything until mounted
  }

  return (
    <div className="flex items-center gap-1">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_31_465"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <circle
            cx="12"
            cy="12"
            r="12"
            transform="rotate(90 12 12)"
            fill={resolvedTheme === "dark" ? "#09090B" : "white"}
          />
        </mask>
        <g mask="url(#mask0_31_465)">
          <circle
            cx="12"
            cy="12"
            r="11"
            transform="rotate(90 12 12)"
            fill="url(#paint0_linear_31_465)"
            stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
            strokeWidth="2"
          />
          <path
            d="M16.3334 8V6H7L13 12L7 18H16.3334V16"
            stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
            strokeWidth="1.33334"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_31_465"
            x1="7"
            y1="18"
            x2="21.5"
            y2="5"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor={resolvedTheme === "light" ? "#09090B" : "white"}
              stopOpacity="0"
            />
            <stop
              offset="1"
              stopColor={resolvedTheme === "light" ? "#09090B" : "white"}
              stopOpacity="0.6"
            />
          </linearGradient>
        </defs>
      </svg>

      <h1 className=" font-bold text-lg">Avermate</h1>
    </div>
  );
}
