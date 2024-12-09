import Link from "next/link";
import { Button } from "../ui/button";
import { GetStarted } from "./get-started";
import { LandingSection } from "./landing-section";

export const Picture = () => {
  return (
    <LandingSection>
      <div className="flex flex-col gap-16 items-center">
        <div className="relative w-full">
          <img
            src="/images/main.png"
            alt="Notes"
            className="w-full rounded-lg max-w-[2000px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 rounded-lg" />
        </div>
      </div>
    </LandingSection>
  );
};
