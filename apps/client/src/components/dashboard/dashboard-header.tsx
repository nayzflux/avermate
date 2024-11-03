import AccountDropdown from "@/components/buttons/account/account-dropdown";
import Logo from "@/components/logo";

export default function DashboardHeader() {
  return (
    // <header className=" border-b border-solid px-4 py-1">
    //   <div className="max-w-[2000px] flex items-center justify-between gap-8 m-auto">
    //     <div className="flex items-center gap-[8px] xs:gap-[30px] flex-col xs:flex-row">
    //       <Logo />
    //       <DashboardNav />
    //     </div>
    //     <AccountDropdown />
    //   </div>
    // </header>

    <header className="sticky flex items-center justify-between gap-8 px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 py-4 sm:py-8 border-b">
      <Logo />

      <AccountDropdown />
    </header>
  );
}
