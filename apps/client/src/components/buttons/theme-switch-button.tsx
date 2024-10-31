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
      {theme.resolvedTheme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode"}
    </DropdownMenuItem>
  );
}
