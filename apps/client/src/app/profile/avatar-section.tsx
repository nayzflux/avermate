"use client";

import Avatar from "@/components/buttons/account/avatar";
import { useSession } from "@/lib/auth";
import ProfileSection from "./profile-section";

export default function AvatarSection() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null;
  }

  return (
    <ProfileSection title="Avatar" description="Change your avatar">
      <div className="flex mt-2">
        <Avatar
          className="size-32 lg:size-64"
          size={256}
          src={
            session?.user?.image ||
            `https://avatar.vercel.sh/${session?.user?.id}?size=256`
          }
        />
      </div>
    </ProfileSection>
  );
}
