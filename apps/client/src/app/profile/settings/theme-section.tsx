"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import ProfileSection from "../profile-section";

export const ThemeSection = () => {
  const theme = useTheme();

  const handleThemeChange = (value: string) => {
    theme.setTheme(value);
  };

  return (
    <ProfileSection
      title="Appearance"
      description="Customize wich theme will be used."
    >
      <div className="flex flex-col gap-4">
        <Label>Theme</Label>

        <Select
          onValueChange={handleThemeChange}
          defaultValue={theme.theme}
          value={theme.theme}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="system">System</SelectItem>

            <SelectItem value="light">Light</SelectItem>

            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ProfileSection>
  );
};
