"use client";
import { UpdateEmailForm } from "@/components/forms/profile/update-email-form";
import { authClient } from "@/lib/auth";
import ProfileSection from "./profile-section";

export default function EmailSection() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  return (
    <ProfileSection title="Your Email" description="Edit your email address.">
      {/* @ts-ignore */}
      <UpdateEmailForm defaultEmail={session?.user?.email} />
    </ProfileSection>
  );
}
