"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function ThemeSwitchButton() {
  const theme = useTheme();
  const t = useTranslations("Header.Dropdown");

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
          {t("switchToLight")}
        </>
      ) : (
        <>
          <MoonIcon className="size-4 mr-2" />
          {t("switchToDark")}
        </>
      )}
    </DropdownMenuItem>
  );
}
