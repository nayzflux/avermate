import { ThemeSection } from "./theme-section";
import { PeriodsSection } from "./periods-section";
import { OnboardingSection } from "./onboarding-section";
import { CustomAveragesSection } from "./custom-averages-section";
import { LanguageSection } from "./language-section";
import { ResetAccountSection } from "./reset-account-section";

export default function SettingsPage() {
  return (
    <main className="flex flex-col md:gap-8 gap-4 w-full ">
      <ThemeSection />
      <LanguageSection />
      <PeriodsSection />
      <CustomAveragesSection />
      <OnboardingSection />
      <ResetAccountSection />
    </main>
  );
}
