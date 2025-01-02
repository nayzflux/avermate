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
import { useEffect, useState } from "react";

export const ThemeSection = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // This ensures we only render the UI after the client is hydrated
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR or no hydration yet, avoid rendering mismatched UI
    return (
      <ProfileSection
        title="Apparence"
        description="Personnalisez le thème qui sera utilisé."
      >
        <div className="flex flex-col gap-4">
          <Label>Thème</Label>
          <Select disabled>
            <SelectTrigger>
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
  }

  return (
    <ProfileSection
      title="Apparence"
      description="Personnalisez le thème qui sera utilisé."
    >
      <div className="flex flex-col gap-4">
        <Label>Thème</Label>

        <Select onValueChange={setTheme} value={theme} defaultValue={theme}>
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
