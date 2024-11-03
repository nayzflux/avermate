import AccountDropdown from "@/components/buttons/account/account-dropdown";
import Logo from "@/components/logo";
import DashboardNav from "@/components/nav/dashboard-nav";

export default function DashboardHeader() {
  return (
    <header className=" border-b borde border-solid px-4 py-1">
      <div className="max-w-[2000px] flex items-center justify-between gap-8 m-auto">
        <div className="flex items-center gap-[8px] xs:gap-[30px] flex-col xs:flex-row">
          <Logo />
          <DashboardNav />
        </div>
        <AccountDropdown />
      </div>
    </header>
  );
}
