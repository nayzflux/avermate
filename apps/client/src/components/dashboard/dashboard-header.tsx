import AccountDropdown from "@/components/buttons/account/account-dropdown";
import Logo from "@/components/logo";

export default function DashboardHeader() {
  return (
    <header className="sticky flex items-center justify-between gap-8 px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16">
      <Logo />

      <AccountDropdown />
    </header>
  );
}
