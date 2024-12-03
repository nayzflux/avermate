import Logo from "../logo";
import { GetStarted } from "./get-started";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 py-4 sm:py-8 bg-opacity-10 backdrop-blur-2xl">
      <Logo />

      <GetStarted />
    </header>
  );
};
