"use client";

import ProfileSection from "../profile-section";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export const OnboardingSection = () => {
  //Fetch period data

  return (
    <ProfileSection
      title="Mise en route"
      description="Accéder à la page de mise en route"
    >
      <Link href={"/onboarding"}>
        <Button>
          Commencer
          <ArrowRightIcon />
        </Button>
      </Link>
    </ProfileSection>
  );
};
