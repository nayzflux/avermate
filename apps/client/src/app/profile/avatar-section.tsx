"use client";

import Avatar from "@/components/buttons/account/avatar";
import UpdateAvatar from "@/components/buttons/update-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth";
import { Session, User } from "better-auth/types";
import ProfileSection from "./profile-section";

export default function AvatarSection() {
  const { data: session, isPending } = authClient.useSession() as unknown as {
    data: { user: User; session: Session };
    isPending: boolean;
  };

  if (isPending) {
    return (
      <Card className={"p-6 w-full"}>
        <div className="flex flex-col gap-6">
          <CardHeader className="p-0">
            <CardTitle>
              <Skeleton className="md:w-32 w-full h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="md:w-64 w-full h-4" />
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
              {/* Avatar Skeleton */}
              <Skeleton className="size-32 rounded-full" />
              {/* Upload Button Skeleton */}
              <Skeleton className="w-full md:w-48 h-10 rounded-md" />
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <ProfileSection
      title="Avatar"
      description="Changez votre avatar"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col md:flex-row items-center  gap-6 align">
        <div className="min-w-[128px] flex justify-center">
        <Avatar
          className="size-32"
          size={128}
          src={
            session?.user?.image ||
            `https://avatar.vercel.sh/${session?.user?.id}?size=256`
          }
        />
        </div>
        <UpdateAvatar />
      </div>
    </ProfileSection>
  );
}
