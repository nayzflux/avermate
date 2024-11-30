import { ThemeSection } from "./theme-section";
import { PeriodsSection } from "./periods-section";

export default function SettingsPage() {
  return (
    <main className="flex flex-col gap-8 w-full">
      <ThemeSection />
      <PeriodsSection />
    </main>
  );
}
