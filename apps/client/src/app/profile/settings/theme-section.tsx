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
      title="Apparence"
      description="Personnalisez le thème qui sera utilisé."
    >
      <div className="flex flex-col gap-4">
        <Label>Thème</Label>

        <Select
          onValueChange={handleThemeChange}
          defaultValue={theme.theme}
          value={theme.theme}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Sélectionnez un thème" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="system">Système</SelectItem>

            <SelectItem value="light">Clair</SelectItem>

            <SelectItem value="dark">Sombre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ProfileSection>
  );
};
