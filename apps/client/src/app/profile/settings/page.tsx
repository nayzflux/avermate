import { ThemeSection } from "./theme-section";
import { PeriodsSection } from "./periods-section";

export default function SettingsPage() {
  return (
    <main className="flex flex-col md:gap-8 gap-4 w-full ">
      <ThemeSection />
      <PeriodsSection />
    </main>
  );
}
