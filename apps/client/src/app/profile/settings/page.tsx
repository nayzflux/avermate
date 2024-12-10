import { ThemeSection } from "./theme-section";
import { PeriodsSection } from "./periods-section";
import { OnboardingSection } from "./onboarding-section";

export default function SettingsPage() {
  return (
    <main className="flex flex-col md:gap-8 gap-4 w-full ">
      <ThemeSection />
      <PeriodsSection />
      <OnboardingSection />
    </main>
  );
}
