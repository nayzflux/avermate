"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
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
          <SunIcon className="size-4 mr-2" />
          Basculer en mode clair
        </>
      ) : (
        <>
          <MoonIcon className="size-4 mr-2" />
          Basculer en mode sombre
        </>
      )}
    </DropdownMenuItem>
  );
}
