"use client";

import { useTheme } from "next-themes";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <>
      {theme === "dark" ? (
        <div className="flex items-center gap-2">
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
                fill="#FAFAFA"
              />
            </mask>
            <g mask="url(#mask0_31_465)">
              <circle
                cx="12"
                cy="12"
                r="11"
                transform="rotate(90 12 12)"
                fill="url(#paint0_linear_31_465)"
                stroke="#FAFAFA"
                stroke-width="2"
              />
              <path
                d="M16.3334 8V6H7L13 12L7 18H16.3334V16"
                stroke="#FAFAFA"
                stroke-width="1.33334"
                stroke-linecap="round"
                stroke-linejoin="round"
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
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="#FAFAFA" stop-opacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          <h1 className="text-2xl font-inter">Avermate</h1>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_2059_67054"
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
                fill="#09090B"
              />
            </mask>
            <g mask="url(#mask0_2059_67054)">
              <circle
                cx="12"
                cy="12"
                r="11"
                transform="rotate(90 12 12)"
                fill="url(#paint0_linear_2059_6705)"
                stroke="#09090B"
                stroke-width="2"
              />
              <path
                d="M16.3334 8V6H7L13 12L7 18H16.3334V16"
                stroke="#09090B"
                stroke-width="1.33334"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_2059_6705"
                x1="7"
                y1="18"
                x2="21.5"
                y2="5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#09090B" stop-opacity="0" />
                <stop offset="1" stop-color="#09090B" stop-opacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-2xl font-inter">Avermate</h1>
        </div>
      )}
    </>
  );
}
