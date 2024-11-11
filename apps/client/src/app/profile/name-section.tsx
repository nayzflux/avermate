"use client";

import { UpdateNameForm } from "@/components/forms/profile/update-name-form";
import { authClient } from "@/lib/auth";
import ProfileSection from "./profile-section";

export default function NameSection() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  return (
    <ProfileSection
      title="Your Name"
      description="Edit how your appear on Avermate."
    >
      <UpdateNameForm defaultName={session?.user?.name} />
    </ProfileSection>
  );
}
