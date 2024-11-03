"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export default function ThemeSwitchButton() {
  const theme = useTheme();

  const handleSwitch = () => {
    if (theme.resolvedTheme === "dark") {
      theme.setTheme("light");
    } else {
      theme.setTheme("dark");
    }
  };

  return (
    <DropdownMenuItem onClick={() => handleSwitch()}>
      {theme.resolvedTheme === "dark" ? (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 3V7M22 5H18M12 3C10.8065 4.19347 10.136 5.81217 10.136 7.5C10.136 9.18783 10.8065 10.8065 12 12C13.1935 13.1935 14.8122 13.864 16.5 13.864C18.1878 13.864 19.8065 13.1935 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17294 13.7558C2.82567 12.01 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3Z"
              stroke="#FAFAFA"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Switch to light mode
        </>
      ) : (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2V4M12 20V22M4.92993 4.92993L6.33993 6.33993M17.6599 17.6599L19.0699 19.0699M2 12H4M20 12H22M6.33993 17.6599L4.92993 19.0699M19.0699 4.92993L17.6599 6.33993M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
              stroke="#09090B"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Switch to dark mode
        </>
      )}
    </DropdownMenuItem>
  );
}
